import { Schema, model, models } from "mongoose";

const ImageSchema = new Schema({
    url: { type: String, required: true },
    publicId: { type: String, required: true },
});

const HomePageSchema = new Schema({
    heroText: { type: String },
    heroVideo: [ImageSchema],
    whyChoose: { type: String },
    whyChooseUsPic: [ImageSchema],
    aboutPic: [ImageSchema],
    showreelUrl: { type: String },
    shortAbout: { type: String },
});

const HomePage = models.HomePage || model("HomePage", HomePageSchema);

export default HomePage;
