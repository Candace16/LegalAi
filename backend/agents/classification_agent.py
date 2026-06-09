import os
import json
from backend.utils.mock_llm import get_mock_classification

try:
    from langchain_groq import ChatGroq
    from langchain_core.prompts import PromptTemplate
except ImportError:
    pass

class ClassificationAgent:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        if self.api_key:
            self.llm = ChatGroq(temperature=0, model_name="llama-3.1-8b-instant", groq_api_key=self.api_key)
        else:
            self.llm = None

    def classify(self, text: str):
        if not self.llm:
            return get_mock_classification()

        prompt = PromptTemplate.from_template(
            """
            You are a legal document classifier. Analyze the following document text and classify it.
            Valid types: FIR, RTI Application, Court Order, Property Deed, Rental Agreement, Government Notice, Other.
            Also extract key metadata: parties involved, dates mentioned, jurisdiction, case number.
            
            Return ONLY a valid JSON object with the following schema:
            {{
                "document_type": "string",
                "metadata": {{
                    "parties_involved": ["string"],
                    "dates_mentioned": ["string"],
                    "jurisdiction": "string",
                    "case_number": "string or null"
                }},
                "confidence_score": 0.0 to 1.0
            }}
            
            Document Text:
            {text}
            """
        )
        
        try:
            # truncate text to avoid token limits
            chain = prompt | self.llm
            response = chain.invoke({"text": text[:5000]})
            content = response.content.replace("```json", "").replace("```", "").strip()
            return json.loads(content)
        except Exception as e:
            print(f"Classification Error: {e}")
            return get_mock_classification()
