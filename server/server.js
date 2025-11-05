import express from "express";
import fs from "fs";
import cors from "cors";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

// === ZÁKLADNÍ CESTY ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Databázové JSONy ve složce /db v kořeni projektu
const dbPath = path.join(__dirname, "..", "db");
// ✅ Obrázky se ukládají do /public/img
const imgPath = path.join(__dirname, "..", "public", "img");

// Vytvoření složky /public/img pokud neexistuje
if (!fs.existsSync(imgPath)) {
    fs.mkdirSync(imgPath, { recursive: true });
    console.log("📁 Vytvořena složka:", imgPath);
}

// === Funkce pro práci s JSON ===
function readJSON(fileName) {
    const filePath = path.join(dbPath, fileName);
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
}

function writeJSON(fileName, data) {
    const filePath = path.join(dbPath, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// === ROUTES ===

// ====== Uživatelské API ======
app.get("/api/users", (req, res) => {
    try {
        const users = readJSON("users.json");
        res.json(users);
    } catch (err) {
        console.error("❌ Chyba při čtení users.json:", err);
        res.status(500).json({ error: "Nelze načíst uživatele" });
    }
});

app.post("/api/users", (req, res) => {
    try {
        const users = readJSON("users.json");
        users.push(req.body);
        writeJSON("users.json", users);
        res.json({ success: true });
    } catch (err) {
        console.error("❌ Chyba při zápisu users.json:", err);
        res.status(500).json({ error: "Nelze uložit uživatele" });
    }
});

app.delete("/api/users/:index", (req, res) => {
    try {
        const users = readJSON("users.json");
        users.splice(req.params.index, 1);
        writeJSON("users.json", users);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Nelze odstranit uživatele" });
    }
});

// ====== Články ======
app.get("/api/articles", (req, res) => {
    res.json(readJSON("articles.json"));
});

app.post("/api/articles", (req, res) => {
    const articles = readJSON("articles.json");
    articles.push(req.body);
    writeJSON("articles.json", articles);
    res.json({ success: true });
});

app.delete("/api/articles/:index", (req, res) => {
    const articles = readJSON("articles.json");
    articles.splice(req.params.index, 1);
    writeJSON("articles.json", articles);
    res.json({ success: true });
});

// ====== Kvízy ======
app.get("/api/quiz", (req, res) => {
    res.json(readJSON("quiz.json"));
});

app.post("/api/quiz", (req, res) => {
    const quiz = readJSON("quiz.json");
    quiz.push(req.body);
    writeJSON("quiz.json", quiz);
    res.json({ success: true });
});

app.delete("/api/quiz/:index", (req, res) => {
    const quiz = readJSON("quiz.json");
    quiz.splice(req.params.index, 1);
    writeJSON("quiz.json", quiz);
    res.json({ success: true });
});

// ====== Obrázky (Picture Management) ======
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imgPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
});

const upload = multer({ storage });

// Nahrání obrázku
app.post("/api/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "Soubor nebyl nahrán" });
    }
    const imageUrl = `/img/${req.file.filename}`;
    console.log("📸 Nahrán obrázek:", imageUrl);
    res.json({ success: true, imageUrl });
});

// Načtení všech obrázků
app.get("/api/images", (req, res) => {
    fs.readdir(imgPath, (err, files) => {
        if (err) {
            console.error("❌ Chyba při čtení složky /img:", err);
            return res.status(500).json({ error: "Nelze načíst obrázky" });
        }
        const imageFiles = files.filter(f => /\.(png|jpg|jpeg|gif|webp)$/i.test(f));
        res.json(imageFiles.map(f => `/img/${f}`));
    });
});

// Statické soubory z public/
app.use("/img", express.static(imgPath));

// === START SERVERU ===
const DEFAULT_PORT = 5050;

function startServer(port) {
    app.listen(port, () => {
        console.log(`✅ Server běží na http://localhost:${port}`);
        console.log(`📂 DB složka: ${dbPath}`);
        console.log(`🖼️ Obrázky se ukládají do: ${imgPath}`);
    }).on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            console.warn(`⚠️ Port ${port} je obsazený, zkouším další...`);
            startServer(port + 1);
        } else {
            console.error(err);
        }
    });
}

startServer(DEFAULT_PORT);
