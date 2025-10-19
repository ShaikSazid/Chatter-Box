import { getAiResponse, generateTitle } from "../services/aiService.js";

const testGemini = async () => {
  try {
    // 👇 Step 1: Test chat response
    const messages = [
      { role: "user", content: "Explain what RabbitMQ is in 50 lines." }
    ];

    console.log("Testing getAiResponse...");
    const reply = await getAiResponse(messages);
    console.log("✅ AI Response:", reply);

    // 👇 Step 2: Test title generation
    console.log("Testing generateTitle...");
    const title = await generateTitle(messages[0].content, reply);
    console.log("✅ Generated Title:", title);
  } catch (err) {
    console.error("❌ Test failed:", err);
  }
};

testGemini();