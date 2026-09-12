export type TransactionType = {
    _id: string;
    user_id: string;
    account_id: string;
    category_id: string;
    type: "income" | "expense" | "transfer";
    amount: number;
    description: string;
    date: string;
    tags: string[];
    notes?: string;

    //recurring rule
    recurring_rule_id?: string;
    is_recurring_child: boolean;

    //split
    split_id?: string;
    split_amount?: number;

    //transfer
    transfer_to_account_id?: string;

    //import metadata
    import_source?: string;
    import_ref?: string;
    is_duplicate: boolean;
}