import { NextResponse } from "next/server";
import connect from "@/app/utils/mongodb";
import User from "@/app/models/user";
import HomePage from "@/app/models/homePage";
import { Types } from "mongoose";

const { ObjectId } = Types;

export const GET = async (
    request: Request,
    context: { params: Promise<{ id: string }> }
) => {
    const { id: homeDataId } = await context.params;

    try {
        if (!homeDataId || !ObjectId.isValid(homeDataId)) {
            return NextResponse.json(
                { success: false, message: "Invalid or missing homeDataId" },
                { status: 400 }
            );
        }

        await connect();
        const homeData = await HomePage.findById(homeDataId);

        if (!homeData) {
            return NextResponse.json(
                { success: false, message: "Home data not found", data: null },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Home data fetched successfully", data: homeData },
            { status: 200 }
        )
    } catch (error: unknown) {
        return NextResponse.json(
            {
                success: false,
                message: "Fetching home data failed",
                error: error instanceof Error ? error.message : error,
            },
            { status: 500 }
        );
    }
}

export const PATCH = async (
    request: Request,
    context: { params: Promise<{ id: string }> }
) => {
    const { id: homeDataId } = await context.params;
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId || !ObjectId.isValid(userId)) {
            return NextResponse.json(
                { success: false, message: "Invalid or missing userId" },
                { status: 400 }
            );
        }
        if (!homeDataId || !ObjectId.isValid(homeDataId)) {
            return NextResponse.json(
                { success: false, message: "Invalid or missing homeDataId" },
                { status: 400 }
            );
        }

        await connect();

        const uploader = await User.findById(userId);
        if (!uploader) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }
        if (uploader.role !== "admin") {
            return NextResponse.json(
                { success: false, message: "You are not an admin" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { heroVideo, aboutPic, whyChooseUsPic, ...formData } = body;

        const updateData: Record<string, unknown> = {}

        if (Array.isArray(heroVideo) && heroVideo.length > 0) {
            updateData.heroVideo = heroVideo;
        }
        if (Array.isArray(aboutPic) && aboutPic.length > 0) {
            updateData.aboutPic = aboutPic;
        }
        if (Array.isArray(whyChooseUsPic) && whyChooseUsPic.length > 0) {
            updateData.whyChooseUsPic = whyChooseUsPic;
        }

        // merge the rest of the formData only if it has keys
        if (formData && Object.keys(formData).length > 0) {
            Object.assign(updateData, formData);
        }


        const updatedHomeData = await HomePage.findByIdAndUpdate(homeDataId, updateData, { new: true });
        if (!updatedHomeData) {
            return NextResponse.json(
                { success: false, message: "Home data not found", data: null },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Home data updated successfully", data: updatedHomeData },
            { status: 200 }
        )

    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Updating home data failed", error: error instanceof Error ? error.message : error },
            { status: 500 }
        );
    }
}