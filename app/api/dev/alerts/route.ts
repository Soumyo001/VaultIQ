import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/db/models/user.schema";
import { UserType } from "@/lib/types";
import checkAndFireAlerts from "@/lib/engines/alert-engine";

export const POST = async (req: Request) => {
    if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connect();
    const user = await User.findOne({ clerk_id: userId }).lean<UserType>();
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const { month, year } = await req.json();
    await checkAndFireAlerts(user._id, month, year);
    return NextResponse.json({ message: "Engine run complete" });
};