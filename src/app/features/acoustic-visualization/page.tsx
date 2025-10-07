"use client"

import { useState, useEffect, useRef } from "react"
import { DecorativePattern } from "@/components/mystical/decorative-pattern"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowLeft, Play, Pause, Waves, Download, Sparkles } from "lucide-react"

export default function AcousticVisualizationPage() {
  const [verse, setVerse] = useState({ mandala: "1", hymn: "1", verse: "1" })
  const [isPlaying, setIsPlaying] = useState(false)
  const [particles, setParticles] = useState<Array<{x: number, y: number, vx: number, vy: number, size: number, hue: number}>>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  // Generate accent pattern simulation
  const generateAccentPattern = (m: number, h: number, v: number) => {
    const seed = m * 1000 + h * 100 + v
    const pattern: ('u' | 'a' | 's')[] = []
    
    for (let i = 0; i < 32; i++) {
      const val = (seed * (i + 1) * 137) % 100
      if (val < 40) pattern.push('u') // udātta
      else if (val < 70) pattern.push('a') // anudātta
      else pattern.push('s') // svarita
    }
    return pattern
  }

  const accentPattern = generateAccentPattern(
    parseInt(verse.mandala),
    parseInt(verse.hymn),
    parseInt(verse.verse)
  )

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateParticles = () => {
      if (!isPlaying) return

      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      setParticles(prev => {
        const updated = prev.map(p => {
          let newX = p.x + p.vx
          let newY = p.y + p.vy
          
          if (newX < 0 || newX > canvas.width) p.vx *= -1
          if (newY < 0 || newY > canvas.height) p.vy *= -1
          
          return {
            ...p,
            x: newX,
            y: newY,
            hue: (p.hue + 1) % 360
          }
        })

        updated.forEach(p => {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${p.hue}, 70%, 60%, 0.8)`
          ctx.fill()
          
          // Glow effect
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2)
          gradient.addColorStop(0, `hsla(${p.hue}, 70%, 60%, 0.4)`)
          gradient.addColorStop(1, 'transparent')
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2)
          ctx.fill()
        })

        return updated
      })

      animationRef.current = requestAnimationFrame(updateParticles)
    }

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updateParticles)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying])

  const startVisualization = () => {
    setIsPlaying(!isPlaying)
    
    if (!isPlaying) {
      // Generate new particles based on accent pattern
      const newParticles = accentPattern.map((accent, idx) => {
        const angle = (idx / accentPattern.length) * Math.PI * 2
        const radius = 200
        const hue = accent === 'u' ? 0 : accent === 's' ? 120 : 240
        
        return {
          x: 400 + Math.cos(angle) * radius,
          y: 300 + Math.sin(angle) * radius,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: accent === 'u' ? 8 : accent === 's' ? 6 : 4,
          hue
        }
      })
      setParticles(newParticles)
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      canvas.width = 800
      canvas.height = 600
    }
  }, [])

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
            <Waves className="h-10 w-10 text-primary animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Acoustic Visualization
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real-time audio-reactive mandala • Pitch accent particles • Flowing energy
          </p>
        </div>

        {/* Verse Selector */}
        <Card className="border-2 shadow-xl mb-6">
          <CardHeader>
            <CardTitle>Select Verse</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="grid grid-cols-3 gap-3 flex-1">
                <Input
                  type="number"
                  placeholder="Maṇḍala"
                  value={verse.mandala}
                  onChange={e => setVerse({...verse, mandala: e.target.value})}
                  className="text-center"
                />
                <Input
                  type="number"
                  placeholder="Hymn"
                  value={verse.hymn}
                  onChange={e => setVerse({...verse, hymn: e.target.value})}
                  className="text-center"
                />
                <Input
                  type="number"
                  placeholder="Verse"
                  value={verse.verse}
                  onChange={e => setVerse({...verse, verse: e.target.value})}
                  className="text-center"
                />
              </div>
              <Button onClick={startVisualization} size="lg" className="gap-2">
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                {isPlaying ? 'Pause' : 'Start'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Visualization Canvas */}
        <Card className="border-2 shadow-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="relative bg-black">
              <canvas
                ref={canvasRef}
                className="w-full h-auto"
                style={{ maxHeight: '600px' }}
              />
              
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <Button onClick={startVisualization} size="lg" className="gap-2">
                    <Play className="w-6 h-6" />
                    Start Visualization
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Accent Legend */}
        <Card className="mt-6 border-2 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Accent Pattern Key
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border-2 border-red-500/30">
                <div className="w-8 h-8 rounded-full bg-red-500" />
                <div>
                  <div className="font-semibold">Udātta (High)</div>
                  <div className="text-xs text-muted-foreground">Large red particles</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border-2 border-green-500/30">
                <div className="w-6 h-6 rounded-full bg-green-500" />
                <div>
                  <div className="font-semibold">Svarita (Rising)</div>
                  <div className="text-xs text-muted-foreground">Medium green particles</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-500/10 border-2 border-blue-500/30">
                <div className="w-4 h-4 rounded-full bg-blue-500" />
                <div>
                  <div className="font-semibold">Anudātta (Low)</div>
                  <div className="text-xs text-muted-foreground">Small blue particles</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}