"use client"

import { useState } from "react"
import { DecorativePattern } from "@/components/mystical/decorative-pattern"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, HelpCircle, BarChart3, Sparkles } from "lucide-react"

const metreData = [
  {
    name: "Gāyatrī",
    syllables: "8-8-8 (24 total)",
    prevalence: 2467,
    percentage: 23.8,
    rhetorical: "Compact & Meditative",
    description: "The most sacred metre, perfect for concentrated invocations. Its three octets create a rhythmic triplet that enhances memorization and contemplative chanting.",
    usage: "Preferred for philosophical hymns and mantras requiring deep focus. The Gayatri mantra itself uses this metre.",
    examples: ["RV 3.62.10 (Gayatri Mantra)", "RV 1.1.1 (Agni invocation)"],
    color: "from-amber-500 to-orange-600"
  },
  {
    name: "Triṣṭubh",
    syllables: "11-11-11-11 (44 total)",
    prevalence: 4253,
    percentage: 41.0,
    rhetorical: "Majestic & Heroic",
    description: "The most common Rigvedic metre, grand and expansive. Its four eleven-syllable lines create a stately rhythm ideal for epic narratives and praise.",
    usage: "Used for hymns celebrating warrior deities, cosmic forces, and heroic acts. The extended length allows complex imagery.",
    examples: ["RV 1.32 (Indra slaying Vritra)", "RV 10.129 (Creation hymn)"],
    color: "from-blue-500 to-indigo-600"
  },
  {
    name: "Jagatī",
    syllables: "12-12-12-12 (48 total)",
    prevalence: 1367,
    percentage: 13.2,
    rhetorical: "Expansive & Flowing",
    description: "The longest standard metre, allowing elaborate descriptions. Its twelve-syllable lines provide maximum space for rich metaphor and extended thought.",
    usage: "Ideal for nature descriptions, cosmological speculation, and detailed mythological narratives requiring breathing room.",
    examples: ["RV 1.164 (Enigmatic hymn)", "RV 10.90 (Purusha Sukta)"],
    color: "from-green-500 to-emerald-600"
  },
  {
    name: "Anuṣṭubh",
    syllables: "8-8-8-8 (32 total)",
    prevalence: 875,
    percentage: 8.4,
    rhetorical: "Simple & Direct",
    description: "A straightforward metre that became dominant in later Sanskrit poetry. Its regular eight-syllable lines create accessible, flowing verse.",
    usage: "Used for didactic content, straightforward praise, and transitional verses. Later became the standard epic metre.",
    examples: ["RV 10.34 (Gambling hymn)", "Used widely in Mahabharata"],
    color: "from-purple-500 to-violet-600"
  },
  {
    name: "Paṅkti",
    syllables: "Various patterns (40 total)",
    prevalence: 312,
    percentage: 3.0,
    rhetorical: "Rhythmic & Ceremonial",
    description: "A five-line metre with flexible patterns. Its unique structure creates distinctive rhythms suitable for ritual contexts.",
    usage: "Often used in hymns with ritual instructions or ceremonial invocations requiring a different cadence.",
    examples: ["RV 1.52", "RV 8.69"],
    color: "from-pink-500 to-rose-600"
  },
  {
    name: "Bṛhatī",
    syllables: "8-8-12-8 (36 total)",
    prevalence: 456,
    percentage: 4.4,
    rhetorical: "Dynamic & Varied",
    description: "Combines short and long lines for dynamic effect. The asymmetry creates interesting rhythmic variations and emphasis.",
    usage: "Effective for hymns needing shifts in tone or emphasis, creating dramatic contrast within stanzas.",
    examples: ["RV 1.88", "RV 4.58"],
    color: "from-cyan-500 to-sky-600"
  }
]

export default function WhyMetreCardsPage() {
  const [selectedMetre, setSelectedMetre] = useState<typeof metreData[0] | null>(null)

  return (
    <div className="min-h-screen bg-background relative">
      <DecorativePattern />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        <Link href="/features">
          <Button variant="ghost" className="gap-2 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Features
          </Button>
        </Link>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle className="h-10 w-10 text-primary animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold">Why This Metre?</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover the rhetorical purpose and aesthetic feel of each Vedic metre
          </p>
        </div>

        {/* Metre cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metreData.map((metre, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedMetre(metre)}
              className={`text-left transition-all hover:scale-105 ${
                selectedMetre?.name === metre.name ? "scale-105" : ""
              }`}
            >
              <Card className={`h-full border-2 ${
                selectedMetre?.name === metre.name 
                  ? "border-primary shadow-xl" 
                  : "border-border hover:border-primary/50"
              }`}>
                <CardHeader>
                  <div className={`w-full h-2 rounded-full bg-gradient-to-r ${metre.color} mb-3`} />
                  <CardTitle className="text-2xl">{metre.name}</CardTitle>
                  <CardDescription className="font-mono text-xs">
                    {metre.syllables}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Badge variant="secondary" className="font-semibold">
                      {metre.rhetorical}
                    </Badge>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Prevalence</span>
                      <span className="font-bold text-primary">{metre.prevalence} hymns</span>
                    </div>
                    
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${metre.color}`}
                        style={{ width: `${metre.percentage}%` }}
                      />
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      {metre.percentage}% of Rigveda
                    </p>
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>

        {/* Detailed view */}
        {selectedMetre && (
          <Card className="border-2 border-primary">
            <CardHeader>
              <div className={`w-full h-3 rounded-full bg-gradient-to-r ${selectedMetre.color} mb-4`} />
              <CardTitle className="text-3xl flex items-center gap-3">
                {selectedMetre.name}
                <Badge variant="secondary">{selectedMetre.rhetorical}</Badge>
              </CardTitle>
              <CardDescription className="text-base font-mono">
                {selectedMetre.syllables}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Character & Feel
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedMetre.description}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-primary" />
                      Typical Usage
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedMetre.usage}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3">Examples</h4>
                    <ul className="space-y-2">
                      {selectedMetre.examples.map((example, idx) => (
                        <li 
                          key={idx}
                          className="text-sm p-3 rounded-lg bg-muted/50 border border-border"
                        >
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-1">
                        {selectedMetre.prevalence}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total hymns ({selectedMetre.percentage}%)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary stats */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Rigveda Metre Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metreData.map((metre, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-32 text-sm font-medium">{metre.name}</div>
                  <div className="flex-1 bg-muted rounded-full h-6 relative overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${metre.color} transition-all flex items-center justify-end pr-2`}
                      style={{ width: `${metre.percentage}%` }}
                    >
                      <span className="text-xs font-semibold text-white drop-shadow">
                        {metre.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="w-24 text-sm text-muted-foreground text-right">
                    {metre.prevalence} hymns
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}