import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from backend.models.database import init_db
from backend.routers import upload, summarize, translate, qa

# Initialize Database
init_db()

app = FastAPI(title="LegalEase API", version="1.0.0")

# Setup CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, change to specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(upload.router, prefix="/upload", tags=["Upload & Ingest"])
app.include_router(summarize.router, prefix="/summarize", tags=["Summarize"])
app.include_router(translate.router, prefix="/translate", tags=["Translate"])
app.include_router(qa.qa_router, prefix="/ask", tags=["Q&A"])
app.include_router(qa.history_router, prefix="/history", tags=["History"])

@app.get("/")
def root():
    return {"message": "Welcome to LegalEase API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
