"use client"

import { useState } from "react"
import { DecorativePattern } from "@/components/mystical/decorative-pattern"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Flame, Users, Activity, Calendar, Scroll, Sparkles, ExternalLink } from "lucide-react"

interface MandalaData {
  number: number
  name: string
  hymns: number
  verses: number
  avgVersesPerHymn: number
  deities: {main: string[], count: number}
  rishis: {main: string[], count: number}
  metres: {dominant: string, distribution: {name: string, percent: number}[]}
  period: string
  linguisticFeatures: string[]
  themes: string[]
  specialCharacteristics: string[]
  famousHymns: {id: string, name: string, description: string}[]
}

const mandalaDataset: MandalaData[] = [
  {
    number: 1,
    name: "Youngest Book (Part 1)",
    hymns: 191,
    verses: 2006,
    avgVersesPerHymn: 10.5,
    deities: {
      main: ["Agni", "Indra", "Aśvins", "Soma"],
      count: 35
    },
    rishis: {
      main: ["Madhucchandas Vaiśvāmitra", "Medhātithi Kāṇva", "Gotama Rāhūgaṇa"],
      count: 45
    },
    metres: {
      dominant: "Gāyatrī",
      distribution: [
        {name: "Gāyatrī", percent: 35},
        {name: "Triṣṭubh", percent: 40},
        {name: "Jagatī", percent: 15},
        {name: "Others", percent: 10}
      ]
    },
    period: "Late Rigvedic (1200-1000 BCE)",
    linguisticFeatures: [
      "Mixed linguistic features",
      "Some archaic forms, some innovative",
      "Transitional vocabulary"
    ],
    themes: [
      "Diverse pantheon invocations",
      "Ritual procedures",
      "Cosmological speculation",
      "Nature worship"
    ],
    specialCharacteristics: [
      "Heterogeneous collection",
      "Compiled from various sources",
      "Contains both old and new material",
      "Acts as introductory book"
    ],
    famousHymns: [
      {id: "1.1", name: "First Agni Hymn", description: "Opening hymn to Agni, the divine priest"},
      {id: "1.154", name: "Viṣṇu's Three Strides", description: "Viṣṇu's cosmic manifestation"},
      {id: "1.164", name: "Riddle Hymn", description: "Profound philosophical riddles"}
    ]
  },
  {
    number: 2,
    name: "Gr̥tsamada Family Book",
    hymns: 43,
    verses: 429,
    avgVersesPerHymn: 10.0,
    deities: {
      main: ["Agni", "Indra", "Bṛhaspati", "Savitṛ"],
      count: 18
    },
    rishis: {
      main: ["Gr̥tsamada Śaunahotra", "Kurma Gārtsamada", "Somāhuti Bhārgava"],
      count: 12
    },
    metres: {
      dominant: "Triṣṭubh",
      distribution: [
        {name: "Triṣṭubh", percent: 55},
        {name: "Gāyatrī", percent: 20},
        {name: "Jagatī", percent: 15},
        {name: "Others", percent: 10}
      ]
    },
    period: "Middle Rigvedic (1400-1200 BCE)",
    linguisticFeatures: [
      "Consistent family dialect",
      "Unique phraseology",
      "Archaic grammatical forms"
    ],
    themes: [
      "Fire worship (Agni emphasis)",
      "Indra's valor",
      "Priestly functions",
      "Divine protection"
    ],
    specialCharacteristics: [
      "Shortest family book",
      "Strong Gr̥tsamada lineage signature",
      "Emphasis on priestly duties",
      "Distinct stylistic unity"
    ],
    famousHymns: [
      {id: "2.12", name: "Who is Indra?", description: "Rhetorical celebration of Indra's might"},
      {id: "2.33", name: "Rudra Hymn", description: "Praise and propitiation of fierce Rudra"}
    ]
  },
  {
    number: 3,
    name: "Viśvāmitra Family Book",
    hymns: 62,
    verses: 617,
    avgVersesPerHymn: 9.9,
    deities: {
      main: ["Agni", "Indra", "Aśvins", "Savitṛ"],
      count: 22
    },
    rishis: {
      main: ["Viśvāmitra Gāthina", "Jamadagni Bhārgava", "Kuśika lineage"],
      count: 18
    },
    metres: {
      dominant: "Gāyatrī",
      distribution: [
        {name: "Gāyatrī", percent: 45},
        {name: "Triṣṭubh", percent: 35},
        {name: "Jagatī", percent: 12},
        {name: "Others", percent: 8}
      ]
    },
    period: "Middle Rigvedic (1400-1200 BCE)",
    linguisticFeatures: [
      "Viśvāmitra dialect features",
      "Specific lexical preferences",
      "Formulaic expressions unique to lineage"
    ],
    themes: [
      "Cosmic order (ṛta)",
      "Sun worship",
      "Morning rituals",
      "Divine illumination"
    ],
    specialCharacteristics: [
      "Contains the Gāyatrī Mantra (3.62.10)",
      "Strong solar focus",
      "Emphasis on wisdom and enlightenment",
      "Viśvāmitra's conversion legend"
    ],
    famousHymns: [
      {id: "3.62.10", name: "Gāyatrī Mantra", description: "Most sacred Vedic mantra to Savitṛ"},
      {id: "3.33", name: "Viśvāmitra & Rivers", description: "Rivers' dialogue with the sage"}
    ]
  },
  {
    number: 4,
    name: "Vāmadeva Family Book",
    hymns: 58,
    verses: 589,
    avgVersesPerHymn: 10.2,
    deities: {
      main: ["Agni", "Indra", "Uṣas", "Aśvins"],
      count: 20
    },
    rishis: {
      main: ["Vāmadeva Gautama", "Trasadasyu Paurukutsya", "Purumīḍha Gautama"],
      count: 15
    },
    metres: {
      dominant: "Triṣṭubh",
      distribution: [
        {name: "Triṣṭubh", percent: 50},
        {name: "Gāyatrī", percent: 25},
        {name: "Jagatī", percent: 18},
        {name: "Others", percent: 7}
      ]
    },
    period: "Middle Rigvedic (1400-1200 BCE)",
    linguisticFeatures: [
      "Gautama family style",
      "Poetic virtuosity",
      "Complex metaphors"
    ],
    themes: [
      "Heroic exploits",
      "Dawn worship",
      "Cosmic creation",
      "Divine friendship"
    ],
    specialCharacteristics: [
      "High poetic quality",
      "Balanced deity distribution",
      "Gautama lineage traditions",
      "Emphasis on Uṣas (dawn)"
    ],
    famousHymns: [
      {id: "4.26", name: "Indra's Might", description: "Celebration of Indra's power"},
      {id: "4.42", name: "Twin Physicians", description: "Hymn to Aśvins, divine healers"}
    ]
  },
  {
    number: 5,
    name: "Atri Family Book",
    hymns: 87,
    verses: 727,
    avgVersesPerHymn: 8.4,
    deities: {
      main: ["Agni", "Indra", "Viṣṇu", "Maruts"],
      count: 24
    },
    rishis: {
      main: ["Atri Bhauma", "Śyāvāśva Ātreya", "Budha Ātreya"],
      count: 20
    },
    metres: {
      dominant: "Triṣṭubh",
      distribution: [
        {name: "Triṣṭubh", percent: 52},
        {name: "Gāyatrī", percent: 22},
        {name: "Jagatī", percent: 16},
        {name: "Others", percent: 10}
      ]
    },
    period: "Middle Rigvedic (1400-1200 BCE)",
    linguisticFeatures: [
      "Atri dialect",
      "Astronomical references",
      "Technical ritual terminology"
    ],
    themes: [
      "Solar eclipses",
      "Storm gods",
      "Cosmic battles",
      "Ritual precision"
    ],
    specialCharacteristics: [
      "Astronomical observations",
      "Atri's solar rescue legend",
      "Strong Marut emphasis",
      "Technical ritual knowledge"
    ],
    famousHymns: [
      {id: "5.40", name: "Solar Eclipse", description: "Atri's rescue of the sun"},
      {id: "5.85", name: "Storm Gods", description: "Maruts' cosmic power"}
    ]
  },
  {
    number: 6,
    name: "Bharadvāja Family Book",
    hymns: 75,
    verses: 765,
    avgVersesPerHymn: 10.2,
    deities: {
      main: ["Agni", "Indra", "Soma", "Pūṣan"],
      count: 21
    },
    rishis: {
      main: ["Bharadvāja Bārhaspatya", "Suhotra Bhāradvāja", "Nara Bhāradvāja"],
      count: 16
    },
    metres: {
      dominant: "Triṣṭubh",
      distribution: [
        {name: "Triṣṭubh", percent: 48},
        {name: "Gāyatrī", percent: 28},
        {name: "Jagatī", percent: 14},
        {name: "Others", percent: 10}
      ]
    },
    period: "Middle Rigvedic (1400-1200 BCE)",
    linguisticFeatures: [
      "Bharadvāja phraseology",
      "Consistent metre usage",
      "Family-specific vocabulary"
    ],
    themes: [
      "Divine benevolence",
      "Prosperity prayers",
      "Ritual efficacy",
      "Cattle wealth"
    ],
    specialCharacteristics: [
      "Well-organized structure",
      "Bharadvāja lineage pride",
      "Emphasis on Pūṣan (pastoral deity)",
      "Ritual instruction focus"
    ],
    famousHymns: [
      {id: "6.9", name: "Agni as Priest", description: "Agni's priestly functions"},
      {id: "6.47", name: "Indra & Wealth", description: "Prayer for prosperity"}
    ]
  },
  {
    number: 7,
    name: "Vasiṣṭha Family Book",
    hymns: 104,
    verses: 841,
    avgVersesPerHymn: 8.1,
    deities: {
      main: ["Agni", "Indra", "Varuṇa", "Aśvins"],
      count: 26
    },
    rishis: {
      main: ["Vasiṣṭha Maitrāvaruṇi", "Śakti Vāsiṣṭha", "Parāśara Śāktya"],
      count: 18
    },
    metres: {
      dominant: "Triṣṭubh",
      distribution: [
        {name: "Triṣṭubh", percent: 55},
        {name: "Gāyatrī", percent: 20},
        {name: "Jagatī", percent: 15},
        {name: "Others", percent: 10}
      ]
    },
    period: "Early-Middle Rigvedic (1500-1300 BCE)",
    linguisticFeatures: [
      "Archaic grammatical features",
      "Vasiṣṭha family style",
      "Refined poetic diction"
    ],
    themes: [
      "Varuṇa worship",
      "Cosmic order",
      "Ethical conduct",
      "Royal patronage"
    ],
    specialCharacteristics: [
      "Largest family book",
      "Strong Varuṇa focus",
      "Vasiṣṭha-Viśvāmitra rivalry legends",
      "Emphasis on ṛta (cosmic law)"
    ],
    famousHymns: [
      {id: "7.86", name: "Varuṇa's Mercy", description: "Vasiṣṭha's plea to Varuṇa"},
      {id: "7.88", name: "Varuṇa & Mitra", description: "Twin guardians of order"}
    ]
  },
  {
    number: 8,
    name: "Kaṇva & Āṅgirasa Collections",
    hymns: 103,
    verses: 1716,
    avgVersesPerHymn: 16.7,
    deities: {
      main: ["Indra", "Agni", "Soma", "Aśvins"],
      count: 28
    },
    rishis: {
      main: ["Pragātha Kāṇva", "Medhātithi Kāṇva", "Various Āṅgirasas"],
      count: 42
    },
    metres: {
      dominant: "Gāyatrī",
      distribution: [
        {name: "Gāyatrī", percent: 42},
        {name: "Triṣṭubh", percent: 32},
        {name: "Jagatī", percent: 16},
        {name: "Others", percent: 10}
      ]
    },
    period: "Mixed (1500-1000 BCE)",
    linguisticFeatures: [
      "Heterogeneous styles",
      "Mix of archaic and late forms",
      "Varied dialectal features"
    ],
    themes: [
      "Indra's soma-drinking",
      "Heroic battles",
      "Divine assistance",
      "Ritual complexity"
    ],
    specialCharacteristics: [
      "Longest average hymn length",
      "Mixed lineage compositions",
      "Valakhilya supplement (8.49-59)",
      "High verse count despite fewer hymns"
    ],
    famousHymns: [
      {id: "8.48", name: "Indra & Soma", description: "Praise of soma-drinking Indra"},
      {id: "8.58", name: "Vālakhilya", description: "Supplementary mystical hymns"}
    ]
  },
  {
    number: 9,
    name: "Soma Maṇḍala",
    hymns: 114,
    verses: 1108,
    avgVersesPerHymn: 9.7,
    deities: {
      main: ["Soma Pavamāna"],
      count: 1
    },
    rishis: {
      main: ["Various (multi-author)", "Mainly Āṅgirasas & Kaṇvas"],
      count: 50
    },
    metres: {
      dominant: "Gāyatrī",
      distribution: [
        {name: "Gāyatrī", percent: 60},
        {name: "Jagatī", percent: 25},
        {name: "Triṣṭubh", percent: 10},
        {name: "Others", percent: 5}
      ]
    },
    period: "Ritual compilation (1200-1000 BCE)",
    linguisticFeatures: [
      "Specialized ritual vocabulary",
      "Repetitive formulae",
      "Soma pressing terminology"
    ],
    themes: [
      "Soma purification",
      "Ritual pressing",
      "Divine intoxication",
      "Cosmic transformation"
    ],
    specialCharacteristics: [
      "Entirely dedicated to Soma",
      "Liturgical organization",
      "Ritual instruction embedded",
      "High Gāyatrī metre usage",
      "Pavamāna (flowing/purifying) epithet"
    ],
    famousHymns: [
      {id: "9.113", name: "Soma's Immortality", description: "Where immortality dwells"},
      {id: "9.1", name: "First Pressing", description: "Soma's purification begins"}
    ]
  },
  {
    number: 10,
    name: "Youngest Book (Part 2)",
    hymns: 191,
    verses: 1754,
    avgVersesPerHymn: 9.2,
    deities: {
      main: ["Various (diverse)", "Agni", "Indra", "Viśvedevas"],
      count: 45
    },
    rishis: {
      main: ["Various authors", "Mixed lineages"],
      count: 65
    },
    metres: {
      dominant: "Triṣṭubh",
      distribution: [
        {name: "Triṣṭubh", percent: 45},
        {name: "Gāyatrī", percent: 25},
        {name: "Jagatī", percent: 20},
        {name: "Others", percent: 10}
      ]
    },
    period: "Latest Rigvedic (1200-1000 BCE)",
    linguisticFeatures: [
      "Most innovative language",
      "Philosophical vocabulary",
      "Proto-Upaniṣadic terminology"
    ],
    themes: [
      "Cosmogony speculation",
      "Death and afterlife",
      "Marriage and society",
      "Philosophical inquiry"
    ],
    specialCharacteristics: [
      "Most diverse content",
      "Nāsadīya Sūkta (creation hymn)",
      "Purūravas-Urvaśī dialogue",
      "Philosophical and speculative",
      "Transition to Upaniṣadic thought"
    ],
    famousHymns: [
      {id: "10.129", name: "Nāsadīya Sūkta", description: "Hymn of creation - cosmic origins"},
      {id: "10.90", name: "Puruṣa Sūkta", description: "Cosmic person sacrifice"},
      {id: "10.95", name: "Purūravas-Urvaśī", description: "Mortal and celestial nymph dialogue"},
      {id: "10.121", name: "Hiraṇyagarbha", description: "Golden embryo of creation"}
    ]
  }
]

export default function MandalaDeepDivePage() {
  const [selectedMandala, setSelectedMandala] = useState<number>(1)
  
  const mandala = mandalaDataset.find(m => m.number === selectedMandala) || mandalaDataset[0]

  return (
    <div className="min-h-screen bg-background relative">
      <DecorativePattern />
      
      <div className="container mx-auto px-4 py-4 max-w-7xl relative z-10">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-10 w-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold font-heading">Maṇḍala Deep Dive</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive exploration of each Maṇḍala of the Rigveda
          </p>
        </div>

        {/* Mandala Selector */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <label className="text-sm font-semibold mt-1">Select Maṇḍala:</label>
              <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <Button
                    key={num}
                    variant={selectedMandala === num ? "default" : "outline"}
                    onClick={() => setSelectedMandala(num)}
                    size="sm"
                    className="min-w-[60px]"
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Header Card */}
        <Card className="mb-6 border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-3xl font-heading mb-2">
                  Maṇḍala {mandala.number}: {mandala.name}
                </CardTitle>
                <CardDescription className="text-lg">
                  {mandala.period}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {mandala.hymns} Hymns • {mandala.verses} Verses
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Compact Stats as Tags */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Badge variant="outline" className="px-3 py-2 text-sm">
            Hymns (Sūktas): <span className="ml-2 font-semibold">{mandala.hymns}</span>
          </Badge>
          <Badge variant="outline" className="px-3 py-2 text-sm">
            Verses (Ṛcs): <span className="ml-2 font-semibold">{mandala.verses}</span>
          </Badge>
          <Badge variant="outline" className="px-3 py-2 text-sm">
            Avg Verses/Hymn: <span className="ml-2 font-semibold">{mandala.avgVersesPerHymn}</span>
          </Badge>
          <Badge variant="outline" className="px-3 py-2 text-sm">
            Deities Invoked: <span className="ml-2 font-semibold">{mandala.deities.count}</span>
          </Badge>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Deities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-primary" />
                Primary Deities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mandala.deities.main.map((deity, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="font-semibold">{deity}</span>
                  <Badge variant="outline">{idx + 1}</Badge>
                </div>
              ))}
              <div className="text-sm text-muted-foreground mt-4">
                Total: {mandala.deities.count} deities invoked across this maṇḍala
              </div>
            </CardContent>
          </Card>

          {/* Rishis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                Primary R̥ṣis (Composers)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mandala.rishis.main.map((rishi, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="font-semibold">{rishi}</span>
                  <Badge variant="outline">{idx + 1}</Badge>
                </div>
              ))}
              <div className="text-sm text-muted-foreground mt-4">
                Total: {mandala.rishis.count} r̥ṣis attributed to this maṇḍala
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Metre Distribution */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-secondary" />
              Metre Distribution
            </CardTitle>
            <CardDescription>
              Dominant metre: <strong>{mandala.metres.dominant}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mandala.metres.distribution.map((metre, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{metre.name}</span>
                  <span className="text-muted-foreground">{metre.percent}%</span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-primary to-accent"
                    style={{ width: `${metre.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Linguistic Features */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Linguistic Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {mandala.linguisticFeatures.map((feature, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-muted/30 border">
                  <p className="text-sm">{feature}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Themes */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Major Themes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {mandala.themes.map((theme, idx) => (
                <Badge key={idx} variant="secondary" className="text-sm px-4 py-2">
                  {theme}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Special Characteristics */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Special Characteristics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mandala.specialCharacteristics.map((char, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <p className="flex-1">{char}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Famous Hymns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Famous Hymns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {mandala.famousHymns.map((hymn, idx) => (
                <Card key={idx} className="border-2">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>RV {hymn.id}</span>
                      <a
                        href={`https://vedaweb.uni-koeln.de/${hymn.id.replace('.', '/')}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </CardTitle>
                    <CardDescription className="font-semibold">{hymn.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{hymn.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}