import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
import { GoogleGenAI } from "@google/genai";
import { Document, Chunk } from "../models/model.js";
import { chunkText } from "../utils/chunker.js";

export const uploadDocument = async (req, res) => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        let rawText = "";
        if (req.file.mimetype === "application/pdf") {
            const pdfData = await pdfParse(req.file.buffer);
            rawText = pdfData.text;
        } else if (req.file.mimetype === "text/plain") {
            rawText = req.file.buffer.toString("utf-8");
        } else {
            return res.status(400).json({ error: "Unsupported file type. Please upload a PDF or TXT file." });
        }

        const chunks = chunkText(rawText, 1000, 200);

        const newDoc = new Document({
            fileName: req.file.originalname,
            fileType: req.file.mimetype,
            fileSize: req.file.size,
            totalChunks: chunks.length,
            status: "processing"
        });
        const savedDoc = await newDoc.save();

        const response = await ai.models.embedContent({
            model: 'gemini-embedding-001',
            contents: chunks,
        });

        const chunkPromises = chunks.map((textChunk, index) => {
            const newChunk = new Chunk({
                documentId: savedDoc._id,
                chunkIndex: index,
                text: textChunk,
                embedding: response.embeddings[index].values
            });
            return newChunk.save();
        });

        await Promise.all(chunkPromises);

        savedDoc.status = "completed";
        await savedDoc.save();

        res.status(201).json({
            message: "File successfully processed and embedded!",
            data: {
                documentId: savedDoc._id,
                totalChunks: chunks.length
            }
        });

    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: "Failed to process the file." });
    }
};

export const chatWithDocument = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: "Query is required." });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const queryEmbeddingResponse = await ai.models.embedContent({
            model: 'gemini-embedding-001',
            contents: query,
        });
        const queryVector = queryEmbeddingResponse.embeddings[0].values;

        const searchResults = await Chunk.aggregate([
            {
                "$vectorSearch": {
                    "index": "vector_index",
                    "path": "embedding",
                    "queryVector": queryVector,
                    "numCandidates": 50,
                    "limit": 5
                }
            },
            {
                "$project": {
                    "text": 1,
                    "score": { "$meta": "vectorSearchScore" }
                }
            }
        ]);

        if (searchResults.length === 0) {
            return res.json({ answer: "I couldn't find any relevant information in the uploaded documents to answer that." });
        }

        const context = searchResults.map(doc => doc.text).join("\n\n");

        const prompt = `
            You are a friendly and helpful assistant. 
            For general greetings or conversational questions (like "hello", "how are you"), respond politely like a normal human.
            However, for ANY factual questions, you MUST use ONLY the following retrieved context to answer.
            If the context does not contain the factual answer, explicitly say that you don't have that information in the uploaded document.
            Do not make up facts outside of the context.

            Context:
            ${context}

            Question: ${query}
            
            Answer:
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.json({
            answer: response.text,
            contextUsed: searchResults
        });

    } catch (error) {
        console.error("Chat Error:", error);
        if (error.status === 429) {
            return res.status(429).json({ 
                error: "Google AI Rate Limit Exceeded: The free tier quota has been reached. Please wait a bit or try again tomorrow!" 
            });
        }
        res.status(500).json({ error: "Failed to generate an answer." });
    }
};
