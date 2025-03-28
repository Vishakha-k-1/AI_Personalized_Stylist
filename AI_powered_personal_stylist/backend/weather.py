import requests
import os
from dotenv import load_dotenv

load_dotenv()

WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")
CITY = "London"  # Replace with a city name

url = f"http://api.openweathermap.org/data/2.5/weather?q={CITY}&appid={WEATHER_API_KEY}&units=metric"

try:
    response = requests.get(url)
    response.raise_for_status()
    data = response.json()
    print(f"Temperature: {data['main']['temp']}°C")
    print(f"Description: {data['weather'][0]['description']}")
except requests.exceptions.RequestException as e:
    print(f"Weather API Error: {e}")