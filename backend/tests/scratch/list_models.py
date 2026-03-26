import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ ERROR: GEMINI_API_KEY not found in .env file.")
else:
    genai.configure(api_key=api_key)
    print("🤖 Available Models supporting generateContent:")
    try:
        found_any = False
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f" - {m.name}")
                found_any = True
        if not found_any:
            print("No models found supporting generateContent.")
    except Exception as e:
        print(f"❌ Failed to list models: {e}")
