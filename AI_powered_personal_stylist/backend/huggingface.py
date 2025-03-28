from huggingface_hub import InferenceClient
import os
from dotenv import load_dotenv
from PIL import Image
import time
import requests

load_dotenv()

HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
MODEL_NAME = "stable-diffusion-v1-5/stable-diffusion-v1-5"

try:
    client = InferenceClient(
        provider="hf-inference",
        api_key=HUGGINGFACE_API_KEY,
    )

    prompt = "Clothes suggestion with other accessories for a Thailand beach party, but with conservative clothes."

    image = client.text_to_image(
        prompt,
        model=MODEL_NAME,
    )

    image.save("generated_image.png")

    print("Image generated successfully. Saved as generated_image.png")

except requests.exceptions.HTTPError as e:
    if e.response.status_code == 503:
        print("Hugging Face Inference API 503 Error. Retrying in 30 seconds.")
        time.sleep(30)
        try:
            client = InferenceClient(
                provider="hf-inference",
                api_key=HUGGINGFACE_API_KEY,
            )

            image = client.text_to_image(
                prompt,
                model=MODEL_NAME,
            )

            image.save("generated_image.png")

            print("Image generated successfully. Saved as generated_image.png")

        except Exception as retry_error:
            print(f"Hugging Face Retry Error: {retry_error}")
    else:
        print(f"Hugging Face Inference API Error: {e}")

except Exception as e:
    print(f"Hugging Face Inference API Error: {e}")