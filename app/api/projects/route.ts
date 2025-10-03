import { NextResponse } from "next/server"
import connect from "@/app/utils/mongodb";
import User from "@/app/models/user";
import Project, { IProject } from "@/app/models/project";
import { Types, SortOrder } from "mongoose";

const { ObjectId } = Types;


export const GET = async (request: Request) => {
  try {
    await connect();

    const { searchParams } = new URL(request.url);

    // optional limit
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    // optional type filter (comma-separated)
    const typeParam = searchParams.get("type");
    const filter: Record<string, unknown> = {};
    if (typeParam) {
      filter.types = { $in: typeParam.split(",") };
    }

    // sort order (featured first, then newest)
    const sortOrder: Record<string, SortOrder> = { isFeatured: -1, createdAt: -1 };

    // query
    const query = Project.find(filter).sort(sortOrder);
    if (limit) query.limit(limit);

    const projects = await query;

    return NextResponse.json({
      success: true,
      message: "Projects fetched successfully",
      data: projects,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { success: false, message: "Fetching projects failed: " + msg },
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Parse payload
    const body = await request.json();
    const { videoUploads, photoUploads, designUploads, types, ...formData } = body;

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

    console.log("Form Data:", formData);
    console.log("Project Files:", videoUploads);
    console.log("Photo Files:", photoUploads);
    console.log("Design Files:", designUploads);
    console.log("Types:", types);

    // Create new project document
    const newProject: IProject = await Project.create({
      ...formData,
      pictureTitle: formData.projectTitle || "",
      types: types || [],
      thumbnail: videoUploads || [],
      photoFiles: photoUploads || [],
      designFiles: designUploads || [],
    });

    await newProject.save();
    return NextResponse.json(
      {
        success: true,
        message: "Project created successfully",
        data: null,
        error: null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error while posting project:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Posting project failed",
        data: null,
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
};
