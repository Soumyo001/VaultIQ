export type CategoryType = {
    _id: string;
    user_id: string;
    name: string;
    type: "income" | "expense";
    icon: string;
    color: string;
    parent_id?: string | null;
    is_system: boolean;
}