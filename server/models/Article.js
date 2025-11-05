import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
    title: String,
    tldr: String,
    text: String,
    img: String,
    author: String,
    date: String
});

export default mongoose.model("Article", articleSchema);
