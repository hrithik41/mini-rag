import mongoose from "mongoose";
import dotenv from "dotenv";
import { Document, Chunk } from "./model.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function testDatabase() {
    try {
        console.log("Connecting to MongoDB Atlas...");
        await mongoose.connect(MONGO_URI);
        console.log("Connected!");

        const testDoc = new Document({
            fileName: "test-document.pdf",
            fileType: "application/pdf",
            fileSize: 1024,
            totalChunks: 1,
            status: "completed"
        });

        const savedDoc = await testDoc.save();
        console.log("📄 Saved Document:", savedDoc);

        // 2. Create a Test Chunk linked to the Document
        const testChunk = new Chunk({
            documentId: savedDoc._id,
            text: "This is a test paragraph inside our document.",
            embedding: [0.1, 0.2, 0.3], // Dummy vector
            chunkIndex: 0,
            pageNumber: 1,
            tokenCount: 9
        });

        const savedChunk = await testChunk.save();
        console.log("🧩 Saved Chunk:", savedChunk);

        console.log("🎉 Database Test Successful! Check your Atlas Dashboard.");

    } catch (error) {
        console.error("❌ Database Test Failed:", error);
    } finally {
        // Close connection so the terminal process exits gracefully
        mongoose.connection.close();
    }
}

testDatabase();
