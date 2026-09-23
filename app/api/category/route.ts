import { CategoryType, UserType, AccountType } from "@/lib/types";
import { CreateCategorySchema } from "@/lib/validators/payload_validator/category.schema";
import connect from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import User from "@/lib/db/models/user.schema";
import { Types } from "mongoose";
import Category from "@/lib/db/models/category.schema";

export const POST = async(req: Request) => {
    try {
        const { userId, isAuthenticated } = await auth();
        if(!userId || !isAuthenticated) {
            return NextResponse.json({
                message: "Unauthenticated! User not logged in"
            }, {status: 401});
        }
        await connect();
        const user: UserType|null = await User.findOne({clerk_id: userId}).lean<UserType>();
        if(!user) {
            return NextResponse.json({
                message: "Warning! User not synced. please re-login to sync your account"
            }, {status: 404});
        }
        const body = await req.json();
        const parsed = CreateCategorySchema.safeParse(body);
        if(!parsed.success) {
            return NextResponse.json({
                message: "Unsupported request type",
                errors: parsed.error.flatten().fieldErrors
            }, {status: 400});
        }
        const data = parsed.data;
        const parentId = data.parent_id ?? null;
        if(parentId) {
            if(!Types.ObjectId.isValid(parentId)) {
                return NextResponse.json({
                    message: "Invalid category parent ID"
                }, {status: 400});
            }
            const parentCategory: CategoryType|null = await Category.findOne({
                _id: parentId,
                user_id: user._id
            }).lean<CategoryType>();
            if(!parentCategory) {
                return NextResponse.json({
                    message: "Parent category not found"
                }, {status: 404});
            }
            if(parentCategory.type !== data.type) {
                return NextResponse.json({
                    message: "Subcategory type must match with parent type"
                }, {status: 400});
            }
            if(parentCategory.parent_id !== null) {
                return NextResponse.json({
                    message: "Cannot have subcategories more than 1 layer deep"
                }, {status: 400});
            }
        }
        let category: CategoryType|null = await Category.findOne({
            user_id: user._id,
            name: data.name,
            type: data.type
        }).lean<CategoryType>();
        if(category) {
            return NextResponse.json({
                message: "Conflict. Category with same name and type already exist"
            }, {status: 409});
        }

        category = await Category.create({
            ...data,
            user_id: user._id,
            is_system: false
        });
        return NextResponse.json({
            message: "Category created", category
        }, {status: 201});
    } catch (err: any) {
        console.log("POST /api/category", err.message);
        return NextResponse.json({
            message: "Internal server error"
        }, {status: 500});
    }
}