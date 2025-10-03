import { NextResponse } from "next/server";
import connect from "@/app/utils/mongodb";
import User from "@/app/models/user";
import Testimony from "@/app/models/testimony";
import { Types } from "mongoose";

const { ObjectId } = Types;

export const GET = async (request: Request, context: { params: Promise<{ id: string }> }) => {
    const { id: testimonyId } = await context.params;

    try {
        if (!testimonyId || !ObjectId.isValid(testimonyId)) {
            return NextResponse.json(
                { success: false, message: "Invalid or missing testimonyId" },
                { status: 400 }
            );
        }

        await connect();
        const testimony = await Testimony.findById(testimonyId);

        if (!testimony) {
            return NextResponse.json(
                { success: false, message: "Testimony not found", data: null },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Testimony fetched successfully", data: testimony },
            { status: 200 }
        )

    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Fetching testimony failed", error: error instanceof Error ? error.message : error },
            { status: 500 }
        );
    }
}

export const PATCH = async (
    request: Request,
    context: { params: Promise<{ id: string }> }
) => {
    const { id: testimonyId } = await context.params;

    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId || !ObjectId.isValid(userId)) {
            return NextResponse.json(
                { success: false, message: "Invalid or missing userId" },
                { status: 400 }
            );
        }
        if (!testimonyId || !ObjectId.isValid(testimonyId)) {
            return NextResponse.json(
                { success: false, message: "Invalid or missing testimonyId" },
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
        const { ...formData } = body;

        const updateData: Record<string, unknown> = {};

        if (formData && Object.keys(formData).length > 0) {
            Object.keys(formData).forEach((key) => {
                updateData[key] = formData[key];
            });
        }

        const updatedTestimony = await Testimony.findByIdAndUpdate(testimonyId, {$set: updateData}, { new: true });

        if (!updatedTestimony) {
            return NextResponse.json(
                { success: false, message: "Testimony not found", data: null },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Testimony updated successfully", data: updatedTestimony },
            { status: 200 }
        )

    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Updating testimony failed", error: error instanceof Error ? error.message : error },
            { status: 500 }
        );
    }

}


export const DELETE = async (
    request: Request,
    context: { params: Promise<{ id: string }> }
) => {

    const { id: testimonyId } = await context.params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    try {

        // --- Validate IDs ---
        if (!userId || !ObjectId.isValid(userId)) {
            return NextResponse.json({ success: false, message: "Invalid or missing userId" }, { status: 400 });
        }

        if (!testimonyId || !ObjectId.isValid(testimonyId)) {
            return NextResponse.json({ success: false, message: "Invalid or missing testimonyId" }, { status: 400 });
        }

        await connect();

        // --- Verify admin ---
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }
        if (user.role !== "admin") {
            return NextResponse.json({ success: false, message: "You are not an admin" }, { status: 401 });
        }

        // --- Fetch the project first so we can read file objects ---
        const testimony = await Testimony.findById(testimonyId);
        if (!testimony) {
            return NextResponse.json({ success: false, message: "Testimony not found" }, { status: 404 });
        }

        // --- Delete testimony ---
        const deletedTestimony = await Testimony.findByIdAndDelete(testimonyId);
        if (!deletedTestimony) {
            return NextResponse.json({ success: false, message: "Testimony not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Testimony deleted successfully", data: deletedTestimony }, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Deleting testimonial failed",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}