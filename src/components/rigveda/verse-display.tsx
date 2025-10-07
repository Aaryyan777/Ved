"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2, Flame, ScrollText, BookOpen } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export interface VerseData {
  mandala: number
  hymn: number
  verse: number
  sanskrit: string
  transliteration: string
  translations: {
    english: string
    hindi?: string
    author?: string
  }
  deity?: string
  poet_family?: string
  meter_type?: string
  metrical_data?: string
  hymnAddressee?: string
  hymnGroup?: string
  stanzaType?: string
  stanzaMeter?: string
  hymnMeter?: string
  seer?: string
}

interface VerseDisplayProps {
  verse: VerseData
  aiExplanation?: string
  onRequestAIExplanation: () => void
  isLoadingAI?: boolean
}

export const VerseDisplay = ({ 
  verse, 
  aiExplanation, 
  onRequestAIExplanation, 
  isLoadingAI 
}: VerseDisplayProps) => {
  return (
    <div className="space-y-6">
      <Card className="border-2 border-accent/20 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 p-6 border-b border-accent/20">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <ScrollText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold">
                    Rigveda {verse.mandala}.{verse.hymn}.{verse.verse}
                  </CardTitle>
                  <CardDescription className="text-base mt-1">
                    मण्डल {verse.mandala} • सूक्त {verse.hymn} • ऋचा {verse.verse}
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {verse.deity && (
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    <Flame className="w-3 h-3 mr-1" />
                    Deity: {verse.deity}
                  </Badge>
                )}
                {verse.poet_family && (
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    Poet Family: {verse.poet_family}
                  </Badge>
                )}
                {verse.seer && (
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    Seer: {verse.seer}
                  </Badge>
                )}
                {verse.hymnGroup && (
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    Group: {verse.hymnGroup}
                  </Badge>
                )}
              </div>
            </div>
            <Link href={`/features/verse-deep-dive?m=${verse.mandala}&h=${verse.hymn}&v=${verse.verse}`}>
              <Button variant="default" size="lg" className="gap-2">
                <BookOpen className="w-4 h-4" />
                Deep Dive
              </Button>
            </Link>
          </div>
        </div>
        
        <CardContent className="p-6 space-y-6">
          {/* Sanskrit Text */}
          <div className="relative">
            <div className="absolute -top-2 -left-2 w-16 h-16 bg-primary/5 rounded-full blur-xl"></div>
            <div className="relative p-8 bg-gradient-to-br from-muted/30 to-muted/50 rounded-2xl border-2 border-primary/20">
              <p className="text-2xl md:text-3xl leading-relaxed font-devanagari text-center" dir="ltr">
                {verse.sanskrit}
              </p>
            </div>
          </div>

          {/* English Translation */}
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-semibold text-lg flex items-center gap-2">
                                English Translation
                              </h3>
                            </div>
                            <div className="p-6 bg-gradient-to-br from-muted/30 to-muted/50 rounded-2xl border-2 border-secondary/20">
                              <p className="text-lg leading-relaxed">
                                {verse.translations.english}
                              </p>
                              {verse.translations.author && (
                                <p className="text-sm text-muted-foreground italic mt-2 text-right">
                                  — {verse.translations.author}
                                </p>
                              )}
                            </div>
                          </div>          
          {/* Optional Hindi Translation */}
          {verse.translations.hindi && (
            <>
              <Separator className="my-4" />
              <div>
                <h3 className="font-semibold text-lg mb-3">Hindi Translation</h3>
                <div className="p-6 bg-gradient-to-br from-muted/30 to-muted/50 rounded-2xl border-2 border-secondary/20">
                  <p className="text-lg leading-relaxed font-devanagari">{verse.translations.hindi}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="border-2 border-primary/20 shadow-xl overflow-hidden bg-gradient-to-br from-card via-card to-primary/5">
        <CardHeader className="border-b border-primary/10 bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                Divine Wisdom & AI Insights
              </CardTitle>
              <CardDescription className="text-base mt-1">
                Unlock deeper spiritual understanding with AI-powered interpretation
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {!aiExplanation && !isLoadingAI && (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <p className="text-muted-foreground mb-6 text-lg">
                Invoke the AI oracle to receive profound insights about this sacred verse
              </p>
              <Button onClick={onRequestAIExplanation} size="lg" className="shadow-lg">
                <Sparkles className="mr-2 h-5 w-5" />
                Summon Divine Explanation
              </Button>
            </div>
          )}
          
          {isLoadingAI && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative w-20 h-20 mb-6">
                <Flame className="w-20 h-20 text-primary animate-pulse absolute" />
                <Loader2 className="w-20 h-20 animate-spin text-accent absolute" />
              </div>
              <span className="text-lg text-muted-foreground">
                Channeling ancient wisdom...
              </span>
            </div>
          )}
          
          {aiExplanation && !isLoadingAI && (
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-br from-muted/30 to-muted/50 rounded-2xl border-2 border-primary/20">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap leading-relaxed text-base">
                    {aiExplanation}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={onRequestAIExplanation} 
                  variant="outline" 
                  size="lg"
                  className="flex-1"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Regenerate Insights
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}