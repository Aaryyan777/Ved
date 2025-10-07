"use client"

import { useState } from "react"
import { DecorativePattern } from "@/components/mystical/decorative-pattern"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Search, Info } from "lucide-react"

const metreDatabase = {
  gayatri: {
    name: "Gāyatrī",
    syllables: 8,
    pattern: "⏑−⏑−⏑−⏑−",
    description: "The most sacred metre, 8 syllables per pāda",
    occurrences: 2450,
    padas: 4,
    examples: [
      { verse: "RV 1.1.1", text: "अग्निमीळे पुरोहितम्" },
      { verse: "RV 3.62.10", text: "तत्सवितुर्वरेण्यम्" }
    ],
    substitutions: [
      "Occasionally allows anuṣṭubh variation",
      "Caesura typically after 4th syllable"
    ]
  },
  tristubh: {
    name: "Triṣṭubh",
    syllables: 11,
    pattern: "⏑−⏑−−⏑⏑−⏑−−",
    description: "Heroic metre, 11 syllables per pāda",
    occurrences: 4253,
    padas: 4,
    examples: [
      { verse: "RV 10.129.1", text: "नासदासीन्नो सदासीत्तदानीम्" },
      { verse: "RV 1.164.46", text: "इन्द्रं मित्रं वरुणमग्निमाहुः" }
    ],
    substitutions: [
      "Final pāda may vary with jagatī ending",
      "Caesura after 5th or 7th syllable"
    ]
  },
  jagati: {
    name: "Jagatī",
    syllables: 12,
    pattern: "⏑−⏑−−⏑⏑−⏑−−⏑",
    description: "Flowing metre, 12 syllables per pāda",
    occurrences: 1350,
    padas: 4,
    examples: [
      { verse: "RV 1.32.1", text: "इन्द्रस्य नु वीर्याणि प्र वोचम्" }
    ],
    substitutions: [
      "Often interchanges with triṣṭubh",
      "Additional syllable adds grandeur"
    ]
  },
  anustubh: {
    name: "Anuṣṭubh",
    syllables: 8,
    pattern: "⏑−⏑−−⏑⏑−",
    description: "Popular narrative metre",
    occurrences: 855,
    padas: 4,
    examples: [
      { verse: "Various epic verses" }
    ],
    substitutions: [
      "More flexible than gāyatrī",
      "Common in later Sanskrit literature"
    ]
  }
}

export default function MetreInspectorPage() {
  const [selectedMetre, setSelectedMetre] = useState<keyof typeof metreDatabase>("gayatri")

  const metre = metreDatabase[selectedMetre]

  return (
    <div className="min-h-screen bg-background relative">
      <DecorativePattern />
      
      <div className="container mx-auto px-4 py-8 max-w-5xl relative z-10">
        <Link href="/features">
          <Button variant="ghost" className="gap-2 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Features
          </Button>
        </Link>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Search className="h-10 w-10 text-primary animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold">Metre Inspector</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore syllable counts, patterns, and Rigvedic occurrences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Metre selection */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Select Metre</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(metreDatabase).map(([key, m]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedMetre(key as keyof typeof metreDatabase)}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                      selectedMetre === key
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="font-bold">{m.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {m.syllables} syllables • {m.occurrences} occurrences
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Metre details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl mb-2">{metre.name}</CardTitle>
                    <CardDescription className="text-base">{metre.description}</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    {metre.syllables} syllables
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Pattern */}
                <div className="mb-6 p-6 rounded-xl bg-gradient-to-br from-card to-primary/5 border-2 border-primary/20">
                  <div className="text-sm text-muted-foreground mb-2">Metrical Pattern</div>
                  <div className="text-4xl font-mono mb-2 text-center">{metre.pattern}</div>
                  <div className="text-sm text-center text-muted-foreground">
                    ⏑ = short (laghu) • − = long (guru)
                  </div>
                </div>

                {/* Structure info */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-muted/30">
                    <div className="text-sm text-muted-foreground mb-1">Pādas per Verse</div>
                    <div className="text-2xl font-bold">{metre.padas}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30">
                    <div className="text-sm text-muted-foreground mb-1">Rigvedic Occurrences</div>
                    <div className="text-2xl font-bold text-primary">{metre.occurrences}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Examples */}
            <Card>
              <CardHeader>
                <CardTitle>Examples from Rigveda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {metre.examples.map((example, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-muted/30 border border-border">
                    <div className="text-sm font-semibold text-primary mb-2">{example.verse}</div>
                    {example.text && (
                      <div className="font-devanagari text-lg">{example.text}</div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Substitutions & variations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Common Substitutions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {metre.substitutions.map((sub, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{sub}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Syllable breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Syllable Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 justify-center">
                  {metre.pattern.split('').filter(c => c !== ' ').map((symbol, idx) => (
                    <div
                      key={idx}
                      className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 ${
                        symbol === '⏑' 
                          ? 'bg-accent/10 border-accent/30 text-accent' 
                          : 'bg-primary/10 border-primary/30 text-primary'
                      }`}
                    >
                      <span className="text-2xl">{symbol}</span>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-4 text-sm text-muted-foreground">
                  Total: {metre.pattern.replace(/\s/g, '').length} syllable positions
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}