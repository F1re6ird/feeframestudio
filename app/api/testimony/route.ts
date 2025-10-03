import { NextResponse } from "next/server";
import connect from "@/app/utils/mongodb";
import User from "@/app/models/user";
import Testimony from "@/app/models/testimony";
import { Types } from "mongoose";

const { ObjectId } = Types;

export const GET = async () => {
    try {
        await connect();

        const testimony = await Testimony.find();

        if (!testimony) {
            return NextResponse.json({
                success: false,
                message: "Testimony not found",
                data: null,
                error: null,
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Testimony fetched successfully",
            data: testimony,
            error: null,
        })

    } catch (err: unknown) {
        const errorMessage =
            err instanceof Error ? err.message : "Unknown error occurred";

        return NextResponse.json({
            success: false,
            message: "Fetching testimony failed: " + errorMessage,
            data: null,
            error: process.env.NODE_ENV === "development" ? errorMessage : null,
        }, { status: 500 });
    }
}

export const POST = async (request: Request) => {

    try {

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId || !ObjectId.isValid(userId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid or missing userId",
                    data: null,
                    error: null,
                },
                { status: 400 }
            );
        }

        await connect();

        const uploader = await User.findById(userId);
        if (!uploader) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                    data: null,
                    error: null,
                },
                { status: 404 }
            );
        }

        if (uploader.role !== "admin") {
            return NextResponse.json(
                {
                    success: false,
                    message: "You are not an admin",
                    data: null,
                    error: null,
                },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, role, content } = body;

        console.log(name, role, content)

        const testimony = new Testimony({ name, role, content });

        if (!testimony) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Posting testimony failed",
                    data: null,
                    error: null,
                },
                { status: 500 }
            );
        }

        await testimony.save();

        return NextResponse.json(
            {
                success: true,
                message: "Testimony posted successfully",
                data: testimony,
                error: null,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error while posting footer links:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Posting testimony failed",
                data: null,
                error: error instanceof Error ? error.message : error,
            },
            { status: 500 }
        );
    }
}