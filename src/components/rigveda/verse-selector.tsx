"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Flame } from "lucide-react"

interface VerseSelectorProps {
  onSearch: (mandala: number, hymn: number, verse: number) => void
  isLoading?: boolean
}

export const VerseSelector = ({ onSearch, isLoading }: VerseSelectorProps) => {
  const [mandala, setMandala] = useState("")
  const [hymn, setHymn] = useState("")
  const [verse, setVerse] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const mandalaNum = parseInt(mandala)
    const hymnNum = parseInt(hymn)
    const verseNum = parseInt(verse)

    if (mandalaNum && hymnNum && verseNum) {
      onSearch(mandalaNum, hymnNum, verseNum)
    }
  }

  return (
    <Card className="border-2 border-primary/20 shadow-xl bg-gradient-to-br from-card via-card to-accent/5">

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-3">
              <Label htmlFor="mandala" className="text-base font-semibold flex items-center gap-2">
                <span className="text-primary">मण्डल</span>
                <span className="text-muted-foreground">Mandala</span>
              </Label>
              <Input
                id="mandala"
                type="number"
                min="1"
                max="10"
                placeholder="1-10"
                value={mandala}
                onChange={(e) => setMandala(e.target.value)}
                required
                className="h-12 text-lg border-primary/20 focus:border-primary/50"
              />
              <p className="text-xs text-muted-foreground">Books of hymns</p>
            </div>
            <div className="space-y-3">
              <Label htmlFor="hymn" className="text-base font-semibold flex items-center gap-2">
                <span className="text-accent">सूक्त</span>
                <span className="text-muted-foreground">Sukta</span>
              </Label>
              <Input
                id="hymn"
                type="number"
                min="1"
                placeholder="Hymn no."
                value={hymn}
                onChange={(e) => setHymn(e.target.value)}
                required
                className="h-12 text-lg border-accent/20 focus:border-accent/50"
              />
              <p className="text-xs text-muted-foreground">Hymn number</p>
            </div>
            <div className="space-y-3">
              <Label htmlFor="verse" className="text-base font-semibold flex items-center gap-2">
                <span className="text-secondary">ऋचा</span>
                <span className="text-muted-foreground">Rik</span>
              </Label>
              <Input
                id="verse"
                type="number"
                min="1"
                placeholder="Verse no."
                value={verse}
                onChange={(e) => setVerse(e.target.value)}
                required
                className="h-12 text-lg border-secondary/20 focus:border-secondary/50"
              />
              <p className="text-xs text-muted-foreground">Verse number</p>
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full h-14 text-lg shadow-lg hover:shadow-xl transition-all" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Flame className="mr-2 h-5 w-5 animate-pulse" />
                Invoking Sacred Verse...
              </>
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" />
                Reveal Sacred Verse
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}