"use client"

import { useState, useEffect } from "react"
import { DecorativePattern } from "@/components/mystical/decorative-pattern"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Activity, Play, Pause, RotateCcw, Music2, Volume2 } from "lucide-react"

// All Vedic Metres with syllable patterns
const METRES = {
  // Seven major metres
  gayatri: {
    name: "Gāyatrī",
    syllablesPerPada: 8,
    padas: 3,
    pattern: "L L G G L L G G",
    description: "The most sacred metre, 24 syllables (8×3)",
    verses: 2447
  },
  usnih: {
    name: "Uṣṇih",
    syllablesPerPada: [8, 8, 12],
    padas: 3,
    pattern: "L H L H L L H X | L H L H L L H X | L H L H L L H X L H L H",
    description: "Asymmetric metre, 28 syllables (8+8+12)",
    verses: 341
  },
  anushtubh: {
    name: "Anuṣṭubh",
    syllablesPerPada: 8,
    padas: 4,
    pattern: "L H L H L L H X",
    description: "Later standard metre, 32 syllables (8×4)",
    verses: 855
  },
  brihati: {
    name: "Bṛhatī",
    syllablesPerPada: [8, 8, 12, 8],
    padas: 4,
    pattern: "L H L H L L H X | L H L H L L H X | L H L H L L H X L H L H | L H L H L L H X",
    description: "Mixed metre, 36 syllables (8+8+12+8)",
    verses: 181
  },
  pankti: {
    name: "Pankti",
    syllablesPerPada: 8,
    padas: 5,
    pattern: "L H L H L L H X",
    description: "Five-pada metre, 40 syllables (8×5)",
    verses: 312
  },
  trishtubh: {
    name: "Triṣṭubh",
    syllablesPerPada: 11,
    padas: 4,
    pattern: "L H L H L L H H L L X",
    description: "Heroic metre, 44 syllables (11×4)",
    verses: 4253
  },
  jagati: {
    name: "Jagatī",
    syllablesPerPada: 12,
    padas: 4,
    pattern: "L H L H L L H H L L H X",
    description: "Grand metre, 48 syllables (12×4)",
    verses: 1318
  },
  // Additional 14 less frequent metres
  atijagati: {
    name: "Atijagati",
    syllablesPerPada: 13,
    padas: 4,
    pattern: "L H L H L L H H L L H H X",
    description: "Extended metre, 52 syllables (13×4)",
    verses: 0
  },
  shakkari: {
    name: "Śakkarī",
    syllablesPerPada: 14,
    padas: 4,
    pattern: "L H L H L L H H L L H H L X",
    description: "Rare metre, 56 syllables (14×4)",
    verses: 0
  },
  atishakari: {
    name: "Atiśakarī",
    syllablesPerPada: 15,
    padas: 4,
    pattern: "L H L H L L H H L L H H L L X",
    description: "Very rare metre, 60 syllables (15×4)",
    verses: 0
  },
  ashti: {
    name: "Ashṭi",
    syllablesPerPada: 16,
    padas: 4,
    pattern: "L H L H L L H H L L H H L L H X",
    description: "Extended metre, 64 syllables (16×4)",
    verses: 0
  },
  atyashti: {
    name: "Atyashti",
    syllablesPerPada: 17,
    padas: 4,
    pattern: "L H L H L L H H L L H H L L H H X",
    description: "Very extended metre, 68 syllables (17×4)",
    verses: 0
  },
  dhriti: {
    name: "Dhritī",
    syllablesPerPada: 18,
    padas: 4,
    pattern: "L H L H L L H H L L H H L L H H L X",
    description: "Long metre, 72 syllables (18×4)",
    verses: 0
  },
  atidhrti: {
    name: "Atidhritī",
    syllablesPerPada: 19,
    padas: 4,
    pattern: "L H L H L L H H L L H H L L H H L L X",
    description: "Very long metre, 76 syllables (19×4)",
    verses: 0
  },
  kriti: {
    name: "Kṛiti",
    syllablesPerPada: 20,
    padas: 4,
    pattern: "L H L H L L H H L L H H L L H H L L H X",
    description: "Longest regular metre, 80 syllables (20×4)",
    verses: 0
  },
  prakriti: {
    name: "Prakṛiti",
    syllablesPerPada: 21,
    padas: 4,
    pattern: "L H L H L L H H L L H H L L H H L L H H X",
    description: "Extended metre, 84 syllables (21×4)",
    verses: 0
  },
  akriti: {
    name: "Ākṛiti",
    syllablesPerPada: 22,
    padas: 4,
    pattern: "L H L H L L H H L L H H L L H H L L H H L X",
    description: "Very extended metre, 88 syllables (22×4)",
    verses: 0
  },
  vikriti: {
    name: "Vikṛiti",
    syllablesPerPada: 23,
    padas: 4,
    pattern: "L H L H L L H H L L H H L L H H L L H H L L X",
    description: "Rare long metre, 92 syllables (23×4)",
    verses: 0
  },
  sankriti: {
    name: "Śankṛiti",
    syllablesPerPada: 24,
    padas: 4,
    pattern: "L H L H L L H H L L H H L L H H L L H H L L H X",
    description: "Very rare metre, 96 syllables (24×4)",
    verses: 0
  },
  atikriti: {
    name: "Atikṛiti",
    syllablesPerPada: 25,
    padas: 4,
    pattern: "L H L H L L H H L L H H L L H H L L H H L L H H X",
    description: "Extremely rare metre, 100 syllables (25×4)",
    verses: 0
  },
  utkriti: {
    name: "Utkṛiti",
    syllablesPerPada: 26,
    padas: 4,
    pattern: "L H L H L L H H L L H H L L H H L L H H L L H H L X",
    description: "Maximum regular metre, 104 syllables (26×4)",
    verses: 0
  },
  // Other minor metres
  viraj: {
    name: "Virāj",
    syllablesPerPada: 10,
    padas: 4,
    pattern: "L H L H L L H H L X",
    description: "Four padas of 10 syllables",
    verses: 0
  },
  kakubh: {
    name: "Kakubh",
    syllablesPerPada: [8, 12, 8],
    padas: 3,
    pattern: "L H L H L L H X | L H L H L L H X L H L H | L H L H L L H X",
    description: "Three lines: 8, 12, 8 syllables",
    verses: 0
  },
}

type MetreKey = keyof typeof METRES

const INSTRUMENTS = ["piano", "guitar", "flute", "tabla", "tanpura", "sitar"]

export default function ChandasCanvasPage() {
  const [selectedMetre, setSelectedMetre] = useState<MetreKey>("gayatri")
  const [animating, setAnimating] = useState(false)
  const [currentPada, setCurrentPada] = useState(0)
  const [currentSyllable, setCurrentSyllable] = useState(0)
  
  // Music controls
  const [tempo, setTempo] = useState(120)
  const [selectedInstrument, setSelectedInstrument] = useState("piano")
  const [volume, setVolume] = useState(70)
  const [isPlayingMusic, setIsPlayingMusic] = useState(false)

  const metre = METRES[selectedMetre]
  const syllablesPerPada = Array.isArray(metre.syllablesPerPada) 
    ? metre.syllablesPerPada[currentPada] || metre.syllablesPerPada[0]
    : metre.syllablesPerPada

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (animating) {
      // Slower animation: 1200ms per syllable instead of calculating from tempo
      const syllableMs = 1200
      interval = setInterval(() => {
        setCurrentSyllable(prev => {
          const maxSyllables = Array.isArray(metre.syllablesPerPada)
            ? metre.syllablesPerPada[currentPada] || metre.syllablesPerPada[0]
            : metre.syllablesPerPada
          
          if (prev + 1 >= maxSyllables) {
            // Completed current pada
            setCurrentPada(p => {
              const nextPada = p + 1
              if (nextPada >= metre.padas) {
                // Completed all padas
                setAnimating(false)
                return 0
              }
              return nextPada
            })
            return 0
          }
          return prev + 1
        })
      }, syllableMs)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [animating, metre, currentPada])

  const handleReset = () => {
    setAnimating(false)
    setCurrentPada(0)
    setCurrentSyllable(0)
  }

  const handleToggleAnimation = () => {
    if (animating) {
      setAnimating(false)
    } else {
      const maxSyllables = Array.isArray(metre.syllablesPerPada)
        ? metre.syllablesPerPada[metre.padas - 1] || metre.syllablesPerPada[0]
        : metre.syllablesPerPada
      if (currentPada === metre.padas - 1 && currentSyllable === maxSyllables - 1) {
        handleReset()
      }
      setAnimating(true)
    }
  }

  const getSyllableType = (padaIndex: number, syllableIndex: number): "light" | "heavy" | "anceps" => {
    const pattern = metre.pattern.split(" ")[syllableIndex]
    if (!pattern) return "light"
    if (pattern === "G" || pattern === "H") return "heavy"
    if (pattern === "X") return "anceps"
    return "light"
  }

  const playMusicForChanda = () => {
    if (!isPlayingMusic) {
      // Create audio context and play tones
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = 440 // A4 note
      oscillator.type = selectedInstrument === "piano" ? "sine" : 
                        selectedInstrument === "guitar" ? "triangle" : "square"
      gainNode.gain.value = volume / 100
      
      oscillator.start()
      setTimeout(() => oscillator.stop(), 500)
      
      setIsPlayingMusic(true)
      toast.success(`Playing ${metre.name} with ${selectedInstrument}`)
      setTimeout(() => setIsPlayingMusic(false), 500)
    }
  }

  return (
    <div className="min-h-screen bg-background relative">
      <DecorativePattern />
      
      <div className="container mx-auto px-4 py-4 max-w-7xl relative z-10">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Activity className="h-10 w-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold font-heading">छन्दस् Canvas</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Interactive metre map with rhythmic visualization and music creation
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Metre Selector */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="font-heading">Select Vedic Metre</CardTitle>
              <CardDescription>Choose from 21+ chandas types</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
              {Object.entries(METRES).map(([key, m]) => (
                <Button
                  key={key}
                  variant={selectedMetre === key ? "default" : "outline"}
                  onClick={() => {
                    setSelectedMetre(key as MetreKey)
                    handleReset()
                  }}
                  className="w-full justify-start text-left h-auto py-3"
                >
                  <div className="flex flex-col items-start">
                    <span className="font-bold">{m.name}</span>
                    <span className="text-xs opacity-70">
                      {Array.isArray(m.syllablesPerPada) 
                        ? m.syllablesPerPada.join("+") 
                        : `${m.syllablesPerPada}×${m.padas}`}
                      {m.verses > 0 && ` • ${m.verses} verses`}
                    </span>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Center: Visualization */}
          <Card className="lg:col-span-2">
            <CardHeader className="bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle className="text-2xl font-heading">{metre.name}</CardTitle>
                  <CardDescription className="text-base mt-1">{metre.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleToggleAnimation} size="lg">
                    {animating ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                    {animating ? "Pause" : "Animate"}
                  </Button>
                  <Button onClick={handleReset} variant="outline" size="lg">
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Clock Animation */}
              <div className="flex justify-center mb-8">
                <div className="relative w-64 h-64">
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.2" />
                    <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.1" />
                    
                    {Array.from({ length: syllablesPerPada }).map((_, idx) => {
                      const angle = (idx / syllablesPerPada) * Math.PI * 2 - Math.PI / 2
                      const x = 100 + Math.cos(angle) * 80
                      const y = 100 + Math.sin(angle) * 80
                      const isActive = idx === currentSyllable && animating
                      const type = getSyllableType(currentPada, idx)
                      
                      return (
                        <g key={idx}>
                          {isActive && (
                            <>
                              <circle 
                                cx={x} 
                                cy={y} 
                                r="12" 
                                fill={type === "heavy" ? "#8B4513" : type === "anceps" ? "#9CA3AF" : "#CD853F"}
                                opacity="0.3"
                                className="animate-ping"
                              />
                              <circle 
                                cx={x} 
                                cy={y} 
                                r="15" 
                                fill="none"
                                stroke={type === "heavy" ? "#8B4513" : type === "anceps" ? "#9CA3AF" : "#CD853F"}
                                strokeWidth="2"
                                opacity="0.5"
                                className="animate-pulse"
                              />
                            </>
                          )}
                          
                          <circle 
                            cx={x} 
                            cy={y} 
                            r="8" 
                            fill={isActive ? (type === "heavy" ? "#8B4513" : type === "anceps" ? "#9CA3AF" : "#CD853F") : "currentColor"}
                            opacity={isActive ? "1" : "0.4"}
                          />
                          
                          <text 
                            x={x} 
                            y={y + 4} 
                            textAnchor="middle" 
                            fontSize="10" 
                            fill="white"
                            fontWeight="bold"
                          >
                            {idx + 1}
                          </text>
                        </g>
                      )
                    })}
                    
                    <text x="100" y="100" textAnchor="middle" fontSize="14" fontWeight="bold">
                      Pāda {currentPada + 1}
                    </text>
                    <text x="100" y="115" textAnchor="middle" fontSize="10" opacity="0.7">
                      {syllablesPerPada} syllables
                    </text>
                  </svg>
                </div>
              </div>

              {/* Keyboard Visualization */}
              <div className="space-y-4">
                <h3 className="text-center font-semibold text-sm text-muted-foreground">Syllable Keyboard</h3>
                <div className="space-y-2">
                  {Array.from({ length: metre.padas }).map((_, padaIdx) => {
                    const padaSyllables = Array.isArray(metre.syllablesPerPada)
                      ? metre.syllablesPerPada[padaIdx] || metre.syllablesPerPada[0]
                      : metre.syllablesPerPada
                    
                    return (
                      <div key={padaIdx} className="flex gap-1 justify-center">
                        {Array.from({ length: padaSyllables }).map((_, syllIdx) => {
                          const type = getSyllableType(padaIdx, syllIdx)
                          const isActive = padaIdx === currentPada && syllIdx === currentSyllable && animating
                          const bgColor = type === "heavy" ? "#8B4513" : 
                                         type === "anceps" ? "#9CA3AF" : "#CD853F"
                          
                          return (
                            <div
                              key={syllIdx}
                              className="w-12 h-12 rounded border-2 flex items-center justify-center font-bold text-white text-sm transition-all"
                              style={{
                                backgroundColor: isActive ? bgColor : "transparent",
                                borderColor: isActive ? bgColor : "currentColor",
                                opacity: isActive ? 1 : 0.5,
                                boxShadow: isActive ? `0 0 20px ${bgColor}` : "none",
                                transform: isActive ? "scale(1.1)" : "scale(1)"
                              }}
                            >
                              {type === "heavy" ? "G" : type === "anceps" ? "X" : "L"}
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
                <div className="flex justify-center gap-6 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: "#CD853F" }} />
                    <span>L = Laghu (Light)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: "#8B4513" }} />
                    <span>G = Guru (Heavy)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: "#9CA3AF" }} />
                    <span>X = Anceps</span>
                  </div>
                </div>
              </div>

              {/* Progress Info */}
              <div className="p-4 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 rounded-lg border">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Pāda</div>
                    <div className="text-2xl font-bold text-primary">{currentPada + 1}/{metre.padas}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Syllable</div>
                    <div className="text-2xl font-bold text-accent">{currentSyllable + 1}/{syllablesPerPada}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Total</div>
                    <div className="text-2xl font-bold text-secondary">
                      {Array.from({ length: currentPada }).reduce((sum, _: any, i) => {
                        return sum + (Array.isArray(metre.syllablesPerPada) ? metre.syllablesPerPada[i] || 8 : metre.syllablesPerPada)
                      }, 0) + currentSyllable + 1}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Metrical Structure */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading">
              Metre Structure
            </CardTitle>
            <CardDescription>
              Visual representation of {metre.name} syllable pattern
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: metre.padas }).map((_, padaIdx) => {
              const padaSyllables = Array.isArray(metre.syllablesPerPada)
                ? metre.syllablesPerPada[padaIdx] || metre.syllablesPerPada[0]
                : metre.syllablesPerPada
              
              return (
                <div key={padaIdx} className="space-y-2">
                  <div className="text-sm font-semibold text-muted-foreground">Pāda {padaIdx + 1}:</div>
                  <div className="flex gap-2">
                    {Array.from({ length: padaSyllables }).map((_, syllIdx) => {
                      const type = getSyllableType(padaIdx, syllIdx)
                      const bgColor = type === "heavy" ? "#A0AEC0" : "#F6AD55"
                      const label = type === "heavy" ? "G" : "L"
                      
                      return (
                        <div
                          key={syllIdx}
                          className="flex-1 h-16 rounded-lg flex items-center justify-center text-white font-bold text-xl border-2"
                          style={{
                            backgroundColor: bgColor,
                            borderColor: bgColor
                          }}
                        >
                          {label}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Music Creation Controls */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading">
              <Music2 className="w-5 h-5" />
              Music Creation from Chandas
            </CardTitle>
            <CardDescription>
              Generate rhythmic patterns based on the syllable structure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Tempo */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tempo (BPM): {tempo}</label>
                <Slider
                  value={[tempo]}
                  onValueChange={(v) => setTempo(v[0])}
                  min={60}
                  max={180}
                  step={5}
                />
              </div>

              {/* Instrument */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Instrument</label>
                <Select value={selectedInstrument} onValueChange={setSelectedInstrument}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INSTRUMENTS.map(inst => (
                      <SelectItem key={inst} value={inst} className="capitalize">
                        {inst}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Volume */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  Volume: {volume}%
                </label>
                <Slider
                  value={[volume]}
                  onValueChange={(v) => setVolume(v[0])}
                  min={0}
                  max={100}
                  step={5}
                />
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={playMusicForChanda} size="lg" className="gap-2" disabled={isPlayingMusic}>
                {isPlayingMusic ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                {isPlayingMusic ? "Playing..." : "Play Chandas Tone"}
              </Button>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg text-sm text-muted-foreground">
              <p className="mb-2">
                <strong>How it works:</strong> Each syllable in the chandas generates a musical beat.
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Light syllables (Laghu) = short notes</li>
                <li>Heavy syllables (Guru) = long notes or chords</li>
                <li>Tempo controls the speed of recitation</li>
                <li>Different instruments provide varied timbres</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}