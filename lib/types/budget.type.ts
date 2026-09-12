export type BudgetType = {
    _id: string;
    user_id: string;
    category_id: string | null;
    month: number;
    year: number;
    limit: number;
    alert_at: number;
    spent: number;
    alert_sent_at?: Date;
}