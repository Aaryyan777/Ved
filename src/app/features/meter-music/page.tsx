"use client"

import { useState } from "react"
import { DecorativePattern } from "@/components/mystical/decorative-pattern"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Music, Play, Pause, RotateCcw, Loader2 } from "lucide-react"
import { toast } from "sonner"

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

const metres = [
  {
    name: "Gāyatrī",
    pattern: "⏑−⏑−⏑−⏑−",
    syllables: [1, 2, 1, 2, 1, 2, 1, 2],
    description: "8 syllables per pāda, most sacred metre",
    tempo: 120
  },
  {
    name: "Triṣṭubh",
    pattern: "⏑−⏑−−⏑⏑−⏑−−",
    syllables: [1, 2, 1, 2, 2, 1, 1, 2, 1, 2, 2],
    description: "11 syllables per pāda, heroic metre",
    tempo: 100
  },
  {
    name: "Jagatī",
    pattern: "⏑−⏑−−⏑⏑−⏑−−⏑",
    syllables: [1, 2, 1, 2, 2, 1, 1, 2, 1, 2, 2, 1],
    description: "12 syllables per pāda, flowing metre",
    tempo: 90
  },
  {
    name: "Anuṣṭubh",
    pattern: "⏑−⏑−−⏑⏑−",
    syllables: [1, 2, 1, 2, 2, 1, 1, 2],
    description: "8 syllables per pāda, popular metre",
    tempo: 110
  }
]

export default function MeterMusicPage() {
  const [mandala, setMandala] = useState("")
  const [hymn, setHymn] = useState("")
  const [verse, setVerse] = useState("")
  const [selectedMetre, setSelectedMetre] = useState(metres[0])
  const [verseData, setVerseData] = useState<VerseData | null>(null)
  const [dynamicSyllables, setDynamicSyllables] = useState<number[] | null>(null) // Syllables for dynamic metrical music
  const [isPlayingDynamic, setIsPlayingDynamic] = useState(false) // State for dynamic metrical music playback
  const [currentDynamicBeat, setCurrentDynamicBeat] = useState(0) // Current beat for dynamic metrical music visualization
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentBeat, setCurrentBeat] = useState(0)
  const [customTempo, setCustomTempo] = useState(120); // For dynamic metrical music
  const [laghuDurationMs, setLaghuDurationMs] = useState(200); // Base duration for Laghu
  const [guruMultiplier, setGuruMultiplier] = useState(2); // Guru duration multiplier
  const [instrumentType, setInstrumentType] = useState<OscillatorType>('sine'); // 'sine', 'square', 'sawtooth', 'triangle'

  const fetchVerseMetadata = async () => {
    if (!mandala || !hymn || !verse) {
      toast.error("Please enter Mandala, Hymn, and Verse")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/rigveda/verse?mandala=${mandala}&hymn=${hymn}&verse=${verse}`)
      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || "Failed to fetch verse")
        return
      }

      // Attempt to derive metrical_data from versions if not directly provided
      if (!data.data.metrical_data && data.data.versions && data.data.versions.length > 0) {
        const metricalVersion = data.data.versions.find(v => v.metricalData && v.type === "version" && v.language?.startsWith("san"));
        if (metricalVersion && metricalVersion.metricalData) {
          data.data.metrical_data = metricalVersion.metricalData.join("<br />");
        }
      }
      setVerseData(data.data)

      // Convert metrical data to dynamic syllables for music generation
      if (data.data.metrical_data) {
        const convertedSyllables = convertMetricalDataToSyllables(data.data.metrical_data);
        setDynamicSyllables(convertedSyllables);
        console.log("Dynamic Syllables set:", convertedSyllables); // Debug log
      } else {
        setDynamicSyllables(null); // Reset if no metrical data
        console.log("Dynamic Syllables reset (no metrical data)."); // Debug log
      }
      
      // Find matching metre
      const metre = metres.find(m => m.name === data.data.meter) || metres[0]
      setSelectedMetre(metre)
      
      toast.success("Verse loaded! Music generation ready.")
    } catch (error) {
      console.error(error)
      toast.error("Failed to fetch verse")
    } finally {
      setIsLoading(false)
    }
  }

  const playTalaSequence = () => {
    setIsPlaying(true)
    let beat = 0
    
    const interval = setInterval(() => {
      if (beat < selectedMetre.syllables.length) {
        setCurrentBeat(beat)
        
        // Play sound simulation
        const audioContext = new AudioContext()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        // Different frequencies for long/short syllables
        oscillator.frequency.value = selectedMetre.syllables[beat] === 2 ? 440 : 330
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
        
        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.2)
        
        beat++
      } else {
        clearInterval(interval)
        setIsPlaying(false)
        setCurrentBeat(0)
        toast.success("Tala sequence complete!")
      }
    }, (60 / selectedMetre.tempo) * 1000)
  }

  const stopTalaSequence = () => {
    setIsPlaying(false)
    setCurrentBeat(0)
  }

  const playDynamicMetreMusic = () => {
    console.log("playDynamicMetreMusic called. dynamicSyllables:", dynamicSyllables); // Debug log
    if (!dynamicSyllables || dynamicSyllables.length === 0) {
      toast.error("No dynamic metrical data to play.")
      return;
    }

    setIsPlayingDynamic(true)

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    let currentAudioTime = audioContext.currentTime;
    let beatIndex = 0;
    let cumulativeDelay = 0; // Initialize cumulative delay

    const scheduleNextNote = () => {
      if (beatIndex < dynamicSyllables.length) {
        const isGuru = dynamicSyllables[beatIndex] === 2;
        const duration = isGuru
          ? (laghuDurationMs / 1000) * guruMultiplier
          : (laghuDurationMs / 1000);

        const currentBeatDelay = cumulativeDelay; // Capture cumulativeDelay *before* incrementing

        // Schedule visual update using the captured delay
        setTimeout(() => {
          setCurrentDynamicBeat(beatIndex);
        }, currentBeatDelay * 1000);

        // Schedule audio
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = instrumentType;
        oscillator.frequency.value = isGuru ? 330 : 440; // Inverted frequencies for distinction

        gainNode.gain.setValueAtTime(0.3, currentAudioTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, currentAudioTime + duration * 0.8);

        oscillator.start(currentAudioTime);
        oscillator.stop(currentAudioTime + duration);

        currentAudioTime += duration; // Advance time for next note
        cumulativeDelay += duration; // Update cumulativeDelay
        beatIndex++;
        scheduleNextNote(); // Schedule the next note
      } else {
        // Sequence complete
        setTimeout(() => {
          setIsPlayingDynamic(false);
          setCurrentDynamicBeat(-1); // Reset to -1 to clear highlight
          toast.success("Dynamic metrical sequence complete!");
          audioContext.close(); // Clean up audio context
        }, cumulativeDelay * 1000); // Use cumulativeDelay for final reset
      }
    };

    scheduleNextNote();
  };

  const stopDynamicMetreMusic = () => {
    setIsPlayingDynamic(false)
    setCurrentDynamicBeat(-1) // Reset to -1 to clear highlight
  }

  const resetSequence = () => {
    stopTalaSequence()
    toast.info("Sequence reset")
  }

  // Helper function to convert L/G metrical data to syllable durations
  const convertMetricalDataToSyllables = (metricalDataString: string): number[] => {
    const syllables: number[] = [];
    const padas = metricalDataString.split("<br />");
    padas.forEach(pada => {
      const cleanedPada = pada.trim().replace(/\s/g, ''); // Remove all spaces
      for (const char of cleanedPada) {
        if (char === 'L') {
          syllables.push(1);
        } else if (char === 'G') {
          syllables.push(2);
        } else if (char === 'S') { // Assuming 'S' might also represent Guru
          syllables.push(2);
        }
      }
    });
    return syllables;
  };


  const renderMetricalStructure = (
    isPlayingDynamic: boolean,
    currentDynamicBeat: number,
    playDynamicMetreMusic: () => void,
    stopDynamicMetreMusic: () => void,
    dynamicSyllables: number[] | null,
    customTempo: number,
    setCustomTempo: (tempo: number) => void,
    laghuDurationMs: number,
    setLaghuDurationMs: (duration: number) => void,
    guruMultiplier: number,
    setGuruMultiplier: (multiplier: number) => void,
    instrumentType: OscillatorType,
    setInstrumentType: (type: OscillatorType) => void
  ) => {
    if (!verseData?.metrical_data) return null

    const padas = verseData.metrical_data.split("<br />").map(line => line.trim().replace(/\s/g, '').split("")); // Remove all spaces before splitting into chars
    
    // Flatten padas into a single array of syllables for beat tracking
    const flatSyllables = padas.flat();

    return (
      <div className="space-y-4 mt-4"> {/* Added mt-4 for spacing */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          {/* Metrical Data Keyboard */}
          <div className="flex-grow space-y-2"> {/* Adjusted spacing */}
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold">Metrical Structure:</div>
              {dynamicSyllables && dynamicSyllables.length > 0 && (
                <Button
                  size="sm"
                  onClick={isPlayingDynamic ? stopDynamicMetreMusic : playDynamicMetreMusic}
                  disabled={!dynamicSyllables || dynamicSyllables.length === 0}
                >
                  {isPlayingDynamic ? (
                    <><Pause className="w-4 h-4 mr-1" /> Stop Metre Music</>
                  ) : (
                    <><Play className="w-4 h-4 mr-1" /> Play Metre Music</>
                  )}
                </Button>
              )}
            </div>
            {padas.map((pada, pIdx) => (
              <div key={pIdx} className="">
                <div className="mb-1 text-xs font-medium">Pāda {pIdx + 1}:</div> {/* Smaller label */}
                <div className="flex gap-1 flex-wrap"> {/* Smaller gap */}
                  {pada.map((syll, sIdx) => {
                    // Calculate global index for lighting up
                    const globalIndex = padas.slice(0, pIdx).flat().length + sIdx;
                    const isCurrentBeat = isPlayingDynamic && currentDynamicBeat === globalIndex;
                    console.log(`Pada ${pIdx}, Syllable ${sIdx}: globalIndex=${globalIndex}, currentDynamicBeat=${currentDynamicBeat}, isCurrentBeat=${isCurrentBeat}`);

                    return (
                      <div
                        key={sIdx}
                        className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold border ${
                          syll === "L" ? "bg-amber-200/70 text-amber-900 border-amber-300" : "bg-sky-300/70 text-sky-900 border-sky-400"
                        } ${isCurrentBeat ? "scale-110 shadow-md ring-2 ring-offset-2 ring-primary" : ""}`}
                      >
                        {syll}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="text-xs text-muted-foreground mt-2"> {/* Adjusted spacing */}
              L = Laghu (short) • G = Guru (long)
            </div>
          </div>

          {/* Music Generation Settings */}
          <div className="w-full md:w-1/3 space-y-2 p-4 border rounded-lg bg-muted/30 text-sm">
            <h3 className="text-md font-semibold mb-2">Music Generation Settings</h3>
            {/* Tempo */}
            <div>
              <Label htmlFor="customTempo" className="text-xs">Tempo (BPM): {customTempo}</Label>
              <Input
                id="customTempo"
                type="range"
                min="60"
                max="240"
                value={customTempo}
                onChange={(e) => setCustomTempo(Number(e.target.value))}
                className="mt-1 h-2 bg-primary/20 [&::-webkit-slider-thumb]:bg-primary [&::-moz-range-thumb]:bg-primary"
              />
            </div>

            {/* Laghu Duration */}
            <div>
              <Label htmlFor="laghuDurationMs" className="text-xs">Laghu Duration (ms): {laghuDurationMs}</Label>
              <Input
                id="laghuDurationMs"
                type="range"
                min="50"
                max="500"
                step="10"
                value={laghuDurationMs}
                onChange={(e) => setLaghuDurationMs(Number(e.target.value))}
                className="mt-1 h-2 bg-primary/20 [&::-webkit-slider-thumb]:bg-primary [&::-moz-range-thumb]:bg-primary"
              />
            </div>

            {/* Guru Multiplier */}
            <div>
              <Label htmlFor="guruMultiplier" className="text-xs">Guru Duration Multiplier: {guruMultiplier}x</Label>
              <Input
                id="guruMultiplier"
                type="range"
                min="1.5"
                max="3"
                step="0.1"
                value={guruMultiplier}
                onChange={(e) => setGuruMultiplier(Number(e.target.value))}
                className="mt-1 h-2 bg-primary/20 [&::-webkit-slider-thumb]:bg-primary [&::-moz-range-thumb]:bg-primary"
              />
            </div>

            {/* Instrument Type */}
            <div>
              <Label htmlFor="instrumentType" className="text-xs">Instrument Type</Label>
              <select
                id="instrumentType"
                value={instrumentType}
                onChange={(e) => setInstrumentType(e.target.value as OscillatorType)}
                className="mt-1 block w-full p-1 text-xs border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="sine">Sine Wave</option>
                <option value="square">Square Wave</option>
                <option value="sawtooth">Sawtooth Wave</option>
                <option value="triangle">Triangle Wave</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative">
      <DecorativePattern />
      
      <div className="container mx-auto px-4 py-4 max-w-5xl relative z-10">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music className="h-10 w-10 text-primary animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold">Meter-as-Music Generator</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Select a verse and generate music based on its metrical pattern
          </p>
        </div>

        {/* Verse Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Verse</CardTitle>
            <CardDescription>Enter Mandala, Hymn, and Verse numbers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="mandala">Maṇḍala</Label>
                <Input
                  id="mandala"
                  type="number"
                  min="1"
                  max="10"
                  placeholder="1-10"
                  value={mandala}
                  onChange={(e) => setMandala(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="hymn">Hymn (Sūkta)</Label>
                <Input
                  id="hymn"
                  type="number"
                  min="1"
                  placeholder="e.g., 1"
                  value={hymn}
                  onChange={(e) => setHymn(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="verse">Verse (Ṛc)</Label>
                <Input
                  id="verse"
                  type="number"
                  min="1"
                  placeholder="e.g., 1"
                  value={verse}
                  onChange={(e) => setVerse(e.target.value)}
                />
              </div>
            </div>

            <Button 
              onClick={fetchVerseMetadata} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading Verse...
                </>
              ) : (
                "Load Verse & Metre Info"
              )}
            </Button>

            {verseData && (
              <div className="p-4 rounded-lg bg-muted/30 border">
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">Verse:</span> {verseData.mandala}.{verseData.hymn}.{verseData.verse}
                  </div>
                  <div>
                    <span className="font-semibold">Deity:</span> {verseData.deity}
                  </div>
                  <div>
                    <span className="font-semibold">Verse:</span> {verseData.meter_type}
                  </div>
                  <div className="pt-2">
                    <p className="text-lg font-devanagari font-bold" dangerouslySetInnerHTML={{ __html: verseData.sanskrit }}></p>
                  </div>
                  {/* Display Metrical Structure using the new function */}
                  {renderMetricalStructure(
                    isPlayingDynamic,
                    currentDynamicBeat,
                    playDynamicMetreMusic,
                    stopDynamicMetreMusic,
                    dynamicSyllables,
                    customTempo,
                    setCustomTempo,
                    laghuDurationMs,
                    setLaghuDurationMs,
                    guruMultiplier,
                    setGuruMultiplier,
                    instrumentType,
                    setInstrumentType
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Metre selection */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Select Metre</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {metres.map((metre) => (
                  <button
                    key={metre.name}
                    onClick={() => {
                      setSelectedMetre(metre)
                      stopTalaSequence()
                    }}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      selectedMetre.name === metre.name
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="font-bold text-lg mb-1">{metre.name}</div>
                    <div className="text-sm text-muted-foreground">{metre.description}</div>
                    <div className="text-xs font-mono mt-2 text-primary">{metre.pattern}</div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Tala Sequence</CardTitle>
                <CardDescription>
                  {selectedMetre.name} • {selectedMetre.tempo} BPM • {selectedMetre.syllables.length} beats
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Metrical pattern */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-card to-primary/5 border-2 border-primary/20">
                  <div className="text-center mb-4">
                    <div className="text-4xl font-mono mb-2">{selectedMetre.pattern}</div>
                    <div className="text-sm text-muted-foreground">
                      ⏑ = short (laghu) • − = long (guru)
                    </div>
                  </div>
                </div>

                                {/* Beat visualization */}
                                <div className="flex flex-wrap gap-3 justify-center">
                                  {selectedMetre.syllables.map((duration, idx) => (
                                    <div
                                      key={idx}
                                      className={`flex items-center justify-center rounded-lg border-2 transition-all duration-200 ${
                                        currentBeat === idx && isPlaying
                                          ? "scale-125 shadow-lg border-primary bg-primary text-primary-foreground"
                                          : "border-border"
                                      } ${duration === 2 ? "w-20 h-20" : "w-14 h-14"}`}
                                    >
                                      <div className="text-center">
                                        <div className="font-bold">{idx + 1}</div>
                                        <div className="text-xs">{duration === 2 ? "−" : "⏑"}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                {/* Controls */}
                <div className="flex flex-wrap gap-3 justify-center pt-4">
                  <Button
                    size="lg"
                    onClick={isPlaying ? stopTalaSequence : playTalaSequence}
                    className="gap-2"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-5 h-5" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        Play Music
                      </>
                    )}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={resetSequence}
                    className="gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Reset
                  </Button>
                </div>

                {/* Progress bar */}
                {isPlaying && (
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-200"
                      style={{
                        width: `${((currentBeat + 1) / selectedMetre.syllables.length) * 100}%`
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            
            {/* Information */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Understanding Tala Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Long syllables (−) produce lower, sustained notes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Short syllables (⏑) produce higher, quick notes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Each metre has its own characteristic rhythm and tempo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>The pattern repeats four times for a complete verse (4 pādas)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}