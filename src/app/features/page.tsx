"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { 
  Activity, Mic, Network, Lightbulb, Music, PieChart, 
  Sparkles, Clock, BookOpen, BarChart3, CheckCircle, 
  Quote, FileCheck, Ruler, Volume2, Hexagon, Trophy, 
  HelpCircle, Link2, ArrowLeft, Flame, GitCompare, User,
  Waves, Cloud, MessageSquare, TrendingUp, Bookmark, Sun, Crown
} from "lucide-react"

const features = [
  {
    title: "Interactive Mandala Explorer",
    description: "Sacred sun-wheel chakra visualization. Click petals to explore Maṇḍalas, Sūktas, and glowing verses in a divine cosmic map.",
    icon: Sun,
    href: "/features/mandala-explorer",
    category: "Creative",
    tags: ["visualization", "interactive", "design"]
  },
  {
    title: "Rig Veda Galaxy",
    description: "Experience the Rigveda as a cosmic universe. Each Sūkta is a star, verses orbit as planets. Nebula threads connect hymns.",
    icon: Sparkles,
    href: "/features/rigveda-galaxy",
    category: "Creative",
    tags: ["visualization", "interactive", "cosmic"]
  },
  {
    title: "Chandas Canvas",
    description: "Interactive metre map where each pāda animates to Gayatri, Trishtubh, Jagati with syllable clocks",
    icon: Activity,
    href: "/features/chandas-canvas",
    category: "Interactive"
  },
  {
    title: "Svara Karaoke",
    description: "Microphone-based chanting practice with real-time udātta, anudātta, svarita coloring",
    icon: Mic,
    href: "/features/svara-karaoke",
    category: "Practice"
  },
  {
    title: "Mandala Knowledge Graph",
    description: "Zoomable network linking suktas, deities, r̥ṣis, metres via VedaWeb morphology",
    icon: Network,
    href: "/features/knowledge-graph",
    category: "Exploration"
  },
  {
    title: "Pitch-to-Light Visualizer",
    description: "Map accent contours to gentle light pulses and binaural panning for meditation",
    icon: Lightbulb,
    href: "/features/pitch-to-light",
    category: "Meditation"
  },
  {
    title: "Meter-as-Music Generator",
    description: "Convert syllable lengths to percussive tala sequences preserving metre counts",
    icon: Music,
    href: "/features/meter-music",
    category: "Creative"
  },
  {
    title: "Deity Co-occurrence Explorer",
    description: "Chord diagram showing which deities are invoked together across mandalas",
    icon: PieChart,
    href: "/features/deity-cooccurrence",
    category: "Analytics"
  },
  {
    title: "Theme-in-30s",
    description: "Quick summary lens auto-generating deity, metre, and 2-line gist with citations",
    icon: Sparkles,
    href: "/features/theme-30s",
    category: "Quick"
  },
  {
    title: "Recitation Timeline",
    description: "Line-synced highlighting with audio layers and pause-by-pāda navigation",
    icon: Clock,
    href: "/features/recitation-timeline",
    category: "Audio"
  },
  {
    title: "Gayatri Deep-Dive",
    description: "One-page explainer of RV 3.62.10 with metre notes and translation variants",
    icon: BookOpen,
    href: "/features/gayatri",
    category: "Educational"
  },
  {
    title: "Mandala Moodboard",
    description: "Topic clusters per book with meter distribution bars for instant character feel",
    icon: BarChart3,
    href: "/features/mandala-moodboard",
    category: "Overview"
  },
  {
    title: "Saṁhitā-Only Linter",
    description: "Validator checking verse IDs against VedaWeb API, rejecting non-Saṁhitā content",
    icon: CheckCircle,
    href: "/features/samhita-linter",
    category: "Validation"
  },
  {
    title: "Source Attribution",
    description: "Hover-citations to edition, metre, and dictionary entry for rigor",
    icon: Quote,
    href: "/features/source-attribution",
    category: "Compliance"
  },
  {
    title: "Translation Picker",
    description: "Auto-suggests public-domain translations with one-tap source notice",
    icon: FileCheck,
    href: "/features/translation-picker",
    category: "Compliance"
  },
  {
    title: "Metre Inspector",
    description: "Click pāda to see syllable counts, substitutions, and Rigvedic examples",
    icon: Ruler,
    href: "/features/metre-inspector",
    category: "Learning"
  },
  {
    title: "Accent Tutor",
    description: "Tap syllables to hear udātta vs svarita pairs with Unicode codepoints",
    icon: Volume2,
    href: "/features/accent-tutor",
    category: "Learning"
  },
  {
    title: "Svara Mandala Art",
    description: "Generate symmetrical geometry from accent sequences for unique yantras",
    icon: Hexagon,
    href: "/features/svara-mandala-art",
    category: "Creative"
  },
  {
    title: "Call-and-Response Quiz",
    description: "5 rapid prompts mixing metre ID, deity recognition, and accent spotting",
    icon: Trophy,
    href: "/features/quiz",
    category: "Practice"
  },
  {
    title: "Why-this-metre Cards",
    description: "Micro-explanations pairing metre with rhetorical feel and prevalence stats",
    icon: HelpCircle,
    href: "/features/why-metre",
    category: "Educational"
  },
  {
    title: "Dictionary Walkthrough",
    description: "Tap lemmas to open Cologne Digital Sanskrit links without losing scroll",
    icon: Link2,
    href: "/features/dictionary",
    category: "Reference"
  },
  {
    title: "Verse Comparison Matrix",
    description: "Compare verses side-by-side with common roots, shared themes, metrical patterns, and similarity analysis",
    icon: GitCompare,
    href: "/features/verse-comparison",
    category: "Exploration"
  },
  {
    title: "R̥ṣi Journey Map",
    description: "Explore sages who composed the Rigveda with family lineages, geographic origins, and stylistic signatures",
    icon: User,
    href: "/features/rishi-journey",
    category: "Educational"
  },
  {
    title: "Acoustic Visualization",
    description: "Real-time audio-reactive visualization with waveforms, pitch accent particles, and flowing energy mandala",
    icon: Waves,
    href: "/features/acoustic-visualization",
    category: "Creative"
  },
  {
    title: "Vedic Ritual Builder",
    description: "Interactive yajña simulator with ritual stages, verse usage, timeline progression, and historical accuracy",
    icon: Flame,
    href: "/features/ritual-builder",
    category: "Educational"
  },
  {
    title: "Deity Relationship Web",
    description: "Explore divine hierarchies, family lineages, consort pairs, and cosmic relationships between deities",
    icon: Network,
    href: "/features/deity-network",
    category: "Exploration"
  },
  {
    title: "Chandas Rhythm Game",
    description: "Master Vedic metres through rhythm gameplay with tap-along mechanics, visual feedback, and streak scoring",
    icon: Music,
    href: "/features/rhythm-game",
    category: "Practice"
  },
  {
    title: "Sanskrit Word Cloud",
    description: "Dynamic word frequency visualization with clickable words, morphological analysis, and category filtering",
    icon: Cloud,
    href: "/features/word-cloud",
    category: "Analytics"
  },
  {
    title: "Maṇḍala Evolution Timeline",
    description: "Chronological layers, linguistic evolution, and thematic development across 400 years of composition",
    icon: TrendingUp,
    href: "/features/mandala-timeline",
    category: "Educational"
  },
  {
    title: "Verse Collections",
    description: "Save favorite verses, add personal notes, create custom collections, and share with others",
    icon: Bookmark,
    href: "/features/bookmarks",
    category: "Reference"
  },
  {
    title: "God Popularity Contest",
    description: "Dynamic bar chart race showing deity invocation frequency across Maṇḍalas. Watch as gods compete for the top spot!",
    icon: Crown,
    href: "/features/god-popularity",
    category: "Creative",
    badge: "New"
  }
]

const categories = [
  "All",
  "Interactive",
  "Practice",
  "Exploration",
  "Meditation",
  "Creative",
  "Analytics",
  "Quick",
  "Audio",
  "Educational",
  "Overview",
  "Validation",
  "Compliance",
  "Learning",
  "Reference"
]

export default function FeaturesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredFeatures = selectedCategory === "All" 
    ? features 
    : features.filter(f => f.category === selectedCategory)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-12">
          <Link href="/">
            <Button variant="ghost" className="gap-2 mb-6 hover:bg-muted">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          
          <div className="mb-12">
            <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-4">
              Features
            </h1>
            <div className="w-16 h-px bg-foreground mb-6" style={{ 
              transform: 'rotate(-0.5deg)',
              transformOrigin: 'left'
            }} />
            <p className="text-muted-foreground text-lg max-w-2xl font-light">
              Interactive tools and visualizations for exploring the Rigveda
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-10 flex flex-wrap gap-2">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="font-mono text-xs uppercase tracking-wider"
              style={{
                borderRadius: selectedCategory === cat ? '2px 3px 2px 4px' : '3px 2px 4px 2px'
              }}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <Link key={feature.href} href={feature.href}>
                <Card 
                  className="h-full border hover:bg-muted/30 transition-all group cursor-pointer relative"
                  style={{
                    borderRadius: '2px 4px 3px 2px',
                    borderWidth: idx % 3 === 0 ? '1px 2px 1px 1px' : idx % 3 === 1 ? '2px 1px 1px 2px' : '1px 1px 2px 1px',
                    transform: `rotate(${(idx % 3 - 1) * 0.3}deg)`
                  }}
                >
                  <CardHeader>
                    <div className="w-10 h-10 border flex items-center justify-center mb-4 bg-background"
                      style={{
                        borderRadius: '2px 3px 2px 4px',
                        transform: 'rotate(-1deg)'
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-xl font-medium group-hover:translate-x-0.5 transition-transform">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-sm font-light leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground border px-2 py-1"
                        style={{ borderRadius: '2px 3px 2px 2px' }}
                      >
                        {feature.category}
                      </span>
                      <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                  {feature.badge && (
                    <div 
                      className="absolute -top-2 -right-2 bg-foreground text-background px-2 py-1 text-xs font-mono"
                      style={{
                        borderRadius: '2px 4px 2px 3px',
                        transform: 'rotate(3deg)'
                      }}
                    >
                      {feature.badge}
                    </div>
                  )}
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const useState = (initial: string) => {
  const [state, setState] = React.useState(initial)
  return [state, setState] as const
}

import React from "react"