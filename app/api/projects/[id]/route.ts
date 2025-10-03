import { NextResponse } from "next/server";
import connect from "@/app/utils/mongodb";
import User from "@/app/models/user";
import Project from "@/app/models/project";
import { Types } from "mongoose";

const { ObjectId } = Types;

export const GET = async (
  request: Request,
  context: { params: Promise<{ id: string }> } // params is a Promise
) => {
  // Await the promise to get the actual params object
  const { id: projectId } = await context.params;


  try {
    if (!projectId || !ObjectId.isValid(projectId)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing projectId" },
        { status: 400 }
      );
    }

    await connect();
    const project = await Project.findById(projectId);

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found", data: null },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Project fetched successfully", data: project },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message: "Fetching project failed",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
};


// PATCH project
export const PATCH = async (
  request: Request,
  context: { params: Promise<{ id: string }> } // params is a Promise
) => {
  // Await the promise to get the actual params object
  const { id: projectId } = await context.params;

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json({ success: false, message: "Invalid or missing userId" }, { status: 400 });
    }
    if (!projectId || !ObjectId.isValid(projectId)) {
      return NextResponse.json({ success: false, message: "Invalid or missing projectId" }, { status: 400 });
    }

    await connect();

    const uploader = await User.findById(userId);
    if (!uploader) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    if (uploader.role !== "admin") {
      return NextResponse.json({ success: false, message: "You are not an admin" }, { status: 401 });
    }

    const body = await request.json();
    const { videoUploads, photoUploads, designUploads, ...formData } = body;

    const updateData: Record<string, unknown> = {};

    if (Array.isArray(videoUploads) && videoUploads.length > 0) {
      updateData.thumbnail = videoUploads;
    }

    if (Array.isArray(photoUploads) && photoUploads.length > 0) {
      updateData.photoFiles = photoUploads;
    }

    if (Array.isArray(designUploads) && designUploads.length > 0) {
      updateData.designFiles = designUploads;
    }

    // merge the rest of the formData only if it has keys
    if (formData && Object.keys(formData).length > 0) {
      Object.assign(updateData, formData);
    }


    const updatedProject = await Project.findByIdAndUpdate(projectId, { $set: updateData }, { new: true });

    if (!updatedProject) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Project updated successfully", data: updatedProject },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Updating project failed", error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
};

// DELETE project
export const DELETE = async (
  request: Request,
  context: { params: Promise<{ id: string }> }
) => {
  const { id: projectId } = await context.params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  try {
    // --- Validate IDs ---
    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json({ success: false, message: "Invalid or missing userId" }, { status: 400 });
    }
    if (!projectId || !ObjectId.isValid(projectId)) {
      return NextResponse.json({ success: false, message: "Invalid or missing projectId" }, { status: 400 });
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
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    await Project.findByIdAndDelete(projectId);

    return NextResponse.json(
      { success: true, message: "Project and associated Cloudinary files deleted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Deleting project failed",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
};