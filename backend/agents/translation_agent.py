import os
import json
from backend.utils.mock_llm import get_mock_translation

try:
    from googletrans import Translator
except ImportError:
    pass

class TranslationAgent:
    def __init__(self):
        try:
            self.translator = Translator()
        except NameError:
            self.translator = None
        self.use_mock = not os.getenv("GROQ_API_KEY") and not os.getenv("GOOGLE_TRANSLATE_API_KEY")

    def translate_summary(self, summary_json: dict, target_language: str) -> dict:
        """
        Translates the structured JSON summary into the target language.
        Language mapping: hi (Hindi), bn (Bengali), ta (Tamil), te (Telugu), mr (Marathi), gu (Gujarati), kn (Kannada), ml (Malayalam)
        """
        lang_map = {
            "Hindi": "hi", "Bengali": "bn", "Tamil": "ta", "Telugu": "te",
            "Marathi": "mr", "Gujarati": "gu", "Kannada": "kn", "Malayalam": "ml"
        }
        
        target_code = lang_map.get(target_language, "hi")
        
        if self.use_mock:
            translated_dict = {}
            for k, v in summary_json.items():
                if isinstance(v, list):
                    translated_dict[k] = [get_mock_translation(item, target_language) for item in v]
                else:
                    translated_dict[k] = get_mock_translation(str(v), target_language)
            return translated_dict

        translated_dict = {}
        try:
            for k, v in summary_json.items():
                if isinstance(v, list):
                    translated_list = []
                    for item in v:
                        res = self.translator.translate(str(item), dest=target_code)
                        translated_list.append(res.text)
                    translated_dict[k] = translated_list
                else:
                    res = self.translator.translate(str(v), dest=target_code)
                    translated_dict[k] = res.text
            return translated_dict
        except Exception as e:
            print(f"Translation Error: {e}")
            # Fallback to mock if it fails
            translated_dict = {}
            for k, v in summary_json.items():
                if isinstance(v, list):
                    translated_dict[k] = [get_mock_translation(item, target_language) for item in v]
                else:
                    translated_dict[k] = get_mock_translation(str(v), target_language)
            return translated_dict
