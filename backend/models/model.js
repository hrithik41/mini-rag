import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },

    fileType: {
        type: String,
        required: true
    },

    uploadedAt: {
        type: Date,
        default: Date.now,
        required: true
    },

    fileSize: {
        type: Number,
        required: true
    },

    totalChunks: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ["processing", "completed", "failed"],
        default: "processing"
    }
});

const chunkSchema = new mongoose.Schema({
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
        required: true
    },

    text: {
        type: String,
        required: true
    },

    embedding: {
        type: [Number],
        required: true
    },

    chunkIndex: {
        type: Number,
        required: true
    },

    pageNumber: {
        type: Number,
        required: true
    },

    tokenCount: {
        type: Number,
        required: true
    }
});

chunkSchema.index({ documentId: 1, chunkIndex: 1 });

export const Document = mongoose.model("Document", documentSchema);
export const Chunk = mongoose.model("Chunk", chunkSchema);
