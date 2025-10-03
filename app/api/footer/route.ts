import { NextResponse } from "next/server";
import connect from "@/app/utils/mongodb";
import User from "@/app/models/user";
import { Types } from "mongoose";
import FooterLinks from "@/app/models/footerLinks";

const { ObjectId } = Types;

export const GET = async () => {
    try {
        await connect();
        const footerLinks = await FooterLinks.find();

        if (!footerLinks) {
            return NextResponse.json({
                success: false,
                message: "Footer links not found",
                data: null,
                error: null,
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Footer links fetched successfully",
            data: footerLinks,
            error: null,
        })
    } catch (err: unknown) {
        const errorMessage =
            err instanceof Error ? err.message : "Unknown error occurred";

        return NextResponse.json({
            success: false,
            message: "Fetching footer links failed: " + errorMessage,
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
        const { mail, instagram, whatsapp, youtube } = body;

        const footerLinks = new FooterLinks({
            mail,
            instagram,
            whatsapp,
            youtube,
        });

        if (!footerLinks) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Footer links not found",
                    data: null,
                    error: null,
                },
                { status: 404 }
            );
        }

        await footerLinks.save();
        return NextResponse.json({
            success: true,
            message: "Footer links posted successfully",
            data: footerLinks,
            error: null,
        });
    } catch (error) {
        console.error("Error while posting footer links:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Posting footer links failed",
                data: null,
                error: error instanceof Error ? error.message : error,
            },
            { status: 500 }
        );
    }
}