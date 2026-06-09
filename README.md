# LegalEase - Multilingual Indian Legal Document Summarizer

## 🎯 The Problem We Are Solving

Legal documents (like FIRs, RTIs, Court Orders, Property Deeds, and Rental Agreements) are notoriously complex, excessively lengthy, and filled with dense legal jargon. Furthermore, India is a highly multilingual country, but most legal documentation remains predominantly in English or complex formal regional dialects. 

This creates a massive barrier to justice and understanding for the average citizen. People often have to rely on expensive legal counsel just to understand what a document says.

**LegalEase** bridges this gap. It is a powerful multi-agent AI application designed to democratize legal understanding. It extracts text from your documents, classifies them, generates a highly structured plain-language summary, translates it into your native language, and allows you to chat directly with the document to ask specific questions—all in a matter of seconds.

## ✨ Core Features & Agentic Workflow

LegalEase is powered by a multi-agent pipeline where specialized AI agents handle different parts of the processing:

- **Agent 1 (Ingestion & OCR):** Extracts text from digital PDFs, scanned PDFs, and Images using advanced OCR.
- **Agent 2 (Classification):** Automatically identifies the legal document type (e.g., FIR, Lease Agreement) and extracts crucial metadata (dates, parties involved, etc.).
- **Agent 3 (Summarization):** Distills the dense text into a structured, 7-section plain-language summary tailored to the document type.
- **Agent 4 (Translation):** Translates the generated summary into 8 Indian regional languages (Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, or Malayalam).
- **Agent 5 (Q&A / RAG):** A Retrieval-Augmented Generation (RAG) system that allows you to ask follow-up questions in natural language and receive answers with direct citations from the uploaded document.
- **Mock Mode:** Runs completely without API keys using simulated AI responses for demonstration, testing, and development purposes.

## 🛠️ Tech Stack & Tools Used

### Backend
- **Python 3.9+** & **FastAPI:** High-performance async web framework.
- **LangChain:** For orchestrating the multi-agent AI pipeline.
- **Groq LLMs:** For ultra-fast inference during classification, summarization, and Q&A.
- **ChromaDB & Sentence Transformers:** Local Vector database and embedding models for the RAG (Q&A) system.
- **PyMuPDF & PyTesseract:** For robust text extraction and Optical Character Recognition.
- **SQLAlchemy & SQLite:** Database ORM and local storage for document history and metadata.
- **Googletrans:** For multilingual translation capabilities.

### Frontend
- **React 19 & Vite:** Next-generation frontend framework and build tool for a snappy user experience.
- **Tailwind CSS 4:** For modern, responsive, and utility-first styling.
- **Framer Motion:** For smooth micro-interactions and dynamic UI animations.
- **React Query & Axios:** For robust state management and API communication.
- **React Dropzone:** For seamless drag-and-drop file uploads.
- **PWA Ready:** Configured with `vite-plugin-pwa` for progressive web app capabilities.

## 🚀 Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+
- Tesseract OCR (Installed locally for image text extraction)

### 1. Backend Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # Mac/Linux:
   source venv/bin/activate
   ```

3. Install the Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure Environment Variables:
   - Copy `.env.example` to a new file named `.env`.
   - If you have a Groq API key, add it to `GROQ_API_KEY`.
   - **If you do not have API keys**, leave the `.env` file blank. The application will automatically run in "Mock Mode" and provide simulated responses so you can still test the UI and flow!

5. Start the FastAPI server:
   ```bash
   python main.py
   ```
   *The backend will run on http://localhost:8000*

### 2. Frontend Setup

1. Open a **new** terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install the JavaScript dependencies (Required before running dev server!):
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on http://localhost:5173*

4. Open your browser and go to the frontend URL to use LegalEase!

## ⚠️ Note on OCR (Optical Character Recognition)
To extract text from images or scanned PDFs, the system uses Tesseract OCR. If you are on Windows and Tesseract is not installed, image extraction will fallback to a warning message, but the rest of the pipeline will continue to work for digital documents. For full functionality, install Tesseract locally.
