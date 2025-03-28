from flask import Flask, request, jsonify, render_template
import google.generativeai as genai
import os
from dotenv import load_dotenv
import requests
import json
import cv2
import numpy as np
import time

load_dotenv()

app = Flask(__name__, template_folder='templates', static_folder='static')

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")
HUGGINGFACE_API_ENDPOINT = os.getenv("HUGGINGFACE_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)

def get_weather(city):
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={WEATHER_API_KEY}&units=metric"
    try:
        # Add your code logic here
        pass
    except Exception as e:
        print(f"Error processing recommendation text: {e}")
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        temperature = data["main"]["temp"]
        description = data["weather"][0]["description"]
        return {"temperature": temperature, "description": description}
    except requests.exceptions.RequestException as e:
        print(f"Error fetching weather: {e}")
        return None

@app.route('/weather', methods=['GET'])
def get_weather_data():
    city = request.args.get('city')
    if not city:
        return jsonify({"error": "City is required"}), 400

    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={WEATHER_API_KEY}&units=metric"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        temperature = data["main"]["temp"]
        description = data["weather"][0]["description"]
        return jsonify({"temperature": temperature, "description": description})
    except requests.exceptions.HTTPError as e:
        print(f"HTTP error fetching weather data for {city}: {e}")
        return jsonify({"error": f"Unable to fetch weather data for {city}"}), 500
    except Exception as e:
        print(f"Error fetching weather data for {city}: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

def generate_image(prompt):
    if not HUGGINGFACE_API_ENDPOINT:
        print("Hugging Face API Endpoint not configured. Using placeholder image.")
        return None

    headers = {"Content-Type": "application/json"}
    payload = {"inputs": prompt}

    try:
        response = requests.post(HUGGINGFACE_API_ENDPOINT, headers=headers, data=json.dumps(payload))
        response.raise_for_status()
        image_url = response.json()[0]['url']
        return image_url
    except Exception as e:
        print(f"Error generating image: {e}")
        return None

def analyze_webcam_data(image_data):
    try:
        nparr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        average_color = np.mean(img, axis=(0, 1))
        r, g, b = int(average_color[2]), int(average_color[1]), int(average_color[0])

        # Map RGB to descriptive skin tone
        if (r + g + b) / 3 > 200:
            skin_tone = "Fair"
        elif (r + g + b) / 3 > 150:
            skin_tone = "Medium"
        elif (r + g + b) / 3 > 100:
            skin_tone = "Olive"
        else:
            skin_tone = "Dark"

        # Detect mood
        if r > g and r > b:
            mood = "Energetic"
        elif g > r and g > b:
            mood = "Relaxed"
        elif b > r and b > g:
            mood = "Calm"
        else:
            mood = "Neutral"

        return {"skin_color": f"rgb({r}, {g}, {b})", "skin_tone": skin_tone, "mood": mood}
    except Exception as e:
        print(f"Error analyzing webcam data: {e}")
        return {"skin_color": "unknown", "skin_tone": "unknown", "mood": "unknown"}

def generate_recommendation(data):
    print("Received data:", data)
    try:
        # Validate required fields
        if not data.get("user_input"):
            raise ValueError("Missing 'user_input' in the request payload.")

        model = genai.GenerativeModel("gemini-1.5-flash")
        user_input = data.get("user_input", "")
        skin_color = data.get("skinColor", "unknown")
        mood = data.get("mood", "unknown")
        measurements = data.get("measurements", "unknown")
        style_preferences = data.get("stylePreferences", "unknown")
        conversation_history = data.get("conversation_history", [])

        # Generate prompt
        prompt = f"""
        You are a professional AI stylist. Provide fashion advice based on the following:
        Skin Color: {skin_color}, Mood: {mood}, Measurements: {measurements}, Style Preferences: {style_preferences}.
        Conversation History: {conversation_history}
        User Input: {user_input}
        """

        print("Generated prompt:", prompt)

        # Call Gemini API
        response = model.generate_content(prompt)
        recommendation_text = response.text
        print(f"Gemini Response: {recommendation_text}")

        # Parse Gemini response
        clothes = []
        accessories = []
        tips = recommendation_text

        if "Clothes:" in recommendation_text and "Accessories:" in recommendation_text:
            clothes_start = recommendation_text.find("Clothes:") + len("Clothes:")
            accessories_start = recommendation_text.find("Accessories:")
            tips_start = recommendation_text.find("Styling Tips:")

            clothes = recommendation_text[clothes_start:accessories_start].strip().split(", ")
            accessories = recommendation_text[accessories_start + len("Accessories:"):tips_start].strip().split(", ")
            tips = recommendation_text[tips_start + len("Styling Tips:"):].strip()

        # Generate image if requested
        image_url = None
        if data.get("generate_image", False) and clothes:
            prompt_image = f"A {clothes[0]} and {accessories[0]} outfit."
            image_url = generate_image(prompt_image)

        return {
            "clothes": clothes,
            "accessories": accessories,
            "styling_tips": tips,
            "image_url": image_url,
            "skin_color": skin_color,
            "mood": mood,
            "gemini_response": recommendation_text,
        }

    except Exception as e:
        print(f"Error in generate_recommendation: {e}")
        return {
            "clothes": [],
            "accessories": [],
            "styling_tips": f"Error generating recommendation: {e}",
            "image_url": None,
            "skin_color": "unknown",
            "mood": "unknown",
            "gemini_response": f"Error: {e}",
        }

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    recommendation = generate_recommendation(data)
    return jsonify(recommendation)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)