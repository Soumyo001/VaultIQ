import User from "@/lib/models/user.schema";
import { UserType } from "@/lib/types";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { SyncSchema } from "@/lib/validators/payload_validator/sync-user.schema";
import connect from "@/lib/db";
import { DEFAULT_TIMEZONE } from "@/lib/data/constants";
import { guessCurrency } from "@/lib/engines/currency-detection-engine";

export const GET = async() => {
    try {
        const { userId, isAuthenticated } = await auth();
        if(!userId || !isAuthenticated) {
            return NextResponse.json(
                {message: "Unauthorized. User must be logged in"}, {status: 401}
            );
        }
        let user: UserType|null = null;
        user = await User.findOne({clerk_id: userId}).lean<UserType>();
        if(!user) {
            const client = await clerkClient();
            const clerkUser = await client.users.getUser(userId);
            const email = clerkUser.emailAddresses[0]?.emailAddress;
            const username = clerkUser.username;
            if(!email || !username) {
                return NextResponse.json(
                    {message: "Clerk auth missing email or username"}, {status: 422}
                );
            }

            const timezone = (clerkUser.publicMetadata as any).timezone ?? DEFAULT_TIMEZONE;
            const currency = (clerkUser.publicMetadata as any).currency ?? await guessCurrency();
            user = await User.create({
                clerk_id: userId,
                email,
                username,
                timezone,
                currency
            });
        }
        return NextResponse.json(
            {message: "User account synced", user}, {status: 200}
        );
    } catch (err: any) {
        return NextResponse.json(
            {message: `Server error: ${err.message}`}, {status: 500}
        );
    }
}

export const POST = async(req: Request) => {
    try {
        const { userId, isAuthenticated } = await auth();
        if(!userId || !isAuthenticated) {
            return NextResponse.json(
                {message: "Unauthorized. User account not created"}, {status: 401}
            );
        }
        const body = await req.json();
        const parsed = SyncSchema.safeParse(body);
        if(!parsed.success) {
            return NextResponse.json(
                {
                    message: "Invalid request data",
                    errors: parsed.error.flatten().fieldErrors
                }, { status: 400 }
            );
        }
        const { timezone, currency } = parsed.data;

        let syncedUser: UserType|null = null;
        const client = await clerkClient();
        await connect();
        const alreadySynced = await User.findOne({clerk_id: userId}).lean<UserType>();
        if(!alreadySynced) {
            const clerkUser = await client.users.getUser(userId);
            const email = clerkUser.emailAddresses[0]?.emailAddress;
            const username = clerkUser.username;
            if(!email || !username) {
                return NextResponse.json(
                    {message: "Clerk auth missing email or username"}, {status: 422}
                );
            }

            const orphaned = await User.findOne({
                $or: [{email}, {username}]
            }).lean<UserType>();

            if(orphaned) {
                syncedUser = await User.findByIdAndUpdate(
                    orphaned._id,
                    {
                        $set: {
                            clerk_id: userId,
                            email,
                            username,
                            timezone,
                            currency,
                            role: 'user'
                        },
                    },
                    {new: true, runValidators: true}
                ).lean<UserType>();
            } else {
                syncedUser = await User.create({
                    clerk_id: userId,
                    email,
                    username,
                    timezone,
                    currency,
                    role: 'user'
                });
            }
        }

        await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'user',
                isOnboarded: true,
                timezone,
                currency
            }
        });
        return NextResponse.json(
            {message: "User account synced", user: syncedUser}, {status: 201}
        );
    } catch (err: any) {
        if(err.code === 11000) {
            return NextResponse.json(
                {message: "User already exists"}, {status: 409}
            );
        }
        return NextResponse.json(
            {message: `Server error: ${err.message}`}, {status: 500}
        );
    }
}