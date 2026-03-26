import json
import sys
from pathlib import Path

from fastapi.encoders import jsonable_encoder

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

from app.services import conductor  # noqa: E402


CUSTOMER_ID = "000058a12d5b43e67d225668fa1f8d618c13dc232df0cad8ffe7ad4a1091e318"


def build_prompt(customer_id: str, payload: dict) -> str:
    narrative = (
        "You are the H&M AI Consultant. The user asked: "
        f"'{customer_id}'. Based on this CRM data: "
        f"{json.dumps(payload)}, write a brief, insightful, and strategic "
        "narrative (2 sentences max) summarizing their risk, style drift, "
        "and the recommended strategy. Speak in a confident, professional tone."
    )
    return narrative


if __name__ == "__main__":
    result = conductor.get_customer_360(CUSTOMER_ID)
    serializable = jsonable_encoder(result)
    print("=== JSON payload sent to Gemini ===")
    print(json.dumps(serializable, indent=2))
    print("\n=== Constructed Gemini prompt ===")
    print(build_prompt(CUSTOMER_ID, serializable))
