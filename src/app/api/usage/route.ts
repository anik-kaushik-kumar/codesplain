import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getUsage } from "@/lib/usage-tracker";

export async function GET() {
    const headersList = await headers();
    const ip =
        headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        headersList.get("x-real-ip") ||
        "127.0.0.1";

    const usage = getUsage(ip);
    return NextResponse.json(usage);
}
