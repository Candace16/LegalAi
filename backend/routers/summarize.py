import os
import json
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from backend.models.database import get_db, Document, Summary
from backend.models.schemas import SummaryResponse
from backend.agents.summarization_agent import SummarizationAgent

router = APIRouter()
summarization_agent = SummarizationAgent()
UPLOAD_DIR = "./uploads"

@router.post("/{doc_id}", response_model=SummaryResponse)
async def summarize_document(doc_id: int, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    # 1. Get document
    db_doc = db.query(Document).filter(Document.id == doc_id).first()
    if not db_doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    # Check if summary already exists
    existing_summary = db.query(Summary).filter(Summary.doc_id == doc_id).first()
    if existing_summary:
        return SummaryResponse(doc_id=doc_id, summary_json=json.loads(existing_summary.summary_json))
        
    # 2. Read text and classification
    try:
        with open(f"{UPLOAD_DIR}/{doc_id}_text.txt", "r", encoding="utf-8") as f:
            text = f.read()
        with open(f"{UPLOAD_DIR}/{doc_id}_class.json", "r", encoding="utf-8") as f:
            classification_data = json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Document text or classification missing. Re-upload.")

    # 3. Update status
    db_doc.status = "Processing"
    db.commit()

    # 4. Run Agent 3: Summarization
    summary_json = summarization_agent.summarize(text, classification_data)
    
    # 5. Save Summary
    db_summary = Summary(
        doc_id=doc_id,
        summary_json=json.dumps(summary_json)
    )
    db.add(db_summary)
    
    db_doc.status = "Ready"
    db.commit()
    
    return SummaryResponse(doc_id=doc_id, summary_json=summary_json)
