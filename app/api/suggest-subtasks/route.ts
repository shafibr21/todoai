import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!)

// util to call Gemini with auto-retry / fallback on HTTP-429
async function generateSubtasksWithRetry(title: string, description?: string | null) {
  // The heavy model we prefer first
  const primaryModelName = "gemini-1.5-pro"
  // Lighter, faster model we fall back to if quota is hit
  const fallbackModelName = "gemini-1.5-flash"

  const prompt = `
Break down this task into 3-5 smaller, actionable subtasks.

Task: ${title}
${description ? `Description: ${description}` : ""}

Return a JSON array of strings only.
Example: ["Step 1","Step 2","Step 3"]
`.trim()

  async function call(modelName: string) {
    const model = genAI.getGenerativeModel({ model: modelName })
    return model.generateContent(prompt)
  }

  try {
    return await call(primaryModelName)
  } catch (err: any) {
    // If it wasn't a quota problem – rethrow
    if (!err.message?.includes("429")) throw err

    // Parse Google’s suggested retry delay (if present)
    const retryMatch = err.message.match(/"retryDelay":"(\d+)s"/)
    const retryMs = retryMatch && retryMatch[1] ? Number.parseInt(retryMatch[1], 10) * 1000 : 5000
    console.warn(
      `Quota hit on ${primaryModelName}. Waiting ${retryMs / 1000}s then retrying with ${fallbackModelName} …`,
    )
    await new Promise((r) => setTimeout(r, retryMs))

    // Second attempt with cheaper model
    return await call(fallbackModelName)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description } = await request.json()

    if (!title) {
      return NextResponse.json({ error: "Task title is required" }, { status: 400 })
    }

    const result = await generateSubtasksWithRetry(title, description)
    const response = await result.response
    const text = response.text()

    // Try to parse the JSON response
    let subtasks: string[]
    try {
      // Clean the response to extract JSON
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        subtasks = JSON.parse(jsonMatch[0])
      } else {
        // Fallback: split by lines and clean up
        subtasks = text
          .split("\n")
          .filter((line) => line.trim() && !line.includes("```"))
          .map((line) =>
            line
              .replace(/^\d+\.\s*/, "")
              .replace(/^[-*]\s*/, "")
              .trim(),
          )
          .filter((line) => line.length > 0)
          .slice(0, 5)
      }
    } catch (parseError) {
      // Fallback parsing
      subtasks = text
        .split("\n")
        .filter((line) => line.trim() && !line.includes("```"))
        .map((line) =>
          line
            .replace(/^\d+\.\s*/, "")
            .replace(/^[-*]\s*/, "")
            .trim(),
        )
        .filter((line) => line.length > 0)
        .slice(0, 5)
    }

    return NextResponse.json({ subtasks })
  } catch (error) {
    console.error("Error generating subtasks:", error)
    return NextResponse.json({ error: "Failed to generate subtasks. Please try again." }, { status: 500 })
  }
}
