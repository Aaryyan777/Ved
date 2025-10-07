"use client"

import { useState, useRef, useEffect } from "react"
import { DecorativePattern } from "@/components/mystical/decorative-pattern"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Mic, MicOff, Volume2, Play, Pause, Info } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface VerseData {
  mandala: number
  hymn: number
  verse: number
  sanskrit: string
  transliteration: string
  translations: { english: string }
  deity?: string
  meter?: string
}

const accentColors = {
  udātta: "text-primary bg-primary/20",
  anudātta: "text-accent bg-accent/20", 
  svarita: "text-secondary bg-secondary/20",
  mixed: "text-muted-foreground bg-muted"
}

export default function SvaraKaraokePage() {
  const [mandala, setMandala] = useState(1)
  const [hymn, setHymn] = useState(1)
  const [verse, setVerse] = useState(1)
  const [verseData, setVerseData] = useState<VerseData | null>(null)
  const [isLoadingVerse, setIsLoadingVerse] = useState(false)
  
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [pitchData, setPitchData] = useState<number[]>([])
  const [pitchLevel, setPitchLevel] = useState<"low" | "medium" | "high">("medium")
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)

  // Parse verse to extract words with accents
  const parseVerseWords = (sanskrit: string) => {
    // This is a simplified parser - in production you'd use proper Vedic text parsing
    const words = sanskrit.split(/\s+/).filter(w => w.length > 0)
    return words.map(word => ({
      text: word,
      accent: word.includes("॑") ? "udātta" : word.includes("॒") ? "anudātta" : "mixed",
      tone: word.includes("॑") ? "high" : word.includes("॒") ? "low" : "mid"
    }))
  }

  const words = verseData ? parseVerseWords(verseData.sanskrit) : []

  const fetchVerse = async () => {
    setIsLoadingVerse(true)
    try {
      const response = await fetch(
        `/api/rigveda/verse?mandala=${mandala}&hymn=${hymn}&verse=${verse}`
      )
      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || "Failed to fetch verse")
        return
      }

      setVerseData(data.data)
      toast.success("Verse loaded successfully!")
    } catch (error) {
      console.error("Error fetching verse:", error)
      toast.error("Failed to fetch verse")
    } finally {
      setIsLoadingVerse(false)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioContextRef.current = new AudioContext()
      
      const source = audioContextRef.current.createMediaStreamSource(stream)
      const analyser = audioContextRef.current.createAnalyser()
      analyser.fftSize = 2048
      analyser.smoothingTimeConstant = 0.3
      source.connect(analyser)
      analyserRef.current = analyser

      mediaRecorderRef.current = new MediaRecorder(stream)
      setIsRecording(true)
      toast.success("Microphone active - begin chanting!")

      // Enhanced pitch detection with better sensitivity
      const detectPitch = () => {
        if (!analyserRef.current || !isRecording) return
        
        const bufferLength = analyserRef.current.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)
        analyserRef.current.getByteFrequencyData(dataArray)
        
        // Calculate weighted average for better pitch detection
        let sum = 0
        let weightedSum = 0
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i]
          weightedSum += dataArray[i] * i
        }
        const average = sum / bufferLength
        const centroid = weightedSum / sum
        
        // More sensitive thresholds for low/medium/high
        if (average > 15) {
          if (centroid < bufferLength * 0.3) {
            setPitchLevel("low")
          } else if (centroid < bufferLength * 0.6) {
            setPitchLevel("medium")
          } else {
            setPitchLevel("high")
          }
        }
        
        setPitchData(prev => [...prev.slice(-80), average])
        
        if (isRecording) {
          requestAnimationFrame(detectPitch)
        }
      }

      detectPitch()
      mediaRecorderRef.current.start()
    } catch (error) {
      toast.error("Microphone access denied")
      console.error("Error accessing microphone:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      toast.info("Recording stopped")
      
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }

  const playbackDemo = () => {
    if (!verseData) {
      toast.error("Please load a verse first")
      return
    }
    
    setIsPlaying(true)
    let index = 0
    const interval = setInterval(() => {
      if (index < words.length) {
        setCurrentWordIndex(index)
        index++
      } else {
        setIsPlaying(false)
        setCurrentWordIndex(0)
        clearInterval(interval)
      }
    }, 600)
  }

  const playProperRecitation = () => {
    toast.success("Playing proper Vedic recitation")
    // In production, this would play actual audio file
  }

  return (
    <div className="min-h-screen bg-background relative">
      <DecorativePattern />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mic className="h-10 w-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold font-heading">Svara Karaoke</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Practice Vedic chanting with real-time accent feedback
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Sidebar: Vedic Accent Guide */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-heading">
                <Info className="w-5 h-5" />
                Accent Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                <div className="font-semibold text-primary mb-1 text-sm">उदात्त (Udātta) ॑</div>
                <p className="text-xs">High pitch • Raised tone</p>
              </div>
              <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
                <div className="font-semibold text-accent mb-1 text-sm">अनुदात्त (Anudātta) ॒</div>
                <p className="text-xs">Low pitch • Unmarked</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/30">
                <div className="font-semibold text-secondary mb-1 text-sm">स्वरित (Svarita) ᳚</div>
                <p className="text-xs">Mid pitch • Combined</p>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Verse Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Select Verse</CardTitle>
                <CardDescription>Choose a mandala, hymn, and verse to practice</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label>Mandala (1-10)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={mandala}
                      onChange={(e) => setMandala(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div>
                    <Label>Hymn (Sūkta)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={hymn}
                      onChange={(e) => setHymn(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div>
                    <Label>Verse (Ṛc)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={verse}
                      onChange={(e) => setVerse(parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>
                <Button onClick={fetchVerse} disabled={isLoadingVerse} className="w-full">
                  {isLoadingVerse ? "Loading..." : "Load Verse"}
                </Button>
              </CardContent>
            </Card>

            {/* Practice Verse */}
            {verseData && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Practice Verse</CardTitle>
                  <CardDescription>
                    RV {verseData.mandala}.{verseData.hymn}.{verseData.verse}
                    {verseData.deity && ` • ${verseData.deity}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Sanskrit with accents */}
                  <div className="p-6 rounded-lg bg-gradient-to-br from-card to-primary/5 border">
                    <div className="font-devanagari text-2xl md:text-3xl leading-relaxed text-center mb-4">
                      {verseData.sanskrit}
                    </div>
                    <div className="text-center text-sm text-muted-foreground italic">
                      {verseData.transliteration}
                    </div>
                  </div>

                  {/* Word-by-word display */}
                  <div className="flex flex-wrap gap-3 justify-center">
                    {words.map((word, idx) => (
                      <div
                        key={idx}
                        className={`px-4 py-3 rounded-lg border transition-all duration-300 ${
                          currentWordIndex === idx && isPlaying
                            ? "scale-110 shadow-lg border-primary bg-primary/20"
                            : "border-border"
                        } ${accentColors[word.accent as keyof typeof accentColors]}`}
                      >
                        <div className="font-devanagari text-xl">{word.text}</div>
                        <div className="text-xs mt-1 opacity-70">{word.accent}</div>
                      </div>
                    ))}
                  </div>

                  {/* Controls */}
                  <div className="flex flex-wrap gap-3 justify-center pt-4">
                    <Button
                      size="lg"
                      onClick={playbackDemo}
                      disabled={isPlaying || isRecording}
                      className="gap-2"
                      variant="outline"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      Demo Playback
                    </Button>
                    
                    <Button
                      size="lg"
                      onClick={playProperRecitation}
                      disabled={isRecording}
                      className="gap-2"
                      variant="outline"
                    >
                      <Volume2 className="w-5 h-5" />
                      Hear Proper Recitation
                    </Button>
                    
                    <Button
                      size="lg"
                      variant={isRecording ? "destructive" : "default"}
                      onClick={isRecording ? stopRecording : startRecording}
                      className="gap-2"
                    >
                      {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      {isRecording ? "Stop Recording" : "Start Recording"}
                    </Button>
                  </div>

                  {/* Enhanced Pitch visualization */}
                  {pitchData.length > 0 && (
                    <div className="p-4 rounded-lg bg-muted/30 border">
                      <div className="text-sm font-semibold mb-3 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Volume2 className="w-4 h-4" />
                          Pitch Visualization
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-background border">
                          Current: <strong className="capitalize">{pitchLevel}</strong>
                        </span>
                      </div>
                      
                      {/* Waveform */}
                      <div className="h-32 bg-background rounded-lg p-2 mb-3 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-end gap-0.5 px-2 pb-2">
                          {pitchData.slice(-80).map((value, idx) => {
                            const height = (value / 255) * 100
                            let color = "#CD853F" // default medium
                            if (value > 60) color = "#8B4513" // high
                            else if (value < 30) color = "#DEB887" // low
                            
                            return (
                              <div
                                key={idx}
                                className="flex-1 rounded-t transition-all duration-100"
                                style={{ 
                                  height: `${Math.max(height, 2)}%`,
                                  backgroundColor: color,
                                  opacity: 0.7 + (value / 255) * 0.3
                                }}
                              />
                            )
                          })}
                        </div>
                      </div>
                      
                      {/* Level indicators */}
                      <div className="grid grid-cols-3 gap-2 text-xs text-center">
                        <div className={`p-2 rounded border ${pitchLevel === "low" ? "bg-accent/20 border-accent" : "bg-muted border-border"}`}>
                          <div className="font-semibold">Low (Anudātta)</div>
                        </div>
                        <div className={`p-2 rounded border ${pitchLevel === "medium" ? "bg-secondary/20 border-secondary" : "bg-muted border-border"}`}>
                          <div className="font-semibold">Medium (Svarita)</div>
                        </div>
                        <div className={`p-2 rounded border ${pitchLevel === "high" ? "bg-primary/20 border-primary" : "bg-muted border-border"}`}>
                          <div className="font-semibold">High (Udātta)</div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {!verseData && (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Mic className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Select and load a verse above to begin practicing</p>
                </CardContent>
              </Card>
            )}

            {/* Tips */}
            <Card className="border-accent/30">
              <CardHeader>
                <CardTitle className="text-accent font-heading">Practice Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Listen to the proper recitation first to understand the accent pattern</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Watch the demo playback to see word-by-word progression</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Record yourself and watch the pitch visualization in real-time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Focus on udātta (high) and anudātta (low) pitch differences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Practice slowly, emphasizing each syllable's natural tone</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}