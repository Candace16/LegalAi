import os
import json
from backend.utils.mock_llm import get_mock_summary

try:
    from langchain_groq import ChatGroq
    from langchain_core.prompts import PromptTemplate
except ImportError:
    pass

class SummarizationAgent:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        if self.api_key:
            self.llm = ChatGroq(temperature=0.2, model_name="llama-3.1-8b-instant", groq_api_key=self.api_key)
        else:
            self.llm = None

    def summarize(self, text: str, classification_data: dict):
        if not self.llm:
            return get_mock_summary()

        prompt = PromptTemplate.from_template(
            """
            You are a legal expert explaining to a common Indian citizen with no legal background. Use simple words. Avoid jargon.
            
            Based on the following document text and its classification data, generate a structured summary.
            
            Classification Data:
            {classification}
            
            Document Text:
            {text}
            
            Return ONLY a valid JSON object with EXACTLY these keys:
            {{
                "Document Type & Purpose": "1 sentence string",
                "Key Parties": ["array of strings"],
                "Important Dates & Deadlines": ["array of strings"],
                "Core Legal Points": ["array of 3-5 plain-language strings"],
                "What This Means For You": "2-3 sentences string in simple English",
                "Red Flags / Things to Watch Out For": ["array of strings (if any)"],
                "Recommended Next Steps": ["array of strings"]
            }}
            """
        )
        
        try:
            chain = prompt | self.llm
            response = chain.invoke({
                "classification": json.dumps(classification_data),
                "text": text[:10000] # Truncate to avoid context limits
            })
            content = response.content.replace("```json", "").replace("```", "").strip()
            return json.loads(content)
        except Exception as e:
            print(f"Summarization Error: {e}")
            return get_mock_summary()
