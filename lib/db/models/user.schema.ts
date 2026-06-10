import { Schema, models, model, Document } from "mongoose";

export interface IUser extends Document {
    clerk_id:  string;
    email:     string;
    username:  string;
    role:      'admin' | 'user';
    currency:  string;
    timezone:  string;
    createdAt: string;
    updatedAt: string;
};

const UserSchema = new Schema<IUser>(
    {
        clerk_id: {type: String, required: true, unique: true},
        email:    {type: String, required: true, unique: true, lowercase: true, trim: true},
        username: {type: String, required: true, unique: true, trim: true},
        role:     {type: String, enum: ['admin', 'user'], default: 'user'},
        currency: {type: String, default: 'BDT' },
        timezone: {type: String, default: 'UTC'}
    },
    {
        timestamps: true,
        collection: 'users'
    }
);

const User = models.User || model<IUser>("User", UserSchema);
export default User;