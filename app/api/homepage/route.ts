import { NextResponse } from "next/server";
import connect from "@/app/utils/mongodb";
import User from "@/app/models/user";
import { Types } from "mongoose";
import HomePage from "@/app/models/homePage";

const { ObjectId } = Types;

export const GET = async () => {
    try {
        await connect()
        const homePage = await HomePage.find()
        if (!homePage) {
            return NextResponse.json({
                success: false,
                message: "Something went wrong",
                data: null,
                error: null
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: "Homepage fetched successfully",
            data: homePage,
            error: null,
        }, { status: 200 });

    } catch (err: unknown) {
        const errorMessage =
            err instanceof Error ? err.message : "Unknown error occurred";

        return NextResponse.json({
            success: false,
            message: "Fetching homepage failed: " + errorMessage,
            data: null,
            error: process.env.NODE_ENV === "development" ? errorMessage : null,
        }, { status: 500 });
    }

}
export const POST = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        // Parse payload
        const body = await request.json();
        const { heroVideo, aboutPic, whyChooseUsPic, ...formData } = body;

        // Validate userId
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
                { success: false, message: "You are not an admin" },
                { status: 401 }
            );
        }

        // Create new project document
        const newHomePage = await HomePage.create({
            ...formData,
            heroVideo: heroVideo || [],
            aboutPic: aboutPic || [],
            whyChooseUsPic: whyChooseUsPic || [],
        });

        await newHomePage.save();
        return NextResponse.json(
            {
                success: true,
                message: "HomePage created successfully",
                data: null,
                error: null,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("Error while posting Homepage:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Posting Homepage failed",
                data: null,
                error: error instanceof Error ? error.message : error,
            },
            { status: 500 }
        );
    }
};
