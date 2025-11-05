import express from "express";
import cors from "cors";
import path from "path";
import multer from "multer";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import fs from "fs";

// === Připojení k MongoDB Atlas ===
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://admin:qWgDhoc2jTLi8hu4@renewit.pn7uxyf.mongodb.net/?appName=RenewIT";
mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Připojeno k MongoDB Atlas"))
    .catch((err) => console.error("❌ Chyba připojení k MongoDB:", err));

const app = express();
app.use(cors());
app.use(express.json());

// === Nastavení cest ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imgPath = path.join(__dirname, "..", "public", "img");

// Vytvoření složky pro obrázky
if (!fs.existsSync(imgPath)) fs.mkdirSync(imgPath, { recursive: true });

// === MongoDB MODELY ===
const User = mongoose.model(
    "User",
    new mongoose.Schema({
        name: String,
        password_sha256: String,
        role: String,
    })
);

const Article = mongoose.model(
    "Article",
    new mongoose.Schema({
        title: String,
        tldr: String,
        text: String,
        img: String,
        author: String,
        date: String,
    })
);

const Quiz = mongoose.model(
    "Quiz",
    new mongoose.Schema({
        question: String,
        1: String,
        2: String,
        3: String,
        4: String,
        correct: Number,
    })
);

// === API ROUTES ===

// ====== USERS ======
app.get("/api/users", async (req, res) => {
    const users = await User.find();
    res.json(users);
});

app.post("/api/users", async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.json({ success: true });
});

app.delete("/api/users/:id", async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

// ====== ARTICLES ======
app.get("/api/articles", async (req, res) => {
    const articles = await Article.find();
    res.json(articles);
});

app.post("/api/articles", async (req, res) => {
    const article = new Article(req.body);
    await article.save();
    res.json({ success: true });
});

app.delete("/api/articles/:id", async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

// ====== QUIZ ======
app.get("/api/quiz", async (req, res) => {
    const quiz = await Quiz.find();
    res.json(quiz);
});

app.post("/api/quiz", async (req, res) => {
    const question = new Quiz(req.body);
    await question.save();
    res.json({ success: true });
});

app.delete("/api/quiz/:id", async (req, res) => {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

// ====== Obrázky ======
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, imgPath),
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + unique + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

app.post("/api/upload", upload.single("image"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "Soubor nebyl nahrán" });
    const imageUrl = `/img/${req.file.filename}`;
    console.log("📸 Nahrán obrázek:", imageUrl);
    res.json({ success: true, imageUrl });
});

app.use("/img", express.static(imgPath));

// === SERVE FRONTEND (volitelné) ===
const clientPath = path.join(__dirname, "..", "client", "build");
if (fs.existsSync(clientPath)) {
    app.use(express.static(clientPath));
    app.get("*", (req, res) => res.sendFile(path.join(clientPath, "index.html")));
}

// === START SERVERU ===
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`✅ Server běží na portu ${PORT}`));
