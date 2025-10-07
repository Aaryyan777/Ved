"use client"

import { useState } from "react"
import { VerseSelector } from "@/components/rigveda/verse-selector"
import { VerseDisplay, VerseData } from "@/components/rigveda/verse-display"
import { DecorativePattern } from "@/components/mystical/decorative-pattern"
import { toast } from "sonner"
import { Flame, ScrollText, Sun, Moon, Star, ArrowLeft, Grid3x3, Crown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function Home() {
  const [verse, setVerse] = useState<VerseData | null>(null)
  const [aiExplanation, setAiExplanation] = useState<string>("")
  const [isLoadingVerse, setIsLoadingVerse] = useState(false)
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [showExplorer, setShowExplorer] = useState(false)

  const handleSearch = async (mandala: number, hymn: number, verseNum: number) => {
    setIsLoadingVerse(true)
    setVerse(null)
    setAiExplanation("")

    try {
      const response = await fetch(
        `/api/rigveda/verse?mandala=${mandala}&hymn=${hymn}&verse=${verseNum}`
      )
      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || data.error || "Failed to fetch verse")
        if (data.suggestion) {
          toast.info(data.suggestion)
        }
        return
      }

      setVerse(data.data)
      toast.success("Verse loaded successfully!")
    } catch (error) {
      console.error("Error fetching verse:", error)
      toast.error("Failed to fetch verse. Please try again.")
    } finally {
      setIsLoadingVerse(false)
    }
  }

  const handleRequestAIExplanation = async () => {
    if (!verse) return

    setIsLoadingAI(true)
    try {
      const response = await fetch("/api/rigveda/ai-explanation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sanskrit: verse.sanskrit,
          transliteration: verse.transliteration,
          translation: verse.translations.english,
          mandala: verse.mandala,
          hymn: verse.hymn,
          verse: verse.verse,
          deity: verse.deity,
          meter: verse.meter,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || data.error || "Failed to generate AI explanation")
        return
      }

      setAiExplanation(data.explanation)
      toast.success("AI explanation generated!")
    } catch (error) {
      console.error("Error generating AI explanation:", error)
      toast.error("Failed to generate explanation. Please try again.")
    } finally {
      setIsLoadingAI(false)
    }
  }

  if (showExplorer) {
    return (
      <div className="min-h-screen bg-background relative">
        <DecorativePattern />
        <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
          <div className="mb-6 flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => setShowExplorer(false)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <Link href="/features">
              <Button variant="outline" className="gap-2">
                <Grid3x3 className="w-4 h-4" />
                Explore All Features
              </Button>
            </Link>
          </div>
          
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-wide font-heading">
                ऋग्वेद Rigveda
              </h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Journey through the sacred hymns of ancient wisdom
            </p>
          </div>

          <div className="space-y-8">
            <VerseSelector onSearch={handleSearch} isLoading={isLoadingVerse} />

            {verse && (
              <VerseDisplay
                verse={verse}
                aiExplanation={aiExplanation}
                onRequestAIExplanation={handleRequestAIExplanation}
                isLoadingAI={isLoadingAI}
              />
            )}

            {!verse && !isLoadingVerse && (
              <div className="text-center py-16 text-muted-foreground">
                <ScrollText className="h-20 w-20 mx-auto mb-6 opacity-50" />
                <p className="text-xl mb-2">
                  Select a sacred verse to begin your journey
                </p>
                <p className="text-sm mt-4 max-w-md mx-auto">
                  The Rigveda contains 10,552 verses organized in 10 Mandalas (books),
                  each containing multiple hymns dedicated to various deities
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative">
      <DecorativePattern />
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto text-center space-y-8 mb-16">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight font-heading">
            <span className="block mb-4">
              ॐ ऋग्वेद
            </span>
            <span className="text-3xl md:text-5xl lg:text-6xl block text-muted-foreground font-light">
              The Sacred Hymns
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Explore the oldest and most revered collection of Vedic Sanskrit hymns. 
            Discover profound wisdom, divine poetry, and spiritual insights from over 
            <span className="text-primary font-semibold"> 3,500 years ago</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <a
              href="http://localhost:8080"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 py-6 text-lg"
            >
              Begin Sacred Journey
            </a>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6"
              onClick={() => {
                setShowExplorer(true)
                setTimeout(() => {
                  document.querySelector('input')?.focus()
                }, 100)
              }}
            >
              Explore Verses
            </Button>
          </div>
        </div>

        {/* Cosmic Visualizations */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
              Cosmic Visualizations
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience the Rigveda through stunning interactive visualizations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="group hover:shadow-lg transition-all">
              <CardHeader>
                <Sun className="w-16 h-16 text-primary mb-4 opacity-80" />
                <CardTitle className="text-2xl font-heading">Interactive Mandala Explorer</CardTitle>
                <CardDescription>
                  Sacred sun-wheel chakra with 10 color-coded petals. Click to explore Maṇḍalas, Sūktas, and glowing verses in a divine cosmic map
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/features/mandala-explorer">
                  <Button className="w-full">
                    Explore the Mandala
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all">
              <CardHeader>
                <Sparkles className="w-16 h-16 text-accent mb-4 opacity-80" />
                <CardTitle className="text-2xl font-heading">Rig Veda Galaxy</CardTitle>
                <CardDescription>
                  Experience poetry as a spiral universe. Each Sūkta is a star, verses orbit as planets. Zoom in to read the sacred verses.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/features/rigveda-galaxy">
                  <Button className="w-full">
                    Explore the Galaxy
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all">
              <CardHeader>
                <Crown className="w-16 h-16 text-secondary mb-4 opacity-80" />
                <CardTitle className="text-2xl font-heading">God Popularity Contest</CardTitle>
                <CardDescription>
                  Watch the divine race. Animated bar chart shows which deities dominate each Maṇḍala. See Soma's dominance in Book 9
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/features/god-popularity">
                  <Button className="w-full">
                    Start the Race
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mt-20">
          <div className="group p-8 rounded-lg border bg-card/50 backdrop-blur-sm hover:bg-card transition-all hover:shadow-lg">
            <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <ScrollText className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 font-heading">10,552 Verses</h3>
            <p className="text-muted-foreground leading-relaxed">
              Access the complete collection of sacred hymns organized across 10 Mandalas, 
              each containing profound spiritual wisdom and cosmic knowledge.
            </p>
          </div>

          <div className="group p-8 rounded-lg border bg-card/50 backdrop-blur-sm hover:bg-card transition-all hover:shadow-lg">
            <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
              <Flame className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3 font-heading">Multiple Translations</h3>
            <p className="text-muted-foreground leading-relaxed">
              Read verses in original Sanskrit with precise transliterations and 
              authoritative translations to understand the true essence of each hymn.
            </p>
          </div>

          <div className="group p-8 rounded-lg border bg-card/50 backdrop-blur-sm hover:bg-card transition-all hover:shadow-lg">
            <div className="w-14 h-14 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
              <Sparkles className="w-7 h-7 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 font-heading">AI-Powered Insights</h3>
            <p className="text-muted-foreground leading-relaxed">
              Generate detailed explanations, historical context, and spiritual interpretations 
              using advanced AI to deepen your understanding.
            </p>
          </div>
        </div>

        {/* Sample Preview Section */}
        <div className="max-w-4xl mx-auto mt-20 p-8 md:p-12 rounded-lg border bg-card/50 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 font-heading">Experience Divine Poetry</h2>
            <p className="text-muted-foreground">Sample verse from the Agni Sukta</p>
          </div>
          
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-background/50 backdrop-blur-sm border">
              <p className="text-sm text-muted-foreground mb-2 font-medium">Sanskrit (Devanagari)</p>
              <p className="text-xl md:text-2xl font-devanagari leading-relaxed">
                अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम् ।<br />
                होतारं रत्नधातमम् ॥
              </p>
            </div>

            <div className="p-6 rounded-lg bg-background/50 backdrop-blur-sm border">
              <p className="text-sm text-muted-foreground mb-2 font-medium">Translation</p>
              <p className="text-lg leading-relaxed italic">
                "I praise Agni, the chosen priest, god, minister of sacrifice,
                The invoker, lavishest of wealth."
              </p>
            </div>

            <div className="text-center pt-4">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setShowExplorer(true)}
              >
                Discover More Verses
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}