import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { apiKey, theme, sanskrit, translation, context } = await request.json()

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      )
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a Sanskrit scholar and expert in Vedic literature, specializing in thematic analysis and interpretation of ancient texts."
          },
          {
            role: "user",
            content: `Provide a detailed thematic significance analysis for the following:

Theme: ${theme}
Sanskrit: ${sanskrit}
Translation: ${translation}
Context: ${context}

Please explain:
1. The deeper spiritual and philosophical meaning
2. The cultural and historical significance
3. How this theme represents or contributes to Vedic thought
4. Its relevance and symbolism in the broader context of the Rigveda
5. The universal themes and timeless wisdom it contains

Provide a comprehensive, scholarly analysis in 3-4 paragraphs.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: error.error?.message || "Failed to generate content" },
        { status: response.status }
      )
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || ""

    return NextResponse.json({ content })
  } catch (error) {
    console.error("Thematic significance error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}