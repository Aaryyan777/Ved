"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const mainFeatures = [
  { name: "Mandala Explorer", href: "/features/mandala-explorer" },
  { name: "Chandas Canvas", href: "/features/chandas-canvas" },
  { name: "Svara Karaoke", href: "/features/svara-karaoke" },
  { name: "Rigveda Galaxy", href: "/features/rigveda-galaxy" },
  { name: "Features", href: "/features" },
]

const allFeatures = [
  { name: "Mandala Explorer", href: "/features/mandala-explorer" },
  { name: "Rigveda Galaxy", href: "/features/rigveda-galaxy" },
  { name: "Chandas Canvas", href: "/features/chandas-canvas" },
  { name: "Svara Karaoke", href: "/features/svara-karaoke" },
  { name: "Knowledge Graph", href: "/features/knowledge-graph" },
  { name: "Pitch to Light", href: "/features/pitch-to-light" },
  { name: "Meter Music", href: "/features/meter-music" },
  { name: "Deity Co-occurrence", href: "/features/deity-cooccurrence" },
  { name: "God Popularity", href: "/features/god-popularity" },
  { name: "Theme in 30s", href: "/features/theme-30s" },
  { name: "Recitation Timeline", href: "/features/recitation-timeline" },
  { name: "Gayatri Deep-Dive", href: "/features/gayatri" },
  { name: "Verse Deep Dive", href: "/features/verse-deep-dive" },
  { name: "Mandala Moodboard", href: "/features/mandala-moodboard" },
  { name: "Mandala Deep Dive", href: "/features/mandala-deep-dive" },
  { name: "Metre Inspector", href: "/features/metre-inspector" },
  { name: "Svara Mandala Art", href: "/features/svara-mandala-art" },
  { name: "Quiz", href: "/features/quiz" },
  { name: "Why Metre", href: "/features/why-metre" },
  { name: "Dictionary", href: "/features/dictionary" },
  { name: "Verse Comparison", href: "/features/verse-comparison" },
  { name: "Rishi Journey", href: "/features/rishi-journey" },
  { name: "Acoustic Visualization", href: "/features/acoustic-visualization" },
  { name: "Ritual Builder", href: "/features/ritual-builder" },
  { name: "Deity Network", href: "/features/deity-network" },
  { name: "Rhythm Game", href: "/features/rhythm-game" },
  { name: "Word Cloud", href: "/features/word-cloud" },
  { name: "Mandala Timeline", href: "/features/mandala-timeline" },
  { name: "Bookmarks", href: "/features/bookmarks" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 ml-4">
          <span className="font-heading text-xl font-bold tracking-tight">
            ऋग्वेद Rigveda
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm">
          {mainFeatures.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="transition-colors hover:text-primary"
            >
              {feature.name}
            </Link>
          ))}
        </nav>

        {/* Hamburger Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:ml-4 mr-4">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle className="font-heading">All Features</SheetTitle>
            </SheetHeader>
            <div className="mt-8 flex flex-col space-y-3 max-h-[calc(100vh-120px)] overflow-y-auto pr-4">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 text-lg hover:text-primary transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <div className="border-t pt-4 mt-4">
                {allFeatures.map((feature) => (
                  <Link
                    key={feature.href}
                    href={feature.href}
                    onClick={() => setIsOpen(false)}
                    className="block py-2 hover:text-primary transition-colors"
                  >
                    {feature.name}
                  </Link>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}