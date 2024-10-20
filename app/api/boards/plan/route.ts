import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

export const runtime = "edge";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const generateInstructionMessage = (
  location: string,
  days: number
): string => {
  return `
    You are an expert travel planner.
    Please generate a structured JSON object that represents a day-by-day itinerary for a trip to ${location}, which is ${days} days long.
    Each day should be listed as an array of specific attractions or activities planned for that day in ${location}.
    Your suggestions should consider practical travel times between locations and include a variety of cultural, historical, and recreational activities to provide a well-rounded experience.

    Format the response as a JSON object with each day labeled from "Day 1" to "Day ${days}", and include the activities for each day. For example:
    
    {
      "Day 1": ["Activity 1", "Activity 2", ...],
      "Day 2": ["Activity 1", "Activity 2", ...],
      ...
    }
    Please focus solely on the trip details and exclude any unrelated text from your response. This JSON object will be used directly in an application, so accuracy and clarity are crucial.
    `
};

export async function POST(
  req: Request
) {
  try {
    const { location, days } = await req.json();

    const instructionMessage = generateInstructionMessage(location, days);

    const response = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      messages: [{
        role: "user",
        content: instructionMessage
      }],
      temperature: 0.7,
      max_tokens: 4096,
      top_p: 1,
      stop: null,
      stream: false,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    return new NextResponse(content, { status: 200 });
  } catch (error) {
    console.error("[ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}