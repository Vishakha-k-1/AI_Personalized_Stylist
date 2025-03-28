from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
import imghdr

app = Flask(__name__)
CORS(app)

@app.route("/detect_skin_tone", methods=["POST"])
def detect_skin_tone():
    data = request.json
    image_data = data.get("image")

    if not image_data:
        return jsonify({"error": "No image provided"}), 400

    try:
        # Decode base64 image
        encoded_data = image_data.split(",")[1]
        image_bytes = base64.b64decode(encoded_data)
        image_np = np.frombuffer(image_bytes, dtype=np.uint8)
        image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

        if image is None:
            return jsonify({"error": "Invalid image format"}), 400

        # Calculate skin tone based on brightness
        brightness = np.mean(image)
        if brightness > 170:
            skin_tone = "Fair"
        elif brightness > 120:
            skin_tone = "Warm"
        else:
            skin_tone = "Dark"

        return jsonify({"skin_tone": skin_tone})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
