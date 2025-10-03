import { Schema, model, models } from "mongoose";

const TestimonySchema = new Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    content: { type: String, required: true },
});

const Testimony = models.Testimony || model("Testimony", TestimonySchema);

export default Testimony;