export type UserType = {
    _id:        string;
    clerk_id:   string;
    email:      string;
    username:   string;
    role:       'admin'|'user';
    currency:   string;
    timezone:   string;
    createdAt:  string;
    updatedAt:  string;
}