"use client"

import { useState, useRef, useEffect } from "react"
import { DecorativePattern } from "@/components/mystical/decorative-pattern"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Lightbulb, Mic, Play, Pause } from "lucide-react"
import { toast } from "sonner"

export default function PitchToLightPage() {
  const [isActive, setIsActive] = useState(false)
  const [lightIntensity, setLightIntensity] = useState(50)
  const [lightColor, setLightColor] = useState("primary")
  const [pitchLevel, setPitchLevel] = useState("mid")
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)

  const startVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 2048

      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)

      setIsActive(true)
      toast.success("Visualization active - begin chanting!")

      const updateVisualization = () => {
        if (!analyserRef.current) return

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
        analyserRef.current.getByteFrequencyData(dataArray)

        // Calculate average frequency
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length
        const intensity = Math.min(100, (average / 255) * 100)
        setLightIntensity(intensity)

        // Determine pitch level and color
        if (average > 150) {
          setPitchLevel("high")
          setLightColor("primary")
        } else if (average > 80) {
          setPitchLevel("mid")
          setLightColor("secondary")
        } else {
          setPitchLevel("low")
          setLightColor("accent")
        }

        if (isActive) {
          requestAnimationFrame(updateVisualization)
        }
      }

      updateVisualization()
    } catch (error) {
      toast.error("Microphone access denied")
      console.error("Error accessing microphone:", error)
    }
  }

  const stopVisualization = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close()
      setIsActive(false)
      setLightIntensity(50)
      toast.info("Visualization stopped")
    }
  }

  const colorMap = {
    primary: "from-primary to-primary/50",
    secondary: "from-secondary to-secondary/50",
    accent: "from-accent to-accent/50"
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
            <Lightbulb className="h-10 w-10 text-primary animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold">Pitch-to-Light Visualizer</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Map your mantra's accent contours to gentle light pulses for meditation
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Visualization */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Light Visualization</CardTitle>
              <CardDescription>Your voice controls the light intensity and color</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-border bg-gradient-to-br from-background to-muted/30">
                {/* Main light orb */}
                <div
                  className={`absolute inset-0 bg-gradient-radial ${colorMap[lightColor as keyof typeof colorMap]} blur-3xl transition-all duration-300`}
                  style={{
                    opacity: isActive ? lightIntensity / 100 : 0.3,
                    transform: `scale(${0.5 + (lightIntensity / 200)})`
                  }}
                />

                {/* Center glow */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className={`w-32 h-32 rounded-full bg-gradient-to-br ${colorMap[lightColor as keyof typeof colorMap]} blur-xl transition-all duration-200`}
                    style={{
                      opacity: isActive ? 0.8 : 0.2,
                      transform: `scale(${0.8 + (lightIntensity / 300)})`
                    }}
                  />
                </div>

                {/* Status overlay */}
                {!isActive && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Lightbulb className="w-20 h-20 mx-auto mb-4 text-muted-foreground/50" />
                      <p className="text-muted-foreground">Start visualization to see the light</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4 mt-6">
                <Button
                  size="lg"
                  onClick={isActive ? stopVisualization : startVisualization}
                  variant={isActive ? "destructive" : "default"}
                  className="gap-2"
                >
                  {isActive ? (
                    <>
                      <Pause className="w-5 h-5" />
                      Stop Visualization
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5" />
                      Start Visualization
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pitch indicator */}
          <Card>
            <CardHeader>
              <CardTitle>Pitch Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/30">
                  <span className="font-semibold">Udātta (High)</span>
                  <div
                    className={`w-4 h-4 rounded-full ${
                      pitchLevel === "high" ? "bg-primary animate-pulse" : "bg-muted"
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/10 border border-secondary/30">
                  <span className="font-semibold">Svarita (Mid)</span>
                  <div
                    className={`w-4 h-4 rounded-full ${
                      pitchLevel === "mid" ? "bg-secondary animate-pulse" : "bg-muted"
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-accent/10 border border-accent/30">
                  <span className="font-semibold">Anudātta (Low)</span>
                  <div
                    className={`w-4 h-4 rounded-full ${
                      pitchLevel === "low" ? "bg-accent animate-pulse" : "bg-muted"
                    }`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Intensity meter */}
          <Card>
            <CardHeader>
              <CardTitle>Light Intensity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">{Math.round(lightIntensity)}%</div>
                  <div className="text-sm text-muted-foreground">Current intensity</div>
                </div>
                
                {/* Visual meter */}
                <div className="h-8 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${colorMap[lightColor as keyof typeof colorMap]} transition-all duration-300`}
                    style={{ width: `${lightIntensity}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-6 border-accent/30">
          <CardHeader>
            <CardTitle className="text-accent">Meditation Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Allow microphone access when prompted</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Begin chanting your chosen mantra in a steady rhythm</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Watch the light respond to your voice's pitch and intensity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Higher pitches create brighter, warmer lights</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Use this visual feedback to maintain steady accent patterns</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}