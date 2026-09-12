import mongoose, { Schema, models, model, Document } from "mongoose";

export interface ITransaction extends Document {
    user_id: mongoose.Types.ObjectId;
    account_id: mongoose.Types.ObjectId;
    category_id: mongoose.Types.ObjectId;
    type: "income" | "expense" | "transfer";
    amount: number;
    description: string;
    date: Date;
    tags: string[];
    notes?: string;

    // recurring rule link
    recurring_rule_id? : mongoose.Types.ObjectId;
    is_recurring_child: boolean;

    // split link
    split_id?: mongoose.Types.ObjectId;
    split_amount?: number;

    // transfer
    transfer_to_account_id? : mongoose.Types.ObjectId;

    // import metadata
    import_source?: string;
    import_ref?: string;
    is_duplicate: boolean;

    createdAt: Date;
    updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
    user_id: {type: Schema.Types.ObjectId, ref: "User", required: true},
    account_id: {type: Schema.Types.ObjectId, ref: "Account", required: true},
    category_id: {type: Schema.Types.ObjectId, ref: "Category", required: true},
    type: {type: String, enum: ["income", "expense", "transfer"], required: true},
    amount: {type: Number, required: true, min: 0},
    description: {type: String, required: true},
    date: {type: Date, required: true},
    tags: {type: [String], default: [] },
    notes: {type: String},

    // recurring rule
    recurring_rule_id: {type: Schema.Types.ObjectId, ref: "RecurringRule"},
    is_recurring_child: {type: Boolean, default: false},

    // split 
    split_id: {type: Schema.Types.ObjectId, ref: "Split"},
    split_amount: {type: Number, min: 0},

    // transfer
    transfer_to_account_id: {type: Schema.Types.ObjectId, ref: "Account"},

    // import metadata
    import_source: {type: String},
    import_ref: {type: String},
    is_duplicate: {type: Boolean, default: false}
},
{
    timestamps: true,
    collection: "transactions"
});

TransactionSchema.index({user_id: 1, date: -1});
TransactionSchema.index({user_id: 1, account_id: 1, date: -1});
TransactionSchema.index({import_ref: 1, user_id: 1}, {sparse: true});

const Transaction = models.Transaction || model<ITransaction>("Transaction", TransactionSchema);
export default Transaction;