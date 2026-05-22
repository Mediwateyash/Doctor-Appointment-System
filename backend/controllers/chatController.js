const Chat = require('../models/Chat');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "INVALID_KEY");

// Simulation Logic (Fallback)
const getSimulationResponse = (message) => {
    const lowerMsg = message.toLowerCase();
    const mockResponses = {
        "hello": "Hello! I am your Health Assistant. How can I help you today?",
        "hi": "Hi there! Feel free to ask me any general health questions.",
        "fever": "For a mild fever, stay hydrated and rest. If it exceeds 102°F (39°C) or lasts more than 3 days, please see a doctor.",
        "headache": "Headaches can be caused by dehydration, stress, or lack of sleep. Try drinking water and resting in a dark room.",
        "cold": "Common cold symptoms include runny nose and sore throat. Rest and fluids are your best friends!",
        "cough": "For a cough, warm honey lemon water can be soothing. If you have trouble breathing, seek medical help immediately.",
        "pain": "If you are experiencing severe pain, please consult a doctor immediately. I cannot diagnose specific conditions.",
        "book": "You can book an appointment with our specialist doctors from the Dashboard.",
        "water": "Staying hydrated is vital! Aim for 8 glasses (about 2 liters) a day.",
        "diet": "A balanced diet with plenty of fruits, vegetables, and whole grains is key to good health.",
        "food": "Try to avoid processed foods and excess sugar. Focus on fresh, nutrient-rich meals.",
        "sleep": "Adults generally need 7-9 hours of quality sleep for optimal mental and physical health.",
        "stress": "To manage stress, try deep breathing, meditation, or a short walk. If it feels overwhelming, talk to a professional.",
        "exercise": "Regular physical activity (30 mins a day) helps boost immunity and mood.",
        "bp": "High blood pressure is a silent killer. Cut down on salt and monitor your levels regularly.",
        "pressure": "For blood pressure concerns, regular check-ups and a low-sodium diet are recommended.",
        "sugar": "Managing blood sugar involves a low-carb diet and regular exercise. Consult a diabetologist for a plan.",
        "diabetes": "Diabetes care requires monitoring glucose levels. Avoid sugary foods and stay active.",
        "skin": "For healthy skin, wear sunscreen, stay hydrated, and eat a balanced diet.",
        "acne": "Acne can be hormonal or cleanliness-related. Keep your face clean and avoid touching it.",
        "stomach": "Stomach pain can have many causes. Avoid spicy foods and eat light meals. If severe, see a doctor.",
        "weight": "Healthy weight loss is about a calorie deficit and exercise, not starvation. Aim for steady progress.",
        "emergency": "If this is a medical emergency (chest pain, trouble breathing), please call emergency services immediately!",
        "ambulance": "For immediate help, please call your local emergency number or go to the nearest hospital.",
        "thank": "You're welcome! Stay healthy.",
        "bye": "Goodbye! Take care of your health."
    };

    for (const key of Object.keys(mockResponses)) {
        if (lowerMsg.includes(key)) {
            return mockResponses[key];
        }
    }
    return "I'm here to help! Could you please rephrase that? You can ask about symptoms like 'fever', 'headache', or say 'book appointment'.";
};

exports.handleChat = async (req, res) => {
    try {
        const { message, userId } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }

        let replyText = "";

        try {
            // 1. Try Real AI
            if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes("YOUR_GEMINI")) {
                throw new Error("Missing API Key");
            }

            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const medicalPrompt = `
          You are a helpful Healthcare Assistant. 
          User Question: "${message}"
          Rules: No diagnosis/prescriptions. Advise doctor for serious symptoms. Keep it short.
        `;

            const result = await model.generateContent(medicalPrompt);
            const response = await result.response;
            replyText = response.text();

        } catch (aiError) {
            // 2. Fallback to Simulation if AI fails
            console.warn("AI Service Failed, switching to Simulation Mode:", aiError.message);
            replyText = getSimulationResponse(message);
        }

        // 3. Save Chat History
        if (userId) {
            try {
                const newChat = new Chat({ userId, message, response: replyText });
                await newChat.save();
            } catch (dbErr) {
                console.error("DB Save Error:", dbErr);
            }
        }

        res.status(200).json({ success: true, response: replyText });

    } catch (error) {
        console.error('Critical Chatbot Error:', error);
        // Ultimate Fail-safe: never send 500 to frontend for chat
        res.status(200).json({ success: true, response: "I'm having trouble connecting right now, but please remember to drink water and rest!" });
    }
};

exports.getChatHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const history = await Chat.find({ userId }).sort({ timestamp: 1 });
        res.status(200).json({ success: true, data: history });
    } catch (error) {
        console.error('Fetch History Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch history' });
    }
};
