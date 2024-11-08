const express = require('express');
const cors = require('cors');
const stringSimilarity = require('string-similarity');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(express.json());
app.use(cors());

// Predefined mental health questions and answers
const predefinedResponses = {
    "what is mental health": "Mental health refers to our cognitive, behavioral, and emotional well-being. It affects how we think, feel, and act.",
    "how can I improve my mental health": "Engaging in regular exercise, maintaining a healthy diet, getting enough sleep, and practicing mindfulness can significantly improve your mental health.",
    "what are signs of depression": "Signs of depression can include persistent sadness, loss of interest in activities, changes in appetite, and feelings of hopelessness.",
    "how do I manage anxiety": "Consider practicing deep breathing exercises, mindfulness, or seeking professional help if your anxiety feels overwhelming.",
    "what is therapy": "Therapy is a treatment for mental health issues where you talk to a trained professional to help you work through your feelings and challenges.",
    "how can I support someone with depression": "Be there for them, listen without judgment, encourage them to seek professional help, and check in regularly.",
    "i need help": "It's important to talk to someone who can help. If you're in crisis, please contact a mental health professional or a crisis hotline immediately.",
    "what should I do if I'm feeling suicidal": "Please reach out to a trusted friend, family member, or a mental health professional. You can also contact a crisis hotline for immediate support.",
    "where can I find support": "You can find support through local mental health services, hotlines, or online resources such as counseling websites.",
    "how do I cope with stress": "Try techniques like mindfulness, exercise, talking to someone, or engaging in hobbies you enjoy.",
    "what are healthy coping mechanisms": "Healthy coping mechanisms include journaling, exercising, practicing relaxation techniques, and seeking social support.",
    "what can you help me with": "I can provide information about mental health, coping strategies, and resources. If you're in crisis, I recommend reaching out to a professional.",
    "who created you": "I was developed by a team dedicated to supporting mental health awareness and resources.",
    "how do I start therapy": "You can start by reaching out to a licensed therapist or counselor. Many offer consultations to help you decide if they're the right fit."
};

// Critical keywords indicating a crisis situation
const criticalKeywords = ["suicide", "kill", "end my life", "self harm", "die", "death", "hurt myself"];

// Function to check for critical keywords in the user message
const containsCriticalKeyword = (message) => {
    const words = message.toLowerCase().split(/\s+/);
    return criticalKeywords.some(keyword =>
        words.some(word => word.includes(keyword) || stringSimilarity.compareTwoStrings(word, keyword) > 0.8)
    );
};

// Chatbot API Route
app.post('/api/chatbot', (req, res) => {
    const userMessage = req.body.message ? req.body.message.toLowerCase().trim() : '';

    if (!userMessage) {
        return res.status(400).json({ error: 'Message is required.' });
    }

    console.log(`User message: ${userMessage}`); // Debugging log for user message

    // Check if the message contains any critical keywords
    if (containsCriticalKeyword(userMessage)) {
        return res.json({
            response: "It sounds like you're going through a tough time. Please reach out to a mental health professional immediately or contact a crisis hotline. Here's a hotline you can contact: 1-800-273-TALK (8255)."
        });
    }

    // Proceed with normal predefined responses if no critical keywords are found
    const questions = Object.keys(predefinedResponses);
    const match = stringSimilarity.findBestMatch(userMessage, questions);
    const threshold = 0.5;  // Minimum similarity threshold to respond with a predefined message

    console.log(`Best match: ${match.bestMatch.target}, Rating: ${match.bestMatch.rating}`); // Debugging log for best match

    if (match.bestMatch.rating >= threshold) {
        const botResponse = predefinedResponses[match.bestMatch.target];
        return res.json({ response: botResponse });
    } else {
        return res.json({ response: "I'm sorry, I didn't understand that. Please ask me something related to mental health." });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});