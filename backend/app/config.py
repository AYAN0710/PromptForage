from dotenv import load_dotenv
import os

load_dotenv()

API_KEY = os.getenv("API_KEY")
MODEL_NAME = "gemini-2.5-flash"

if not API_KEY:
    raise ValueError(
        "API_KEY not found!"
    )