# Mini-RAG: Chat with your Data

A full-stack MERN application that allows users to upload documents (PDF/TXT) and ask questions about them using an advanced Retrieval-Augmented Generation (RAG) pipeline.

## 🚀 Tech Choices & Architecture

- **Frontend:** React + Vite (Vanilla CSS for max performance and glassmorphism UI).
- **Backend:** Node.js + Express.js (MVC Architecture).
- **Database:** MongoDB Atlas (with Atlas Vector Search).
- **AI Models:** 
  - `gemini-embedding-001` for vectorizing text.
  - `gemini-2.5-flash` for fast, grounded generation.

## 🧠 Chunking & Embedding Approach

When a document is uploaded, it is parsed (via `pdf-parse` or raw text) and passed to our custom chunker.
- **Chunk Size:** 1000 characters.
- **Overlap:** 200 characters.
- **Why?** An overlap of 200 characters ensures that context isn't lost if a sentence or paragraph is cut in half between two chunks. The chunks are then passed to Google Gemini to generate 3072-dimensional embeddings, which are stored alongside the text in MongoDB. When a user asks a question, we use MongoDB's `$vectorSearch` to retrieve the top 5 most semantically relevant chunks to ground the LLM's response.

## 🔒 Security (API Keys)
All AI interactions and embedding generations happen strictly on the Node.js backend. Nothing is exposed in frontend.

## 🔮 What could be improved with more time?
1. **Streaming Responses:** Implementing Server-Sent Events (SSE) so the LLM answer streams in real-time like ChatGPT.
2. **Chat History:** Saving the conversation history in MongoDB so the LLM remembers previous context.
3. **Multi-Document Support:** Allowing the user to query a specific workspace containing multiple PDFs at once.

## 💻 Local Setup Steps

1. Clone the repository.
2. Create a `.env` file in the `backend` folder with:
   - `MONGO_URI=your_mongodb_connection_string`
   - `GEMINI_API_KEY=your_gemini_api_key`
   - `PORT=5001`
3. Run `npm install` in both the `frontend` and `backend` directories.
4. Start the backend: `cd backend && npm run dev`
5. Start the frontend: `cd frontend && npm run dev`