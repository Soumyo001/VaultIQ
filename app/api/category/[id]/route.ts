import { auth } from "@clerk/nextjs/server";
import { CategoryType, UserType } from "@/lib/types";
import Category from "@/lib/db/models/category.schema";
import User from "@/lib/db/models/user.schema";
import Transaction from "@/lib/db/models/transaction.schema";
import Budget from "@/lib/db/models/budget.schema";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import connect from "@/lib/db";
import { UpdateCategorySchema } from "@/lib/validators/payload_validator/category.schema";

export const PATCH = async(req: Request, { params }: { params: Promise<{id: string}> }) => {
    try {
        const { userId, isAuthenticated } = await auth();
        if(!userId || !isAuthenticated) {
            return NextResponse.json({
                message: "Unauthenticated. User not logged in"
            }, {status: 401});
        }
        await connect();
        const user: UserType|null = await User.findOne({clerk_id: userId}).lean<UserType>();
        if(!user) {
            return NextResponse.json({
                message: "Warning! User not synced. Please re-login to sync your account"
            }, {status: 404});
        }
        const { id } = await params;
        if(!id || !Types.ObjectId.isValid(id)) {
            return NextResponse.json({
                message: "Invalid category"
            }, {status: 400});
        }
        const category: CategoryType|null = await Category.findOne({
            _id: id,
            user_id: user._id
        }).lean<CategoryType>();
        if(!category) {
            return NextResponse.json({
                message: "Category not found"
            }, {status: 404});
        }
        const body = await req.json();
        const parsed = UpdateCategorySchema.safeParse(body);
        if(!parsed.success) {
            return NextResponse.json({
                message: "Bad update request",
                errors: parsed.error.flatten().fieldErrors
            }, {status: 400});
        }
        const data = parsed.data;
        if(Object.keys(data).length === 0) {
            return NextResponse.json({
                message: "No fields to update"
            }, {status: 400});
        }
        const updatedCategory: CategoryType|null = await Category.findOneAndUpdate(
            {_id: category._id, user_id: user._id},
            {$set: data},
            {new: true, runValidators: true}
        ).lean<CategoryType>();

        return NextResponse.json({
            message: "Category updated",
            category: updatedCategory
        }, {status: 200});
    } catch (err: any) {
        console.log("[PATCH /api/category/[id]]", err.message);
        return NextResponse.json({
            message: "Internal server error"
        }, {status: 500});
    }
}

export const DELETE = async({ params }: { params: Promise<{id: string}> }) => {
    try {
        const { userId, isAuthenticated } = await auth();
        if(!userId || !isAuthenticated) {
            return NextResponse.json({
                message: "Unauthenticated. User not logged in"
            }, {status: 401});
        }
        await connect();
        const user: UserType|null = await User.findOne({clerk_id: userId}).lean<UserType>();
        if(!user) {
            return NextResponse.json({
                message: "Warning! User not synced. please re-login to sync your account"
            }, {status: 404});
        }
        const { id } = await params;
        if(!Types.ObjectId.isValid(id)) {
            return NextResponse.json({
                message: "Invalid category"
            }, {status: 400});
        }
        const category: CategoryType|null = await Category.findOne({
            _id: id,
            user_id: user._id
        }).lean<CategoryType>();
        if(!category) {
            return NextResponse.json({
                message: "Could not find category"
            }, {status: 404});
        }
        if(category.is_system) {
            return NextResponse.json({
                message: "Cannot delete a system category"
            }, {status: 403});
        }
        const [txCount, budgetCount, childCount] = await Promise.all([
            Transaction.countDocuments({category_id: category._id, user_id: user._id}),
            Budget.countDocuments({category_id: category._id, user_id: user._id}),
            Category.countDocuments({parent_id: category._id, user_id: user._id})
        ]);
        if(txCount > 0 || budgetCount > 0) {
            return NextResponse.json({
                message: "Category is in use. Please re-assign transactions and budgets before deleting"
            }, {status: 409});
        }
        if(childCount > 0) {
            return NextResponse.json({
                message: "Cannot delete a parent category. please delete all sub-categories and then try again"
            }, {status: 409});
        }
        const deletedCategory: CategoryType|null = await Category.findByIdAndDelete(category._id).lean<CategoryType>();
        return NextResponse.json({
            message: "Category deleted",
            category: deletedCategory
        }, {status: 200});
    } catch (err: any) {
        console.log("[DELETE /api/category/[id]]", err.message);
        return NextResponse.json({
            message: "Internal server error"
        }, {status: 500});
    }
}