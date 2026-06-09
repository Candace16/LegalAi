import io
import logging

logger = logging.getLogger(__name__)

try:
    import fitz  # PyMuPDF
    from PIL import Image
    import pytesseract
except ImportError:
    pass

def extract_text_from_file(file_path: str, mime_type: str) -> str:
    """
    Extract text from a file (PDF or Image).
    Falls back to basic OCR using pytesseract if available for images.
    """
    text = ""
    try:
        if mime_type == "application/pdf":
            doc = fitz.open(file_path)
            for page in doc:
                # Try regular text extraction first
                page_text = page.get_text()
                if page_text.strip():
                    text += page_text + "\n"
                else:
                    # If page is empty (likely scanned), try to extract image
                    try:
                        images = page.get_images(full=True)
                        for img_index, img in enumerate(images):
                            xref = img[0]
                            base_image = doc.extract_image(xref)
                            image_bytes = base_image["image"]
                            img_obj = Image.open(io.BytesIO(image_bytes))
                            text += pytesseract.image_to_string(img_obj) + "\n"
                    except Exception as e:
                        logger.warning(f"OCR failed on PDF page: {e}")
            doc.close()
        elif mime_type in ["image/jpeg", "image/png", "image/jpg"]:
            try:
                img_obj = Image.open(file_path)
                text = pytesseract.image_to_string(img_obj)
            except Exception as e:
                logger.warning(f"OCR failed on Image: {e}")
                text = "[OCR Failed - Tesseract not installed or image unreadable]"
        else:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                text = f.read()
    except Exception as e:
        logger.error(f"Failed to extract text from {file_path}: {e}")
        text = f"[Error extracting text: {e}]"
        
    return text.strip()
