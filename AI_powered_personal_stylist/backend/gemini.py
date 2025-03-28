import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-1.5-flash") # or your model

prompt = "Give me a clothing recommendation for a sea party."

try:
    response = model.generate_content(prompt)
    print(response.text)
except Exception as e:
    print(f"Gemini API Error: {e}")