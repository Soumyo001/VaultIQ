import { auth } from "@clerk/nextjs/server"
import connect from "@/lib/db";
import { UserType, AccountType } from "@/lib/types";
import { NextResponse } from "next/server";
import { CreateAccountSchema } from "@/lib/validators/payload_validator/account.schema";
import User from "@/lib/db/models/user.schema";
import Account from "@/lib/db/models/account.schema";

export const POST = async (req: Request) => {
    try {
        const { userId, isAuthenticated } = await auth();
        if(!userId || !isAuthenticated) {
            return NextResponse.json({
                message: "Unauthorized. User not logged in"
            }, { status: 401 });
        }
        await connect();
        const user: UserType|null = await User.findOne({clerk_id: userId}).lean<UserType>();
        if(!user) {
            return NextResponse.json({
                message: "Warning! User not synced. Please re-login to sync your account"
            }, { status: 404 });
        }

        const body = await req.json();
        const parsed = CreateAccountSchema.safeParse(body);
        if(!parsed.success) {
            return NextResponse.json({
                message: "Cannot process invalid request data",
                errors: parsed.error.flatten().fieldErrors,
            }, { status: 400 });
        }
        const data = parsed.data;

        const account: AccountType|null = await Account.findOne({
            user_id: user._id,
            name: data.name,
            is_archived: false
        }).lean<AccountType>();
        if(account) {
            return NextResponse.json({
                message: "Conflict! Account with same name already exist"
            }, { status: 409 });
        }

        const createdAccount = await Account.create({
            ...data,
            user_id: user._id,
            balance: data.initial_balance,
            is_archived: false
        });
        return NextResponse.json({
            message: "Account created successfully", account: createdAccount
        }, { status: 201 });
    } catch (err: any) {
        console.log("[POST /api/account]", err.message);
        return NextResponse.json({
            message: 'Internal Server Error'
        }, { status: 500 });
    }
}