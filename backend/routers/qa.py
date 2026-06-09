from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.models.database import get_db, Document, QASession
from backend.models.schemas import QARequest, QAResponse, DocumentResponse
from backend.agents.qa_agent import QAAgent

qa_router = APIRouter()
history_router = APIRouter()
qa_agent = QAAgent()

@qa_router.post("/{doc_id}", response_model=QAResponse)
async def ask_question(doc_id: int, request: QARequest, db: Session = Depends(get_db)):
    # Verify doc exists
    db_doc = db.query(Document).filter(Document.id == doc_id).first()
    if not db_doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    # Agent 5: Q&A
    result = qa_agent.ask_question(doc_id, request.question)
    
    # Save session
    db_qa = QASession(
        doc_id=doc_id,
        question=request.question,
        answer=result["answer"],
        citation=result.get("citation")
    )
    db.add(db_qa)
    db.commit()
    
    return QAResponse(
        answer=result["answer"],
        citation=result.get("citation")
    )

@history_router.get("/", response_model=List[DocumentResponse])
async def get_history(db: Session = Depends(get_db)):
    documents = db.query(Document).order_by(Document.upload_time.desc()).all()
    return documents
    
@history_router.delete("/{doc_id}")
async def delete_document(doc_id: int, db: Session = Depends(get_db)):
    db_doc = db.query(Document).filter(Document.id == doc_id).first()
    if not db_doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    db.delete(db_doc)
    db.commit()
    return {"message": "Document deleted successfully"}
