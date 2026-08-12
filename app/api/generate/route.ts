import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize the Gemini Engine
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    // 1. Grab the user's prompt and chosen stack from the frontend
    const body = await req.json();
    const { prompt, stack } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // 2. Configure Gemini to guarantee a strict JSON response
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    // 3. The Master System Architect Prompt
    const systemInstruction = `
      You are Spine, an elite backend architect.
      The user wants to build this application: "${prompt}"
      They have selected this base stack: ${stack}

      Your job is to analyze the prompt and generate the custom backend logic needed for this app.
      Return ONLY valid JSON with this exact structure:
      {
        "schemaCode": "// prisma/schema.prisma\\n// Write the complete Prisma schema models here...",
        "apiRoutes": [
          {
            "folderPath": "the-name-of-the-route-folder",
            "code": "// src/app/api/folder-name/route.ts\\n// Write the full GET/POST controllers here..."
          }
        ],
        "readme": "# Custom Architecture Blueprint\\n// Write a short explanation of what you built..."
      }
    `;

    // 4. Send to Gemini and parse the result
    const result = await model.generateContent(systemInstruction);
    const text = result.response.text();
    const blueprint = JSON.parse(text);

    return NextResponse.json({ success: true, blueprint });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate architecture." },
      { status: 500 }
    );
  }
}