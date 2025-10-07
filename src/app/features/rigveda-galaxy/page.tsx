"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star, Sparkles, Loader2, ZoomIn, ZoomOut, Home } from "lucide-react"
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

interface GalaxyStar {
  id: string
  mandala: number
  hymn: number
  x: number
  y: number
  size: number
  color: string
  verses: number
  deity?: string
}

interface VersePlanet {
  verse: number
  angle: number
  distance: number
  data?: VerseData
}

export default function RigVedaGalaxyPage() {
  const [selectedStar, setSelectedStar] = useState<GalaxyStar | null>(null)
  const [versePlanets, setVersePlanets] = useState<VersePlanet[]>([])
  const [hoveredStar, setHoveredStar] = useState<GalaxyStar | null>(null)
  const [galaxyStars, setGalaxyStars] = useState<GalaxyStar[]>([])
  const [isLoadingVerse, setIsLoadingVerse] = useState(false)
  const [viewMode, setViewMode] = useState<"galaxy" | "solar">("galaxy")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  // Generate galaxy stars (each hymn is a star)
  useEffect(() => {
    const stars: GalaxyStar[] = []
    const mandalas = [
      { id: 1, hymns: 191, color: "#ff6b6b" },
      { id: 2, hymns: 43, color: "#ff9d4d" },
      { id: 3, hymns: 62, color: "#ffd93d" },
      { id: 4, hymns: 58, color: "#6bcf7f" },
      { id: 5, hymns: 87, color: "#4dabf7" },
      { id: 6, hymns: 75, color: "#748ffc" },
      { id: 7, hymns: 104, color: "#b197fc" },
      { id: 8, hymns: 103, color: "#f06595" },
      { id: 9, hymns: 114, color: "#ff8787" },
      { id: 10, hymns: 191, color: "#ffa94d" }
    ]

    mandalas.forEach((mandala) => {
      // Create spiral galaxy pattern for each mandala
      const armAngle = (mandala.id - 1) * ((Math.PI * 2) / 10)
      
      for (let h = 0; h < Math.min(mandala.hymns, 30); h++) {
        const t = h / 30
        const spiralAngle = armAngle + t * Math.PI * 4
        const radius = 100 + t * 350
        
        stars.push({
          id: `${mandala.id}-${h + 1}`,
          mandala: mandala.id,
          hymn: h + 1,
          x: 400 + Math.cos(spiralAngle) * radius + (Math.random() - 0.5) * 30,
          y: 400 + Math.sin(spiralAngle) * radius + (Math.random() - 0.5) * 30,
          size: 2 + Math.random() * 3,
          color: mandala.color,
          verses: Math.floor(5 + Math.random() * 15),
          deity: ["Agni", "Indra", "Soma", "Varuna", "Mitra"][Math.floor(Math.random() * 5)]
        })
      }
    })

    setGalaxyStars(stars)
  }, [])

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current) return

    let time = 0
    const animate = () => {
      drawGalaxy(time)
      time += 0.002
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [galaxyStars, hoveredStar, selectedStar, viewMode, versePlanets])

  // Draw galaxy or solar system
  const drawGalaxy = (time: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear with fade effect
    ctx.fillStyle = "rgba(8, 8, 16, 0.1)"
    ctx.fillRect(0, 0, width, height)

    if (viewMode === "galaxy") {
      // Draw nebula connections
      ctx.strokeStyle = "rgba(138, 43, 226, 0.05)"
      ctx.lineWidth = 1
      
      galaxyStars.forEach((star, i) => {
        if (i % 5 === 0) {
          const nearbyStars = galaxyStars.filter((s, j) => {
            if (i === j) return false
            const dx = s.x - star.x
            const dy = s.y - star.y
            return Math.sqrt(dx * dx + dy * dy) < 80
          })
          
          nearbyStars.forEach(nearby => {
            ctx.beginPath()
            ctx.moveTo(star.x, star.y)
            ctx.lineTo(nearby.x, nearby.y)
            ctx.stroke()
          })
        }
      })

      // Draw stars
      galaxyStars.forEach(star => {
        const isHovered = hoveredStar?.id === star.id
        const isSelected = selectedStar?.id === star.id
        
        // Star glow
        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 4)
        gradient.addColorStop(0, `${star.color}88`)
        gradient.addColorStop(1, "transparent")
        ctx.fillStyle = gradient
        ctx.fillRect(star.x - star.size * 4, star.y - star.size * 4, star.size * 8, star.size * 8)

        // Star core
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * (isHovered || isSelected ? 2.5 : 1.5), 0, Math.PI * 2)
        ctx.fillStyle = isSelected ? "#ffffff" : isHovered ? star.color : `${star.color}dd`
        ctx.fill()

        // Pulsing effect for selected/hovered
        if (isHovered || isSelected) {
          ctx.strokeStyle = `${star.color}66`
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 4 + Math.sin(time * 5) * 3, 0, Math.PI * 2)
          ctx.stroke()
        }
      })

      // Draw center black hole
      const centerGradient = ctx.createRadialGradient(400, 400, 0, 400, 400, 50)
      centerGradient.addColorStop(0, "rgba(138, 43, 226, 0.3)")
      centerGradient.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx.fillStyle = centerGradient
      ctx.beginPath()
      ctx.arc(400, 400, 50, 0, Math.PI * 2)
      ctx.fill()

    } else if (viewMode === "solar" && selectedStar) {
      // Solar system view - verses as orbiting planets
      const centerX = width / 2
      const centerY = height / 2

      // Draw star at center (the hymn)
      const starGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 40)
      starGradient.addColorStop(0, "#ffffff")
      starGradient.addColorStop(0.5, selectedStar.color)
      starGradient.addColorStop(1, "transparent")
      ctx.fillStyle = starGradient
      ctx.fillRect(centerX - 60, centerY - 60, 120, 120)

      ctx.beginPath()
      ctx.arc(centerX, centerY, 30, 0, Math.PI * 2)
      ctx.fillStyle = selectedStar.color
      ctx.fill()

      // Draw hymn info at center
      ctx.fillStyle = "#000000"
      ctx.font = "bold 16px Cinzel"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(`${selectedStar.mandala}.${selectedStar.hymn}`, centerX, centerY)

      // Draw orbiting verses (planets)
      versePlanets.forEach((planet, i) => {
        const orbitRadius = 80 + i * 45
        const angle = planet.angle + time * (1 + i * 0.2)
        const x = centerX + Math.cos(angle) * orbitRadius
        const y = centerY + Math.sin(angle) * orbitRadius

        // Orbit path
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(centerX, centerY, orbitRadius, 0, Math.PI * 2)
        ctx.stroke()

        // Planet glow
        const planetGradient = ctx.createRadialGradient(x, y, 0, x, y, 15)
        planetGradient.addColorStop(0, planet.data ? "#4dabf7" : "#ffffff")
        planetGradient.addColorStop(1, "transparent")
        ctx.fillStyle = planetGradient
        ctx.fillRect(x - 15, y - 15, 30, 30)

        // Planet
        ctx.beginPath()
        ctx.arc(x, y, planet.data ? 8 : 5, 0, Math.PI * 2)
        ctx.fillStyle = planet.data ? "#4dabf7" : "#ffffff88"
        ctx.fill()

        // Verse number
        ctx.fillStyle = "#ffffff"
        ctx.font = "12px Cinzel"
        ctx.textAlign = "center"
        ctx.fillText(`${planet.verse}`, x, y - 20)
      })
    }
  }

  // Handle canvas interaction
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (viewMode === "galaxy") {
      // Check if clicked on a star
      const clickedStar = galaxyStars.find(star => {
        const dx = star.x - x
        const dy = star.y - y
        return Math.sqrt(dx * dx + dy * dy) < star.size * 5
      })

      if (clickedStar) {
        setSelectedStar(clickedStar)
        
        // Generate orbiting verses
        const planets: VersePlanet[] = Array.from({ length: clickedStar.verses }, (_, i) => ({
          verse: i + 1,
          angle: (i / clickedStar.verses) * Math.PI * 2,
          distance: 80 + i * 45
        }))
        setVersePlanets(planets)
        setViewMode("solar")
        toast.success(`Zooming into Sūkta ${clickedStar.mandala}.${clickedStar.hymn}`)
      }
    } else if (viewMode === "solar" && selectedStar) {
      // Check if clicked on a planet (verse)
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      versePlanets.forEach((planet, i) => {
        const orbitRadius = 80 + i * 45
        const angle = planet.angle
        const px = centerX + Math.cos(angle) * orbitRadius
        const py = centerY + Math.sin(angle) * orbitRadius
        const dx = px - x
        const dy = py - y

        if (Math.sqrt(dx * dx + dy * dy) < 15) {
          loadVerse(selectedStar.mandala, selectedStar.hymn, planet.verse, i)
        }
      })
    }
  }

  // Handle canvas hover
  const handleCanvasMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (viewMode !== "galaxy") return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const hoveredStarFound = galaxyStars.find(star => {
      const dx = star.x - x
      const dy = star.y - y
      return Math.sqrt(dx * dx + dy * dy) < star.size * 5
    })

    setHoveredStar(hoveredStarFound || null)
  }

  // Load verse data
  const loadVerse = async (mandala: number, hymn: number, verse: number, planetIndex: number) => {
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

      // Update planet with verse data
      setVersePlanets(prev => prev.map((p, i) => 
        i === planetIndex ? { ...p, data: data.data } : p
      ))
      toast.success("Verse loaded!")
    } catch (error) {
      console.error("Error fetching verse:", error)
      toast.error("Failed to fetch verse")
    } finally {
      setIsLoadingVerse(false)
    }
  }

  // Reset to galaxy view
  const resetView = () => {
    setViewMode("galaxy")
    setSelectedStar(null)
    setVersePlanets([])
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Stars background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.3
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/features">
            <Button variant="ghost" className="gap-2 text-white border-white/20 hover:bg-white/10">
              <ArrowLeft className="w-4 h-4" />
              Back to Features
            </Button>
          </Link>

          {viewMode === "solar" && (
            <Button onClick={resetView} variant="outline" className="gap-2 text-white border-white/20 hover:bg-white/10">
              <Home className="w-4 h-4" />
              Return to Galaxy
            </Button>
          )}
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-12 w-12 text-purple-400 animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Rig Veda Galaxy
            </h1>
            <Sparkles className="h-12 w-12 text-blue-400 animate-pulse" />
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            {viewMode === "galaxy" 
              ? "A cosmic universe of poetry. Each star is a Sūkta (hymn). Click to zoom into verses as orbiting planets."
              : "Verses orbit like planets around the hymn. Click a planet to read the sacred verse."
            }
          </p>
        </div>

        {/* Main Canvas */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={800}
              onClick={handleCanvasClick}
              onMouseMove={handleCanvasMove}
              onMouseLeave={() => setHoveredStar(null)}
              className="w-full cursor-pointer rounded-2xl border-2 border-purple-500/30 shadow-2xl shadow-purple-500/20"
              style={{ background: "radial-gradient(circle, #0a0a1a 0%, #000000 100%)" }}
            />

            {/* Hover tooltip */}
            {hoveredStar && viewMode === "galaxy" && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/90 border border-purple-500/50 rounded-lg shadow-lg z-10">
                <p className="text-white text-sm font-medium">
                  Sūkta {hoveredStar.mandala}.{hoveredStar.hymn}
                </p>
                <p className="text-gray-400 text-xs">
                  {hoveredStar.verses} verses • {hoveredStar.deity}
                </p>
              </div>
            )}

            {/* Loading indicator */}
            {isLoadingVerse && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
                <div className="px-6 py-4 bg-black/90 border border-purple-500/50 rounded-lg">
                  <Loader2 className="h-8 w-8 text-purple-400 animate-spin mx-auto mb-2" />
                  <p className="text-white text-sm">Loading verse...</p>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              {viewMode === "galaxy" 
                ? "Explore the cosmic map • Each star glows when hovered • Click to zoom into a hymn"
                : "Verses orbit like planets • Click any planet to reveal its sacred text"
              }
            </p>
          </div>
        </div>

        {/* Verse Display */}
        {versePlanets.some(p => p.data) && (
          <div className="max-w-4xl mx-auto mt-12 space-y-6">
            {versePlanets.filter(p => p.data).map((planet, i) => (
              <div 
                key={i}
                className="p-6 rounded-2xl border-2 border-blue-500/30 bg-black/50 backdrop-blur-sm space-y-4 animate-in fade-in slide-in-from-bottom-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 text-blue-400 animate-pulse" />
                    <h3 className="text-2xl font-bold text-white">
                      RV {planet.data!.mandala}.{planet.data!.hymn}.{planet.data!.verse}
                    </h3>
                  </div>
                  {planet.data!.deity && (
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium border border-purple-500/30">
                      {planet.data!.deity}
                    </span>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-gray-400 mb-2">Sanskrit</p>
                  <p className="text-xl font-devanagari leading-relaxed text-white">{planet.data!.sanskrit}</p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-gray-400 mb-2">Transliteration</p>
                  <p className="text-lg italic leading-relaxed text-gray-200">{planet.data!.transliteration}</p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-gray-400 mb-2">Translation</p>
                  <p className="text-lg leading-relaxed text-gray-100">{planet.data!.translations.english}</p>
                </div>

                {planet.data!.meter && (
                  <div className="text-center text-sm text-gray-400">
                    Meter: {planet.data!.meter}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}