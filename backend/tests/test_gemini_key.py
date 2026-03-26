import asyncio
import os
from dataclasses import dataclass

from dotenv import load_dotenv
from google import genai


@dataclass
class GeminiTestResult:
    success: bool
    detail: str


def load_client() -> genai.Client:
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is missing from the environment.")
    return genai.Client(api_key=api_key)


async def stream_test_prompt() -> GeminiTestResult:
    client = load_client()
    try:
        stream = await client.aio.models.generate_content_stream(
            model="gemini-2.5-flash",
            contents="What is machine learning?"
        )
        async for chunk in stream:
            if chunk.text and chunk.text.strip():
                return GeminiTestResult(
                    success=True,
                    detail=f"Received response chunk: {chunk.text.strip()!r}"
                )
        return GeminiTestResult(success=False, detail="No text chunk was returned.")
    except Exception as exc:
        return GeminiTestResult(success=False, detail=str(exc))


if __name__ == "__main__":
    result = asyncio.run(stream_test_prompt())
    status = "SUCCESS" if result.success else "FAILURE"
    print(f"{status}: {result.detail}")
