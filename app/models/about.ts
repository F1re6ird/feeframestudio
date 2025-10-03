import { Schema, model, models } from "mongoose";

const AboutSchema = new Schema({
    aboutUs: { type: String, required: true }
})

const About = models.About || model("About", AboutSchema);

export default About;