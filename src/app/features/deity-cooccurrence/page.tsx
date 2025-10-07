"use client"

import { useState } from "react"
import { DecorativePattern } from "@/components/mystical/decorative-pattern"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Flame, Zap, Moon, Sun, Wind, Droplets, Mountain, Star, ExternalLink } from "lucide-react"

const deityData = [
  { id: "agni", name: "Agni", icon: Flame, color: "#D97706", bgColor: "bg-orange-100", borderColor: "border-orange-500" },
  { id: "indra", name: "Indra", icon: Zap, color: "#2563EB", bgColor: "bg-blue-100", borderColor: "border-blue-500" },
  { id: "soma", name: "Soma", icon: Droplets, color: "#8B5CF6", bgColor: "bg-purple-100", borderColor: "border-purple-500" },
  { id: "surya", name: "Sūrya", icon: Sun, color: "#F59E0B", bgColor: "bg-amber-100", borderColor: "border-amber-500" },
  { id: "vayu", name: "Vāyu", icon: Wind, color: "#06B6D4", bgColor: "bg-cyan-100", borderColor: "border-cyan-500" },
  { id: "varuna", name: "Varuṇa", icon: Moon, color: "#3B82F6", bgColor: "bg-blue-100", borderColor: "border-blue-500" },
  { id: "mitra", name: "Mitra", icon: Star, color: "#EC4899", bgColor: "bg-pink-100", borderColor: "border-pink-500" },
  { id: "maruts", name: "Maruts", icon: Mountain, color: "#10B981", bgColor: "bg-green-100", borderColor: "border-green-500" },
]

interface CooccurrenceDetail {
  from: string
  to: string
  frequency: number
  mandalas: { mandala: number, hymns: string[] }[]
}

const cooccurrenceData: CooccurrenceDetail[] = [
  { 
    from: "agni", to: "indra", frequency: 145, 
    mandalas: [
      { mandala: 1, hymns: ["1.1", "1.3", "1.12"] },
      { mandala: 2, hymns: ["2.1", "2.3"] },
      { mandala: 3, hymns: ["3.2", "3.5"] }
    ]
  },
  { 
    from: "agni", to: "soma", frequency: 89,
    mandalas: [
      { mandala: 1, hymns: ["1.2", "1.4"] },
      { mandala: 8, hymns: ["8.1"] },
      { mandala: 9, hymns: ["9.1", "9.5"] }
    ]
  },
  { 
    from: "indra", to: "soma", frequency: 234,
    mandalas: [
      { mandala: 1, hymns: ["1.5", "1.8"] },
      { mandala: 8, hymns: ["8.2", "8.6"] },
      { mandala: 9, hymns: ["9.2", "9.7"] },
      { mandala: 10, hymns: ["10.3"] }
    ]
  },
  { 
    from: "indra", to: "maruts", frequency: 167,
    mandalas: [
      { mandala: 1, hymns: ["1.6", "1.9"] },
      { mandala: 2, hymns: ["2.2"] },
      { mandala: 5, hymns: ["5.3"] },
      { mandala: 8, hymns: ["8.4"] }
    ]
  },
  { 
    from: "soma", to: "surya", frequency: 32,
    mandalas: [
      { mandala: 9, hymns: ["9.3", "9.8"] },
      { mandala: 10, hymns: ["10.1"] }
    ]
  },
  { 
    from: "agni", to: "vayu", frequency: 67,
    mandalas: [
      { mandala: 1, hymns: ["1.7"] },
      { mandala: 2, hymns: ["2.4"] },
      { mandala: 7, hymns: ["7.1"] }
    ]
  },
  { 
    from: "varuna", to: "mitra", frequency: 198,
    mandalas: [
      { mandala: 1, hymns: ["1.10"] },
      { mandala: 5, hymns: ["5.1", "5.4"] },
      { mandala: 7, hymns: ["7.2", "7.5"] },
      { mandala: 8, hymns: ["8.3"] }
    ]
  },
  { 
    from: "indra", to: "vayu", frequency: 78,
    mandalas: [
      { mandala: 1, hymns: ["1.11"] },
      { mandala: 10, hymns: ["10.2"] }
    ]
  },
  { 
    from: "agni", to: "surya", frequency: 54,
    mandalas: [
      { mandala: 1, hymns: ["1.13"] },
      { mandala: 5, hymns: ["5.2"] },
      { mandala: 7, hymns: ["7.3"] }
    ]
  },
]

export default function DeityCooccurrencePage() {
  const [selectedDeity, setSelectedDeity] = useState<string | null>(null)
  const [selectedConnection, setSelectedConnection] = useState<CooccurrenceDetail | null>(null)
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null)

  const getRelatedDeities = (deityId: string) => {
    return cooccurrenceData
      .filter(d => d.from === deityId || d.to === deityId)
      .map(d => ({
        connection: d,
        deity: d.from === deityId ? d.to : d.from,
        frequency: d.frequency
      }))
      .sort((a, b) => b.frequency - a.frequency)
  }

  const getMaxCount = () => Math.max(...cooccurrenceData.map(d => d.frequency))

  const getConnectionKey = (from: string, to: string) => `${from}-${to}`

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <DecorativePattern />
      
      <div className="container mx-auto px-4 py-4 max-w-7xl relative z-10">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="h-10 w-10 text-primary animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold">Deity Co-occurrence</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover which deities are invoked together across the Rigveda
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Deity selection */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Select Deity</CardTitle>
              <CardDescription>Click to explore connections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {deityData.map((deity) => {
                const Icon = deity.icon
                const connections = getRelatedDeities(deity.id)
                const isSelected = selectedDeity === deity.id
                
                return (
                  <button
                    key={deity.id}
                    onClick={() => {
                      setSelectedDeity(deity.id)
                      setSelectedConnection(null)
                    }}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all hover:scale-102 ${
                      isSelected
                        ? `${deity.borderColor} ${deity.bgColor} shadow-lg`
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${deity.bgColor}`}>
                          <Icon className="w-6 h-6" style={{ color: deity.color }} />
                        </div>
                        <div>
                          <div className="font-bold text-lg">{deity.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {connections.length} connections
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <Badge variant="default" className="text-xs">Active</Badge>
                      )}
                    </div>
                  </button>
                )
              })}
            </CardContent>
          </Card>

          {/* Visualization with curved lines */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Co-occurrence Network</CardTitle>
                <CardDescription>
                  {selectedDeity 
                    ? `Showing connections for ${deityData.find(d => d.id === selectedDeity)?.name}`
                    : "Select a deity to visualize connections"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-square w-full max-w-2xl mx-auto bg-gradient-to-br from-primary/5 via-background to-accent/5 rounded-2xl p-8 border-2 border-border">
                  <svg viewBox="0 0 400 400" className="w-full h-full">
                    <defs>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Curved connection lines */}
                    {selectedDeity && getRelatedDeities(selectedDeity).map((rel, idx) => {
                      const fromIdx = deityData.findIndex(d => d.id === selectedDeity)
                      const toIdx = deityData.findIndex(d => d.id === rel.deity)
                      const fromAngle = (fromIdx / deityData.length) * 2 * Math.PI - Math.PI / 2
                      const toAngle = (toIdx / deityData.length) * 2 * Math.PI - Math.PI / 2
                      const radius = 45
                      const fromX = 50 + radius * Math.cos(fromAngle)
                      const fromY = 50 + radius * Math.sin(fromAngle)
                      const toX = 50 + radius * Math.cos(toAngle)
                      const toY = 50 + radius * Math.sin(toAngle)
                      
                      const strokeWidth = Math.max(3, (rel.frequency / getMaxCount()) * 10)
                      const connectionKey = getConnectionKey(rel.connection.from, rel.connection.to)
                      const isHovered = hoveredConnection === connectionKey

                      return (
                        <g key={idx}>
                          <path
                            d={`M ${fromX} ${fromY} L ${toX} ${toY}`}
                            stroke={isHovered ? deityData.find(d => d.id === rel.deity)?.color : "currentColor"}
                            strokeWidth={isHovered ? strokeWidth + 2 : strokeWidth}
                            fill="none"
                            className={isHovered ? "" : "text-primary/40"}
                            filter={isHovered ? "url(#glow)" : ""}
                            style={{ cursor: "pointer" }}
                            onMouseEnter={() => setHoveredConnection(connectionKey)}
                            onMouseLeave={() => setHoveredConnection(null)}
                            onClick={() => setSelectedConnection(rel.connection)}
                          />
                          {isHovered && (
                            <text
                              x={(fromX + toX) / 2}
                              y={(fromY + toY) / 2}
                              textAnchor="middle"
                              fontSize="12"
                              fontWeight="bold"
                              className="fill-primary"
                            >
                              {rel.frequency}
                            </text>
                          )}
                        </g>
                      )
                    })}

                    {/* Deity nodes */}
                    {deityData.map((deity, idx) => {
                      const angle = (idx / deityData.length) * 2 * Math.PI - Math.PI / 2
                      const radius = 45
                      const x = 50 + radius * Math.cos(angle)
                      const y = 50 + radius * Math.sin(angle)
                      const isHighlighted = selectedDeity === deity.id
                      const isConnected = selectedDeity && cooccurrenceData.some(
                        d => (d.from === selectedDeity && d.to === deity.id) || 
                             (d.to === selectedDeity && d.from === deity.id)
                      )
                      const nodeSize = isHighlighted ? 22 : isConnected ? 18 : 14

                      return (
                        <g key={deity.id}>
                          <circle
                            cx={`${x}%`}
                            cy={`${y}%`}
                            r={nodeSize}
                            fill={deity.color}
                            className={`${
                              isHighlighted ? "animate-pulse" : ""
                            }`}
                            filter={isHighlighted || isConnected ? "url(#glow)" : ""}
                            style={{ cursor: "pointer" }}
                            onClick={() => setSelectedDeity(deity.id)}
                          />
                          <text
                            x={`${x}%`}
                            y={`${y + 10}%`}
                            textAnchor="middle"
                            fontSize="11"
                            fontWeight="bold"
                            className={`${
                              isHighlighted ? "fill-primary" : 
                              isConnected ? "fill-accent" : "fill-muted-foreground"
                            }`}
                          >
                            {deity.name.slice(0, 1)}
                          </text>
                        </g>
                      )
                    })}

                    {/* Center text */}
                    <text
                      x="50%"
                      y="48%"
                      textAnchor="middle"
                      fontSize="32"
                      fontWeight="bold"
                      className="fill-primary"
                    >
                      {selectedDeity ? getRelatedDeities(selectedDeity).length : "?"}
                    </text>
                    <text
                      x="50%"
                      y="56%"
                      textAnchor="middle"
                      fontSize="11"
                      className="fill-muted-foreground"
                    >
                      {selectedDeity ? "connections" : "Select deity"}
                    </text>
                  </svg>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Connection Details Block */}
        {selectedConnection && (
          <Card className="border-2 border-primary/30 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="w-6 h-6 text-primary" />
                Connection Details: {deityData.find(d => d.id === selectedConnection.from)?.name} & {deityData.find(d => d.id === selectedConnection.to)?.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-primary">{selectedConnection.frequency}</div>
                    <div className="text-sm text-muted-foreground">Total Co-invocations</div>
                  </CardContent>
                </Card>
                <Card className="bg-accent/5 border-accent/20">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-accent">{selectedConnection.mandalas.length}</div>
                    <div className="text-sm text-muted-foreground">Maṇḍalas</div>
                  </CardContent>
                </Card>
                <Card className="bg-secondary/5 border-secondary/20">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-secondary">
                      {selectedConnection.mandalas.reduce((sum, m) => sum + m.hymns.length, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Hymns</div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Maṇḍalas & Hymns</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedConnection.mandalas.map((m) => (
                    <Card key={m.mandala} className="border-2">
                      <CardContent className="p-4">
                        <div className="font-bold mb-2 flex items-center gap-2">
                          <Badge>Maṇḍala {m.mandala}</Badge>
                          <span className="text-xs text-muted-foreground">{m.hymns.length} hymns</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {m.hymns.map(hymn => (
                            <a
                              key={hymn}
                              href={`https://vedaweb.uni-koeln.de/${hymn.replace('.', '/')}/`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs px-2 py-1 rounded bg-muted hover:bg-primary hover:text-primary-foreground transition-all"
                            >
                              {hymn}
                            </a>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <ExternalLink className="w-4 h-4" />
                  <span>Click hymn numbers to view in VedaWeb</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Connection details */}
        {selectedDeity && !selectedConnection && (
          <Card className="border-2 border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {(() => {
                  const deity = deityData.find(d => d.id === selectedDeity)
                  if (!deity) return null
                  const Icon = deity.icon
                  return (
                    <>
                      <div className={`p-2 rounded-lg ${deity.bgColor}`}>
                        <Icon className="w-6 h-6" style={{ color: deity.color }} />
                      </div>
                      <span>{deity.name} - Co-invoked Deities</span>
                    </>
                  )
                })()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getRelatedDeities(selectedDeity).map((rel, idx) => {
                  const deity = deityData.find(d => d.id === rel.deity)
                  if (!deity) return null
                  const Icon = deity.icon
                  const percentage = ((rel.frequency / getMaxCount()) * 100).toFixed(1)
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedConnection(rel.connection)}
                      className={`p-4 rounded-xl border-2 ${deity.borderColor} ${deity.bgColor} hover:scale-105 transition-all text-left`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <Icon className="w-8 h-8" style={{ color: deity.color }} />
                          <div>
                            <div className="font-bold text-lg">{deity.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {rel.connection.mandalas.length} Mandalas
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Co-occurrences</span>
                          <Badge variant="secondary" className="font-bold">
                            {rel.frequency}
                          </Badge>
                        </div>
                        
                        <div className="w-full bg-muted/50 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: deity.color
                            }}
                          />
                        </div>
                        
                        <div className="text-xs text-muted-foreground mt-2">
                          Click to view details
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Co-invocation Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30">
                <div className="text-4xl font-bold text-primary mb-2">
                  {cooccurrenceData.reduce((sum, d) => sum + d.frequency, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Co-invocations</div>
              </div>
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 border-2 border-accent/30">
                <div className="text-4xl font-bold text-accent mb-2">{deityData.length}</div>
                <div className="text-sm text-muted-foreground">Major Deities</div>
              </div>
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 border-2 border-secondary/30">
                <div className="text-4xl font-bold text-secondary mb-2">{cooccurrenceData.length}</div>
                <div className="text-sm text-muted-foreground">Connection Pairs</div>
              </div>
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-muted to-muted/5 border-2 border-border">
                <div className="text-4xl font-bold mb-2">{getMaxCount()}</div>
                <div className="text-sm text-muted-foreground">Strongest Link</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}