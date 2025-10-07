"use client"

import { useState } from "react"
import { DecorativePattern } from "@/components/mystical/decorative-pattern"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Zap, Search, Loader2 } from "lucide-react"
import { toast } from "sonner"

const hymnSummaries = {
  "1.1.1": {
    deity: "Agni",
    metre: "Gāyatrī",
    gist: "Invocation of Agni as the divine priest who bestows wealth and connects mortals to gods.",
    citation: "RV 1.1.1 - Agni Sukta by R̥ṣi Madhucchandas",
    theme: "Fire worship, divine mediation",
    keywords: ["Agni", "priest", "sacrifice", "wealth"]
  },
  "10.129.1": {
    deity: "Creation / Cosmic Mystery",
    metre: "Triṣṭubh",
    gist: "Profound cosmological speculation: neither being nor non-being existed before creation.",
    citation: "RV 10.129.1 - Nāsadīya Sukta (Creation Hymn)",
    theme: "Cosmogony, philosophical inquiry",
    keywords: ["creation", "existence", "mystery", "origin"]
  },
  "3.62.10": {
    deity: "Savit̥r (Sun)",
    metre: "Gāyatrī",
    gist: "The sacred Gāyatrī mantra requesting divine illumination and inspiration of intellect.",
    citation: "RV 3.62.10 - Gāyatrī Mantra by Viśvāmitra",
    theme: "Spiritual enlightenment, meditation",
    keywords: ["Savit̥r", "meditation", "light", "wisdom"]
  },
  "1.164.46": {
    deity: "Viśvedevāḥ (All Gods)",
    metre: "Triṣṭubh",
    gist: "Truth is one, though the wise speak of it in many ways - the famous 'Ekam Sat' verse.",
    citation: "RV 1.164.46 - Asya Vāmasya Sukta by Dīrghatamas",
    theme: "Unity of truth, religious tolerance",
    keywords: ["truth", "unity", "wisdom", "diversity"]
  }
}

export default function Theme30sPage() {
  const [searchInput, setSearchInput] = useState("")
  const [currentSummary, setCurrentSummary] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = () => {
    setIsLoading(true)
    
    setTimeout(() => {
      const summary = hymnSummaries[searchInput as keyof typeof hymnSummaries]
      
      if (summary) {
        setCurrentSummary({ ...summary, id: searchInput })
        toast.success("Summary generated!")
      } else {
        toast.error("Verse not found. Try: 1.1.1, 10.129.1, 3.62.10, or 1.164.46")
        setCurrentSummary(null)
      }
      
      setIsLoading(false)
    }, 800)
  }

  const quickAccess = [
    { id: "1.1.1", label: "Agni Hymn" },
    { id: "10.129.1", label: "Creation Hymn" },
    { id: "3.62.10", label: "Gāyatrī Mantra" },
    { id: "1.164.46", label: "Ekam Sat" }
  ]

  return (
    <div className="min-h-screen bg-background relative">
      <DecorativePattern />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <Link href="/features">
          <Button variant="ghost" className="gap-2 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Features
          </Button>
        </Link>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="h-10 w-10 text-primary animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold">Theme-in-30s</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get instant hymn summaries with deity, metre, and essence
          </p>
        </div>

        {/* Search interface */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Hymn</CardTitle>
            <CardDescription>Enter verse ID (e.g., 1.1.1 for Mandala.Hymn.Verse)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                placeholder="1.1.1"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="text-lg"
              />
              <Button onClick={handleSearch} size="lg" disabled={isLoading} className="gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Search
                  </>
                )}
              </Button>
            </div>

            {/* Quick access buttons */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-sm text-muted-foreground mr-2">Quick access:</span>
              {quickAccess.map((item) => (
                <Button
                  key={item.id}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchInput(item.id)
                    setTimeout(() => {
                      const summary = hymnSummaries[item.id as keyof typeof hymnSummaries]
                      setCurrentSummary({ ...summary, id: item.id })
                    }, 100)
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary display */}
        {currentSummary && (
          <Card className="border-2 border-primary/30 animate-in fade-in duration-500">
            <CardHeader className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">Summary</CardTitle>
                  <CardDescription className="text-base">{currentSummary.citation}</CardDescription>
                </div>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  {currentSummary.id}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Quick facts */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                  <div className="text-sm text-muted-foreground mb-1">Deity</div>
                  <div className="font-bold text-lg text-primary">{currentSummary.deity}</div>
                </div>
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                  <div className="text-sm text-muted-foreground mb-1">Metre</div>
                  <div className="font-bold text-lg text-accent">{currentSummary.metre}</div>
                </div>
              </div>

              {/* Gist */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-card to-secondary/5 border-2 border-border">
                <div className="text-sm font-semibold text-muted-foreground mb-2">Essence</div>
                <p className="text-lg leading-relaxed">{currentSummary.gist}</p>
              </div>

              {/* Theme */}
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-2">Theme</div>
                <p className="text-base">{currentSummary.theme}</p>
              </div>

              {/* Keywords */}
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-3">Keywords</div>
                <div className="flex flex-wrap gap-2">
                  {currentSummary.keywords.map((keyword: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="px-3 py-1">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Link href={`/?mandala=${currentSummary.id.split('.')[0]}&hymn=${currentSummary.id.split('.')[1]}&verse=${currentSummary.id.split('.')[2]}`}>
                  <Button variant="outline">Read Full Verse</Button>
                </Link>
                <Button variant="outline">Share Summary</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty state */}
        {!currentSummary && !isLoading && (
          <Card>
            <CardContent className="py-16 text-center">
              <Zap className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground text-lg mb-2">
                Enter a verse ID to get an instant summary
              </p>
              <p className="text-sm text-muted-foreground">
                Try one of the quick access buttons above
              </p>
            </CardContent>
          </Card>
        )}

        {/* Info */}
        <Card className="mt-6 border-accent/30">
          <CardHeader>
            <CardTitle className="text-accent">About This Feature</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Theme-in-30s provides instant, curated summaries of Rigveda hymns optimized for 
              quick understanding and value discovery.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Each summary includes deity, metre, and 2-line essence</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Proper citations ensure scholarly rigor</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Keywords help you discover related themes</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}