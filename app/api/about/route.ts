import { NextResponse } from "next/server";
import connect from "@/app/utils/mongodb";
import About from "@/app/models/about";

export const GET = async () => {
    try {
        await connect();
        const about = await About.find();

        if (!about) {
            return NextResponse.json({
                success: false,
                message: "About not found",
                data: null,
                error: null,
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "About fetched successfully",
            data: about,
            error: null,
        })

    } catch (err: unknown) {
        const errorMessage =
            err instanceof Error ? err.message : "Unknown error occurred";

        return NextResponse.json({
            success: false,
            message: "Fetching about failed: " + errorMessage,
            data: null,
            error: process.env.NODE_ENV === "development" ? errorMessage : null,
        }, { status: 500 });
    }
}