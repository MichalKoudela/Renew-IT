import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    question: String,
    1: String,
    2: String,
    3: String,
    4: String,
    correct: Number
});

export default mongoose.model("Quiz", quizSchema);
