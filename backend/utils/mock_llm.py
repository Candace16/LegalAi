import json

def get_mock_classification() -> dict:
    return {
        "document_type": "Rental Agreement",
        "metadata": {
            "parties_involved": ["Rahul Sharma (Landlord)", "Priya Patel (Tenant)"],
            "dates_mentioned": ["01-Jan-2024", "31-Dec-2024"],
            "jurisdiction": "Delhi",
            "case_number": None
        },
        "confidence_score": 0.95
    }

def get_mock_summary() -> dict:
    return {
        "Document Type & Purpose": "This is a standard 11-month residential rental agreement establishing terms between a landlord and tenant.",
        "Key Parties": [
            "Rahul Sharma (Landlord)",
            "Priya Patel (Tenant)"
        ],
        "Important Dates & Deadlines": [
            "Start Date: 01-Jan-2024",
            "End Date: 31-Dec-2024",
            "Rent due: 5th of every month"
        ],
        "Core Legal Points": [
            "Monthly rent is ₹25,000.",
            "Security deposit of ₹50,000 paid upfront.",
            "Tenant is responsible for electricity and water bills.",
            "Subletting the property is strictly prohibited."
        ],
        "What This Means For You": "You are legally bound to pay ₹25,000 per month and follow the rules of the house for 11 months. If you break the rules, you could lose your security deposit or be evicted.",
        "Red Flags / Things to Watch Out For": [
            "Notice period is only 1 month, which is shorter than usual.",
            "Landlord can increase rent by 10% if renewed."
        ],
        "Recommended Next Steps": [
            "Keep a copy of the signed agreement.",
            "Take photos of the property condition before moving in.",
            "Ensure rent receipts are collected every month."
        ]
    }

def get_mock_translation(text: str, target_language: str) -> str:
    # A simple mock that just prefixes with a simulated translation tag
    return f"[{target_language} Translation]\n\n" + text

def get_mock_qa_answer(question: str) -> tuple[str, str]:
    if "rent" in question.lower():
        return "The monthly rent is ₹25,000, due by the 5th of every month.", "Core Legal Points: Monthly rent is ₹25,000."
    elif "deposit" in question.lower():
        return "The security deposit is ₹50,000, paid upfront.", "Core Legal Points: Security deposit of ₹50,000 paid upfront."
    else:
        return "Based on the document, I found no specific information regarding that question. The document is an 11-month rental agreement.", "Document Type & Purpose: This is a standard 11-month residential rental agreement..."
