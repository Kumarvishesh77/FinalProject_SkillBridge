const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);
  try {
    // There isn't a direct listModels in the SDK for some versions, 
    // but let's see if we can find it or just try a basic call to see if it works.
    console.log("Checking API key and basic connection...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("test");
    console.log("Success with gemini-1.5-flash");
  } catch (err) {
    console.error("Error with gemini-1.5-flash:", err.message);
    console.error(err);
  }
}

listModels();
