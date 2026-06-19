import { CurrencyCode, DEFAULT_CURRENCY, DEFAULT_TIMEZONE, SUPPORTED_CODES } from "@/lib/utils/currency-util/currency";
import { Schema, models, model, Document } from "mongoose";

export interface IUser extends Document {
    clerk_id?:  string;
    email:     string;
    username:  string;
    role:      'admin' | 'user';
    currency:  CurrencyCode;
    timezone:  string;
    createdAt: string;
    updatedAt: string;
};

const UserSchema = new Schema<IUser>(
    {
        clerk_id: {type: String, sparse: true, unique: true},
        email:    {type: String, required: true, unique: true, lowercase: true, trim: true},
        username: {type: String, required: true, unique: true, trim: true},
        role:     {type: String, enum: ['admin', 'user'], default: 'user'},
        currency: {type: String, enum: SUPPORTED_CODES, default: DEFAULT_CURRENCY },
        timezone: {type: String, default: DEFAULT_TIMEZONE}
    },
    {
        timestamps: true,
        collection: 'users'
    }
);

const User = models.User || model<IUser>("User", UserSchema);
export default User;