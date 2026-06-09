import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.models.database import get_db, Summary, Translation
from backend.models.schemas import TranslationRequest, TranslationResponse
from backend.agents.translation_agent import TranslationAgent

router = APIRouter()
translation_agent = TranslationAgent()

@router.post("/{doc_id}", response_model=TranslationResponse)
async def translate_document(doc_id: int, request: TranslationRequest, db: Session = Depends(get_db)):
    # 1. Check if translation already exists
    existing = db.query(Translation).filter(
        Translation.doc_id == doc_id, 
        Translation.language == request.target_language
    ).first()
    
    if existing:
        return TranslationResponse(
            doc_id=doc_id,
            language=existing.language,
            translated_text=json.loads(existing.translated_text)
        )
        
    # 2. Get English Summary
    summary = db.query(Summary).filter(Summary.doc_id == doc_id).first()
    if not summary:
        raise HTTPException(status_code=404, detail="Summary not found. Please summarize first.")
        
    summary_json = json.loads(summary.summary_json)
    
    # 3. Agent 4: Translation
    translated_json = translation_agent.translate_summary(summary_json, request.target_language)
    
    # 4. Save to Database
    db_trans = Translation(
        doc_id=doc_id,
        language=request.target_language,
        translated_text=json.dumps(translated_json)
    )
    db.add(db_trans)
    db.commit()
    
    return TranslationResponse(
        doc_id=doc_id,
        language=request.target_language,
        translated_text=translated_json
    )
