import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    password_sha256: String,
    role: String
});

export default mongoose.model("User", userSchema);
