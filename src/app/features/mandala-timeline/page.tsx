"use client"

import { useState } from "react"
import { DecorativePattern } from "@/components/mystical/decorative-pattern"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, BookOpen, TrendingUp } from "lucide-react"

const mandalaData = [
  {
    mandala: 2,
    period: "1500-1400 BCE",
    layer: "Family Books (Early)",
    characteristics: "Conservative language, family-specific styles",
    mainDeities: ["Agni", "Indra", "Soma"],
    linguisticFeatures: "Archaic verb forms, complex syntax",
    hymnCount: 43,
    themes: ["Fire ritual", "Soma offering", "Warrior ethos"]
  },
  {
    mandala: 3,
    period: "1500-1400 BCE",
    layer: "Family Books (Early)",
    characteristics: "Viśvāmitra compositions, Gāyatrī mantra",
    mainDeities: ["Agni", "Indra", "Viśvedevas"],
    linguisticFeatures: "Rich metaphors, royal imagery",
    hymnCount: 62,
    themes: ["Royal patronage", "River dialogues", "Divine favor"]
  },
  {
    mandala: 7,
    period: "1400-1300 BCE",
    layer: "Family Books (Middle)",
    characteristics: "Vasiṣṭha family, Battle of Ten Kings",
    mainDeities: ["Agni", "Indra", "Varuṇa"],
    linguisticFeatures: "Historical narratives emerging",
    hymnCount: 104,
    themes: ["Political alliances", "Tribal conflicts", "Divine justice"]
  },
  {
    mandala: 1,
    period: "1300-1200 BCE",
    layer: "Later Compilation",
    characteristics: "Encyclopedic, diverse authors",
    mainDeities: ["Agni", "Indra", "Various"],
    linguisticFeatures: "Standardized forms, editorial arrangement",
    hymnCount: 191,
    themes: ["Comprehensive liturgy", "Ritual completeness", "Theological synthesis"]
  },
  {
    mandala: 10,
    period: "1200-1100 BCE",
    layer: "Latest Addition",
    characteristics: "Philosophical speculation, cosmogony",
    mainDeities: ["Various", "Abstract concepts"],
    linguisticFeatures: "Philosophical vocabulary, speculation",
    hymnCount: 191,
    themes: ["Creation myths", "Death & afterlife", "Social organization"]
  }
]

export default function MandalaTimelinePage() {
  const [selectedMandala, setSelectedMandala] = useState(mandalaData[0])

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <DecorativePattern />
      
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 py-4 max-w-7xl relative z-10">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Clock className="h-10 w-10 text-primary animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Maṇḍala Evolution Timeline
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Chronological layers • Linguistic evolution • Thematic development across 400 years
          </p>
        </div>

        {/* Redesigned Historical Stratification */}
        <Card className="border-2 shadow-xl mb-8">
          <CardHeader>
            <CardTitle>Historical Stratification (1500-1100 BCE)</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {mandalaData.map((m, idx) => (
                <button
                  key={m.mandala}
                  onClick={() => setSelectedMandala(m)}
                  className={`w-full text-left transition-all ${
                    selectedMandala.mandala === m.mandala ? 'scale-[1.02]' : ''
                  }`}
                >
                  <div className={`relative p-6 rounded-xl border-2 ${
                    selectedMandala.mandala === m.mandala
                      ? 'border-primary bg-gradient-to-r from-primary/10 to-accent/10 shadow-lg'
                      : 'border-border hover:border-primary/50 bg-card'
                  }`}>
                    {/* Timeline connector */}
                    {idx < mandalaData.length - 1 && (
                      <div className="absolute left-12 bottom-0 w-0.5 h-6 bg-gradient-to-b from-primary/50 to-transparent translate-y-full" />
                    )}
                    
                    <div className="flex items-start gap-6">
                      {/* Era Badge */}
                      <div className={`flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl shadow-xl ${
                        selectedMandala.mandala === m.mandala
                          ? 'bg-gradient-to-br from-primary to-accent text-white'
                          : 'bg-muted text-foreground'
                      }`}>
                        M{m.mandala}
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <div className="text-xl font-bold">Maṇḍala {m.mandala}</div>
                            <div className="text-sm text-muted-foreground">{m.period}</div>
                          </div>
                          <Badge className="bg-gradient-to-r from-primary to-accent">
                            {m.layer}
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="p-3 rounded-lg bg-muted/30">
                            <div className="text-xs font-semibold text-muted-foreground mb-1">Characteristics</div>
                            <div className="text-sm">{m.characteristics}</div>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/30">
                            <div className="text-xs font-semibold text-muted-foreground mb-1">Linguistic Features</div>
                            <div className="text-sm">{m.linguisticFeatures}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-primary" />
                            <span className="font-semibold">{m.hymnCount} hymns</span>
                          </div>
                          <div className="flex gap-2">
                            {m.mainDeities.map((deity, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{deity}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Details Panel */}
        <Card className="border-2 shadow-xl">
          <CardHeader className="bg-gradient-to-br from-primary/10 to-accent/10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl mb-2">Maṇḍala {selectedMandala.mandala}</CardTitle>
                <Badge className="bg-gradient-to-r from-primary to-accent">
                  {selectedMandala.layer}
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Period</div>
                <div className="font-semibold">{selectedMandala.period}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="p-4 rounded-xl bg-muted/30 border border-border">
              <div className="font-semibold mb-2">Characteristics</div>
              <p className="text-sm text-muted-foreground">{selectedMandala.characteristics}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-primary/5 border-2 border-primary/20">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Main Deities</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedMandala.mainDeities.map((deity, idx) => (
                    <Badge key={idx} variant="secondary">{deity}</Badge>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-accent/5 border-2 border-accent/20">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  <span className="font-semibold">Linguistic Features</span>
                </div>
                <p className="text-sm text-muted-foreground">{selectedMandala.linguisticFeatures}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-secondary/5 border-2 border-secondary/20">
              <div className="font-semibold mb-3">Major Themes</div>
              <ul className="space-y-2">
                {selectedMandala.themes.map((theme, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-secondary">•</span>
                    <span>{theme}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t">
              <div className="text-sm text-muted-foreground leading-relaxed">
                Contains <strong>{selectedMandala.hymnCount} hymns</strong> representing 
                the {selectedMandala.layer.toLowerCase()} of Rigvedic composition. 
                Scholarly dating based on linguistic analysis (Witzel 1995), internal chronology 
                (Talageri 2000), and comparative Indo-European philology.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Citations */}
        <Card className="mt-6 border-2 shadow-xl">
          <CardHeader>
            <CardTitle>Academic References</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Timeline based on: Witzel, Michael (1995) "Early Sanskritization" • 
              Talageri, Shrikant (2000) "The Rigveda: A Historical Analysis" • 
              Jamison & Brereton (2014) "The Rigveda: The Earliest Religious Poetry of India" • 
              Oldenberg, Hermann (1888) "Metrische und textgeschichtliche Prolegomena"
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}