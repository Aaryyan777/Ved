import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sanskrit, transliteration, translation, mandala, hymn, verse, deity, meter } = body

    if (!sanskrit || !translation) {
      return NextResponse.json(
        { error: "Missing required fields: sanskrit and translation" },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { 
          error: "OpenAI API key not configured",
          message: "Please configure OPENAI_API_KEY environment variable" 
        },
        { status: 500 }
      )
    }

    const prompt = `You are a knowledgeable scholar of Vedic literature and Hindu philosophy. Provide a detailed explanation and spiritual insights for this Rigveda verse:

Reference: Rigveda ${mandala}.${hymn}.${verse}
${deity ? `Deity: ${deity}` : ''}
${meter ? `Meter: ${meter}` : ''}

Sanskrit: ${sanskrit}
${transliteration ? `Transliteration: ${transliteration}` : ''}
Translation: ${translation}

Please provide:
1. A detailed explanation of the verse's meaning and context
2. Historical and cultural significance
3. Spiritual and philosophical insights
4. Practical relevance for modern life
5. Any symbolic interpretations

Keep the explanation accessible yet profound, around 300-400 words.`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a scholarly expert in Vedic literature, Sanskrit, and Hindu philosophy with deep knowledge of the Rigveda and its interpretations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("OpenAI API error:", errorData)
      return NextResponse.json(
        { 
          error: "Failed to generate AI explanation",
          details: errorData
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    const explanation = data.choices[0]?.message?.content

    if (!explanation) {
      return NextResponse.json(
        { error: "No explanation generated" },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      explanation 
    })
  } catch (error) {
    console.error("Error generating AI explanation:", error)
    return NextResponse.json(
      { 
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}