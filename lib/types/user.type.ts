import { CurrencyCode } from "../utils/currency-util/currency";

export type UserType = {
    _id:        string;
    clerk_id?:   string;
    email:      string;
    username:   string;
    role:       'admin'|'user';
    currency:   CurrencyCode;
    timezone:   string;
    createdAt:  string;
    updatedAt:  string;
}