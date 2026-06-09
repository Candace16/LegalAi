import os
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from datetime import datetime

DATABASE_URL = "sqlite:///./legalease.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    upload_time = Column(DateTime, default=datetime.utcnow)
    doc_type = Column(String, nullable=True) # FIR, RTI, etc.
    language = Column(String, nullable=True)
    status = Column(String, default="Uploaded") # Uploaded, Processing, Ready, Error
    
    summaries = relationship("Summary", back_populates="document", cascade="all, delete")
    translations = relationship("Translation", back_populates="document", cascade="all, delete")
    qa_sessions = relationship("QASession", back_populates="document", cascade="all, delete")

class Summary(Base):
    __tablename__ = "summaries"

    id = Column(Integer, primary_key=True, index=True)
    doc_id = Column(Integer, ForeignKey("documents.id"))
    summary_json = Column(Text) # Store as JSON string
    created_at = Column(DateTime, default=datetime.utcnow)

    document = relationship("Document", back_populates="summaries")

class Translation(Base):
    __tablename__ = "translations"

    id = Column(Integer, primary_key=True, index=True)
    doc_id = Column(Integer, ForeignKey("documents.id"))
    language = Column(String)
    translated_text = Column(Text) # JSON string matching summary structure
    created_at = Column(DateTime, default=datetime.utcnow)

    document = relationship("Document", back_populates="translations")

class QASession(Base):
    __tablename__ = "qa_sessions"

    id = Column(Integer, primary_key=True, index=True)
    doc_id = Column(Integer, ForeignKey("documents.id"))
    question = Column(Text)
    answer = Column(Text)
    citation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    document = relationship("Document", back_populates="qa_sessions")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)
