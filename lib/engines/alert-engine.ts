import User from "../db/models/user.schema";
import Budget, { IBudget } from "../db/models/budget.schema";
import { ICategory } from "../db/models/category.schema";
import { UserType } from "../types";
import { Resend } from "resend";
import { buildEmailHtml, buildEmailSubject, buildEmailText, AlertEmailInput, AlertKind } from "./alert-email";

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendAlertEmail(user: UserType, input: AlertEmailInput): Promise<boolean> {
    try {
        const { error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: "www.soumyo@gmail.com",
            subject: buildEmailSubject(input),
            html: buildEmailHtml(input),
            text: buildEmailText(input)
        });

        if(error) {
            console.error("[ALERT ENGINE /lib/engine/alert-engine.ts] RESEND ERROR", error.message);
            return false;
        }
        return true;
    } catch (err: any) {
        console.error("[ALERT ENGINE /lib/engine/alert-engine.ts] RESEND ERROR", err);
        return false;
    }
}

export default async function checkAndFireAlerts(userId: string, month: number, year: number): Promise<void> {
    try {
        const user = await User.findById(userId).lean<UserType>();
        if(!user) return;

        const budgets = await Budget
                        .find({user_id: userId, month, year})
                        .populate("category_id", "name");
        
        for(const budget of budgets) {
            try {
                if(budget.limit <= 0) continue;
                console.log(JSON.stringify(budget.category_id, null, 2));
                const pct = (budget.spent / budget.limit) * 100;
                let kind: AlertKind|null = null;

                if(pct >= 100 && !budget.exceeded_sent_at) kind = "exceeded";
                if(pct >= budget.alert_at && pct < 100 && !budget.warning_sent_at) kind = "warning";

                if(!kind) continue;

                const alertEmailInput: AlertEmailInput = {
                    categoryName: budget.category_id?.name ?? null,
                    currency: user.currency,
                    limit: budget.limit,
                    month: budget.month,
                    year: budget.year,
                    spent: budget.spent,
                    kind,
                };

                let claimed: IBudget|null = null;

                if(kind === "exceeded") {
                    claimed = await Budget.findOneAndUpdate(
                        {
                            _id: budget._id,
                            user_id: user._id,
                            $or: [{exceeded_sent_at: {$exists: false}}, {exceeded_sent_at: null}]
                        },
                        {$set: {exceeded_sent_at: new Date()}},
                        {new: true}
                    );
                } else if(kind === "warning") {
                    claimed = await Budget.findOneAndUpdate(
                        {
                            _id: budget._id,
                            user_id: user._id,
                            $or: [{warning_sent_at: {$exists: false}}, {warning_sent_at: null}]
                        },
                        {$set: {warning_sent_at: new Date()}},
                        {new: true}
                    );
                }

                if(!claimed) continue;

                const sent = await sendAlertEmail(user, alertEmailInput);
                if(!sent) {
                    if(kind === "exceeded") {
                        await Budget.updateOne(
                            {_id: budget._id, user_id: user._id},
                            {$unset: {exceeded_sent_at: ""}}
                        );
                    } else if(kind === "warning") {
                        await Budget.updateOne(
                            {_id: budget._id, user_id: user._id},
                            {$unset: {warning_sent_at: ""}}
                        );
                    }
                }
            } catch (err: any) {
                console.error(`[ALERT ENGINE /lib/engine/alert-engine.ts Budget: ${budget._id}]`, err);
            }
        }
    } catch (err: any) {
        console.error("[ALERT ENGINE /lib/engine/alert-engine.ts]", err);
    }
}