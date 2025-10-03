import { Schema, model, models } from "mongoose";

const FooterLinksSchema = new Schema({
    mail: { type: String },
    instagram: { type: String },
    youtube: { type: String },
    whatsapp: { type: String },
});

const FooterLinks = models.FooterLinks || model("FooterLinks", FooterLinksSchema);

export default FooterLinks;