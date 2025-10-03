export interface IFile {
  url: string;
  publicId: string;
}

export interface IProject {
  _id: string;                 // MongoDB document ID
  types: string[];             // e.g. ["video", "photo", "design"]

  // core fields
  projectTitle: string;
  client: string;

  // video section
  videoShortDescription: string;
  videoLongDescription: string;
  videoUrl: string;
  thumbnail: IFile[];

  // photo section
  pictureTitle: string;
  pictureShortDescription: string;
  pictureLongDescription: string;
  photoFiles: IFile[];

  // design section
  designTitle: string;
  designDescription: string;
  designFiles: IFile[];

  // flags
  isFeatured: boolean;
  isPublished: boolean;

  // timestamps (added automatically by Mongoose)
  createdAt: Date;
  updatedAt: Date;
}


export interface IHome {
  heroText: string
  heroVideo: IFile[]
  whyChoose: string
  whyChooseUsPic: IFile[]
  aboutPic: IFile[]
  showreelUrl: string
  shortAbout: string
}

export interface Testimonial {
    _id: string;
    name: string;
    role?: string;
    content: string;
}