from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime

class DocumentResponse(BaseModel):
    id: int
    filename: str
    upload_time: datetime
    doc_type: Optional[str]
    language: Optional[str]
    status: str
    
    model_config = ConfigDict(from_attributes=True)

class SummaryResponse(BaseModel):
    doc_id: int
    summary_json: Dict[str, Any]
    
class TranslationRequest(BaseModel):
    target_language: str

class TranslationResponse(BaseModel):
    doc_id: int
    language: str
    translated_text: Dict[str, Any]

class QARequest(BaseModel):
    question: str

class QAResponse(BaseModel):
    answer: str
    citation: Optional[str] = None
