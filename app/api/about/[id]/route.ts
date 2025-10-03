import { NextResponse } from "next/server";

import connect from "@/app/utils/mongodb";
import User from "@/app/models/user";
import About from "@/app/models/about";
import { Types } from "mongoose";

const { ObjectId } = Types;

export const GET = async (
    request: Request,
    context: { params: Promise<{ id: string }> }
) => {
    const { id: aboutId } = await context.params;
    try {
        if (!aboutId || !ObjectId.isValid(aboutId)) {
            return NextResponse.json(
                { success: false, message: "Invalid or missing aboutId" },
                { status: 400 }
            );
        }
        await connect();
        const about = await About.findById(aboutId);
        if (!about) {
            return NextResponse.json(
                { success: false, message: "About not found", data: null },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { success: true, message: "About fetched successfully", data: about },
            { status: 200 }
        );

    } catch (error: unknown) {
        return NextResponse.json(
            {
                success: false,
                message: "Fetching about failed",
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
    const { id: aboutId } = await context.params;
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId || !ObjectId.isValid(userId)) {
            return NextResponse.json(
                { success: false, message: "Invalid or missing userId" },
                { status: 400 }
            );
        }
        if (!aboutId || !ObjectId.isValid(aboutId)) {
            return NextResponse.json(
                { success: false, message: "Invalid or missing aboutId" },
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

        const about = await About.findById(aboutId);
        if (!about) {
            return NextResponse.json(
                { success: false, message: "About not found" },
                { status: 404 }
            );
        }

        const body = await request.json();
        const { aboutUs } = body;

        const updatedAbout = await About.findByIdAndUpdate(aboutId, { aboutUs: aboutUs }, { new: true });
        if (!updatedAbout) {
            return NextResponse.json(
                { success: false, message: "Updating about failed" },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { success: true, message: "About updated successfully", data: updatedAbout },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Updating about failed", error: error instanceof Error ? error.message : error },
            { status: 500 }
        );
    }
}