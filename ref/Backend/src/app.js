const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const AuthRoutes = require("./routes/auth.routes");
const AiRoutes = require("./routes/ai.routes");
const ProfileRoutes = require("./routes/profile.routes");

const app = express();

// 0. Request Logging Middleware (Moved to top)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use(express.json());
app.use(cookieParser());

// 0.5 Explicit Root Route Handler (Prioritized)
app.get("/", (req, res) => {
    res.sendFile(path.join(path.resolve(__dirname, "../../Frontend/src"), "index.html"));
});

// Define paths
const frontendSrcPath = path.resolve(__dirname, "../../Frontend/src");
const rootPath = path.resolve(__dirname, "../../");

console.log("Serving frontend from:", frontendSrcPath);

// 1. Static file serving - serving the frontend files from the 'src' directory
app.use(express.static(frontendSrcPath));

app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

// 2. Serve specific assets from the project root safely
const rootAssets = ["img004.jpg", "background2.jfif", "Background4.jpg.jfif", "Media (8).jfif", "profileplaceHolder.jfif", "beginner_questions.json", "advanced_questions.json"];
app.use((req, res, next) => {
    const fileName = req.path.substring(1); // Remove leading slash
    if (rootAssets.includes(fileName)) {
        return res.sendFile(path.join(rootPath, fileName));
    }
    next();
});

// API Routes
app.use("/api/auth", AuthRoutes);
app.use("/api/ai", AiRoutes);
app.use("/api/profile", ProfileRoutes);

// Fallback for SPA routing and 404s
app.use((req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({ message: "API route not found" });
    }
    
    const indexPath = path.join(frontendSrcPath, "index.html");
    res.sendFile(indexPath, (err) => {
        if (err) {
            res.status(404).send(`Frontend not found. Ensure 'index.html' exists in: ${frontendSrcPath}`);
        }
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("SERVER ERROR:", err);
    res.status(500).send(`Internal Server Error: ${err.message}`);
});

module.exports = app;
