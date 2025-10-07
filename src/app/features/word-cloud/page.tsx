"use client"

import { useState, useMemo } from "react"
import { DecorativePattern } from "@/components/mystical/decorative-pattern"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowLeft, Cloud, Search, Filter } from "lucide-react"

// Simulated word frequency data from Rigveda
const wordData = [
  { word: "agni", freq: 1500, category: "deity", root: "√ag" },
  { word: "indra", freq: 2500, category: "deity", root: "√ind" },
  { word: "soma", freq: 1200, category: "deity", root: "√su" },
  { word: "deva", freq: 2000, category: "deity", root: "√div" },
  { word: "yajña", freq: 800, category: "ritual", root: "√yaj" },
  { word: "havana", freq: 600, category: "ritual", root: "√hū" },
  { word: "stoma", freq: 550, category: "ritual", root: "√stu" },
  { word: "sūrya", freq: 400, category: "nature", root: "√svar" },
  { word: "uṣas", freq: 300, category: "nature", root: "√vas" },
  { word: "ap", freq: 700, category: "nature", root: "√āp" },
  { word: "varuṇa", freq: 350, category: "deity", root: "√vr̥" },
  { word: "mitra", freq: 300, category: "deity", root: "√mi" },
  { word: "vāyu", freq: 200, category: "deity", root: "√vā" },
  { word: "prajāpati", freq: 180, category: "deity", root: "√jan" },
  { word: "brahman", freq: 500, category: "ritual", root: "√br̥h" },
  { word: "mantra", freq: 450, category: "ritual", root: "√man" },
  { word: "homa", freq: 380, category: "ritual", root: "√hu" },
  { word: "dyāvā-pr̥thivī", freq: 250, category: "nature", root: "√div" },
  { word: "marut", freq: 320, category: "deity", root: "√mr̥" },
  { word: "viśva", freq: 900, category: "abstract", root: "√viś" },
  { word: "r̥ta", freq: 750, category: "abstract", root: "√r̥" },
  { word: "satya", freq: 420, category: "abstract", root: "√as" },
  { word: "śakti", freq: 380, category: "abstract", root: "√śak" },
  { word: "tejas", freq: 290, category: "abstract", root: "√tij" },
]

const categoryColors: Record<string, string> = {
  deity: "from-orange-500 to-red-600",
  ritual: "from-purple-500 to-pink-600",
  nature: "from-green-500 to-emerald-600",
  abstract: "from-blue-500 to-indigo-600"
}

export default function WordCloudPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedWord, setSelectedWord] = useState<typeof wordData[0] | null>(null)

  const filteredWords = useMemo(() => {
    return wordData
      .filter(w => {
        const matchesSearch = w.word.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = !selectedCategory || w.category === selectedCategory
        return matchesSearch && matchesCategory
      })
      .sort((a, b) => b.freq - a.freq)
  }, [searchTerm, selectedCategory])

  const maxFreq = Math.max(...wordData.map(w => w.freq))
  const minFreq = Math.min(...wordData.map(w => w.freq))

  const getFontSize = (freq: number) => {
    const normalized = (freq - minFreq) / (maxFreq - minFreq)
    return 12 + normalized * 48
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <DecorativePattern />
      
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        <Link href="/features">
          <Button variant="ghost" className="gap-2 mb-6 hover:bg-primary/10">
            <ArrowLeft className="w-4 h-4" />
            Back to Features
          </Button>
        </Link>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Cloud className="h-10 w-10 text-primary animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Sanskrit Word Cloud
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore word frequency • Click to see details • Filter by category
          </p>
        </div>

        {/* Controls */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card className="border-2 shadow-xl">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search Sanskrit words..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-xl">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={!selectedCategory ? "default" : "outline"}
                    onClick={() => setSelectedCategory(null)}
                  >
                    All
                  </Button>
                  {["deity", "ritual", "nature", "abstract"].map(cat => (
                    <Button
                      key={cat}
                      size="sm"
                      variant={selectedCategory === cat ? "default" : "outline"}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Word Cloud */}
          <div className="lg:col-span-2">
            <Card className="border-2 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-primary" />
                  Word Frequency Visualization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative min-h-[500px] flex flex-wrap items-center justify-center gap-4 p-8 bg-gradient-to-br from-muted/30 via-background to-primary/10 rounded-xl border-2 border-border/50">
                  {filteredWords.map((word, idx) => {
                    const fontSize = getFontSize(word.freq)
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedWord(word)}
                        className={`font-devanagari font-bold transition-all hover:scale-110 ${
                          selectedWord?.word === word.word ? 'scale-125' : ''
                        }`}
                        style={{
                          fontSize: `${fontSize}px`,
                          background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}
                      >
                        <span className={`bg-gradient-to-r ${categoryColors[word.category]} bg-clip-text`}>
                          {word.word}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Word Details */}
          <div>
            <Card className="border-2 shadow-xl sticky top-8">
              <CardHeader className="bg-gradient-to-br from-primary/5 to-accent/5">
                <CardTitle>{selectedWord ? "Word Details" : "Select a Word"}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {selectedWord ? (
                  <div className="space-y-4">
                    <div className="text-center py-4">
                      <h3 className="text-4xl font-bold font-devanagari mb-3">{selectedWord.word}</h3>
                      <Badge className={`bg-gradient-to-r ${categoryColors[selectedWord.category]}`}>
                        {selectedWord.category}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="p-4 rounded-xl bg-muted/30 border border-border">
                        <div className="text-xs text-muted-foreground mb-1">Frequency</div>
                        <div className="text-2xl font-bold text-primary">{selectedWord.freq}</div>
                        <div className="text-xs text-muted-foreground">occurrences</div>
                      </div>

                      <div className="p-4 rounded-xl bg-muted/30 border border-border">
                        <div className="text-xs text-muted-foreground mb-1">Root</div>
                        <div className="text-xl font-semibold">{selectedWord.root}</div>
                      </div>

                      <div className="p-4 rounded-xl bg-primary/5 border-2 border-primary/20">
                        <div className="text-xs text-muted-foreground mb-2">Context</div>
                        <p className="text-sm leading-relaxed">
                          The word <span className="font-semibold">{selectedWord.word}</span> appears 
                          {" "}{selectedWord.freq} times in the Rigveda, making it one of the {
                            selectedWord.freq > 1000 ? "most frequent" : 
                            selectedWord.freq > 500 ? "commonly used" : "significant"
                          } terms in the {selectedWord.category} category.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Cloud className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-sm">Click any word in the cloud to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <Card className="mt-6 border-2 shadow-xl">
          <CardHeader>
            <CardTitle>Category Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              {["deity", "ritual", "nature", "abstract"].map(cat => {
                const count = wordData.filter(w => w.category === cat).length
                const totalFreq = wordData.filter(w => w.category === cat).reduce((sum, w) => sum + w.freq, 0)
                
                return (
                  <div key={cat} className={`p-6 rounded-xl bg-gradient-to-br ${categoryColors[cat]} bg-opacity-10 border-2`} style={{borderColor: `var(--${cat})`}}>
                    <div className="text-2xl font-bold mb-1">{count}</div>
                    <div className="text-sm text-muted-foreground capitalize mb-2">{cat} words</div>
                    <div className="text-xs text-muted-foreground">{totalFreq.toLocaleString()} total occurrences</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}