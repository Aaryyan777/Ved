"use client"

import { useState, useMemo } from "react"
import { DecorativePattern } from "@/components/mystical/decorative-pattern"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Network, Zap, Flame, Sun, Moon, Wind, Sparkles, BookOpen, User } from "lucide-react"

const graphData = {
  nodes: [
    { id: "agni", label: "Agni", type: "deity", icon: Flame, count: 200, color: "from-orange-500 to-red-600" },
    { id: "indra", label: "Indra", type: "deity", icon: Zap, count: 289, color: "from-yellow-500 to-amber-600" },
    { id: "soma", label: "Soma", type: "deity", icon: Moon, count: 123, color: "from-blue-400 to-indigo-500" },
    { id: "surya", label: "Sūrya", type: "deity", icon: Sun, count: 45, color: "from-yellow-400 to-orange-500" },
    { id: "vayu", label: "Vāyu", type: "deity", icon: Wind, count: 38, color: "from-cyan-400 to-blue-500" },
    { id: "gayatri", label: "Gāyatrī", type: "metre", icon: Sparkles, count: 2450, color: "from-purple-500 to-pink-600" },
    { id: "tristubh", label: "Triṣṭubh", type: "metre", icon: BookOpen, count: 4253, color: "from-violet-500 to-purple-600" },
    { id: "jagati", label: "Jagatī", type: "metre", icon: Sparkles, count: 1350, color: "from-fuchsia-500 to-pink-600" },
    { id: "visvamitra", label: "Viśvāmitra", type: "rishi", icon: User, count: 45, color: "from-emerald-500 to-green-600" },
    { id: "vasistha", label: "Vasiṣṭha", type: "rishi", icon: User, count: 89, color: "from-teal-500 to-cyan-600" },
    { id: "atri", label: "Atri", type: "rishi", icon: User, count: 67, color: "from-green-500 to-emerald-600" },
  ],
  edges: [
    { from: "indra", to: "tristubh", strength: 180 },
    { from: "agni", to: "gayatri", strength: 120 },
    { from: "soma", to: "jagati", strength: 95 },
    { from: "visvamitra", to: "gayatri", strength: 40 },
    { from: "vasistha", to: "tristubh", strength: 65 },
    { from: "indra", to: "vasistha", strength: 50 },
    { from: "agni", to: "atri", strength: 35 },
    { from: "surya", to: "gayatri", strength: 28 },
  ]
}

const typeColors = {
  deity: "from-primary/80 to-primary",
  metre: "from-accent/80 to-accent",
  rishi: "from-secondary/80 to-secondary"
}

export default function KnowledgeGraphPage() {
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [filterType, setFilterType] = useState<string>("all")
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  const filteredNodes = filterType === "all" 
    ? graphData.nodes 
    : graphData.nodes.filter(n => n.type === filterType)

  const getConnections = (nodeId: string) => {
    return graphData.edges
      .filter(e => e.from === nodeId || e.to === nodeId)
      .map(e => {
        const connectedId = e.from === nodeId ? e.to : e.from
        const node = graphData.nodes.find(n => n.id === connectedId)
        return { ...node, strength: e.strength }
      })
  }

  // Calculate node positions in a circular layout
  const nodePositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {}
    const centerX = 50
    const centerY = 50
    const radius = 35

    filteredNodes.forEach((node, index) => {
      const angle = (index / filteredNodes.length) * 2 * Math.PI - Math.PI / 2
      positions[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      }
    })

    return positions
  }, [filteredNodes])

  // Get edges that should be highlighted
  const getHighlightedEdges = () => {
    if (!selectedNode && !hoveredNode) return []
    const activeNode = selectedNode?.id || hoveredNode
    return graphData.edges.filter(e => e.from === activeNode || e.to === activeNode)
  }

  const highlightedEdges = getHighlightedEdges()

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <DecorativePattern />
      
      {/* Mystical background glow */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        <Link href="/features">
          <Button variant="ghost" className="gap-2 mb-6 hover:bg-primary/10">
            <ArrowLeft className="w-4 h-4" />
            Back to Features
          </Button>
        </Link>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Network className="h-10 w-10 text-primary animate-pulse" />
              <div className="absolute inset-0 h-10 w-10 text-primary animate-ping opacity-20" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Mandala Knowledge Graph
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore connections between deities, r̥ṣis, and metres across the Rigveda
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <Button
            variant={filterType === "all" ? "default" : "outline"}
            onClick={() => setFilterType("all")}
            className="relative overflow-hidden group"
          >
            <span className="relative z-10">All Nodes</span>
            {filterType === "all" && (
              <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/80 animate-shimmer" />
            )}
          </Button>
          <Button
            variant={filterType === "deity" ? "default" : "outline"}
            onClick={() => setFilterType("deity")}
            className="gap-2"
          >
            <Flame className="w-4 h-4" />
            Deities
          </Button>
          <Button
            variant={filterType === "metre" ? "default" : "outline"}
            onClick={() => setFilterType("metre")}
            className="gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Metres
          </Button>
          <Button
            variant={filterType === "rishi" ? "default" : "outline"}
            onClick={() => setFilterType("rishi")}
            className="gap-2"
          >
            <User className="w-4 h-4" />
            R̥ṣis
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Graph visualization */}
          <div className="lg:col-span-2">
            <Card className="border-2 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="w-5 h-5 text-primary" />
                  Network Visualization
                </CardTitle>
                <CardDescription>Click a node to see connections • Hover to preview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gradient-to-br from-muted/30 via-background to-primary/10 rounded-xl p-4 aspect-square border-2 border-border/50 shadow-inner">
                  {/* SVG for connections */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                    <defs>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
                      </linearGradient>
                    </defs>
                    
                    {/* Draw all edges */}
                    {graphData.edges.map((edge, idx) => {
                      const fromPos = nodePositions[edge.from]
                      const toPos = nodePositions[edge.to]
                      if (!fromPos || !toPos) return null

                      const isHighlighted = highlightedEdges.some(e => 
                        (e.from === edge.from && e.to === edge.to) || 
                        (e.from === edge.to && e.to === edge.from)
                      )

                      return (
                        <line
                          key={idx}
                          x1={fromPos.x}
                          y1={fromPos.y}
                          x2={toPos.x}
                          y2={toPos.y}
                          stroke="url(#lineGradient)"
                          strokeWidth={isHighlighted ? edge.strength / 20 : edge.strength / 40}
                          className={`transition-all duration-300 ${
                            isHighlighted ? "text-primary opacity-80" : "text-muted-foreground opacity-20"
                          }`}
                          filter={isHighlighted ? "url(#glow)" : undefined}
                        />
                      )
                    })}
                  </svg>

                  {/* Nodes positioned in circular layout */}
                  {filteredNodes.map((node) => {
                    const Icon = node.icon || Network
                    const pos = nodePositions[node.id]
                    if (!pos) return null

                    const isSelected = selectedNode?.id === node.id
                    const isHovered = hoveredNode === node.id
                    const isConnected = selectedNode && getConnections(selectedNode.id).some(c => c?.id === node.id)

                    return (
                      <button
                        key={node.id}
                        onClick={() => setSelectedNode(node)}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                        style={{
                          left: `${pos.x}%`,
                          top: `${pos.y}%`,
                        }}
                      >
                        <div
                          className={`relative p-3 rounded-2xl border-2 transition-all duration-300 ${
                            isSelected
                              ? "border-primary shadow-2xl shadow-primary/50 scale-110"
                              : isHovered || isConnected
                              ? "border-accent shadow-lg shadow-accent/30 scale-105"
                              : "border-border shadow-md hover:shadow-lg"
                          } bg-gradient-to-br ${node.color} backdrop-blur-sm`}
                        >
                          {/* Glow effect */}
                          {(isSelected || isHovered) && (
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent animate-pulse" />
                          )}
                          
                          <Icon className={`w-6 h-6 text-white relative z-10 ${
                            isSelected ? "animate-pulse" : ""
                          }`} />
                          
                          {/* Tooltip */}
                          <div className={`absolute -top-16 left-1/2 -translate-x-1/2 px-3 py-2 bg-popover border border-border rounded-lg shadow-xl whitespace-nowrap transition-all duration-200 ${
                            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                          }`}>
                            <div className="font-semibold text-sm">{node.label}</div>
                            <div className="text-xs text-muted-foreground">{node.count} hymns</div>
                            <Badge className={`mt-1 text-xs ${typeColors[node.type as keyof typeof typeColors]}`}>
                              {node.type}
                            </Badge>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Details panel */}
          <div>
            <Card className="sticky top-8 border-2 shadow-xl">
              <CardHeader className="bg-gradient-to-br from-primary/5 to-accent/5">
                <CardTitle>
                  {selectedNode ? "Node Details" : "Select a Node"}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {selectedNode ? (
                  <div className="space-y-6">
                    <div className="text-center py-4">
                      <div className={`inline-flex p-6 rounded-3xl bg-gradient-to-br ${selectedNode.color} mb-4 shadow-lg`}>
                        {selectedNode.icon && <selectedNode.icon className="w-16 h-16 text-white animate-pulse" />}
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{selectedNode.label}</h3>
                      <Badge className={`${typeColors[selectedNode.type as keyof typeof typeColors]} shadow-md`}>
                        {selectedNode.type}
                      </Badge>
                      <div className="mt-3 p-3 rounded-lg bg-muted/50 inline-block">
                        <p className="text-2xl font-bold text-primary">{selectedNode.count}</p>
                        <p className="text-xs text-muted-foreground">hymns</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Network className="w-4 h-4 text-primary" />
                        Connected To:
                      </h4>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                        {getConnections(selectedNode.id).map((conn: any, idx: number) => {
                          const connectedNode = graphData.nodes.find(n => n.id === conn?.id)
                          return (
                            <button
                              key={idx}
                              onClick={() => setSelectedNode(conn)}
                              className="w-full flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-muted/50 to-muted/30 hover:from-muted to-muted/50 transition-all hover:scale-[1.02] border border-border/50"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg bg-gradient-to-br ${connectedNode?.color || 'from-primary to-accent'}`}>
                                  {conn.icon && <conn.icon className="w-4 h-4 text-white" />}
                                </div>
                                <span className="font-medium">{conn.label}</span>
                              </div>
                              <Badge variant="outline" className="text-xs shadow-sm">
                                {conn.strength} links
                              </Badge>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <div className="relative inline-block mb-4">
                      <Network className="w-16 h-16 opacity-30" />
                      <div className="absolute inset-0 w-16 h-16 opacity-20 animate-ping">
                        <Network className="w-16 h-16" />
                      </div>
                    </div>
                    <p className="text-sm">Select a node to view its connections and details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Statistics */}
        <Card className="mt-6 border-2 shadow-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Network Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative text-center p-6 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 shadow-lg overflow-hidden group hover:scale-105 transition-transform">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-4xl font-bold text-primary mb-2 relative z-10">{graphData.nodes.length}</div>
                <div className="text-sm text-muted-foreground relative z-10">Total Nodes</div>
              </div>
              <div className="relative text-center p-6 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 shadow-lg overflow-hidden group hover:scale-105 transition-transform">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-4xl font-bold text-accent mb-2 relative z-10">{graphData.edges.length}</div>
                <div className="text-sm text-muted-foreground relative z-10">Connections</div>
              </div>
              <div className="relative text-center p-6 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/20 shadow-lg overflow-hidden group hover:scale-105 transition-transform">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-4xl font-bold text-secondary mb-2 relative z-10">
                  {graphData.nodes.filter(n => n.type === "deity").length}
                </div>
                <div className="text-sm text-muted-foreground relative z-10">Deities</div>
              </div>
              <div className="relative text-center p-6 rounded-xl bg-gradient-to-br from-muted to-muted/50 border border-border shadow-lg overflow-hidden group hover:scale-105 transition-transform">
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-4xl font-bold mb-2 relative z-10">
                  {graphData.nodes.filter(n => n.type === "rishi").length}
                </div>
                <div className="text-sm text-muted-foreground relative z-10">R̥ṣis</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}