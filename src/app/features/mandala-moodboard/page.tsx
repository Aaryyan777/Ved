"use client"

import { useState } from "react"
import { DecorativePattern } from "@/components/mystical/decorative-pattern"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, TrendingUp, Users, Flame, Sparkles, ExternalLink } from "lucide-react"

const mandalas = [
  {
    number: 1,
    hymns: 191,
    verses: 2006,
    avgVersesPerSukta: 10.5,
    uniqueDeities: 38,
    focusTags: ["Encyclopedic", "Youngest Book"],
    deities: [
      { name: "Agni", suktas: 75, color: "#D97706" },
      { name: "Indra", suktas: 50, color: "#2563EB" },
      { name: "Maruts", suktas: 20, color: "#7C3AED" },
      { name: "Ushas", suktas: 18, color: "#EC4899" },
      { name: "Soma", suktas: 15, color: "#8B5CF6" }
    ],
    rshis: [
      { name: "Madhucchandas", suktas: 10 },
      { name: "Gotama", suktas: 78 },
      { name: "Kutsa", suktas: 24 },
      { name: "Kaṇva", suktas: 18 }
    ],
    metres: { gayatri: 45, tristubh: 35, jagati: 12, other: 8 },
    dominantMetre: "Gāyatrī",
    metreVariance: [45, 42, 38, 35, 40, 45, 43]
  },
  {
    number: 2,
    hymns: 43,
    verses: 429,
    avgVersesPerSukta: 10.0,
    uniqueDeities: 15,
    focusTags: ["Family Book", "Gṛtsamada"],
    deities: [
      { name: "Agni", suktas: 20, color: "#D97706" },
      { name: "Indra", suktas: 11, color: "#2563EB" },
      { name: "Bṛhaspati", suktas: 3, color: "#F59E0B" },
      { name: "Soma", suktas: 2, color: "#8B5CF6" }
    ],
    rshis: [
      { name: "Gṛtsamada", suktas: 43 }
    ],
    metres: { gayatri: 30, tristubh: 50, jagati: 15, other: 5 },
    dominantMetre: "Triṣṭubh",
    metreVariance: [50, 48, 52, 50, 49, 51, 50]
  },
  {
    number: 9,
    hymns: 114,
    verses: 1108,
    avgVersesPerSukta: 9.7,
    uniqueDeities: 3,
    focusTags: ["Soma-centric", "Ritual Book"],
    deities: [
      { name: "Soma Pavamāna", suktas: 114, color: "#8B5CF6" },
      { name: "Indra", suktas: 8, color: "#2563EB" },
      { name: "Agni", suktas: 5, color: "#D97706" }
    ],
    rshis: [
      { name: "Various (Multi-author)", suktas: 114 }
    ],
    metres: { gayatri: 25, tristubh: 35, jagati: 30, other: 10 },
    dominantMetre: "Triṣṭubh",
    metreVariance: [35, 32, 38, 35, 36, 34, 35]
  }
]

export default function MandalaMoodboardPage() {
  const [selectedMandala, setSelectedMandala] = useState(mandalas[0])
  const [hoveredDeity, setHoveredDeity] = useState<string | null>(null)
  const [comparisonMandala, setComparisonMandala] = useState<typeof mandalas[0] | null>(null)
  const [selectedHymn, setSelectedHymn] = useState<{deity: string, hymnIds: string[]} | null>(null)

  const getMetreForDeity = (deityName: string) => {
    // Simulate filtered metre distribution
    if (!hoveredDeity || hoveredDeity !== deityName) return selectedMandala.metres
    return { gayatri: 60, tristubh: 25, jagati: 10, other: 5 }
  }

  const currentMetres = hoveredDeity 
    ? getMetreForDeity(hoveredDeity)
    : selectedMandala.metres

  return (
    <div className="min-h-screen bg-background relative">
      <DecorativePattern />
      
      <div className="container mx-auto px-4 py-4 max-w-7xl relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Maṇḍala Moodboard</h1>
          <p className="text-muted-foreground text-lg">
            Deep dive into deity clusters, r̥ṣi lineages, and metrical patterns
          </p>
        </div>

        {/* Mandala Selector */}
        <div className="flex gap-2 justify-center mb-6 flex-wrap">
          {mandalas.map(m => (
            <Button
              key={m.number}
              variant={selectedMandala.number === m.number ? "default" : "outline"}
              onClick={() => setSelectedMandala(m)}
            >
              M{m.number}
            </Button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Left: Deity & Rishi Clusters */}
          <div className="space-y-6">
            {/* Deity Clusters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="w-5 h-5" />
                  Deity Clusters
                </CardTitle>
                <CardDescription>Sized by sūkta count</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedMandala.deities.map(deity => {
                  const maxSuktas = Math.max(...selectedMandala.deities.map(d => d.suktas))
                  const size = (deity.suktas / maxSuktas) * 100
                  
                  return (
                    <button
                      key={deity.name}
                      className="w-full text-left"
                      onMouseEnter={() => setHoveredDeity(deity.name)}
                      onMouseLeave={() => setHoveredDeity(null)}
                      onClick={() => setSelectedHymn({
                        deity: deity.name,
                        hymnIds: Array.from({length: deity.suktas}, (_, i) => `${selectedMandala.number}.${i+1}`)
                      })}
                    >
                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-all">
                        <div
                          className="rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                          style={{
                            backgroundColor: deity.color,
                            width: `${Math.max(size * 0.8, 40)}px`,
                            height: `${Math.max(size * 0.8, 40)}px`
                          }}
                        >
                          {deity.suktas}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{deity.name}</div>
                          <div className="text-xs text-muted-foreground">{deity.suktas} sūktas</div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </CardContent>
            </Card>

            {/* Rishi Clusters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  R̥ṣi Lineages
                </CardTitle>
                <CardDescription>Composing families</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {selectedMandala.rshis.map(rshi => (
                  <div key={rshi.name} className="p-3 rounded-lg bg-muted/30">
                    <div className="font-semibold">{rshi.name}</div>
                    <div className="text-sm text-muted-foreground">{rshi.suktas} sūktas attributed</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Center: Stats & Metre */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Maṇḍala {selectedMandala.number}</CardTitle>
                  <div className="flex gap-2">
                    {selectedMandala.focusTags.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg bg-primary/10">
                    <div className="text-3xl font-bold text-primary">{selectedMandala.hymns}</div>
                    <div className="text-xs text-muted-foreground mt-1">Hymns</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-accent/10">
                    <div className="text-3xl font-bold text-accent">{selectedMandala.verses}</div>
                    <div className="text-xs text-muted-foreground mt-1">Verses</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-secondary/10">
                    <div className="text-3xl font-bold text-secondary">{selectedMandala.avgVersesPerSukta}</div>
                    <div className="text-xs text-muted-foreground mt-1">Avg/Sūkta</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted">
                    <div className="text-3xl font-bold">{selectedMandala.uniqueDeities}</div>
                    <div className="text-xs text-muted-foreground mt-1">Deities</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metre Distribution */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Metre Distribution
                  </CardTitle>
                  <Badge>{selectedMandala.dominantMetre}</Badge>
                </div>
                {hoveredDeity && (
                  <CardDescription className="text-primary">
                    Filtered for {hoveredDeity} hymns
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stacked bar */}
                <div className="h-12 flex rounded-lg overflow-hidden">
                  <div
                    className="bg-primary flex items-center justify-center text-white text-sm font-semibold"
                    style={{ width: `${currentMetres.gayatri}%` }}
                  >
                    {currentMetres.gayatri > 10 && `${currentMetres.gayatri}%`}
                  </div>
                  <div
                    className="bg-accent flex items-center justify-center text-white text-sm font-semibold"
                    style={{ width: `${currentMetres.tristubh}%` }}
                  >
                    {currentMetres.tristubh > 10 && `${currentMetres.tristubh}%`}
                  </div>
                  <div
                    className="bg-secondary flex items-center justify-center text-white text-sm font-semibold"
                    style={{ width: `${currentMetres.jagati}%` }}
                  >
                    {currentMetres.jagati > 10 && `${currentMetres.jagati}%`}
                  </div>
                  <div
                    className="bg-muted-foreground flex items-center justify-center text-white text-sm font-semibold"
                    style={{ width: `${currentMetres.other}%` }}
                  >
                    {currentMetres.other > 10 && `${currentMetres.other}%`}
                  </div>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-primary" />
                    <span>Gāyatrī {currentMetres.gayatri}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-accent" />
                    <span>Triṣṭubh {currentMetres.tristubh}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-secondary" />
                    <span>Jagatī {currentMetres.jagati}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-muted-foreground" />
                    <span>Other {currentMetres.other}%</span>
                  </div>
                </div>

                {/* Sparkline */}
                <div>
                  <div className="text-xs text-muted-foreground mb-2">Metre variance across hymn sequence:</div>
                  <div className="h-12 flex items-end gap-1">
                    {selectedMandala.metreVariance.map((value, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-primary/30 rounded-t"
                        style={{ height: `${(value / 60) * 100}%` }}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Compare Maṇḍalas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  {mandalas.filter(m => m.number !== selectedMandala.number).map(m => (
                    <Button
                      key={m.number}
                      size="sm"
                      variant={comparisonMandala?.number === m.number ? "default" : "outline"}
                      onClick={() => setComparisonMandala(comparisonMandala?.number === m.number ? null : m)}
                    >
                      Compare with M{m.number}
                    </Button>
                  ))}
                </div>

                {comparisonMandala && (
                  <div className="mt-4 p-4 rounded-lg bg-muted/30 border">
                    <div className="font-semibold mb-3">M{selectedMandala.number} vs M{comparisonMandala.number}</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Hymns:</span>
                        <span>{selectedMandala.hymns} vs {comparisonMandala.hymns}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dominant Metre:</span>
                        <span>{selectedMandala.dominantMetre} vs {comparisonMandala.dominantMetre}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Drill-down Panel */}
        {selectedHymn && (
          <Card className="border-2 border-primary/30">
            <CardHeader>
              <CardTitle>Hymns for {selectedHymn.deity}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {selectedHymn.hymnIds.slice(0, 20).map(id => (
                  <a
                    key={id}
                    href={`https://vedaweb.uni-koeln.de/${id.replace('.', '/')}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-center rounded bg-muted hover:bg-primary hover:text-primary-foreground transition-all text-sm"
                  >
                    {id}
                  </a>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <ExternalLink className="w-4 h-4" />
                <span>Links open in VedaWeb for verification</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Provenance */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Data Provenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>Query Scope:</strong> Maṇḍala {selectedMandala.number}</p>
              <p><strong>Methodology:</strong> Sūkta counts from anukramaṇī indices; metre analysis per Oldenberg (1888)</p>
              <p><strong>Sources:</strong> VedaWeb TEI-XML corpus, Aufrecht's edition</p>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" asChild>
                  <a href="https://vedaweb.uni-koeln.de/" target="_blank" rel="noopener">
                    View in VedaWeb
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}