import { auth } from "@clerk/nextjs/server"
import { UserType, AccountType } from "@/lib/types"
import User from "@/lib/db/models/user.schema"
import Account from "@/lib/db/models/account.schema"
import { NextResponse } from "next/server"
import { UpdateAccountSchema } from "@/lib/validators/payload_validator/account.schema"
import connect from "@/lib/db"
import { Types } from "mongoose"
import Transaction from "@/lib/db/models/transaction.schema"

export const PATCH = async(req: Request, { params }: { params: Promise<{id: string}> }) => {
    try {
        const { userId, isAuthenticated } = await auth();
        if(!userId || !isAuthenticated) {
            return NextResponse.json({
                message: "Unauthorized. User not logged in"
            }, { status: 401 });
        }
        await connect();
        const user: UserType|null = await User.findOne({clerk_id: userId}).lean<UserType>();
        if(!user) {
            return NextResponse.json({
                message: "Warning! User not synced. please re-login to sync your account"
            }, { status: 404 });
        }

        const { id } = await params;
        if(!id || !Types.ObjectId.isValid(id)) {
            return NextResponse.json({
                message: "Invalid account ID"
            }, { status: 400 });
        }
        const account: AccountType|null = await Account.findOne({
            _id: id,
            user_id: user._id
        }).lean<AccountType>();
        if(!account) {
            return NextResponse.json({
                message: "Could not find your account"
            }, { status: 404 });
        }

        const body = await req.json();
        const parsed = UpdateAccountSchema.safeParse(body);
        if(!parsed.success) {
            return NextResponse.json({
                message: "Invalid request data",
                errors: parsed.error.flatten().fieldErrors
            }, { status: 400 });
        }
        const data = parsed.data;
        if(Object.keys(data).length === 0) {
            return NextResponse.json({
                message: "No fields to update"
            }, { status: 400 });
        }

        const updatedAccount: AccountType|null = await Account.findOneAndUpdate(
            {_id: account._id, user_id: user._id},
            { $set: data },
            { new: true, runValidators: true }
        ).lean<AccountType>();
        return NextResponse.json({
            message: "Account updated",
            account: updatedAccount
        }, { status: 200 });
    } catch (err: any) {
        console.log("[PATCH /api/account/[id]]", err.message);
        return NextResponse.json({
            message: 'Internal server error'
        }, { status: 500 });
    }
}

export const DELETE = async(req: Request, { params }: { params: Promise<{id: string}> }) => {
    try {
        const { userId, isAuthenticated } = await auth();
        if(!userId || !isAuthenticated) {
            return NextResponse.json({
                message: "Unauthenticated. User not logged in"
            }, { status: 401 });
        }
        await connect();
        const user: UserType|null = await User.findOne({clerk_id: userId}).lean<UserType>();
        if(!user) {
            return NextResponse.json({
                message: "Warning! User not synced. please re-login to sync your account"
            }, { status: 404 });
        }

        const { id } = await params;
        if(!id || !Types.ObjectId.isValid(id)) {
            return NextResponse.json({
                message: "Invalid account ID"
            }, { status: 400 });
        }
        const account: AccountType|null = await Account.findOne({
            _id: id,
            user_id: user._id
        }).lean<AccountType>();
        if(!account) {
            return NextResponse.json({
                message: "Could not find your account"
            }, { status: 404 });
        }

        const count = await Transaction.countDocuments({
            account_id: account._id,
            user_id: user._id
        });
        
        let updatedAccount: AccountType|null = null;
        if(count > 0) {
            updatedAccount = await Account.findByIdAndUpdate(
                account._id,
                {$set: { is_archived: true }},
                {new: true, runValidators: true}
            ).lean<AccountType>();
        } else {
            updatedAccount = await Account.findByIdAndDelete(account._id).lean<AccountType>();
        }
        
        return NextResponse.json({
            message: `Account ${count > 0 ? "archived":"deleted"}`, 
            account: updatedAccount,
        }, { status: 200 });
    } catch (err: any) {
        console.log("[DELETE /api/account/[id]]", err.message);
        return NextResponse.json({
            message: 'Internal Server Error'
        }, { status: 500 });
    }
}