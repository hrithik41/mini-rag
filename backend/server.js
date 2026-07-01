import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        time: new Date().toISOString(),
        message: "Server is running",
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
