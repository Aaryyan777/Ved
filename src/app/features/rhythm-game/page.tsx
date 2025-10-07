"use client"

import { useState, useEffect } from "react"
import { DecorativePattern } from "@/components/mystical/decorative-pattern"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Music, Trophy, Target } from "lucide-react"

const metres = [
  {
    id: "gayatri",
    name: "Gāyatrī",
    pattern: ["G", "L", "G", "G", "L", "G", "L", "G"],
    bpm: 120
  },
  {
    id: "tristubh",
    name: "Triṣṭubh",
    pattern: ["G", "L", "G", "L", "G", "G", "L", "G", "L", "G", "L"],
    bpm: 100
  },
  {
    id: "jagati",
    name: "Jagatī",
    pattern: ["G", "L", "G", "L", "G", "L", "G", "G", "L", "G", "L", "L"],
    bpm: 90
  }
]

export default function RhythmGamePage() {
  const [selectedMetre, setSelectedMetre] = useState(metres[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentBeat, setCurrentBeat] = useState(-1)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [userTaps, setUserTaps] = useState<string[]>([])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentBeat(prev => {
          if (prev >= selectedMetre.pattern.length - 1) {
            setIsPlaying(false)
            return -1
          }
          return prev + 1
        })
      }, 60000 / selectedMetre.bpm)
    }
    return () => clearInterval(interval)
  }, [isPlaying, selectedMetre])

  const handleTap = (type: "G" | "L") => {
    if (!isPlaying || currentBeat < 0) return
    
    const correct = selectedMetre.pattern[currentBeat] === type
    setUserTaps([...userTaps, type])
    
    if (correct) {
      setScore(score + 10 * (streak + 1))
      setStreak(streak + 1)
    } else {
      setStreak(0)
    }
  }

  const startGame = () => {
    setIsPlaying(true)
    setCurrentBeat(-1)
    setScore(0)
    setStreak(0)
    setUserTaps([])
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <DecorativePattern />
      
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        <Link href="/features">
          <Button variant="ghost" className="gap-2 mb-6 hover:bg-primary/10">
            <ArrowLeft className="w-4 h-4" />
            Back to Features
          </Button>
        </Link>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music className="h-10 w-10 text-primary animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Chandas Rhythm Game
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Master Vedic metres through rhythm • Tap along to guru/laghu patterns • Build your streak!
          </p>
        </div>

        {/* Metre Selection */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {metres.map(metre => (
            <button
              key={metre.id}
              onClick={() => {
                setSelectedMetre(metre)
                setIsPlaying(false)
                setCurrentBeat(-1)
              }}
              disabled={isPlaying}
              className={`text-left transition-all ${
                selectedMetre.id === metre.id ? 'scale-105' : 'hover:scale-[1.02]'
              }`}
            >
              <Card className={`border-2 ${
                selectedMetre.id === metre.id
                  ? 'border-primary shadow-2xl shadow-primary/30'
                  : 'border-border shadow-md'
              }`}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-xl font-bold mb-2">{metre.name}</div>
                    <div className="text-sm text-muted-foreground">{metre.pattern.length} beats</div>
                    <Badge className="mt-2">{metre.bpm} BPM</Badge>
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>

        {/* Score Display */}
        <Card className="border-2 shadow-xl mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">{score}</div>
                <div className="text-sm text-muted-foreground">Score</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">{streak}</div>
                <div className="text-sm text-muted-foreground">Streak</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary">
                  {currentBeat >= 0 ? `${currentBeat + 1}/${selectedMetre.pattern.length}` : "0/0"}
                </div>
                <div className="text-sm text-muted-foreground">Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pattern Display */}
        <Card className="border-2 shadow-xl mb-6">
          <CardHeader>
            <CardTitle className="text-center">{selectedMetre.name} Pattern</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-2 flex-wrap">
              {selectedMetre.pattern.map((beat, idx) => (
                <div
                  key={idx}
                  className={`w-16 h-16 rounded-xl flex items-center justify-center font-bold text-xl transition-all ${
                    idx === currentBeat
                      ? 'bg-gradient-to-br from-primary to-accent text-white scale-125 animate-pulse shadow-2xl'
                      : idx < currentBeat
                      ? userTaps[idx] === beat
                        ? 'bg-green-500/20 border-2 border-green-500 text-green-600'
                        : 'bg-red-500/20 border-2 border-red-500 text-red-600'
                      : 'bg-muted border-2 border-border'
                  }`}
                >
                  {beat}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Button
            onClick={startGame}
            disabled={isPlaying}
            size="lg"
            className="gap-2"
          >
            <Music className="w-5 h-5" />
            {isPlaying ? 'Playing...' : 'Start Game'}
          </Button>

          <Button
            onClick={() => handleTap("G")}
            disabled={!isPlaying}
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
          >
            Tap GURU (Long)
          </Button>

          <Button
            onClick={() => handleTap("L")}
            disabled={!isPlaying}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            Tap LAGHU (Short)
          </Button>
        </div>

        {/* Instructions */}
        <Card className="border-2 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              How to Play
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary">1.</span>
                <span>Select a metre (Gāyatrī, Triṣṭubh, or Jagatī)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">2.</span>
                <span>Click "Start Game" to begin the rhythm sequence</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">3.</span>
                <span>When a syllable lights up, tap the correct button (Guru for G, Laghu for L)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">4.</span>
                <span>Build streaks for bonus points! Each consecutive correct tap multiplies your score</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">5.</span>
                <span><strong>Guru (G)</strong> = Heavy/Long syllable • <strong>Laghu (L)</strong> = Light/Short syllable</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}