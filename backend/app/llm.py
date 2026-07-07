from google import genai
from app.config import API_KEY, MODEL_NAME

client = genai.Client(api_key=API_KEY)

def get_llm_response(prompt: str) -> str:
    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )
        return response.text
    except Exception as e:
        print(f"Gemini Error: {e}")
        return "Error generating response."
    
    