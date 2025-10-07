"use client"

import { useState } from "react"
import { DecorativePattern } from "@/components/mystical/decorative-pattern"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Network, Flame, Zap, Sun, Moon, Wind, Droplets, Star } from "lucide-react"

interface Deity {
  id: string
  name: string
  icon: any
  color: string
  generation: number
  parents?: string[]
  biography: {
    title: string
    role: string
    attributes: string[]
    myths: string[]
    associations: string[]
  }
}

const deities: Deity[] = [
  {
    id: "dyaus",
    name: "Dyaus Pitṛ",
    icon: Sun,
    color: "#EAB308",
    generation: 1,
    biography: {
      title: "Sky Father",
      role: "Primordial deity of the sky",
      attributes: ["Father of all", "Heaven", "Celestial vault"],
      myths: [
        "Father of Indra and many other gods",
        "Consort of Pṛthivī (Earth)",
        "Represents the masculine cosmic principle"
      ],
      associations: ["Sky", "Thunder", "Rain"]
    }
  },
  {
    id: "prithivi",
    name: "Pṛthivī Mātā",
    icon: Moon,
    color: "#84CC16",
    generation: 1,
    biography: {
      title: "Earth Mother",
      role: "Primordial goddess of the earth",
      attributes: ["Mother of all", "Fertile earth", "Nurturing"],
      myths: [
        "Mother of Indra and many other gods",
        "Consort of Dyaus (Sky)",
        "Represents the feminine cosmic principle"
      ],
      associations: ["Earth", "Fertility", "Stability"]
    }
  },
  {
    id: "indra",
    name: "Indra",
    icon: Zap,
    color: "#2563EB",
    generation: 2,
    parents: ["dyaus", "prithivi"],
    biography: {
      title: "King of the Gods",
      role: "God of thunder, rain, and war",
      attributes: ["Vajra (thunderbolt)", "Warrior", "Soma drinker"],
      myths: [
        "Slayer of Vṛtra, the drought demon",
        "Released the waters for humanity",
        "Most invoked deity in the Rigveda (250+ hymns)",
        "Protector of dharma and cosmic order"
      ],
      associations: ["Thunder", "Rain", "Battle", "Victory"]
    }
  },
  {
    id: "agni",
    name: "Agni",
    icon: Flame,
    color: "#D97706",
    generation: 2,
    parents: ["dyaus"],
    biography: {
      title: "God of Fire",
      role: "Divine messenger and priest of the gods",
      attributes: ["Sacred fire", "Purification", "Transformation"],
      myths: [
        "Born from the friction of two fire-sticks",
        "Mediator between gods and humans",
        "Second most invoked deity (200+ hymns)",
        "Present in all three realms: earth, atmosphere, heaven"
      ],
      associations: ["Fire", "Sacrifice", "Home hearth", "Lightning"]
    }
  },
  {
    id: "ushas",
    name: "Uṣas",
    icon: Star,
    color: "#EC4899",
    generation: 2,
    parents: ["dyaus"],
    biography: {
      title: "Goddess of Dawn",
      role: "Deity of the morning light",
      attributes: ["Radiant beauty", "Renewal", "Hope"],
      myths: [
        "Daughter of Dyaus",
        "Awakens all living beings",
        "Drives away darkness and evil",
        "Praised in 20+ hymns"
      ],
      associations: ["Dawn", "Light", "Beginning", "Beauty"]
    }
  },
  {
    id: "maruts",
    name: "Maruts",
    icon: Wind,
    color: "#10B981",
    generation: 3,
    parents: ["indra"],
    biography: {
      title: "Storm Gods",
      role: "Companions of Indra in battle",
      attributes: ["Storm clouds", "Wind", "Rain"],
      myths: [
        "Born from Rudra or companions of Indra",
        "Fierce warriors who ride storm clouds",
        "Assist Indra in his battles",
        "Praised in 30+ hymns"
      ],
      associations: ["Storms", "Wind", "Thunder", "Battle"]
    }
  },
  {
    id: "asvins",
    name: "Aśvins",
    icon: Sun,
    color: "#F59E0B",
    generation: 3,
    parents: ["dyaus"],
    biography: {
      title: "Divine Twins",
      role: "Gods of medicine and healing",
      attributes: ["Horse-headed", "Healers", "Youth"],
      myths: [
        "Twin sons of the sky god",
        "Rescued many in distress",
        "Brought youth and vitality",
        "Praised in 50+ hymns"
      ],
      associations: ["Healing", "Dawn", "Horses", "Rescue"]
    }
  },
  {
    id: "soma",
    name: "Soma Pavamāna",
    icon: Droplets,
    color: "#8B5CF6",
    generation: 2,
    parents: ["dyaus"],
    biography: {
      title: "Sacred Plant Deity",
      role: "God of the sacred soma plant and ritual drink",
      attributes: ["Intoxication", "Purification", "Immortality"],
      myths: [
        "Entire Mandala 9 (114 hymns) dedicated to Soma",
        "Gives immortality to the gods",
        "Purified through flowing waters",
        "Source of poetic inspiration"
      ],
      associations: ["Soma plant", "Moon", "Intoxication", "Ritual"]
    }
  }
]

export default function DeityNetworkPage() {
  const [selectedDeity, setSelectedDeity] = useState<Deity | null>(null)
  const [showBiography, setShowBiography] = useState(false)

  const getPosition = (deity: Deity, index: number, total: number) => {
    const generationCounts = [0, 0, 0, 0]
    const generationIndices = [0, 0, 0, 0]
    
    deities.forEach(d => {
      generationCounts[d.generation - 1]++
    })
    
    deities.forEach((d, i) => {
      if (i < deities.indexOf(deity)) {
        if (d.generation === deity.generation) {
          generationIndices[d.generation - 1]++
        }
      }
    })
    
    const genIndex = generationIndices[deity.generation - 1]
    const genTotal = generationCounts[deity.generation - 1]
    
    const x = ((genIndex + 1) / (genTotal + 1)) * 100
    const y = ((deity.generation - 0.5) / 3.5) * 100
    
    return { x, y }
  }

  const getParentConnections = (deity: Deity) => {
    if (!deity.parents) return []
    return deity.parents.map(parentId => {
      const parent = deities.find(d => d.id === parentId)
      return parent ? { parent, child: deity } : null
    }).filter(Boolean)
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <DecorativePattern />
      
      <div className="container mx-auto px-4 py-4 max-w-7xl relative z-10">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Network className="h-10 w-10 text-primary animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Deity Relationship Web
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore divine hierarchies and family lineages
          </p>
        </div>

        {/* Family Tree Visualization */}
        <Card className="border-2 shadow-xl mb-6">
          <CardHeader>
            <CardTitle>Divine Family Tree</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-[600px] bg-gradient-to-br from-primary/5 via-background to-accent/5 rounded-2xl p-8 border-2 border-border overflow-hidden">
              <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" className="text-primary/40" />
                  </marker>
                </defs>

                {/* Connection lines */}
                {deities.map(deity => {
                  const connections = getParentConnections(deity)
                  const childPos = getPosition(deity, deities.indexOf(deity), deities.length)
                  
                  return connections.map((conn, idx) => {
                    if (!conn) return null
                    const parentPos = getPosition(conn.parent, deities.indexOf(conn.parent), deities.length)
                    
                    return (
                      <g key={`${deity.id}-${idx}`}>
                        <line
                          x1={parentPos.x}
                          y1={parentPos.y}
                          x2={childPos.x}
                          y2={childPos.y}
                          stroke="currentColor"
                          strokeWidth="0.3"
                          className="text-primary/40"
                          markerEnd="url(#arrowhead)"
                        />
                      </g>
                    )
                  })
                })}

                {/* Deity nodes */}
                {deities.map((deity, idx) => {
                  const Icon = deity.icon
                  const pos = getPosition(deity, idx, deities.length)
                  const isSelected = selectedDeity?.id === deity.id
                  
                  return (
                    <g 
                      key={deity.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSelectedDeity(deity)
                        setShowBiography(true)
                      }}
                    >
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={isSelected ? 6 : 4}
                        fill={deity.color}
                        className={isSelected ? "animate-pulse" : ""}
                        filter={isSelected ? "url(#glow)" : ""}
                      />
                      <text
                        x={pos.x}
                        y={pos.y + 9}
                        textAnchor="middle"
                        fontSize="3.5"
                        fontWeight="bold"
                        className="fill-foreground"
                      >
                        {deity.name}
                      </text>
                    </g>
                  )
                })}

                {/* Generation labels */}
                <text x="2" y="15" fontSize="3" className="fill-muted-foreground">Generation 1</text>
                <text x="2" y="43" fontSize="3" className="fill-muted-foreground">Generation 2</text>
                <text x="2" y="72" fontSize="3" className="fill-muted-foreground">Generation 3</text>
              </svg>
            </div>
            <div className="text-center text-sm text-muted-foreground mt-4">
              Click on any deity to view their biography
            </div>
          </CardContent>
        </Card>

        {/* Biography Dialog */}
        <Dialog open={showBiography} onOpenChange={setShowBiography}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            {selectedDeity && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent">
                      <selectedDeity.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div>{selectedDeity.name}</div>
                      <div className="text-sm font-normal text-muted-foreground">
                        {selectedDeity.biography.title}
                      </div>
                    </div>
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                  {/* Role */}
                  <div>
                    <h3 className="font-semibold mb-2">Role</h3>
                    <p className="text-muted-foreground">{selectedDeity.biography.role}</p>
                  </div>

                  {/* Attributes */}
                  <div>
                    <h3 className="font-semibold mb-2">Attributes</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedDeity.biography.attributes.map((attr, idx) => (
                        <Badge key={idx} variant="secondary">{attr}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Myths */}
                  <div>
                    <h3 className="font-semibold mb-2">Myths & Stories</h3>
                    <ul className="space-y-2">
                      {selectedDeity.biography.myths.map((myth, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-primary mt-1">•</span>
                          <span>{myth}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Associations */}
                  <div>
                    <h3 className="font-semibold mb-2">Associations</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedDeity.biography.associations.map((assoc, idx) => (
                        <Badge key={idx} variant="outline">{assoc}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Parents */}
                  {selectedDeity.parents && (
                    <div>
                      <h3 className="font-semibold mb-2">Parents</h3>
                      <div className="flex gap-2">
                        {selectedDeity.parents.map(parentId => {
                          const parent = deities.find(d => d.id === parentId)
                          if (!parent) return null
                          const Icon = parent.icon
                          return (
                            <Button
                              key={parentId}
                              variant="outline"
                              className="gap-2"
                              onClick={() => {
                                setSelectedDeity(parent)
                              }}
                            >
                              <Icon className="w-4 h-4" style={{ color: parent.color }} />
                              {parent.name}
                            </Button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Generation */}
                  <div>
                    <h3 className="font-semibold mb-2">Generation</h3>
                    <Badge className="bg-gradient-to-r from-primary to-accent">
                      Generation {selectedDeity.generation}
                    </Badge>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Legend */}
        <Card className="border-2 shadow-xl">
          <CardHeader>
            <CardTitle>Deity Generations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">Generation 1</Badge>
                <span className="text-sm">Primordial deities (Dyaus, Pṛthivī)</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">Generation 2</Badge>
                <span className="text-sm">Major deities (Indra, Agni, Soma, Uṣas)</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">Generation 3</Badge>
                <span className="text-sm">Minor deities and groups (Maruts, Aśvins)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}