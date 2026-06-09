import os
import shutil
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.models.database import get_db, Document
from backend.models.schemas import DocumentResponse
from backend.agents.ingestion_agent import IngestionAgent
from backend.agents.classification_agent import ClassificationAgent
from backend.agents.qa_agent import QAAgent

router = APIRouter()

ingestion_agent = IngestionAgent()
classification_agent = ClassificationAgent()
qa_agent = QAAgent()

UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/", response_model=DocumentResponse)
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # 1. Save file locally
    file_location = f"{UPLOAD_DIR}/{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # 2. Agent 1: Ingestion
    ingestion_result = ingestion_agent.process_file(file_location, file.content_type)
    text = ingestion_result["text"]
    language = ingestion_result["language"]
    
    if not text or text.startswith("[Error"):
        raise HTTPException(status_code=400, detail="Failed to extract text from document.")
        
    # 3. Agent 2: Classification
    classification_data = classification_agent.classify(text)
    doc_type = classification_data.get("document_type", "Unknown")
    
    # 4. Save to Database
    db_doc = Document(
        filename=file.filename,
        doc_type=doc_type,
        language=language,
        status="Uploaded" # Will change to Processing later, or keep it simple
    )
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    
    # 5. Agent 5 component: Index document in ChromaDB for Q&A later
    # (Doing this async or in background is better, but doing it here for simplicity)
    qa_agent.index_document(db_doc.id, text)
    
    # Also save the raw text to a temporary file or return it so summarize can use it
    # For a real app we might store text in a db or file storage, we'll write to a txt file
    with open(f"{UPLOAD_DIR}/{db_doc.id}_text.txt", "w", encoding="utf-8") as f:
        f.write(text)
        
    with open(f"{UPLOAD_DIR}/{db_doc.id}_class.json", "w", encoding="utf-8") as f:
        import json
        json.dump(classification_data, f)
    
    return db_doc
