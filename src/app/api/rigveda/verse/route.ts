import { NextRequest, NextResponse } from "next/server"

// VedaWeb API base URL
const VEDAWEB_API = "http://vedaweb.uni-koeln.de/rigveda/api/document/id"

// Helper to format doc ID (e.g., mandala 1, hymn 1, verse 1 => "0100101")
function formatDocId(mandala: number, hymn: number, verse: number): string {
  const m = String(mandala).padStart(2, '0')
  const h = String(hymn).padStart(3, '0')
  const v = String(verse).padStart(2, '0')
  return `${m}${h}${v}`
}

// Helper to extract Sanskrit text from VedaWeb padas
function extractSanskrit(padas: any[]): string {
  if (!padas || !Array.isArray(padas)) return ""
  return padas.map(pada => pada.grammarData.map((token: any) => token.form || "").join(" ")).join(" | ")
}

// Helper to extract a specific version/translation from versions array
function getVersion(versions: any[], type: string, id?: string): any | undefined {
  if (!versions || !Array.isArray(versions)) return undefined
  return versions.find(v => v.type === type && (id ? v.id === id : true))
}

function getMetricalData(versions: any[]): string | undefined {
  if (!versions || !Array.isArray(versions)) return undefined
  const lubotskyVersion = versions.find(v => v.id === "version_lubotskyzurich" && v.metricalData)
  return lubotskyVersion ? lubotskyVersion.metricalData.join(" ") : undefined
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const mandala = searchParams.get("mandala")
    const hymn = searchParams.get("hymn")
    const verse = searchParams.get("verse")

    if (!mandala || !hymn || !verse) {
      return NextResponse.json(
        { error: "Missing required parameters: mandala, hymn, verse" },
        { status: 400 }
      )
    }

    const mandalaNum = parseInt(mandala)
    const hymnNum = parseInt(hymn)
    const verseNum = parseInt(verse)

    if (isNaN(mandalaNum) || isNaN(hymnNum) || isNaN(verseNum)) {
      return NextResponse.json(
        { error: "Invalid parameter format. All parameters must be numbers." },
        { status: 400 }
      )
    }

    // Validate mandala range (1-10)
    if (mandalaNum < 1 || mandalaNum > 10) {
      return NextResponse.json(
        { error: "Invalid mandala. Must be between 1 and 10." },
        { status: 400 }
      )
    }

    // Format document ID for VedaWeb API
    const docId = formatDocId(mandalaNum, hymnNum, verseNum)

    // Fetch from VedaWeb API
    const response = await fetch(`${VEDAWEB_API}/${docId}`, {
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { 
            error: "Verse not found",
            message: `Rigveda ${mandalaNum}.${hymnNum}.${verseNum} is not available in the VedaWeb database.`,
            suggestion: "Try Mandala 1, Hymn 1, Verse 1 or check the Rigveda index for valid references"
          },
          { status: 404 }
        )
      }
      throw new Error(`VedaWeb API returned status ${response.status}`)
    }

    const data = await response.json()
    console.log("VedaWeb API Response Versions:", data.versions) // Debugging line

    const sanskritText = extractSanskrit(data.padas)
    const transliterationVersion = getVersion(data.versions, "version", "version_lubotskyzurich") || getVersion(data.versions, "version", "version_lubotsky")
    const englishTranslationVersion = getVersion(data.versions, "translation", "translation_griffith")

    const sanskritVersion = getVersion(data.versions, "version", "version_eichler")
    const metricalData = getMetricalData(data.versions)

    const verseData = {
      mandala: mandalaNum,
      hymn: hymnNum,
      verse: verseNum,
      sanskrit: sanskritVersion?.form.join("<br />") || "Sanskrit text not available",
      sanskritSource: sanskritVersion?.source || "D. Eichler",
      sanskritLanguage: sanskritVersion?.language || "san-Deva",
      transliteration: transliterationVersion?.form.join("<br />") || "Transliteration not available",
      transliterationSource: transliterationVersion?.source || "Lubotsky, Zurich",
      transliterationLanguage: transliterationVersion?.language || "san-Latn-x-ISO-15919",
      translations: {
        english: englishTranslationVersion?.form.join(" ") || "English translation not available",
        author: englishTranslationVersion?.source || "Ralph Griffith", // Default to Ralph Griffith
        hindi: getVersion(data.versions, "translation", "geldner")?.form.join(" ") || undefined, // Assuming Geldner is Hindi for now, need to verify
      },
      deity: data.hymnAddressee || "N/A",
      hymnAddressee: data.hymnAddressee || "N/A",
      hymnGroup: data.hymnGroup || "N/A",
      stanzaType: data.stanzaType || data.hymnMeter || "N/A",
      metricalData: metricalData, // Add metrical data here
      // New fields from Stanza object
      id: data.id,
      index: data.index,
      hymnAbs: data.hymnAbs,
      strata: data.strata,
      lateAdditions: data.lateAdditions,
      externalResources: data.externalResources,
      padas: data.padas,
      versions: data.versions,
      location: data.location,
    }

    return NextResponse.json({ success: true, data: verseData })
  } catch (error) {
    console.error("Error fetching Rigveda verse:", error)
    return NextResponse.json(
      { 
        error: "Failed to fetch verse from VedaWeb",
        message: error instanceof Error ? error.message : "Unknown error occurred"
      },
      { status: 500 }
    )
  }
}