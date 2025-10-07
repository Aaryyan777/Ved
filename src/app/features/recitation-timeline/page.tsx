"use client"

import { useState, useRef } from "react"
import { DecorativePattern } from "@/components/mystical/decorative-pattern"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, Volume2, Clock } from "lucide-react"

const sampleVerse = {
  id: "RV 1.1.1",
  title: "Agni Sukta Opening",
  padas: [
    {
      sanskrit: "अग्निमीळे पुरोहितम्",
      transliteration: "agním īḷe puróhitam",
      translation: "Agni I praise, the household priest",
      startTime: 0,
      duration: 3.5
    },
    {
      sanskrit: "यज्ञस्य देवमृत्विजम्",
      transliteration: "yajñásya devám r̥tvíjam",
      translation: "The god, priest of the sacrifice",
      startTime: 3.5,
      duration: 3.2
    },
    {
      sanskrit: "होतारं रत्नधातमम्",
      transliteration: "hótāram ratnadhā́tamam",
      translation: "The invoker, the best bestower of treasure",
      startTime: 6.7,
      duration: 3.8
    }
  ]
}

export default function RecitationTimelinePage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [activePada, setActivePada] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout>()

  const totalDuration = sampleVerse.padas.reduce((sum, p) => sum + p.duration, 0)

  const togglePlay = () => {
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + 0.1
          if (next >= totalDuration) {
            if (intervalRef.current) clearInterval(intervalRef.current)
            setIsPlaying(false)
            return 0
          }
          
          // Update active pada
          let padaIdx = 0
          let elapsed = 0
          for (let i = 0; i < sampleVerse.padas.length; i++) {
            if (next >= elapsed && next < elapsed + sampleVerse.padas[i].duration) {
              padaIdx = i
              break
            }
            elapsed += sampleVerse.padas[i].duration
          }
          setActivePada(padaIdx)
          
          return next
        })
      }, 100)
    }
  }

  const seekTo = (time: number) => {
    setCurrentTime(time)
    // Update active pada
    let padaIdx = 0
    let elapsed = 0
    for (let i = 0; i < sampleVerse.padas.length; i++) {
      if (time >= elapsed && time < elapsed + sampleVerse.padas[i].duration) {
        padaIdx = i
        break
      }
      elapsed += sampleVerse.padas[i].duration
    }
    setActivePada(padaIdx)
  }

  const jumpToPada = (padaIdx: number) => {
    let elapsed = 0
    for (let i = 0; i < padaIdx; i++) {
      elapsed += sampleVerse.padas[i].duration
    }
    seekTo(elapsed)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
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
            <Clock className="h-10 w-10 text-primary animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold">Recitation Timeline</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Line-synced highlighting with pause-by-pāda navigation
          </p>
        </div>

        {/* Verse display with highlighting */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{sampleVerse.title}</CardTitle>
            <CardDescription>{sampleVerse.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {sampleVerse.padas.map((pada, idx) => (
                <button
                  key={idx}
                  onClick={() => jumpToPada(idx)}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    activePada === idx
                      ? "border-primary bg-primary/10 shadow-lg scale-105"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="space-y-2">
                    <div className={`text-2xl font-devanagari transition-colors ${
                      activePada === idx ? "text-primary" : ""
                    }`}>
                      {pada.sanskrit}
                    </div>
                    <div className="text-muted-foreground italic">
                      {pada.transliteration}
                    </div>
                    <div className="text-sm">
                      {pada.translation}
                    </div>
                  </div>
                  {activePada === idx && (
                    <div className="mt-4 w-full bg-muted rounded-full h-1">
                      <div 
                        className="h-1 bg-primary rounded-full transition-all"
                        style={{ 
                          width: `${((currentTime - pada.startTime) / pada.duration) * 100}%` 
                        }}
                      />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Audio controls */}
        <Card>
          <CardContent className="pt-6">
            {/* Timeline slider */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(totalDuration)}</span>
              </div>
              <Slider
                value={[currentTime]}
                max={totalDuration}
                step={0.1}
                onValueChange={(vals) => seekTo(vals[0])}
                className="cursor-pointer"
              />
            </div>

            {/* Control buttons */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => jumpToPada(Math.max(0, activePada - 1))}
                disabled={activePada === 0}
              >
                <SkipBack className="w-5 h-5" />
              </Button>
              
              <Button
                size="lg"
                onClick={togglePlay}
                className="w-16 h-16 rounded-full"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => jumpToPada(Math.min(sampleVerse.padas.length - 1, activePada + 1))}
                disabled={activePada === sampleVerse.padas.length - 1}
              >
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>

            {/* Volume control */}
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-muted-foreground" />
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={(vals) => setVolume(vals[0] / 100)}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-12 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid md:grid-cols-2 gap-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Synchronized highlighting follows recitation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Click any pāda to jump to that line</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Previous/Next buttons navigate by line</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Drag timeline to seek precise position</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}