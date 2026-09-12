export type AccountType = {
    _id: string;
    user_id: string;
    name: string;
    type: "checking"|"savings"|"credit"|"cash"|"investment";
    currency: string;
    balance: number;
    initial_balance: number;
    color: string;
    icon: string;
    is_archived: boolean;
}