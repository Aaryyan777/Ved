"use client"

import { useState } from "react"
import { DecorativePattern } from "@/components/mystical/decorative-pattern"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Flame } from "lucide-react"

// Total invocations across all mandalas (25 deities)
const deityInvocations = [
  { name: "Indra", total: 289, icon: "⚡", color: "#8B7355", mandalas: [50, 11, 30, 42, 46, 44, 50, 72, 8, 50] },
  { name: "Agni", total: 218, icon: "🔥", color: "#A0826D", mandalas: [75, 20, 22, 25, 35, 28, 42, 30, 5, 45] },
  { name: "Soma", total: 123, icon: "🌙", color: "#8B7665", mandalas: [15, 2, 5, 8, 6, 4, 10, 15, 114, 25] },
  { name: "Aśvins", total: 56, icon: "🐎", color: "#967259", mandalas: [12, 1, 4, 6, 5, 4, 5, 8, 2, 15] },
  { name: "Maruts", total: 95, icon: "💨", color: "#8B6F47", mandalas: [20, 2, 6, 10, 12, 8, 14, 10, 5, 18] },
  { name: "Uṣas", total: 63, icon: "🌅", color: "#C19A6B", mandalas: [18, 1, 3, 4, 6, 5, 8, 4, 2, 14] },
  { name: "Sūrya", total: 45, icon: "☀️", color: "#DAA520", mandalas: [8, 2, 5, 6, 7, 4, 5, 3, 1, 8] },
  { name: "Varuṇa", total: 46, icon: "🌊", color: "#708090", mandalas: [10, 3, 2, 5, 4, 3, 6, 4, 2, 12] },
  { name: "Mitra", total: 42, icon: "🤝", color: "#B8860B", mandalas: [8, 3, 2, 4, 5, 3, 6, 3, 1, 10] },
  { name: "Viṣṇu", total: 38, icon: "🦅", color: "#8B7D6B", mandalas: [7, 2, 3, 5, 6, 3, 4, 3, 2, 6] },
  { name: "Rudra", total: 32, icon: "🏹", color: "#A0522D", mandalas: [5, 2, 2, 4, 5, 3, 4, 2, 1, 5] },
  { name: "Bṛhaspati", total: 28, icon: "📚", color: "#CD853F", mandalas: [4, 3, 2, 3, 4, 2, 3, 2, 1, 6] },
  { name: "Pūṣan", total: 25, icon: "🐐", color: "#8B8378", mandalas: [3, 1, 2, 3, 4, 2, 3, 2, 1, 5] },
  { name: "Sarasvatī", total: 22, icon: "📖", color: "#8B7E66", mandalas: [3, 1, 2, 2, 3, 2, 3, 2, 1, 4] },
  { name: "Viśvedevas", total: 45, icon: "✨", color: "#9B8B7E", mandalas: [6, 2, 4, 5, 6, 4, 5, 4, 2, 8] },
  { name: "Dyāvā-Pṛthivī", total: 20, icon: "🌍", color: "#8B8970", mandalas: [3, 1, 2, 2, 3, 2, 2, 2, 1, 3] },
  { name: "Parjanya", total: 18, icon: "🌧️", color: "#778899", mandalas: [2, 1, 2, 2, 3, 2, 2, 2, 1, 2] },
  { name: "Aryaman", total: 16, icon: "🛡️", color: "#D2B48C", mandalas: [2, 1, 2, 2, 2, 2, 2, 1, 1, 2] },
  { name: "Yama", total: 15, icon: "⚰️", color: "#696969", mandalas: [2, 1, 1, 2, 2, 1, 2, 1, 1, 3] },
  { name: "Ṛbhus", total: 14, icon: "🔨", color: "#BC8F8F", mandalas: [2, 1, 1, 2, 2, 1, 2, 1, 1, 2] },
  { name: "Savitṛ", total: 35, icon: "🌞", color: "#DAA06D", mandalas: [5, 2, 3, 4, 5, 3, 4, 3, 2, 6] },
  { name: "Ratri", total: 12, icon: "🌙", color: "#2F4F4F", mandalas: [2, 1, 1, 2, 2, 1, 1, 1, 1, 1] },
  { name: "Vāyu", total: 30, icon: "🌬️", color: "#8B8682", mandalas: [4, 2, 2, 3, 4, 3, 3, 3, 2, 5] },
  { name: "Apām Napāt", total: 11, icon: "💧", color: "#708090", mandalas: [2, 1, 1, 1, 2, 1, 1, 1, 1, 1] },
  { name: "Tvaṣṭṛ", total: 13, icon: "⚒️", color: "#8B4513", mandalas: [2, 1, 1, 2, 2, 1, 2, 1, 1, 1] }
]

export default function GodPopularityPage() {
  const [viewMode, setViewMode] = useState<"total" | "mandala">("total")
  const [selectedMandala, setSelectedMandala] = useState(1)

  const getSortedDeities = () => {
    if (viewMode === "total") {
      return [...deityInvocations].sort((a, b) => b.total - a.total)
    } else {
      return [...deityInvocations]
        .map(d => ({ ...d, count: d.mandalas[selectedMandala - 1] }))
        .sort((a, b) => b.count - a.count)
    }
  }

  const maxValue = viewMode === "total" 
    ? Math.max(...deityInvocations.map(d => d.total))
    : Math.max(...deityInvocations.map(d => d.mandalas[selectedMandala - 1]))

  return (
    <div className="min-h-screen bg-background relative">
      <DecorativePattern />
      
      <div className="container mx-auto px-4 py-4 max-w-7xl relative z-10">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="h-10 w-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">
              God Popularity Contest
            </h1>
            <Flame className="h-10 w-10 text-accent animate-pulse" />
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Deity invocation frequency across the Rigveda
          </p>
        </div>

        {/* View Controls */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "total" ? "default" : "outline"}
                  onClick={() => setViewMode("total")}
                >
                  Total Invocations
                </Button>
                <Button
                  variant={viewMode === "mandala" ? "default" : "outline"}
                  onClick={() => setViewMode("mandala")}
                >
                  By Maṇḍala
                </Button>
              </div>

              {viewMode === "mandala" && (
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(m => (
                    <Button
                      key={m}
                      size="sm"
                      variant={selectedMandala === m ? "default" : "outline"}
                      onClick={() => setSelectedMandala(m)}
                    >
                      M{m}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Horizontal Visualization (slim bars) */}
        <Card className="border-2 shadow-xl">
          <CardHeader>
            <CardTitle>
              {viewMode === "total" 
                ? "Total Invocations (All Maṇḍalas)"
                : `Invocations in Maṇḍala ${selectedMandala}`}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2">
              {getSortedDeities().map((deity, index) => {
                const value = viewMode === "total" ? deity.total : // @ts-ignore
                  deity.count
                const widthPercent = (value / maxValue) * 100
                const isTop3 = index < 3
                return (
                  <div key={deity.name} className="flex items-center gap-3">
                    {/* Rank */}
                    {isTop3 ? (
                      <Badge variant="secondary" className="w-10 justify-center">#{index + 1}</Badge>
                    ) : (
                      <div className="w-10 text-right text-xs text-muted-foreground">{index + 1}</div>
                    )}
                    {/* Name */}
                    <div className="w-36 truncate text-sm font-semibold">{deity.name}</div>
                    {/* Bar */}
                    <div className="flex-1">
                      <div className="w-full bg-muted/40 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{ width: `${Math.max(widthPercent, 4)}%`, backgroundColor: deity.color }}
                        />
                      </div>
                    </div>
                    {/* Value */}
                    <div className="w-14 text-right text-sm font-medium text-primary">{value}</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20">
            <CardContent className="p-6 text-center">
              <Crown className="w-12 h-12 mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold text-primary mb-2">
                {getSortedDeities()[0].name}
              </div>
              <div className="text-sm text-muted-foreground">Most Invoked</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-2 border-accent/20">
            <CardContent className="p-6 text-center">
              <Flame className="w-12 h-12 mx-auto mb-3 text-accent" />
              <div className="text-3xl font-bold text-accent mb-2">
                {viewMode === "total" 
                  ? deityInvocations.reduce((sum, d) => sum + d.total, 0)
                  : deityInvocations.reduce((sum, d) => sum + d.mandalas[selectedMandala - 1], 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Invocations</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-2 border-secondary/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-secondary mb-2">25</div>
              <div className="text-sm text-muted-foreground">Deities Tracked</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}