
# AI Personalized Stylist (Stylo)

Overview
Stylo is an AI-powered personalized stylist that provides outfit recommendations, AR-based virtual try-ons, and color suggestions based on skin tone. The platform integrates AI, Machine Learning, and Augmented Reality to enhance the user experience.

Features
- **AI-Based Outfit Recommendation**: Get outfit suggestions based on your skin tone and fashion trends.
- **AR Virtual Try-On**: Try on clothes in real-time using augmented reality.
- **Skin Tone Detection**: Upload an image or use a live camera feed to detect your skin tone and get color suggestions.
- **Interactive UI**: A modern and engaging interface using React.

Tech Stack
*Frontend*
- React.js
- React Three Fiber (for 3D model rendering)
- Tailwind CSS
- Firebase (for authentication and storage)

*Backend*
- FastAPI (Python)
- TensorFlow / PyTorch (for AI-based outfit recommendations)
- OpenCV & Mediapipe (for image processing and skin tone detection)


Setup Instructions
Prerequisites
- Node.js & npm
- Python 3.9+

Installation
1. Clone the Repository
```sh
  git clone https://github.com/your-repo/ai-personalized-stylist.git
  cd ai-personalized-stylist
```
2. Setup Frontend
```sh
  cd frontend
  npm install
  npm start
```

3. Setup Backend
```sh
  cd backend
  pip install -r requirements.txt
  python app.py
```



