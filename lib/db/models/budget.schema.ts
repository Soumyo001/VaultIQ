import mongoose, { Schema, models, model, Document } from "mongoose";

export interface IBudget extends Document {
    user_id: mongoose.Types.ObjectId;
    category_id?: mongoose.Types.ObjectId;
    account_id?: mongoose.Types.ObjectId;
    month: number;
    year: number;
    limit: number;
    alert_at: number;
    spent: number;
    alert_sent_at?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const BudgetSchema = new Schema<IBudget>({
    user_id: {type: Schema.Types.ObjectId, ref: "User", required: true},
    category_id: {type: Schema.Types.ObjectId, ref: "Category"},
    account_id: {type: Schema.Types.ObjectId, ref: "Account"},
    month: {type: Number, required: true, min: 1, max: 12},
    year: {type: Number, required: true},
    limit: {type: Number, required: true, min: 0},
    alert_at: {type: Number, default: 80},
    spent: {type: Number, default: 0},
    alert_sent_at: {type: Date}
},
{
    timestamps: true,
    collection: "budgets"
});

BudgetSchema.index({user_id: 1, year: 1, month: 1});
BudgetSchema.index({user_id: 1, category_id: 1, year: 1, month: 1}, {unique: true});

const Budget = models.Budget || model<IBudget>("Budget", BudgetSchema);
export default Budget;