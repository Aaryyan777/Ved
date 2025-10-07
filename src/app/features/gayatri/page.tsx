"use client"

import { useState } from "react"
import { DecorativePattern } from "@/components/mystical/decorative-pattern"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

// Gayatri Mantra (RV 3.62.10) with accents using Unicode Vedic marks
const GAYATRI_DATA = {
  reference: "Rigveda 3.62.10",
  metre: "Gāyatrī (3 × 8 syllables)",
  seer: "Viśvāmitra Gāthina",
  deity: "Savitṛ (Solar deity)",
  
  // Sanskrit with Vedic accent marks
  sanskritAccented: "त॒त्स॑वि॒तुर्वरे॑ण्यं॒ भर्गो॑ दे॒वस्य॑ धीमहि । धियो॒ यो नः॑ प्रचो॒दया॑त् ॥",
  sanskrit: "तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि । धियो यो नः प्रचोदयात् ॥",
  
  transliteration: "tát savitúr váreṇyaṃ bhárgo devásya dhīmahi | dhíyo yó naḥ pracodáyāt ||",
  
  translations: [
    {
      author: "Ralph T.H. Griffith (1896)",
      text: "May we attain that excellent glory of Savitar the god: So may he stimulate our prayers.",
      license: "Public Domain"
    },
    {
      author: "H.H. Wilson (1866)",
      text: "Let us meditate on that excellent glory of the divine vivifier; may he enlighten our understanding.",
      license: "Public Domain"
    },
    {
      author: "Sri Aurobindo",
      text: "We meditate on the adorable glory of the radiant sun; may he inspire our intelligence.",
      license: "Public Domain"
    },
    {
      author: "Monier Williams",
      text: "We meditate on the adorable light of the divine Savitri; may he stimulate our thoughts.",
      license: "Public Domain"
    }
  ],
  
  wordBreakdown: [
    { word: "तत्", trans: "tát", meaning: "that", type: "pronoun" },
    { word: "सवितुः", trans: "savitúḥ", meaning: "of Savitṛ (the Sun)", type: "genitive" },
    { word: "वरेण्यम्", trans: "váreṇyam", meaning: "adorable, excellent", type: "adjective" },
    { word: "भर्गः", trans: "bhárgas", meaning: "radiance, glory", type: "noun" },
    { word: "देवस्य", trans: "devásya", meaning: "of the divine", type: "genitive" },
    { word: "धीमहि", trans: "dhīmahi", meaning: "we meditate", type: "verb (1st pl.)" },
    { word: "धियः", trans: "dhíyaḥ", meaning: "thoughts, intellect", type: "accusative pl." },
    { word: "यः", trans: "yáḥ", meaning: "who, which", type: "relative pronoun" },
    { word: "नः", trans: "naḥ", meaning: "our", type: "genitive pl." },
    { word: "प्रचोदयात्", trans: "pracodáyāt", meaning: "may stimulate/inspire", type: "optative verb" }
  ],
  
  accentGuide: {
    udatta: { mark: "॑", symbol: "´", description: "High pitch (raised tone)", examples: ["स॑", "भर्गो॑"] },
    anudatta: { mark: "॒", symbol: "`", description: "Low pitch (unmarked in transliteration)", examples: ["त॒", "यो॒"] },
    svarita: { mark: "", symbol: "^", description: "Falling tone (combination)", examples: [] }
  }
}

export default function GayatriDeepDivePage() {
  const [thematicContent, setThematicContent] = useState("")
  const [isLoadingThematic, setIsLoadingThematic] = useState(false)
  const [apiKey, setApiKey] = useState("")

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const generateThematicSignificance = async () => {
    if (!apiKey.trim()) {
      toast.error("Please enter your OpenAI API key")
      return
    }

    setIsLoadingThematic(true)
    try {
      const response = await fetch("/api/rigveda/thematic-significance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey,
          theme: "Gayatri Mantra",
          sanskrit: GAYATRI_DATA.sanskrit,
          translation: GAYATRI_DATA.translations[0].text,
          context: "The most sacred verse of the Rigveda, a prayer to Savitṛ for enlightenment"
        })
      })

      const data = await response.json()
      if (!response.ok) {
        toast.error(data.error || "Failed to generate content")
        return
      }

      setThematicContent(data.content)
      toast.success("Thematic significance generated!")
    } catch (error) {
      console.error(error)
      toast.error("Failed to generate thematic significance")
    } finally {
      setIsLoadingThematic(false)
    }
  }

  return (
    <div className="min-h-screen bg-background relative">
      <DecorativePattern />
      
      <div className="container mx-auto px-4 py-4 max-w-5xl relative z-10">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-10 w-10 text-primary animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold">गायत्री Mantra</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Deep dive into the most sacred verse of the Rigveda
          </p>
          <div className="flex gap-2 justify-center mt-4 flex-wrap">
            <Badge variant="secondary">{GAYATRI_DATA.reference}</Badge>
            <Badge variant="outline">{GAYATRI_DATA.metre}</Badge>
            <Badge>Seer: {GAYATRI_DATA.seer}</Badge>
            <Badge>Deity: {GAYATRI_DATA.deity}</Badge>
          </div>
        </div>

        {/* Navigation Bar */}
        <Card className="mb-6 sticky top-4 z-20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex gap-2 justify-center flex-wrap">
              <Button variant="outline" size="sm" onClick={() => scrollToSection("sacred-text")}>
                Sacred Text
              </Button>
              <Button variant="outline" size="sm" onClick={() => scrollToSection("translations")}>
                Translations
              </Button>
              <Button variant="outline" size="sm" onClick={() => scrollToSection("word-analysis")}>
                Word by Word Analysis
              </Button>
              <Button variant="outline" size="sm" onClick={() => scrollToSection("thematic-significance")}>
                Thematic Significance
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sacred Text */}
        <div id="sacred-text">
          <Card className="mb-6 border-2 border-primary/30 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10">
              <CardTitle className="text-center text-2xl">The Sacred Text</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <Tabs defaultValue="accented" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="accented">With Accents</TabsTrigger>
                  <TabsTrigger value="plain">Devanagari</TabsTrigger>
                  <TabsTrigger value="roman">Transliteration</TabsTrigger>
                </TabsList>
                
                <TabsContent value="accented" className="space-y-4">
                  <div className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl border-2 border-primary/20">
                    <p className="text-3xl md:text-4xl leading-relaxed font-devanagari text-center">
                      {GAYATRI_DATA.sanskritAccented}
                    </p>
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    <p>Vedic accents: {GAYATRI_DATA.accentGuide.udatta.mark} Udātta (high) • {GAYATRI_DATA.accentGuide.anudatta.mark} Anudātta (low)</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="plain">
                  <div className="p-8 bg-gradient-to-br from-muted/30 to-muted/50 rounded-2xl border-2 border-border">
                    <p className="text-3xl md:text-4xl leading-relaxed font-devanagari text-center">
                      {GAYATRI_DATA.sanskrit}
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="roman">
                  <div className="p-8 bg-gradient-to-br from-accent/5 to-secondary/5 rounded-2xl border-2 border-accent/20">
                    <p className="text-2xl md:text-3xl leading-relaxed italic text-center">
                      {GAYATRI_DATA.transliteration}
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Translation Variants */}
        <div id="translations">
          <Card className="mb-6 border-2 border-accent/20">
            <CardHeader>
              <CardTitle>Translation Variants (Public Domain)</CardTitle>
              <CardDescription>Compare authoritative interpretations from renowned scholars</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {GAYATRI_DATA.translations.map((t, idx) => (
                <div key={idx} className="p-6 rounded-xl border-2 border-border bg-card hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-lg">{t.author}</p>
                      <p className="text-xs text-muted-foreground">{t.license}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">{idx + 1}</Badge>
                  </div>
                  <p className="text-base leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Word-by-Word Breakdown */}
        <div id="word-analysis">
          <Card className="mb-6 border-2 border-secondary/20">
            <CardHeader>
              <CardTitle>Word-by-Word Analysis</CardTitle>
              <CardDescription>Morphological breakdown with meanings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {GAYATRI_DATA.wordBreakdown.map((w, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="min-w-[80px]">
                      <p className="text-2xl font-devanagari">{w.word}</p>
                      <p className="text-xs text-muted-foreground italic">{w.trans}</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-primary">{w.meaning}</p>
                      <p className="text-xs text-muted-foreground mt-1">{w.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Thematic Significance */}
        <div id="thematic-significance">
          <Card className="mb-6 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Thematic Significance
              </CardTitle>
              <CardDescription>
                Deeper meaning and importance of the Gāyatrī Mantra powered by AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!thematicContent && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="apiKey">OpenAI API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder="sk-..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Your API key is used only for this request and not stored
                    </p>
                  </div>
                  <Button 
                    onClick={generateThematicSignificance}
                    disabled={isLoadingThematic}
                    className="w-full"
                  >
                    {isLoadingThematic ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Thematic Significance"
                    )}
                  </Button>
                </div>
              )}

              {thematicContent && (
                <div className="prose prose-sm max-w-none">
                  <div className="p-6 rounded-lg bg-muted/30 border whitespace-pre-wrap">
                    {thematicContent}
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setThematicContent("")}
                    className="mt-4"
                  >
                    Generate Again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Metre Analysis */}
        <Card className="mb-6 border-2 border-primary/20">
          <CardHeader>
            <CardTitle>Metrical Structure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                <p className="text-sm text-muted-foreground mb-1">Metre Type</p>
                <p className="text-2xl font-bold text-primary">Gāyatrī</p>
              </div>
              <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                <p className="text-sm text-muted-foreground mb-1">Structure</p>
                <p className="text-2xl font-bold text-accent">3 × 8</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                <p className="text-sm text-muted-foreground mb-1">Total Syllables</p>
                <p className="text-2xl font-bold text-secondary">24</p>
              </div>
            </div>
            <div className="p-6 rounded-xl bg-muted/30 border border-border">
              <p className="text-sm text-muted-foreground mb-2">Pattern per Pāda</p>
              <p className="text-center font-mono text-xl tracking-wider">⏑ – ⏑ –  ⏑ ⏑ – ⏓</p>
              <p className="text-center text-xs text-muted-foreground mt-3">
                ⏑ = Light (laghu) • – = Heavy (guru) • ⏓ = Anceps
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Accent Guide */}
        <Card className="border-2 border-accent/20">
          <CardHeader>
            <CardTitle>Vedic Accent Marks</CardTitle>
            <CardDescription>Understanding the tonal notation system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl font-devanagari">॑</span>
                  <div>
                    <p className="font-bold">Udātta (उदात्त)</p>
                    <p className="text-sm text-muted-foreground">High pitch / raised tone</p>
                  </div>
                </div>
                <p className="text-xs">Marked with vertical line above: <span className="font-devanagari text-lg">स॑</span></p>
              </div>
              
              <div className="p-6 rounded-xl bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl font-devanagari">॒</span>
                  <div>
                    <p className="font-bold">Anudātta (अनुदात्त)</p>
                    <p className="text-sm text-muted-foreground">Low pitch / unmarked</p>
                  </div>
                </div>
                <p className="text-xs">Marked with horizontal line below: <span className="font-devanagari text-lg">त॒</span></p>
              </div>
            </div>
            <div className="p-6 rounded-xl bg-secondary/10 border border-secondary/20">
              <p className="font-semibold mb-2">Svarita (स्वरित)</p>
              <p className="text-sm text-muted-foreground">
                Falling tone created when udātta is followed by anudātta. 
                Represents a transition between high and low pitch.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}