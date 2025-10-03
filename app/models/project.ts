import { Schema, model, models, Document } from "mongoose";

// ---------- Sub-document for uploaded files ----------
const FileSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false }
);

export interface IFile {
  url: string;
  publicId: string;
}

// ---------- Main Project interface ----------
export type ProjectType = "video" | "photo" | "design";

export interface IProject extends Document {
  types: ProjectType[];               // must contain 1-3 of the allowed values
  projectTitle: string;

  // Video section (optional unless "video" is in types)
  videoShortDescription?: string;
  videoLongDescription?: string;
  client?: string;
  thumbnail?: IFile[];
  videoUrl?: string;

  // Photo section (optional unless "photo" is in types)
  pictureTitle?: string;
  pictureShortDescription?: string;
  pictureLongDescription?: string;
  photoFiles?: IFile[];

  // Design section (optional unless "design" is in types)
  designTitle?: string;
  designDescription?: string;
  designFiles?: IFile[];

  isFeatured: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ---------- Schema ----------
const ProjectSchema = new Schema<IProject>(
  {
    types: {
      type: [String],
      enum: ["video", "photo", "design"],       // restrict allowed values
      required: true,
      validate: {
        validator: (arr: string[]) => arr.length > 0 && arr.length <= 3,
        message: "Types must contain 1–3 values."
      }
    },
    projectTitle: { type: String, required: true, trim: true },

    // Video section
    videoShortDescription: String,
    videoLongDescription: String,
    client: String,
    thumbnail: [FileSchema],
    videoUrl: String,

    // Photo section
    pictureTitle: String,
    pictureShortDescription: String,
    pictureLongDescription: String,
    photoFiles: [FileSchema],

    // Design section
    designTitle: String,
    designDescription: String,
    designFiles: [FileSchema],

    isFeatured: { type: Boolean, default: false, index: true },
    isPublished: { type: Boolean, default: false, index: true },
  },
  { timestamps: true, versionKey: false } // adds createdAt & updatedAt
);

// ---------- Export ----------
export default models.Project || model<IProject>("Project", ProjectSchema);
