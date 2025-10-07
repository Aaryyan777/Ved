"use client"

import { useState, useEffect } from "react"
import { DecorativePattern } from "@/components/mystical/decorative-pattern"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowLeft, GitCompare, Loader2, Sparkles, Network, BookOpen, Layers } from "lucide-react"

interface VerseData {
  mandala: number
  hymn: number
  verse: number
  sanskrit: string
  transliteration: string
  translations: {
    english: string
    author: string
  }
  deity?: string
  hymnAddressee?: string
  hymnGroup?: string
  stanzaType?: string
}

export default function VerseComparisonPage() {
  const [verse1, setVerse1] = useState({ mandala: "1", hymn: "1", verse: "1" })
  const [verse2, setVerse2] = useState({ mandala: "1", hymn: "1", verse: "2" })
  const [data1, setData1] = useState<VerseData | null>(null)
  const [data2, setData2] = useState<VerseData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchVerse = async (m: string, h: string, v: string): Promise<VerseData | null> => {
    try {
      const res = await fetch(`/api/rigveda/verse?mandala=${m}&hymn=${h}&verse=${v}`)
      const json = await res.json()
      if (json.success) {
        return json.data
      }
      return null
    } catch (err) {
      return null
    }
  }

  const handleCompare = async () => {
    setLoading(true)
    setError("")
    const [d1, d2] = await Promise.all([
      fetchVerse(verse1.mandala, verse1.hymn, verse1.verse),
      fetchVerse(verse2.mandala, verse2.hymn, verse2.verse)
    ])
    
    if (!d1 || !d2) {
      setError("Could not fetch one or both verses. Check coordinates.")
    } else {
      setData1(d1)
      setData2(d2)
    }
    setLoading(false)
  }

  useEffect(() => {
    handleCompare()
  }, [])

  // Analysis functions
  const findCommonWords = (text1: string, text2: string): string[] => {
    const words1 = text1.toLowerCase().split(/\s+/).filter(w => w.length > 3)
    const words2 = text2.toLowerCase().split(/\s+/).filter(w => w.length > 3)
    return words1.filter(w => words2.includes(w))
  }

  const analyzeMetrics = () => {
    if (!data1 || !data2) return null
    
    const commonWords = findCommonWords(data1.transliteration, data2.transliteration)
    const sameMeter = data1.meter === data2.meter
    const sameDeity = data1.deity === data2.deity
        const sameHymnGroup = data1.hymnGroup === data2.hymnGroup
        const sameMandala = Number(data1.mandala) === Number(data2.mandala)
    
    return {
      commonWords,
      sameMeter,
      sameDeity,
      sameHymnGroup,
      similarity: (
        (sameMeter ? 25 : 0) +
        (sameDeity ? 25 : 0) +
        (sameHymnGroup ? 15 : 0) +
        (sameMandala ? 10 : 0) +
        Math.min(commonWords.length * 5, 25)
      )
    }
  }

  const metrics = analyzeMetrics()

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
            <GitCompare className="h-10 w-10 text-primary animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Verse Comparison Matrix
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Compare verses side-by-side • Find common themes • Analyze metrical patterns
          </p>
        </div>

        {/* Verse Selectors */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 shadow-xl">
            <CardHeader className="bg-gradient-to-br from-primary/10 to-primary/5">
              <CardTitle>Verse 1</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Maṇḍala</label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={verse1.mandala}
                                        onChange={(e) => setVerse1({ ...verse1, mandala: parseInt(e.target.value) })}
                    className="text-center"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Hymn</label>
                  <Input
                    type="number"
                    min="1"
                    value={verse1.hymn}
                    onChange={(e) => setVerse1({ ...verse1, hymn: e.target.value })}
                    className="text-center"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Verse</label>
                  <Input
                    type="number"
                    min="1"
                    value={verse1.verse}
                    onChange={(e) => setVerse1({ ...verse1, verse: e.target.value })}
                    className="text-center"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-xl">
            <CardHeader className="bg-gradient-to-br from-accent/10 to-accent/5">
              <CardTitle>Verse 2</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Maṇḍala</label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={verse2.mandala}
                                        onChange={(e) => setVerse2({ ...verse2, mandala: parseInt(e.target.value) })}
                    className="text-center"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Hymn</label>
                  <Input
                    type="number"
                    min="1"
                    value={verse2.hymn}
                    onChange={(e) => setVerse2({ ...verse2, hymn: e.target.value })}
                    className="text-center"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Verse</label>
                  <Input
                    type="number"
                    min="1"
                    value={verse2.verse}
                    onChange={(e) => setVerse2({ ...verse2, verse: e.target.value })}
                    className="text-center"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center mb-8">
          <Button
            onClick={handleCompare}
            disabled={loading}
            size="lg"
            className="gap-2 shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <GitCompare className="w-5 h-5" />
                Compare Verses
              </>
            )}
          </Button>
        </div>

        {error && (
          <Card className="border-destructive bg-destructive/5 mb-8">
            <CardContent className="pt-6 text-center text-destructive">
              {error}
            </CardContent>
          </Card>
        )}

        {data1 && data2 && metrics && (
          <>
            {/* Similarity Score */}
            <Card className="border-2 shadow-xl mb-6 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Similarity Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Overall Similarity</span>
                      <span className="text-2xl font-bold text-primary">{metrics.similarity}%</span>
                    </div>
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
                        style={{ width: `${metrics.similarity}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className={`text-center p-2 rounded-lg border ${metrics.sameMeter ? 'bg-green-900/50 border-green-700/50 text-white' : 'bg-red-900/50 border-red-700/50 text-white'}`}>
                    <div className="text-xl mb-1">{metrics.sameMeter ? '✓' : '✗'}</div>
                    <div className="text-xs font-medium">Same Metre</div>
                  </div>
                  <div className={`text-center p-2 rounded-lg border ${metrics.sameDeity ? 'bg-green-900/50 border-green-700/50 text-white' : 'bg-red-900/50 border-red-700/50 text-white'}`}>
                    <div className="text-xl mb-1">{metrics.sameDeity ? '✓' : '✗'}</div>
                    <div className="text-xs font-medium">Same Deity</div>
                  </div>
                  <div className={`text-center p-2 rounded-lg border ${metrics.sameHymnGroup ? 'bg-green-900/50 border-green-700/50 text-white' : 'bg-red-900/50 border-red-700/50 text-white'}`}>
                    <div className="text-xl mb-1">{metrics.sameHymnGroup ? '✓' : '✗'}</div>
                    <div className="text-xs font-medium">Same Hymn Group</div>
                  </div>
                  <div className={`text-center p-2 rounded-lg border ${metrics.sameMandala ? 'bg-green-900/50 border-green-700/50 text-white' : 'bg-red-900/50 border-red-700/50 text-white'}`}>
                    <div className="text-xl mb-1">{metrics.sameMandala ? '✓' : '✗'}</div>
                    <div className="text-xs font-medium">Same Maṇḍala</div>
                  </div>
                  <div className="text-center p-2 rounded-lg border bg-green-900/50 border-green-700/50 text-white">
                    <div className="text-xl font-bold mb-1">{metrics.commonWords.length}</div>
                    <div className="text-xs font-medium">Common Words</div>
                  </div>
                </div>

                {metrics.commonWords.length > 0 && (
                  <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-border">
                    <div className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Network className="w-4 h-4 text-accent" />
                      Shared Vocabulary
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {metrics.commonWords.slice(0, 15).map((word, i) => (
                        <Badge key={i} variant="secondary" className="bg-accent/20 text-accent-foreground">
                          {word}
                        </Badge>
                      ))}
                      {metrics.commonWords.length > 15 && (
                        <Badge variant="outline">+{metrics.commonWords.length - 15} more</Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Side-by-Side Comparison */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Verse 1 */}
              <Card className="border-2 shadow-xl">
                <CardHeader className="bg-gradient-to-br from-primary/10 to-primary/5">
                  <CardTitle className="text-xl">
                    Rigveda {data1.mandala}.{data1.hymn}.{data1.verse}
                  </CardTitle>
                  <CardDescription className="flex flex-wrap gap-2 mt-2">
                    {data1.deity && <Badge variant="secondary">{data1.deity}</Badge>}

                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      Sanskrit
                    </div>
                                        <p className="font-devanagari text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: data1.sanskrit }} />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-2">Transliteration</div>
                                        <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: data1.transliteration }} />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-2">Translation</div>
                    <p className="text-sm leading-relaxed italic">{data1.translations.english}</p>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-2">Hymn Addressee</div>
                    <p className="text-sm leading-relaxed">{data1.hymnAddressee}</p>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-2">Hymn Group</div>
                    <p className="text-sm leading-relaxed">{data1.hymnGroup}</p>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-2">Stanza Type</div>
                    <p className="text-sm leading-relaxed">{data1.stanzaType}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Verse 2 */}
              <Card className="border-2 shadow-xl">
                <CardHeader className="bg-gradient-to-br from-accent/10 to-accent/5">
                  <CardTitle className="text-xl">
                    Rigveda {data2.mandala}.{data2.hymn}.{data2.verse}
                  </CardTitle>
                  <CardDescription className="flex flex-wrap gap-2 mt-2">
                    {data2.deity && <Badge variant="secondary">{data2.deity}</Badge>}

                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      Sanskrit
                    </div>
                                        <p className="font-devanagari text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: data2.sanskrit }} />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-2">Transliteration</div>
                                        <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: data2.transliteration }} />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-2">Translation</div>
                    <p className="text-sm leading-relaxed italic">{data2.translations.english}</p>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-2">Hymn Addressee</div>
                    <p className="text-sm leading-relaxed">{data2.hymnAddressee}</p>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-2">Hymn Group</div>
                    <p className="text-sm leading-relaxed">{data2.hymnGroup}</p>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-2">Stanza Type</div>
                    <p className="text-sm leading-relaxed">{data2.stanzaType}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  )
}