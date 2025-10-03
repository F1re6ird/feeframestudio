import { NextResponse } from "next/server";
import connect from "@/app/utils/mongodb";
import User from "@/app/models/user";
import FooterLinks from "@/app/models/footerLinks";
import { Types } from "mongoose";

const { ObjectId } = Types;

export const GET = async (
    request: Request,
    context: { params: Promise<{ id: string }> }
) => {
    const { id: footerLinkId } = await context.params;
    try {
        if (!footerLinkId || !ObjectId.isValid(footerLinkId)) {
            return NextResponse.json(
                { success: false, message: "Invalid or missing footerLinkId" },
                { status: 400 }
            );
        }
        await connect();
        const footerLink = await FooterLinks.findById(footerLinkId);
        if (!footerLink) {
            return NextResponse.json(
                { success: false, message: "Footer link not found", data: null },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { success: true, message: "Footer link fetched successfully", data: footerLink },
            { status: 200 }
        );

    } catch (error: unknown) {
        return NextResponse.json(
            {
                success: false,
                message: "Fetching footer link failed",
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
    const { id: footerLinkId } = await context.params;
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId || !ObjectId.isValid(userId)) {
            return NextResponse.json(
                { success: false, message: "Invalid or missing userId" },
                { status: 400 }
            );
        }
        if (!footerLinkId || !ObjectId.isValid(footerLinkId)) {
            return NextResponse.json(
                { success: false, message: "Invalid or missing footerLinkId" },
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

        const footerLink = await FooterLinks.findById(footerLinkId);
        if (!footerLink) {
            return NextResponse.json(
                { success: false, message: "Footer link not found", data: null },
                { status: 404 }
            );
        }

        const body = await request.json();
        const { ...formData } = body;

        const updateData: Record<string, unknown> = {}
        if (formData && Object.keys(formData).length > 0) {
            Object.keys(formData).forEach((key) => {
                updateData[key] = formData[key];
            });
        }

        const updatedFooterLink = await FooterLinks.findByIdAndUpdate(footerLinkId, { $set: updateData }, { new: true });

        if (!updatedFooterLink) {
            return NextResponse.json(
                { success: false, message: "Footer link not found", data: null },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Footer link updated successfully", data: updatedFooterLink },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Updating footer link failed", error: error instanceof Error ? error.message : error },
            { status: 500 }
        );
    }
}