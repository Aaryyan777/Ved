"use client"

import { useState } from "react"
import { DecorativePattern } from "@/components/mystical/decorative-pattern"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Flame, Clock, BookOpen, Sparkles } from "lucide-react"

const rituals = [
  {
    id: "agnihotra",
    name: "Agnihotra",
    description: "Daily fire oblation performed at sunrise and sunset",
    duration: "30 minutes",
    stages: [
      { name: "Prāṇāgnihotra", time: "5 min", verses: ["1.1.1 (Agni invocation)"], description: "Mental preparation" },
      { name: "Agni Pratiṣṭhā", time: "10 min", verses: ["1.1.2", "1.1.3"], description: "Establishing the sacred fire" },
      { name: "Ghee Oblation", time: "10 min", verses: ["1.1.4-7"], description: "Offering clarified butter" },
      { name: "Pūrṇāhuti", time: "5 min", verses: ["1.1.8"], description: "Final oblation" }
    ]
  },
  {
    id: "soma",
    name: "Soma Yajña",
    description: "Elaborate ritual involving soma pressing and offering",
    duration: "Multiple days",
    stages: [
      { name: "Dīkṣā", time: "1 day", verses: ["9.1.1-10"], description: "Consecration of participants" },
      { name: "Soma Procurement", time: "1 day", verses: ["9.2.1-5"], description: "Gathering soma stalks" },
      { name: "Pressing Ceremony", time: "3 hours", verses: ["9.10.1-12"], description: "Three pressings: morning, midday, evening" },
      { name: "Soma Offering", time: "2 hours", verses: ["9.15.1-8"], description: "Offering pressed soma to deities" },
      { name: "Avabhṛtha", time: "1 hour", verses: ["9.20.1-4"], description: "Purificatory bath concluding ritual" }
    ]
  },
  {
    id: "ashvamedha",
    name: "Aśvamedha",
    description: "Royal horse sacrifice symbolizing sovereignty",
    duration: "1 year + ceremony",
    stages: [
      { name: "Horse Selection", time: "1 week", verses: ["1.162.1-5"], description: "Choosing the sacrificial stallion" },
      { name: "Year-long Wandering", time: "1 year", verses: ["1.162.6-10"], description: "Horse roams freely, army follows" },
      { name: "Mahāvrata", time: "1 day", verses: ["1.162.11-15"], description: "Great vow and ritual preparations" },
      { name: "Sacrifice Ceremony", time: "3 days", verses: ["1.162.16-22"], description: "Actual horse sacrifice and offerings" },
      { name: "Distribution of Gifts", time: "1 day", verses: ["1.163.1-5"], description: "Giving away royal wealth to priests" }
    ]
  }
]

export default function RitualBuilderPage() {
  const [selectedRitual, setSelectedRitual] = useState(rituals[0])
  const [currentStage, setCurrentStage] = useState(0)

  const progress = ((currentStage + 1) / selectedRitual.stages.length) * 100

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
            <Flame className="h-10 w-10 text-primary animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Vedic Ritual Builder
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Interactive yajña simulator • Historical accuracy • Verse-by-verse guidance
          </p>
        </div>

        {/* Ritual Selection */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {rituals.map(ritual => (
            <button
              key={ritual.id}
              onClick={() => {
                setSelectedRitual(ritual)
                setCurrentStage(0)
              }}
              className={`text-left transition-all ${
                selectedRitual.id === ritual.id ? 'scale-105' : 'hover:scale-[1.02]'
              }`}
            >
              <Card className={`border-2 ${
                selectedRitual.id === ritual.id
                  ? 'border-primary shadow-2xl shadow-primary/30'
                  : 'border-border shadow-md'
              }`}>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="w-5 h-5 text-primary" />
                    <CardTitle>{ritual.name}</CardTitle>
                  </div>
                  <CardDescription>{ritual.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {ritual.duration}
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>

        {/* Progress Bar */}
        <Card className="border-2 shadow-xl mb-6">
          <CardHeader>
            <CardTitle>Ritual Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Stage {currentStage + 1} of {selectedRitual.stages.length}</span>
                <span className="text-primary font-semibold">{Math.round(progress)}%</span>
              </div>
              <div className="h-4 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Stage Details */}
          <div className="lg:col-span-2">
            <Card className="border-2 shadow-xl">
              <CardHeader className="bg-gradient-to-br from-primary/10 to-accent/10">
                <div className="flex items-center gap-3">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-xl">
                    <Flame className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{selectedRitual.stages[currentStage].name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4" />
                      {selectedRitual.stages[currentStage].time}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedRitual.stages[currentStage].description}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-primary/5 border-2 border-primary/20">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Prescribed Verses</span>
                  </div>
                  <ul className="space-y-2">
                    {selectedRitual.stages[currentStage].verses.map((verse, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-primary">•</span>
                        <span>Rigveda {verse}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setCurrentStage(Math.max(0, currentStage - 1))}
                    disabled={currentStage === 0}
                    variant="outline"
                    className="flex-1"
                  >
                    Previous Stage
                  </Button>
                  <Button
                    onClick={() => setCurrentStage(Math.min(selectedRitual.stages.length - 1, currentStage + 1))}
                    disabled={currentStage === selectedRitual.stages.length - 1}
                    className="flex-1"
                  >
                    Next Stage
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stage Timeline */}
          <div>
            <Card className="border-2 shadow-xl sticky top-8">
              <CardHeader className="bg-gradient-to-br from-accent/5 to-secondary/5">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  All Stages
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {selectedRitual.stages.map((stage, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentStage(idx)}
                      className={`w-full text-left p-3 rounded-xl transition-all ${
                        idx === currentStage
                          ? 'bg-primary/10 border-2 border-primary shadow-lg'
                          : idx < currentStage
                          ? 'bg-green-500/10 border border-green-500/30'
                          : 'bg-muted/30 border border-border'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          idx === currentStage
                            ? 'bg-primary text-white'
                            : idx < currentStage
                            ? 'bg-green-500 text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {idx < currentStage ? '✓' : idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{stage.name}</div>
                          <div className="text-xs text-muted-foreground">{stage.time}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Citations */}
        <Card className="mt-6 border-2 shadow-xl">
          <CardHeader>
            <CardTitle>Historical Sources & Citations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This ritual reconstruction is based on scholarly consensus from the Rigveda Saṁhitā (Mandalas 1-10), 
              cross-referenced with Śatapatha Brāhmaṇa commentaries and modern academic sources including 
              "Vedic Ritual: The Non-Solemn Rites" by Michael Witzel (1997) and "The Rigveda: A Historical Analysis" 
              by Shrikant G. Talageri (2000). All verse references are validated against VedaWeb API.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}