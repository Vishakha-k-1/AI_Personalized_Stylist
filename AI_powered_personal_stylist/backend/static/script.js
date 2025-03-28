const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const webcam = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const skinColorButton = document.getElementById('skinColorButton');
const generateImageButton = document.getElementById('generateImageButton');
const imageArea = document.getElementById('image-area');
const loading = document.getElementById('loading');

let userData = {};
let conversationHistory = [];

let currentStep = 0;
let isWaitingForInput = false;

const steps = [
    { question: "Okay, let's start with your skin tone. What is it? (e.g., fair, light, medium, olive, deep)", handler: handleSkinTone },
    { question: "Great! Now, please capture your skin tone and mood using the 'Capture Skin Color and Mood' button.", handler: handleSkinColorAndMood },
    { question: "Now, tell me about your style preferences. (e.g., classic, bohemian, edgy)", handler: handleStylePreferences },
    { question: "Got it! Could you please provide your waist size?", handler: handleMeasurements },
    { question: "Thank you! Would you like me to generate an outfit image for you?", handler: handleImageGeneration }
];

function startStylingProcess() {
    currentStep = 0;
    isWaitingForInput = true; // Ensure the application waits for user input
    askNextStep();
}

function askNextStep() {
    if (currentStep < steps.length) {
        const step = steps[currentStep];
        appendMessage(`Stylist: ${step.question}`, 'stylist');
        isWaitingForInput = true; // Wait for user input before proceeding
    } else {
        appendMessage("Stylist: All steps completed! Let me know if you need further assistance.", 'stylist');
    }
}

function handleSkinTone(input) {
    userData.skinTone = input;
    appendMessage("Stylist: Please enter your city to get weather-based recommendations.", 'stylist');
    userInput.onkeydown = function(event) {
        if (event.key === 'Enter') {
            const city = userInput.value.trim();
            if (city) {
                userData.city = city;
                fetchWeatherRecommendations(city);
                userInput.value = '';
                userInput.onkeydown = null;
                currentStep++;
                isWaitingForInput = false;
                askNextStep();
            } else {
                appendMessage("Stylist: Please enter a valid city.", 'stylist');
            }
        }
    };
}

async function handleSkinColorAndMood() {
    await captureSkinColorAndMood();
    currentStep++;
    isWaitingForInput = false;
    askNextStep();
}

function handleStylePreferences(input) {
    userData.stylePreferences = input;
    currentStep++;
    isWaitingForInput = false;
    askNextStep();
}

function handleMeasurements(input) {
    userData.measurements = userData.measurements || {};
    userData.measurements.waist = input;
    currentStep++;
    isWaitingForInput = false;
    askNextStep();
}

async function handleImageGeneration(input) {
    if (input.toLowerCase() === "yes") {
        await generateImage();
    }
    currentStep++;
    isWaitingForInput = false;
    askNextStep();
}

async function sendMessage() {
    if (!isWaitingForInput) {
        appendMessage("Stylist: Please wait for the next question.", 'stylist');
        return;
    }

    const message = userInput.value.trim();
    if (!message) {
        appendMessage("Stylist: Please enter a response before sending.", 'stylist');
        return;
    }

    appendMessage("You: " + message, 'user');
    userInput.value = '';

    const step = steps[currentStep];
    if (step && step.handler) {
        isWaitingForInput = false; // Stop waiting for input while processing the current step
        step.handler(message);
    }
}

function appendMessage(message, sender) {
    chatContainer.innerHTML += `<div class="message ${sender}">${message}</div>`;
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function mapSkinTone(rgb) {
    const [r, g, b] = rgb;
    const average = (r + g + b) / 3;

    if (average > 200) {
        return "Fair";
    } else if (average > 150) {
        return "Medium";
    } else if (average > 100) {
        return "Olive";
    } else {
        return "Dark";
    }
}

function detectMood(rgb) {
    const [r, g, b] = rgb;

    if (r > g && r > b) {
        return "Energetic";
    } else if (g > r && g > b) {
        return "Relaxed";
    } else if (b > r && b > g) {
        return "Calm";
    } else {
        return "Neutral";
    }
}

async function captureSkinColorAndMood() {
    try {
        if (!webcam.srcObject) {
            appendMessage(`Stylist: Please start the webcam first by clicking the "Start Webcam" button.`, 'stylist');
            return;
        }
        canvas.width = webcam.videoWidth;
        canvas.height = webcam.videoHeight;
        context.drawImage(webcam, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;

        if (!imageData || imageData.length === 0) {
            throw new Error("No image data captured.");
        }

        // Calculate average RGB values for skin tone
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < imageData.length; i += 4) {
            r += imageData[i];
            g += imageData[i + 1];
            b += imageData[i + 2];
            count++;
        }
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        userData.skinColor = `rgb(${r}, ${g}, ${b})`;

        // Map RGB to descriptive skin tone
        const skinTone = mapSkinTone([r, g, b]);
        userData.skinToneDescription = skinTone;

        // Detect mood
        const mood = detectMood([r, g, b]);
        userData.mood = mood;

        appendMessage(`Stylist: Skin Tone: ${userData.skinToneDescription} (${userData.skinColor}), Mood: ${userData.mood}.`, 'stylist');
    } catch (error) {
        console.error("Error capturing skin tone and mood:", error);
        appendMessage(`Stylist: Unable to detect skin tone and mood. Please try again.`, 'stylist');
    }
}

async function captureSkinColor() {
    try {
        if (!webcam.srcObject) {
            appendMessage(`Stylist: Please start the webcam first by clicking the "Start Webcam" button.`, 'stylist');
            return;
        }
        canvas.width = webcam.videoWidth;
        canvas.height = webcam.videoHeight;
        context.drawImage(webcam, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
        if (!imageData || imageData.length === 0) {
            throw new Error("No image data captured.");
        }
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < imageData.length; i += 4) {
            r += imageData[i];
            g += imageData[i + 1];
            b += imageData[i + 2];
            count++;
        }
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        userData.skinColor = `rgb(${r}, ${g}, ${b})`;
        appendMessage(`Stylist: Your skin color is approximately ${userData.skinColor}.`, 'stylist');
    } catch (error) {
        console.error("Error capturing skin color:", error);
        appendMessage(`Stylist: Unable to detect skin color. Please ensure the webcam is active and try again.`, 'stylist');
    }
}

async function captureWebcamData() {
    try {
        if (!webcam.srcObject) {
            appendMessage(`Stylist: Please start the webcam first by clicking the "Start Webcam" button.`, 'stylist');
            return;
        }
        canvas.width = webcam.videoWidth;
        canvas.height = webcam.videoHeight;
        context.drawImage(webcam, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');
        userData.webcam_data = imageData.split(',')[1]; // Base64 encoded image data
        appendMessage(`Stylist: Captured webcam data successfully.`, 'stylist');
    } catch (error) {
        console.error("Error capturing webcam data:", error);
        appendMessage(`Stylist: Unable to capture webcam data. Please ensure the webcam is active and try again.`, 'stylist');
    }
}

async function startWebcam() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        webcam.srcObject = stream;
        webcam.style.display = 'block'; // Show the webcam feed
        appendMessage(`Stylist: Webcam started. You can now capture skin tone and mood.`, 'stylist');
    } catch (error) {
        console.error("Error starting webcam:", error);
        if (error.name === "NotAllowedError") {
            appendMessage(`Stylist: Webcam access denied. Please allow webcam permissions and try again.`, 'stylist');
        } else if (error.name === "NotFoundError") {
            appendMessage(`Stylist: No webcam found. Please connect a webcam and try again.`, 'stylist');
        } else {
            appendMessage(`Stylist: Unable to start webcam. Please try again later.`, 'stylist');
        }
    }
}

async function stopWebcam() {
    const stream = webcam.srcObject;
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        webcam.srcObject = null;
        webcam.style.display = 'none'; // Hide the webcam feed
        appendMessage(`Stylist: Webcam stopped.`, 'stylist');
    }
}

function askMeasurement(measurementType) {
    let prompt = `Please provide your ${measurementType} measurement.`;
    appendMessage(`Stylist: ${prompt}`, 'stylist');

    userInput.onkeydown = function(event) {
        if (event.key === 'Enter') {
            const measurement = userInput.value;
            userData.measurements = userData.measurements || {};
            userData.measurements[measurementType] = measurement;
            appendMessage(`You: ${measurement}`, 'user');
            userInput.value = '';
            userInput.onkeydown = null;
            sendMessage();
        }
    };
}

async function generateImage() {
    loading.style.display = 'block';
    userData.generate_image = true;
    try {
        const response = await fetch('/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        loading.style.display = 'none';
        if (data.image_url) {
            imageArea.innerHTML = `<img src="${data.image_url}" alt="Generated Outfit" style="max-width: 100%; height: auto;">`;
        } else {
            imageArea.innerHTML = `<p>Image generation failed.</p>`;
        }
    } catch (error) {
        loading.style.display = 'none';
        console.error("Error generating image:", error);
        imageArea.innerHTML = `<p>Image generation failed.</p>`;
    }
}

skinColorButton.addEventListener('click', captureSkinColor);
generateImageButton.addEventListener('click', generateImage);

// Start the process when the page loads
document.addEventListener('DOMContentLoaded', () => {
    appendMessage("Stylist: Hello! I'm here to help you with your styling needs. 👗✨", 'stylist');
    appendMessage("Stylist: I can recommend outfits, accessories, and styling tips based on your preferences, measurements, and even the weather in Thane. Let's get started!", 'stylist');
    startStylingProcess();
});

// Add weather-based recommendations for Thane
async function fetchWeatherRecommendations(city) {
    if (!city) {
        appendMessage("Stylist: Please provide a city to get weather recommendations.", 'stylist');
        return;
    }

    try {
        const response = await fetch(`/weather?city=${encodeURIComponent(city)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const weatherData = await response.json();
        const { temperature, description } = weatherData;
        appendMessage(`Stylist: The current weather in ${city} is ${temperature}°C with ${description}. Based on this, I recommend light, breathable fabrics and comfortable footwear.`, 'stylist');
    } catch (error) {
        console.error("Error fetching weather data:", error);
        appendMessage(`Stylist: Unable to fetch weather data for ${city}. Please try again later.`, 'stylist');
    }
}

// Call weather recommendations after starting the process
document.addEventListener('DOMContentLoaded', fetchWeatherRecommendations);