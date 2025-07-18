import { generateAIResponse } from "../AIresponse.js";

export const aiFeedback = async (req, res) => {
  const { code } = req.body;

  if (!code || code.trim() === "") {
    res.status(400).send({
      message: "Code should not be empty"
    });
    return;
  }

  try {
    const responseText = await generateAIResponse(code);

    // Try parsing the response as JSON
    let parsed;
    try {
      // Remove ```json blocks if present
      let cleaned = responseText.trim();
      if (cleaned.startsWith("```json")) {
        cleaned = cleaned.replace(/```json|```/g, "").trim();
      }

      parsed = JSON.parse(cleaned);
    } catch (err) {
      return res.status(500).send({
        message: "AI response could not be parsed as JSON",
        error: err.message,
        raw: responseText
      });
    }

    res.status(200).send({
      message: "AI Feedback generated successfully",
      ...parsed  // spreads: { score, feedback }
    });

  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error: error.message
    });
  }
};
