"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sun, Star, Loader2, ChevronRight, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { DecorativePattern } from "@/components/mystical/decorative-pattern"
import { toast } from "sonner"

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

export default function MandalaExplorerPage() {
  const [selectedMandala, setSelectedMandala] = useState<number | null>(null)
  const [selectedHymn, setSelectedHymn] = useState<number | null>(null)
  const [selectedVerse, setSelectedVerse] = useState<VerseData | null>(null)
  const [hoveredPetal, setHoveredPetal] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showHymnSelector, setShowHymnSelector] = useState(false)
  const [showVerseSelector, setShowVerseSelector] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Mandala data - 10 petals for 10 Mandalas
  const mandalas = [
    { id: 1, name: "Maṇḍala 1", hymns: 191, verses: 2006, color: "#8B4513" },
    { id: 2, name: "Maṇḍala 2", hymns: 43, verses: 429, color: "#A0522D" },
    { id: 3, name: "Maṇḍala 3", hymns: 62, verses: 617, color: "#CD853F" },
    { id: 4, name: "Maṇḍala 4", hymns: 58, verses: 589, color: "#D2691E" },
    { id: 5, name: "Maṇḍala 5", hymns: 87, verses: 727, color: "#BC8F8F" },
    { id: 6, name: "Maṇḍala 6", hymns: 75, verses: 765, color: "#C19A6B" },
    { id: 7, name: "Maṇḍala 7", hymns: 104, verses: 841, color: "#9B7653" },
    { id: 8, name: "Maṇḍala 8", hymns: 103, verses: 1716, color: "#8B7355" },
    { id: 9, name: "Maṇḍala 9", hymns: 114, verses: 1108, color: "#A67B5B" },
    { id: 10, name: "Maṇḍala 10", hymns: 191, verses: 1754, color: "#B8956A" }
  ]

  // Draw the realistic 3D mandala flower on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) * 0.35

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw radial gradient background for depth
    const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 2)
    bgGradient.addColorStop(0, "rgba(205, 133, 63, 0.03)")
    bgGradient.addColorStop(0.5, "rgba(139, 69, 19, 0.02)")
    bgGradient.addColorStop(1, "rgba(0, 0, 0, 0)")
    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, width, height)

    // Draw petals (10 for 10 Mandalas) with 3D effect
    const petalCount = 10
    const angleStep = (Math.PI * 2) / petalCount

    for (let i = 0; i < petalCount; i++) {
      const angle = angleStep * i - Math.PI / 2
      const isHovered = hoveredPetal === i + 1
      const isSelected = selectedMandala === i + 1

      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(angle)

      // 3D Petal shape with realistic curves
      const petalRadius = isHovered || isSelected ? radius * 1.1 : radius
      const petalWidth = (Math.PI * 2) / (petalCount * 1.3)
      
      ctx.beginPath()
      ctx.moveTo(radius * 0.2, 0)
      
      // Create realistic petal shape with bezier curves
      for (let a = -petalWidth / 2; a <= petalWidth / 2; a += 0.02) {
        const progress = Math.abs(a) / (petalWidth / 2)
        const r = petalRadius * (0.3 + 0.7 * (1 - progress * progress))
        ctx.lineTo(r * Math.cos(a), r * Math.sin(a))
      }
      
      ctx.closePath()

      // Create 3D gradient for depth
      const mandala = mandalas[i]
      const petalGradient = ctx.createRadialGradient(
        petalRadius * 0.6, 0, 0,
        petalRadius * 0.6, 0, petalRadius * 0.5
      )
      
      if (isSelected) {
        petalGradient.addColorStop(0, `${mandala.color}FF`)
        petalGradient.addColorStop(0.6, `${mandala.color}DD`)
        petalGradient.addColorStop(1, `${mandala.color}88`)
      } else if (isHovered) {
        petalGradient.addColorStop(0, `${mandala.color}EE`)
        petalGradient.addColorStop(0.6, `${mandala.color}CC`)
        petalGradient.addColorStop(1, `${mandala.color}77`)
      } else {
        petalGradient.addColorStop(0, `${mandala.color}BB`)
        petalGradient.addColorStop(0.6, `${mandala.color}88`)
        petalGradient.addColorStop(1, `${mandala.color}44`)
      }
      
      ctx.fillStyle = petalGradient
      ctx.fill()

      // Add subtle inner shadow for depth
      ctx.strokeStyle = isSelected || isHovered ? `${mandala.color}EE` : `${mandala.color}66`
      ctx.lineWidth = isHovered || isSelected ? 2 : 1
      ctx.stroke()

      // Add highlight on petal edge for glossy effect
      ctx.beginPath()
      ctx.moveTo(radius * 0.2, 0)
      for (let a = -petalWidth / 2; a <= petalWidth / 4; a += 0.02) {
        const progress = Math.abs(a) / (petalWidth / 2)
        const r = petalRadius * (0.3 + 0.7 * (1 - progress * progress)) * 0.95
        ctx.lineTo(r * Math.cos(a), r * Math.sin(a))
      }
      ctx.strokeStyle = `rgba(255, 255, 255, ${isHovered || isSelected ? 0.3 : 0.15})`
      ctx.lineWidth = 3
      ctx.stroke()

      // Draw mandala number with shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
      ctx.shadowBlur = isHovered || isSelected ? 8 : 4
      ctx.shadowOffsetX = 2
      ctx.shadowOffsetY = 2
      ctx.fillStyle = isHovered || isSelected ? "#FFFFFF" : "rgba(255, 255, 255, 0.9)"
      ctx.font = `bold ${isHovered || isSelected ? 28 : 24}px Cinzel`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(`${i + 1}`, petalRadius * 0.7, 0)

      ctx.restore()
    }

    // Draw center circle with 3D effect
    const centerGradient = ctx.createRadialGradient(
      centerX - radius * 0.05, 
      centerY - radius * 0.05, 
      0, 
      centerX, 
      centerY, 
      radius * 0.28
    )
    centerGradient.addColorStop(0, selectedMandala ? mandalas[selectedMandala - 1].color : "#CD853F")
    centerGradient.addColorStop(0.7, selectedMandala ? mandalas[selectedMandala - 1].color : "#A0522D")
    centerGradient.addColorStop(1, selectedMandala ? mandalas[selectedMandala - 1].color : "#8B4513")
    
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.25, 0, Math.PI * 2)
    ctx.fillStyle = centerGradient
    ctx.fill()
    
    // Add outer ring to center
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)"
    ctx.lineWidth = 2
    ctx.stroke()

    // Om symbol with glow
    ctx.shadowColor = "rgba(255, 255, 255, 0.5)"
    ctx.shadowBlur = 10
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "bold 52px serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("ॐ", centerX, centerY)

  }, [hoveredPetal, selectedMandala, mandalas])

  // Handle petal click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const dx = x - centerX
    const dy = y - centerY
    const distance = Math.sqrt(dx * dx + dy * dy)
    const radius = Math.min(canvas.width, canvas.height) * 0.35

    if (distance > radius * 0.3 && distance < radius * 1.1) {
      let angle = Math.atan2(dy, dx) + Math.PI / 2
      if (angle < 0) angle += Math.PI * 2

      const petalIndex = Math.floor((angle / (Math.PI * 2)) * 10)
      const mandalaNum = petalIndex + 1

      setSelectedMandala(mandalaNum)
      setSelectedHymn(null)
      setSelectedVerse(null)
      toast.success(`Maṇḍala ${mandalaNum} selected`)
    }
  }

  // Handle canvas hover
  const handleCanvasMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const dx = x - centerX
    const dy = y - centerY
    const distance = Math.sqrt(dx * dx + dy * dy)
    const radius = Math.min(canvas.width, canvas.height) * 0.35

    if (distance > radius * 0.3 && distance < radius * 1.1) {
      let angle = Math.atan2(dy, dx) + Math.PI / 2
      if (angle < 0) angle += Math.PI * 2

      const petalIndex = Math.floor((angle / (Math.PI * 2)) * 10)
      setHoveredPetal(petalIndex + 1)
    } else {
      setHoveredPetal(null)
    }
  }

  // Fetch verse from API
  const fetchVerse = async (mandala: number, hymn: number, verse: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/rigveda/verse?mandala=${mandala}&hymn=${hymn}&verse=${verse}`
      )
      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || "Failed to fetch verse")
        return
      }

      setSelectedVerse(data.data)
      setShowVerseSelector(false)
      toast.success("Verse loaded!")
    } catch (error) {
      console.error("Error fetching verse:", error)
      toast.error("Failed to fetch verse")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background relative">
      <DecorativePattern />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-4">
            Interactive Mandala Explorer
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A divine cosmic map of the Rigveda. Click on a petal to explore Maṇḍalas, Sūktas, and glowing verses.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {/* Mandala Chakra Visualization */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={700}
                height={700}
                onClick={handleCanvasClick}
                onMouseMove={handleCanvasMove}
                onMouseLeave={() => setHoveredPetal(null)}
                className="cursor-pointer rounded-lg border bg-card/30 backdrop-blur-sm shadow-xl"
              />
              
              {hoveredPetal && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-card border rounded-lg shadow-lg z-10">
                  <p className="text-sm font-medium font-heading">
                    {mandalas[hoveredPetal - 1].name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {mandalas[hoveredPetal - 1].hymns} hymns • {mandalas[hoveredPetal - 1].verses} verses
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Selected Mandala Info */}
          {selectedMandala && (
            <div className="mb-8 p-6 rounded-lg border bg-card/50 backdrop-blur-sm max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold font-heading" style={{ color: mandalas[selectedMandala - 1].color }}>
                  {mandalas[selectedMandala - 1].name}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedMandala(null)
                    setSelectedHymn(null)
                    setSelectedVerse(null)
                  }}
                >
                  Clear
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Hymns</p>
                  <p className="text-2xl font-bold">{mandalas[selectedMandala - 1].hymns}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Verses</p>
                  <p className="text-2xl font-bold">{mandalas[selectedMandala - 1].verses}</p>
                </div>
              </div>
            </div>
          )}

          {/* Verse Display */}
          {selectedVerse && !isLoading && (
            <div className="p-6 rounded-lg border bg-card/50 backdrop-blur-sm space-y-4 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-accent" />
                  <h3 className="text-2xl font-bold font-heading">
                    RV {selectedVerse.mandala}.{selectedVerse.hymn}.{selectedVerse.verse}
                  </h3>
                </div>
                {selectedVerse.deity && (
                  <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium">
                    {selectedVerse.deity}
                  </span>
                )}
              </div>

              <div className="p-4 rounded-lg bg-background/50 border">
                <p className="text-sm text-muted-foreground mb-2">Sanskrit</p>
                <p className="text-xl font-devanagari leading-relaxed">{selectedVerse.sanskrit}</p>
              </div>

              <div className="p-4 rounded-lg bg-background/50 border">
                <p className="text-sm text-muted-foreground mb-2">Transliteration</p>
                <p className="text-lg italic leading-relaxed">{selectedVerse.transliteration}</p>
              </div>

              <div className="p-4 rounded-lg bg-background/50 border">
                <p className="text-sm text-muted-foreground mb-2">Translation</p>
                <p className="text-lg leading-relaxed">{selectedVerse.translations.english}</p>
              </div>

              {selectedVerse.meter && (
                <div className="text-center text-sm text-muted-foreground">
                  Meter: {selectedVerse.meter}
                </div>
              )}
            </div>
          )}

          {isLoading && (
            <div className="p-12 rounded-lg border bg-card/50 backdrop-blur-sm text-center max-w-2xl mx-auto">
              <Loader2 className="h-12 w-12 mx-auto mb-4 text-primary animate-spin" />
              <p className="text-muted-foreground">Loading sacred verse...</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Hymn Selector - Right Edge */}
      {selectedMandala && !selectedHymn && (
        <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
          <Button
            size="icon"
            className="rounded-full w-14 h-14 shadow-lg"
            onClick={() => setShowHymnSelector(!showHymnSelector)}
          >
            <Sun className="w-6 h-6" />
          </Button>
          {showHymnSelector && (
            <div className="absolute right-16 top-0 w-80 max-h-96 overflow-y-auto bg-card border rounded-lg shadow-xl p-4">
              <h3 className="text-lg font-semibold font-heading mb-3">Select Hymn (Sūkta)</h3>
              <div className="grid grid-cols-5 gap-2">
                {[...Array(mandalas[selectedMandala - 1].hymns)].map((_, i) => {
                  const hymnNum = i + 1
                  return (
                    <button
                      key={hymnNum}
                      onClick={() => {
                        setSelectedHymn(hymnNum)
                        setShowHymnSelector(false)
                        setShowVerseSelector(true)
                      }}
                      className="p-2 rounded border hover:border-primary hover:bg-primary/5 transition-all text-sm"
                    >
                      {hymnNum}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Verse Selector - Right Edge */}
      {selectedHymn && (
        <div className="fixed right-4 top-1/2 translate-y-12 z-50">
          <Button
            size="icon"
            className="rounded-full w-14 h-14 shadow-lg bg-accent hover:bg-accent/90"
            onClick={() => setShowVerseSelector(!showVerseSelector)}
          >
            <Star className="w-6 h-6" />
          </Button>
          {showVerseSelector && (
            <div className="absolute right-16 top-0 w-80 max-h-96 overflow-y-auto bg-card border rounded-lg shadow-xl p-4">
              <h3 className="text-lg font-semibold font-heading mb-3">Select Verse (Ṛc)</h3>
              <div className="grid grid-cols-5 gap-2">
                {[...Array(20)].map((_, i) => {
                  const verseNum = i + 1
                  const isSelected = selectedVerse?.verse === verseNum
                  return (
                    <button
                      key={verseNum}
                      onClick={() => fetchVerse(selectedMandala!, selectedHymn, verseNum)}
                      className={`p-2 rounded border transition-all text-sm ${
                        isSelected 
                          ? "border-accent bg-accent text-accent-foreground" 
                          : "hover:border-accent hover:bg-accent/5"
                      }`}
                    >
                      {verseNum}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}