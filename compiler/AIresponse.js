import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

export const generateAIResponse = async(code)=>{
    console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY);
    const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Evaluate the following code for cleanliness as if it were written during a software engineering interview.
    
    1. Assign a cleanliness score out of 100.
    2. Justify the score briefly.
    3. Give actionable feedback on:
       - Code formatting and readability
       - Naming conventions
       - Modularity and structure
       - Elimination of duplication (DRY principle)
       - Best practices (avoid bad habits, use idiomatic constructs)
    
    Respond in the following JSON format:
    {
      "score": <number>,
      "feedback": "<combined explanation and feedback>"
    }
    
    Here is the candidate's code:
    
    ${code}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0,
            topK: 1,
            topP: 1,
            maxOutputTokens: 600
          }
        }
      );
      return response.text;
}





