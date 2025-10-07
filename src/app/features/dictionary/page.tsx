"use client"

import { useState } from "react"
import { DecorativePattern } from "@/components/mystical/decorative-pattern"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Link2, ExternalLink, BookOpen, Search } from "lucide-react"

const sampleLemmas = [
  {
    word: "अग्नि",
    lemma: "agni",
    transliteration: "agni",
    meaning: "fire, god of fire",
    etymology: "From root ag 'to drive, lead'",
    cologneDictId: "agni"
  },
  {
    word: "देव",
    lemma: "deva",
    transliteration: "deva",
    meaning: "god, deity, divine",
    etymology: "From root div 'to shine, play'",
    cologneDictId: "deva"
  },
  {
    word: "सोम",
    lemma: "soma",
    transliteration: "soma",
    meaning: "soma plant/juice, moon",
    etymology: "From root su 'to press, extract'",
    cologneDictId: "soma"
  },
  {
    word: "इन्द्र",
    lemma: "indra",
    transliteration: "indra",
    meaning: "Indra, king of gods",
    etymology: "From root ind 'to be powerful'",
    cologneDictId: "indra"
  },
  {
    word: "यज्ञ",
    lemma: "yajña",
    transliteration: "yajña",
    meaning: "sacrifice, worship, offering",
    etymology: "From root yaj 'to worship, sacrifice'",
    cologneDictId: "yajJa"
  }
]

export default function DictionaryWalkthroughPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLemma, setSelectedLemma] = useState<typeof sampleLemmas[0] | null>(null)

  const filteredLemmas = searchTerm
    ? sampleLemmas.filter(l => 
        l.word.includes(searchTerm) || 
        l.transliteration.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : sampleLemmas

  const openCologne = (dictId: string) => {
    // Cologne Digital Sanskrit Dictionary URL
    const url = `https://www.sanskrit-lexicon.uni-koeln.de/scans/MWScan/2020/web/webtc/indexcaller.php?input=${dictId}&dir=mw`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="min-h-screen bg-background relative">
      <DecorativePattern />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        <Link href="/features">
          <Button variant="ghost" className="gap-2 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Features
          </Button>
        </Link>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-10 w-10 text-primary animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold">Dictionary Walkthrough</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tap lemmas to explore Cologne Digital Sanskrit Dictionary without losing your place
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Search and list */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Search Sanskrit Terms</CardTitle>
                <CardDescription>Find words from Rigveda verses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-10 font-devanagari"
                    placeholder="Search in Sanskrit or transliteration..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  {filteredLemmas.map((lemma, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedLemma(lemma)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:scale-102 ${
                        selectedLemma?.lemma === lemma.lemma
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl font-devanagari">{lemma.word}</span>
                            <Badge variant="secondary" className="text-xs">
                              {lemma.transliteration}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{lemma.meaning}</p>
                        </div>
                        <Link2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      </div>
                    </button>
                  ))}
                </div>

                {filteredLemmas.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No lemmas found matching "{searchTerm}"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Details panel */}
          <Card>
            <CardHeader>
              <CardTitle>Lemma Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedLemma ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-4xl font-devanagari mb-2">{selectedLemma.word}</div>
                    <Badge variant="outline" className="mb-4">
                      {selectedLemma.transliteration}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1 text-sm text-muted-foreground">Meaning</h4>
                    <p className="text-base">{selectedLemma.meaning}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1 text-sm text-muted-foreground">Etymology</h4>
                    <p className="text-sm">{selectedLemma.etymology}</p>
                  </div>

                  <Button
                    onClick={() => openCologne(selectedLemma.cologneDictId)}
                    className="w-full gap-2 mt-4"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open in Cologne Dictionary
                  </Button>

                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      Links to Monier-Williams Sanskrit-English Dictionary hosted by 
                      University of Cologne. Opens in new tab.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Link2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Select a lemma to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>About Dictionary Walkthrough</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Features</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Click any Sanskrit word to see etymology</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Direct links to authoritative dictionaries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Maintains scroll position when browsing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Search in both Devanagari and transliteration</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Dictionary Sources</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <ExternalLink className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Monier-Williams Sanskrit-English Dictionary</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ExternalLink className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Cologne Digital Sanskrit Dictionaries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ExternalLink className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>University of Cologne Sanskrit Portal</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}