import mongoose, { Schema, models, model, Document } from "mongoose";

export interface IAccount extends Document {
    user_id: mongoose.Types.ObjectId;
    name: string;
    type: "checking"|"savings"|"credit"|"cash"|"investment";
    currency: string;
    initial_balance: number;
    balance: number;
    color: string;
    icon: string;
    is_archived: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const AccountSchema = new Schema<IAccount>({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: {type: String, required: true, trim: true},
    type: {type: String, enum: ["checking", "savings", "credit", "cash", "investment"], required: true},
    currency: {type: String, default: "USD"},
    initial_balance: {type: Number, required: true, default: 0},
    balance: {type: Number, default: 0, required: true},
    color: {type: String, default: "#6366f1"},
    icon: {type: String, default: "wallet"},
    is_archived: {type: Boolean, default: false}
},
{
    timestamps: true,
    collection: 'accounts',
});

const Account = models.Account || model<IAccount>("Account", AccountSchema);
export default Account;