"use client"

import { useState } from "react"
import { DecorativePattern } from "@/components/mystical/decorative-pattern"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, User, MapPin, Users, Scroll, Sparkles } from "lucide-react"

const rishiData = [
  {
    id: "visvamitra",
    name: "Viśvāmitra",
    family: "Kauśika",
    region: "Sapta Sindhu (Punjab)",
    mandalas: [3],
    hymnCount: 45,
    style: "Martial, Royal imagery",
    color: "from-emerald-500 to-green-600",
    description: "A kṣatriya turned brāhmaṇa, known for the famous Gāyatrī mantra (RV 3.62.10)",
    famousHymns: ["3.62 (Gāyatrī Mantra)", "3.33 (Viśvāmitra's dialogue with rivers)"],
    timeline: "Early Rigvedic period (1500-1300 BCE)"
  },
  {
    id: "vasistha",
    name: "Vasiṣṭha",
    family: "Vāsiṣṭha",
    region: "Sapta Sindhu",
    mandalas: [7],
    hymnCount: 89,
    style: "Devotional, Fire imagery",
    color: "from-teal-500 to-cyan-600",
    description: "Royal priest of the Bharata king Sudās, rival of Viśvāmitra",
    famousHymns: ["7.86 (Varuṇa hymn)", "7.33 (Battle of Ten Kings)"],
    timeline: "Early Rigvedic period (1500-1300 BCE)"
  },
  {
    id: "atri",
    name: "Atri",
    family: "Ātreya",
    region: "Northern India",
    mandalas: [5],
    hymnCount: 67,
    style: "Solar, Dawn imagery",
    color: "from-yellow-500 to-amber-600",
    description: "Ancestor of the Ātreya clan, renowned for hymns to Agni and Sūrya",
    famousHymns: ["5.1 (Agni)", "5.2 (Agni Vaiśvānara)"],
    timeline: "Early Rigvedic period (1500-1300 BCE)"
  },
  {
    id: "bharadvaja",
    name: "Bharadvāja",
    family: "Bhāradvāja",
    region: "Sarasvati region",
    mandalas: [6],
    hymnCount: 54,
    style: "Agni-focused, Ritual",
    color: "from-orange-500 to-red-600",
    description: "Priest family known for Agni worship and elaborate sacrificial rituals",
    famousHymns: ["6.16 (Agni)", "6.9 (Indra)"],
    timeline: "Early Rigvedic period (1500-1300 BCE)"
  },
  {
    id: "kanva",
    name: "Kāṇva",
    family: "Āṅgirasa",
    region: "Central Sapta Sindhu",
    mandalas: [8],
    hymnCount: 92,
    style: "Soma-centric, Mystical",
    color: "from-blue-400 to-indigo-500",
    description: "Descendants of Aṅgiras, masters of Soma rituals and cosmic symbolism",
    famousHymns: ["8.48 (Soma)", "8.1 (Indra)"],
    timeline: "Mid Rigvedic period (1300-1100 BCE)"
  },
  {
    id: "gritsamada",
    name: "Gr̥tsamada",
    family: "Bhārgava-Śaunahotra",
    region: "Sarasvati basin",
    mandalas: [2],
    hymnCount: 43,
    style: "Philosophical, Mystical",
    color: "from-purple-500 to-pink-600",
    description: "Known for profound metaphysical hymns and cosmological speculations",
    famousHymns: ["2.12 (Indra praise)", "2.35 (Apāṃ Napāt)"],
    timeline: "Early Rigvedic period (1500-1300 BCE)"
  }
]

export default function RishiJourneyPage() {
  const [selectedRishi, setSelectedRishi] = useState(rishiData[0])

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
            <User className="h-10 w-10 text-primary animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              R̥ṣi Journey Map
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore the sages who composed the Rigveda • Family lineages • Regional origins • Stylistic signatures
          </p>
        </div>

        {/* Timeline */}
        <Card className="border-2 shadow-xl mb-8 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Rigvedic Timeline (1500-1100 BCE)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 right-0 top-1/2 h-1 bg-gradient-to-r from-primary via-accent to-secondary" />
              
              {/* R̥ṣi markers */}
              <div className="relative flex justify-between items-center py-8">
                {rishiData.map((rishi) => (
                  <button
                    key={rishi.id}
                    onClick={() => setSelectedRishi(rishi)}
                    className={`group relative transition-transform hover:scale-110 ${
                      selectedRishi.id === rishi.id ? 'scale-125' : ''
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${rishi.color} flex items-center justify-center shadow-lg ${
                      selectedRishi.id === rishi.id ? 'ring-4 ring-primary/50 animate-pulse' : ''
                    }`}>
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div className={`absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold transition-opacity ${
                      selectedRishi.id === rishi.id ? 'opacity-100' : 'opacity-60'
                    }`}>
                      {rishi.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* R̥ṣi Cards List */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">All R̥ṣis</h3>
            {rishiData.map((rishi) => (
              <button
                key={rishi.id}
                onClick={() => setSelectedRishi(rishi)}
                className={`w-full text-left transition-all ${
                  selectedRishi.id === rishi.id
                    ? 'scale-105'
                    : 'hover:scale-[1.02]'
                }`}
              >
                <Card className={`border-2 ${
                  selectedRishi.id === rishi.id
                    ? 'border-primary shadow-2xl shadow-primary/30'
                    : 'border-border shadow-md'
                }`}>
                  <CardHeader className={`bg-gradient-to-br ${rishi.color} bg-opacity-10`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${rishi.color}`}>
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{rishi.name}</CardTitle>
                        <CardDescription className="text-xs">{rishi.family}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Hymns:</span>
                      <Badge variant="secondary">{rishi.hymnCount}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>

          {/* Detailed View */}
          <div className="lg:col-span-2">
            <Card className="border-2 shadow-xl sticky top-8">
              <CardHeader className={`bg-gradient-to-br ${selectedRishi.color} bg-opacity-10`}>
                <div className="flex items-start gap-4">
                  <div className={`p-6 rounded-2xl bg-gradient-to-br ${selectedRishi.color} shadow-xl`}>
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-3xl mb-2">{selectedRishi.name}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={`bg-gradient-to-r ${selectedRishi.color}`}>
                        {selectedRishi.family}
                      </Badge>
                      <Badge variant="outline">{selectedRishi.hymnCount} hymns</Badge>
                      <Badge variant="secondary">Maṇḍala {selectedRishi.mandalas.join(", ")}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <p className="text-muted-foreground leading-relaxed">{selectedRishi.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold">Geographic Origin</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedRishi.region}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-accent" />
                      <span className="text-sm font-semibold">Stylistic Signature</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedRishi.style}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-primary/5 border-2 border-primary/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Scroll className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Famous Hymns</span>
                  </div>
                  <ul className="space-y-2">
                    {selectedRishi.famousHymns.map((hymn, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="text-sm">{hymn}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-accent/5 border-2 border-accent/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    <span className="font-semibold">Historical Period</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedRishi.timeline}</p>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">Family Lineage Context</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The {selectedRishi.family} family belonged to the {selectedRishi.name} lineage, 
                    which played a crucial role in preserving and transmitting Vedic knowledge across generations. 
                    Their compositional style and thematic preferences influenced later Vedic literature.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Statistics */}
        <Card className="mt-8 border-2 shadow-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              R̥ṣi Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                <div className="text-4xl font-bold text-primary mb-2">{rishiData.length}</div>
                <div className="text-sm text-muted-foreground">Major R̥ṣi Families</div>
              </div>
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20">
                <div className="text-4xl font-bold text-accent mb-2">
                  {rishiData.reduce((sum, r) => sum + r.hymnCount, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Hymns</div>
              </div>
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/20">
                <div className="text-4xl font-bold text-secondary mb-2">400+</div>
                <div className="text-sm text-muted-foreground">Years of Composition</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}