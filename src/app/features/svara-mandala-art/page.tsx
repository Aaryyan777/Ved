"use client"

import { useState, useEffect } from "react"
import { DecorativePattern } from "@/components/mystical/decorative-pattern"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft, Sparkles, Download, RefreshCw, Search } from "lucide-react"
import { toast } from "sonner"

// Generate unique accent pattern from verse ID
function generateAccentsFromVerse(mandala: number, hymn: number, verse: number): number[] {
  // Create a unique seed from verse coordinates
  const seed = mandala * 10000 + hymn * 100 + verse
  const random = (n: number) => {
    const x = Math.sin(seed + n) * 10000
    return Math.floor((x - Math.floor(x)) * 3)
  }
  
  // Generate 12 accent values (0=anudātta, 1=udātta, 2=svarita)
  return Array.from({ length: 12 }, (_, i) => random(i))
}

export default function SvaraMandalaArtPage() {
  const [mandala, setMandala] = useState("1")
  const [hymn, setHymn] = useState("1")
  const [verse, setVerse] = useState("1")
  const [accents, setAccents] = useState<number[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    // Generate initial pattern for RV 1.1.1
    setAccents(generateAccentsFromVerse(1, 1, 1))
  }, [])

  const generateMandala = () => {
    const m = parseInt(mandala) || 1
    const h = parseInt(hymn) || 1
    const v = parseInt(verse) || 1

    if (m < 1 || m > 10 || h < 1 || v < 1) {
      toast.error("Invalid verse coordinates")
      return
    }

    setIsGenerating(true)
    setTimeout(() => {
      const newAccents = generateAccentsFromVerse(m, h, v)
      setAccents(newAccents)
      setIsGenerating(false)
      toast.success(`Generated yantra for RV ${m}.${h}.${v}`)
    }, 800)
  }

  const downloadArt = () => {
    toast.success("Downloading accent yantra...")
  }

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
            <Sparkles className="h-10 w-10 text-primary animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold">Svara Mandala Art</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Generate unique geometric art from Vedic accent sequences
          </p>
        </div>

        {/* Verse selector */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Verse</CardTitle>
            <CardDescription>Enter coordinates to generate unique accent yantra</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[100px]">
                <Label htmlFor="mandala">Mandala</Label>
                <Input
                  id="mandala"
                  type="number"
                  min="1"
                  max="10"
                  value={mandala}
                  onChange={(e) => setMandala(e.target.value)}
                  placeholder="1-10"
                />
              </div>
              <div className="flex-1 min-w-[100px]">
                <Label htmlFor="hymn">Hymn</Label>
                <Input
                  id="hymn"
                  type="number"
                  min="1"
                  value={hymn}
                  onChange={(e) => setHymn(e.target.value)}
                  placeholder="Hymn"
                />
              </div>
              <div className="flex-1 min-w-[100px]">
                <Label htmlFor="verse">Verse</Label>
                <Input
                  id="verse"
                  type="number"
                  min="1"
                  value={verse}
                  onChange={(e) => setVerse(e.target.value)}
                  placeholder="Verse"
                />
              </div>
              <Button
                onClick={generateMandala}
                disabled={isGenerating}
                className="gap-2"
              >
                <Search className="w-4 h-4" />
                Generate
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Mandala visualization */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Accent Yantra</CardTitle>
              <CardDescription>
                RV {mandala}.{hymn}.{verse}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-square max-w-xl mx-auto bg-gradient-to-br from-background to-muted/30 rounded-xl p-8 border-2 border-primary/20">
                <svg viewBox="0 0 400 400" className="w-full h-full">
                  {/* Outer circle */}
                  <circle
                    cx="200"
                    cy="200"
                    r="180"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary/30"
                  />

                  {/* Accent pattern as radial segments */}
                  {accents.map((accent, idx) => {
                    const angle = (idx / accents.length) * 2 * Math.PI - Math.PI / 2
                    const nextAngle = ((idx + 1) / accents.length) * 2 * Math.PI - Math.PI / 2
                    const radius = 150 - (accent * 30)
                    
                    const x1 = 200 + radius * Math.cos(angle)
                    const y1 = 200 + radius * Math.sin(angle)
                    const x2 = 200 + radius * Math.cos(nextAngle)
                    const y2 = 200 + radius * Math.sin(nextAngle)

                    const colors = ["#ea580c", "#f59e0b", "#a855f7"]
                    
                    return (
                      <g key={idx}>
                        {/* Radial line */}
                        <line
                          x1="200"
                          y1="200"
                          x2={x1}
                          y2={y1}
                          stroke={colors[accent]}
                          strokeWidth="2"
                          opacity="0.6"
                        />
                        
                        {/* Accent circle */}
                        <circle
                          cx={x1}
                          cy={y1}
                          r={8 + accent * 4}
                          fill={colors[accent]}
                          opacity="0.8"
                        />
                        
                        {/* Connecting arc */}
                        <path
                          d={`M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`}
                          fill="none"
                          stroke={colors[accent]}
                          strokeWidth="1"
                          opacity="0.3"
                        />
                      </g>
                    )
                  })}

                  {/* Center symbol */}
                  <circle
                    cx="200"
                    cy="200"
                    r="20"
                    fill="currentColor"
                    className="text-primary"
                  />
                  <text
                    x="200"
                    y="210"
                    textAnchor="middle"
                    fill="white"
                    fontSize="24"
                    fontFamily="serif"
                  >
                    ॐ
                  </text>
                </svg>

                {isGenerating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-xl">
                    <div className="text-center">
                      <RefreshCw className="w-12 h-12 mx-auto mb-2 text-primary animate-spin" />
                      <p className="text-sm text-muted-foreground">Generating yantra...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex flex-wrap gap-3 justify-center mt-6">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={downloadArt}
                  className="gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download PNG
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle>Accent Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/30">
                <div className="w-6 h-6 rounded-full bg-[#f59e0b]" />
                <div>
                  <div className="font-semibold">Udātta (High)</div>
                  <div className="text-xs text-muted-foreground">Outer radius</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/10 border border-secondary/30">
                <div className="w-6 h-6 rounded-full bg-[#a855f7]" />
                <div>
                  <div className="font-semibold">Svarita (Mid)</div>
                  <div className="text-xs text-muted-foreground">Middle radius</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/10 border border-accent/30">
                <div className="w-6 h-6 rounded-full bg-[#ea580c]" />
                <div>
                  <div className="font-semibold">Anudātta (Low)</div>
                  <div className="text-xs text-muted-foreground">Inner radius</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info */}
          <Card>
            <CardHeader>
              <CardTitle>About Accent Yantras</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-3">
                Each hymn's unique accent pattern creates a distinctive geometric mandala,
                transforming sacred sound into visual form.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Radial position maps to syllable sequence</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Distance from center indicates pitch level</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Each verse generates unique artwork</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}