"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { DecorativePattern } from "@/components/mystical/decorative-pattern"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ArrowLeft, BookOpen, Sparkles, Loader2, Flame, Link as LinkIcon } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { VerseSelector } from "@/components/rigveda/verse-selector"
import { Separator } from "@/components/ui/separator"

// Define the VerseData interface based on API response
interface VerseData {
  mandala: number;
  hymn: number;
  verse: number;
  sanskrit: string;
  sanskritSource?: string;
  sanskritLanguage?: string;
  transliteration: string;
  transliterationSource?: string;
  transliterationLanguage?: string;
  translations: {
    english: string;
    author?: string;
    hindi?: string; // Added for potential Hindi translation
  };
  deity?: string; // hymnAddressee
  poet_family?: string; // hymnGroup
  meter_type?: string; // stanzaType
  metrical_data?: string; // Derived from StanzaVersion.metricalData
  seer?: string; // hymnAuthor from StanzaVersion.source
  // New fields from Stanza object
  id: string; // docId
  index: number;
  hymnAbs: number;
  strata?: string;
  lateAdditions?: string[];
  externalResources?: Array<{
    label: string;
    description?: string;
    references: string[];
  }>;
  padas?: Array<{
    id: string;
    label: string;
    index: number;
    grammarData: Array<{
      index: number;
      form: string;
      lemma?: string;
      lemmaRefs?: string[];
      props?: { [key: string]: string };
    }>;
  }>;
  versions?: Array<{
    id: string;
    source?: string;
    language?: string;
    form: string[];
    metricalData?: string[];
    type: string;
    applyKeys?: boolean;
  }>;
  location?: string;
}

export default function VerseDeepDivePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [verseData, setVerseData] = useState<VerseData | null>(null)
  const [isLoadingVerse, setIsLoadingVerse] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [thematicContent, setThematicContent] = useState("")
  const [isLoadingThematic, setIsLoadingThematic] = useState(false)
  const [apiKey, setApiKey] = useState("")

  const currentMandala = searchParams.get("m")
  const currentHymn = searchParams.get("h")
  const currentVerse = searchParams.get("v")

  useEffect(() => {
    const fetchVerse = async () => {
      if (!currentMandala || !currentHymn || !currentVerse) {
        router.replace(`/features/verse-deep-dive?m=1&h=1&v=1`);
        return;
      }

      try {
        setIsLoadingVerse(true)
        setError(null)
        const response = await fetch(
          `/api/rigveda/verse?mandala=${currentMandala}&hymn=${currentHymn}&verse=${currentVerse}`
        )
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch verse")
        }

        // Attempt to derive metrical_data from versions if not directly provided
        if (!data.data.metrical_data && data.data.versions && data.data.versions.length > 0) {
          const metricalVersion = data.data.versions.find(v => v.metricalData && v.type === "version" && v.language?.startsWith("san"));
          if (metricalVersion && metricalVersion.metricalData) {
            data.data.metrical_data = metricalVersion.metricalData.join("<br />");
          }
        }
        setVerseData(data.data)
        toast.success("Verse loaded successfully!")
      } catch (err) {
        console.error("Error fetching verse:", err)
        setError(err instanceof Error ? err.message : "Failed to load verse")
        toast.error("Failed to load verse")
      } finally {
        setIsLoadingVerse(false)
      }
    }

    fetchVerse()
  }, [currentMandala, currentHymn, currentVerse, router])

  const handleVerseSelection = (mandala: number, hymn: number, verse: number) => {
    router.push(`/features/verse-deep-dive?m=${mandala}&h=${hymn}&v=${verse}`)
  }

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const generateThematicSignificance = async () => {
    if (!apiKey.trim()) {
      toast.error("Please enter your OpenAI API key")
      return
    }
    if (!verseData) return

    setIsLoadingThematic(true)
    try {
      const response = await fetch("/api/rigveda/thematic-significance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey,
          theme: `Verse RV ${verseData.mandala}.${verseData.hymn}.${verseData.verse}`,
          sanskrit: verseData.sanskrit,
          translation: verseData.translations.english,
          context: `Mandala ${verseData.mandala}, Hymn ${verseData.hymn}, Verse ${verseData.verse}`
        })
      })
      const data = await response.json()
      if (!response.ok) {
        toast.error(data.error || "Failed to generate content")
        return
      }
      setThematicContent(data.content)
      toast.success("Thematic significance generated!")
    } catch (e) {
      console.error(e)
      toast.error("Failed to generate thematic significance")
    } finally {
      setIsLoadingThematic(false)
    }
  }

  // Metre pattern mapping (simplified for general verses, can be expanded)
  const meterMap: Record<string, { padas: number; pattern: ("L"|"G")[] }> = {
    "Gāyatrī": { padas: 3, pattern: ["L","G","L","G","L","G","L","G"] },
    "Triṣṭubh": { padas: 4, pattern: ["L","G","L","G","G","L","L","G","L","G","G"] },
    "Jagatī": { padas: 4, pattern: ["L","G","L","G","G","L","L","G","L","G","G","L"] },
    "Anuṣṭubh": { padas: 4, pattern: ["L","G","L","G","G","L","L","G"] },
  }

  const renderMetricalStructure = () => {
    if (!verseData?.metrical_data) return null

    const padas = verseData.metrical_data.split("<br />").map(line => line.trim().split(" ").join("").split(""));

    return (
      <Card className="mb-6 border-2 border-primary/20" id="metrical-structure">
        <CardHeader>
          <CardTitle>Metrical Structure</CardTitle>
          <CardDescription>Laghu (L) and Guru (G) per pāda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {padas.map((pada, pIdx) => (
              <div key={pIdx} className="">
                <div className="mb-2 text-sm font-semibold">Pāda {pIdx + 1}:</div>
                <div className="flex gap-2 flex-wrap">
                  {pada.map((syll, sIdx) => (
                    <div
                      key={sIdx}
                      className={`w-12 h-10 rounded-md flex items-center justify-center text-sm font-bold border ${
                        syll === "L" ? "bg-amber-200/70 text-amber-900 border-amber-300" : "bg-sky-300/70 text-sky-900 border-sky-400"
                      }`}
                    >
                      {syll}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-xs text-muted-foreground">
            L = Laghu (short) • G = Guru (long)
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoadingVerse) {
    return (
      <div className="min-h-screen bg-background relative flex items-center justify-center">
        <DecorativePattern />
        <div className="text-center z-10">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <Flame className="w-20 h-20 text-primary animate-pulse absolute" />
            <Loader2 className="w-20 h-20 animate-spin text-accent absolute" />
          </div>
          <p className="text-lg text-muted-foreground">Loading sacred verse...</p>
        </div>
      </div>
    )
  }

  if (error || !verseData) {
    return (
      <div className="min-h-screen bg-background relative">
        <DecorativePattern />
        <div className="container mx-auto px-4 py-8 max-w-5xl relative z-10">
          <Link href="/features">
            <Button variant="ghost" className="gap-2 mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Features
            </Button>
          </Link>
          <Card className="border-2 border-destructive/30">
            <CardContent className="p-12 text-center">
              <p className="text-xl text-destructive mb-4">Failed to load verse</p>
              <p className="text-muted-foreground">{error}</p>
              <div className="mt-6">
                <VerseSelector onSearch={handleVerseSelection} isLoading={isLoadingVerse} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative">
      <DecorativePattern />
      
      <div className="container mx-auto px-4 py-4 max-w-5xl relative z-10">
        {/* Verse Selector */}
        <div className="mb-6">
          <VerseSelector onSearch={handleVerseSelection} isLoading={isLoadingVerse} />
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-10 w-10 text-primary animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold">Verse Deep Dive</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Comprehensive analysis of Rigveda {verseData.mandala}.{verseData.hymn}.{verseData.verse}
          </p>
          <div className="flex gap-2 justify-center mt-4 flex-wrap">
            <Badge variant="secondary">Rigveda {verseData.mandala}.{verseData.hymn}.{verseData.verse}</Badge>
            {verseData.deity && (
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <Flame className="w-3 h-3 mr-1" />
                Deity: {verseData.deity}
              </Badge>
            )}
            {verseData.poet_family && (
              <Badge variant="secondary" className="text-sm px-3 py-1">
                Poet Family: {verseData.poet_family}
              </Badge>
            )}
            {verseData.seer && (
              <Badge variant="outline" className="text-sm px-3 py-1">
                Seer: {verseData.seer}
              </Badge>
            )}
            {verseData.hymnGroup && (
              <Badge variant="outline" className="text-sm px-3 py-1">
                Group: {verseData.hymnGroup}
              </Badge>
            )}
          </div>
        </div>

        {/* Navigation Bar */}
        <Card className="mb-6 sticky top-4 z-20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex gap-2 justify-center flex-wrap">
              <Button variant="outline" size="sm" onClick={() => scrollToSection("sacred-text")}>
                Sacred Text
              </Button>
              <Button variant="outline" size="sm" onClick={() => scrollToSection("translations")}>
                Translations
              </Button>
              <Button variant="outline" size="sm" onClick={() => scrollToSection("word-analysis")}>
                Word by Word Analysis
              </Button>
              <Button variant="outline" size="sm" onClick={() => scrollToSection("thematic-significance")}>
                Thematic Significance
              </Button>
              {verseData.meter_type && (
                <Button variant="outline" size="sm" onClick={() => scrollToSection("metrical-structure")}>
                  Metrical Structure
                </Button>
              )}
              {verseData.externalResources && verseData.externalResources.length > 0 && (
                <Button variant="outline" size="sm" onClick={() => scrollToSection("external-resources")}>
                  External Resources
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sacred Text */}
        <div id="sacred-text">
          <Card className="mb-6 border-2 border-primary/30 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10">
              <CardTitle className="text-center text-2xl">The Sacred Text</CardTitle>
              <CardDescription className="text-center">
                मण्डल {verseData.mandala} • सूक्त {verseData.hymn} • ऋचा {verseData.verse}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {/* Sanskrit Text */}
              <div className="relative">
                <div className="absolute -top-2 -left-2 w-16 h-16 bg-primary/5 rounded-full blur-xl"></div>
                <div className="relative p-8 bg-gradient-to-br from-muted/30 to-muted/50 rounded-2xl border-2 border-primary/20">
                  <p className="text-sm text-muted-foreground mb-2 font-medium">
                    {verseData.sanskritSource} ({verseData.sanskritLanguage})
                  </p>
                  <p className="text-2xl md:text-3xl leading-relaxed font-devanagari text-center" dir="ltr" dangerouslySetInnerHTML={{ __html: verseData.sanskrit }}>
                  </p>
                </div>
              </div>

              {/* Transliteration */}
              <div className="relative">
                <div className="absolute -top-2 -right-2 w-16 h-16 bg-accent/5 rounded-full blur-xl"></div>
                <div className="relative p-8 bg-gradient-to-br from-muted/30 to-muted/50 rounded-2xl border-2 border-accent/20">
                  <p className="text-sm text-muted-foreground mb-2 font-medium">
                    {verseData.transliterationSource} ({verseData.transliterationLanguage})
                  </p>
                  <p className="text-xl md:text-2xl leading-relaxed italic text-center" dangerouslySetInnerHTML={{ __html: verseData.transliteration }}>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Translation Variants */}
        <div id="translations">
          <Card className="mb-6 border-2 border-accent/20">
            <CardHeader>
              <CardTitle>Translations</CardTitle>
              <CardDescription>Available translations for this verse</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {(() => {
                const desiredOrder = ["translation_griffith", "translation_oldenberg", "translation_macdonell", "translation_renou", "translation_elizarenkova", "translation_geldner", "translation_grassmann"];
                const filteredTranslations = verseData.versions
                  ? verseData.versions
                      .filter(v => v.type === "translation" && desiredOrder.includes(v.id))
                      .sort((a, b) => desiredOrder.indexOf(a.id) - desiredOrder.indexOf(b.id))
                  : [];

                return filteredTranslations.map((t, idx) => (
                  <div key={t.id || idx} className="p-6 rounded-xl border-2 border-border bg-card hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-lg">{t.source || t.id}</p>
                        <p className="text-xs text-muted-foreground">{t.language}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{idx + 1}</Badge>
                    </div>
                    <p className="text-base leading-relaxed italic">&ldquo;{t.form.join(" ")}&rdquo;</p>
                    {t.source && (
                      <p className="text-sm text-muted-foreground italic mt-2 text-right">
                        — {t.source}
                      </p>
                    )}
                  </div>
                ));
              })()}
            </CardContent>
          </Card>
        </div>

        {/* Word-by-Word Analysis */}
        <div id="word-analysis">
          <Card className="mb-6 border-2 border-secondary/20">
            <CardHeader>
              <CardTitle>Word-by-Word Analysis</CardTitle>
              <CardDescription>Morphological breakdown of each word</CardDescription>
            </CardHeader>
            <CardContent>
              {verseData.padas && verseData.padas.length > 0 ? (
                <div className="space-y-4">
                  {verseData.padas.map((pada, pIdx) => (
                    <div key={pada.id || pIdx} className="p-4 rounded-xl bg-muted/30 border border-border">
                      <h4 className="font-semibold mb-2">Pāda {pada.index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pada.grammarData.map((token, tIdx) => (
                          <div key={tIdx} className="p-3 rounded-lg bg-card border border-dashed border-gray-300">
                            <p className="text-lg font-devanagari">{token.form}</p>
                            {token.lemma && <p className="text-sm text-muted-foreground">Lemma: {token.lemma}</p>}
                            {token.props && Object.keys(token.props).length > 0 && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {Object.entries(token.props).map(([key, value]) => (
                                  <span key={key} className="block">{key}: {value}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Word-by-word analysis not available for this verse.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Thematic Significance (AI) */}
        <div id="thematic-significance">
          <Card className="mb-6 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Thematic Significance
              </CardTitle>
              <CardDescription>
                Deeper meaning generated via AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!thematicContent && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="apiKey">OpenAI API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder="sk-..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Your API key is used only for this request and not stored
                    </p>
                  </div>
                  <Button 
                    onClick={generateThematicSignificance}
                    disabled={isLoadingThematic}
                    className="w-full"
                  >
                    {isLoadingThematic ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Thematic Significance"
                    )}
                  </Button>
                </div>
              )}

              {thematicContent && (
                <div className="prose prose-sm max-w-none">
                  <div className="p-6 rounded-lg bg-muted/30 border whitespace-pre-wrap">
                    {thematicContent}
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setThematicContent("")}
                    className="mt-4"
                  >
                    Generate Again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Dynamic Metrical Structure (L/G grid) */}
        {renderMetricalStructure()}

        {/* Context Card */}
        <Card className="mb-6 border-2 border-secondary/20" id="context">
          <CardHeader>
            <CardTitle>Hymn Context & Metadata</CardTitle>
            <CardDescription>Understanding the verse in its collection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Location in Rigveda
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This verse is part of <span className="font-semibold text-foreground">Mandala {verseData.mandala}</span>, from <span className="font-semibold text-foreground">Hymn {verseData.hymn}</span>, verse <span className="font-semibold text-foreground">{verseData.verse}</span>.
                  (Absolute Hymn: {verseData.hymnAbs}, Internal Index: {verseData.index})
                </p>
                {verseData.strata && (
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                    Strata: <span className="font-semibold text-foreground">{verseData.strata}</span>
                  </p>
                )}
                {verseData.lateAdditions && verseData.lateAdditions.length > 0 && (
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                    Late Additions: <span className="font-semibold text-foreground">{verseData.lateAdditions.join(', ')}</span>
                  </p>
                )}
              </div>

              {verseData.deity && (
                <div className="p-6 rounded-xl bg-gradient-to-br from-accent/5 to-secondary/5 border border-border">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Flame className="w-5 h-5" />
                    About the Deity
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This hymn is addressed to <span className="font-semibold text-foreground">{verseData.deity}</span>.
                  </p>
                </div>
              )}
              {verseData.poet_family && (
                <div className="p-6 rounded-xl bg-gradient-to-br from-secondary/5 to-primary/5 border border-border">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Poet Family
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This verse was composed by the <span className="font-semibold text-foreground">{verseData.poet_family}</span>.
                  </p>
                </div>
              )}
              {verseData.seer && (
                <div className="p-6 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Seer
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The seer (Ṛṣi) associated with this verse is <span className="font-semibold text-foreground">{verseData.seer}</span>.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* External Resources */}
        {verseData.externalResources && verseData.externalResources.length > 0 && (
          <div id="external-resources">
            <Card className="mb-6 border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="w-5 h-5" />
                  External Resources
                </CardTitle>
                <CardDescription>Relevant links for further study</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {verseData.externalResources.map((resource, rIdx) => (
                  <div key={rIdx} className="p-4 rounded-xl bg-muted/30 border border-border">
                    <h4 className="font-semibold mb-2">{resource.label}</h4>
                    {resource.description && <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>}
                    <ul className="list-disc list-inside space-y-1">
                      {resource.references.map((ref, refIdx) => (
                        <li key={refIdx} className="text-sm">
                          <a href={ref} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            {ref}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation controls */}
        <Card className="border-2 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Explorer
              </Button>
              <div className="flex gap-2 w-full sm:w-auto">
                <Link href={`/features/verse-deep-dive?m=${verseData.mandala}&h=${verseData.hymn}&v=${Math.max(1, verseData.verse - 1)}`} className="flex-1 sm:flex-initial">
                  <Button variant="outline" className="w-full">Previous Verse</Button>
                </Link>
                <Link href={`/features/verse-deep-dive?m=${verseData.mandala}&h=${verseData.hymn}&v=${verseData.verse + 1}`} className="flex-1 sm:flex-initial">
                  <Button variant="outline" className="w-full">Next Verse</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
