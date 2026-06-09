import os

try:
    from langdetect import detect
except ImportError:
    def detect(text): return "en"

from backend.utils.pdf_extractor import extract_text_from_file

class IngestionAgent:
    def __init__(self):
        pass

    def process_file(self, file_path: str, mime_type: str):
        """
        Reads a file, extracts text, and detects language.
        """
        # 1. Extract text
        text = extract_text_from_file(file_path, mime_type)
        
        # 2. Detect language
        language = "Unknown"
        if text.strip():
            try:
                # langdetect needs enough text
                lang_code = detect(text[:1000]) 
                # Basic mapping for Indian languages
                lang_map = {
                    'en': 'English', 'hi': 'Hindi', 'bn': 'Bengali', 'ta': 'Tamil',
                    'te': 'Telugu', 'mr': 'Marathi', 'gu': 'Gujarati', 'kn': 'Kannada', 'ml': 'Malayalam'
                }
                language = lang_map.get(lang_code, lang_code.upper())
            except Exception:
                language = "English" # Default fallback
                
        return {
            "text": text,
            "language": language
        }
