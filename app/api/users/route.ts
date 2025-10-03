import { NextResponse } from "next/server";
import connect from "@/app/utils/mongodb";
import User from "@/app/models/user";

export const GET = async () => {
    try {
        await connect();
        const users = await User.find();

        if (!users) {
            return NextResponse.json({
                success: false,
                message: "Users not found",
                data: null,
                error: null,
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Users fetched successfully",
            data: users,
            error: null,
        }, { status: 200 });

    } catch (err: unknown) {
        const errorMessage =
            err instanceof Error ? err.message : "Unknown error occurred";

        return NextResponse.json({
            success: false,
            message: "Fetching users failed: " + errorMessage,
            data: null,
            error: process.env.NODE_ENV === "development" ? errorMessage : null,
        }, { status: 500 });
    }
};

export const POST = async (request: Request) => {
    try {
        await connect();

        // ,role
        const { name, email, password, role } = await request.json();

        const error: Record<string, string> = {};
        if (!name) error.name = "Name is required";
        if (!email) error.email = "Email is required";
        if (!password) error.password = "Password is required";

        if (Object.keys(error).length > 0) {
            return NextResponse.json({
                success: false,
                message: "Validation error",
                data: null,
                error,
            }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({
                success: false,
                message: "Password must be at least 6 characters",
                data: null,
                error: { password: "Too short" },
            }, { status: 400 });
        }

        // ,role
        const newUser = new User({ name, email, password, role});
        await newUser.save();

        return NextResponse.json({
            success: true,
            message: "User created successfully",
            data: {
                name,
                email,
            },
            error: null,
        }, { status: 201 });

    } catch (err: unknown) {
        const errorMessage =
            err instanceof Error ? err.message : "Unknown error occurred";

        return NextResponse.json({
            success: false,
            message: "Creating user failed: " + errorMessage,
            data: null,
            error: process.env.NODE_ENV === "development" ? errorMessage : null,
        }, { status: 500 });
    }
};
