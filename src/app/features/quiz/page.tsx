"use client"

import { useState, useEffect } from "react"
import { DecorativePattern } from "@/components/mystical/decorative-pattern"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Trophy, Check, X, RotateCcw, Clock } from "lucide-react"
import { toast } from "sonner"

interface QuizQuestion {
  id: number
  type: "metre" | "deity" | "accent"
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const ALL_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    type: "metre",
    question: "How many syllables are in each pāda of the Gāyatrī metre?",
    options: ["6", "8", "10", "11"],
    correctAnswer: 1,
    explanation: "Gāyatrī has 8 syllables per pāda, with 3 pādas totaling 24 syllables."
  },
  {
    id: 2,
    type: "deity",
    question: "Which deity is most frequently invoked in the Rigveda?",
    options: ["Agni", "Indra", "Soma", "Varuna"],
    correctAnswer: 1,
    explanation: "Indra, the king of gods and god of thunder, is invoked in about 250 hymns, making him the most prominent deity."
  },
  {
    id: 3,
    type: "accent",
    question: "What does the Unicode mark ॑ (vertical line above) represent?",
    options: ["Anudātta (low)", "Udātta (high)", "Svarita (falling)", "Avagraha"],
    correctAnswer: 1,
    explanation: "The vertical line above (॑) marks Udātta, the high pitch or raised tone in Vedic pronunciation."
  },
  {
    id: 4,
    type: "metre",
    question: "Which is the most common metre in the Rigveda?",
    options: ["Gāyatrī", "Triṣṭubh", "Jagatī", "Anuṣṭubh"],
    correctAnswer: 1,
    explanation: "Triṣṭubh (11 syllables × 4 pādas) is the most common metre, used in approximately 40% of Rigvedic verses."
  },
  {
    id: 5,
    type: "deity",
    question: "Who is the seer (r̥ṣi) of the famous Gāyatrī Mantra (RV 3.62.10)?",
    options: ["Vasiṣṭha", "Viśvāmitra", "Bharadvāja", "Atri"],
    correctAnswer: 1,
    explanation: "Viśvāmitra Gāthina is credited as the seer of the Gāyatrī Mantra, one of the most sacred Vedic verses."
  },
  {
    id: 6,
    type: "metre",
    question: "What is the syllable count for Jagatī metre?",
    options: ["11", "12", "13", "14"],
    correctAnswer: 1,
    explanation: "Jagatī has 12 syllables per pāda (12×4 = 48 total syllables)."
  },
  {
    id: 7,
    type: "deity",
    question: "Which mandala is entirely dedicated to Soma?",
    options: ["Mandala 7", "Mandala 8", "Mandala 9", "Mandala 10"],
    correctAnswer: 2,
    explanation: "Mandala 9 contains 114 hymns all dedicated to Soma Pavamāna."
  },
  {
    id: 8,
    type: "metre",
    question: "How many syllables are in Anuṣṭubh metre?",
    options: ["8×2", "8×4", "11×4", "12×4"],
    correctAnswer: 1,
    explanation: "Anuṣṭubh has 8 syllables per pāda, 4 pādas = 32 syllables total."
  },
  {
    id: 9,
    type: "deity",
    question: "Who is the deity of dawn in the Rigveda?",
    options: ["Ratri", "Ushas", "Sūrya", "Savitṛ"],
    correctAnswer: 1,
    explanation: "Ushas is the goddess of dawn, celebrated in multiple hymns."
  },
  {
    id: 10,
    type: "accent",
    question: "What accent follows Udātta to create Svarita?",
    options: ["Udātta", "Anudātta", "Pluta", "Dirgha"],
    correctAnswer: 1,
    explanation: "Svarita is created when Udātta (high) is followed by Anudātta (low)."
  },
  {
    id: 11,
    type: "deity",
    question: "Who are the divine physician twins?",
    options: ["Mitra-Varuna", "Aśvins", "Maruts", "Rbhus"],
    correctAnswer: 1,
    explanation: "The Aśvins are divine twin physicians who bring healing."
  },
  {
    id: 12,
    type: "metre",
    question: "Which family books are Mandalas 2-7 called?",
    options: ["Royal books", "Family books", "Soma books", "Late books"],
    correctAnswer: 1,
    explanation: "Mandalas 2-7 are called family books, attributed to specific r̥ṣi lineages."
  },
  {
    id: 13,
    type: "deity",
    question: "Which deity is associated with cosmic order (ṛta)?",
    options: ["Indra", "Varuna", "Agni", "Soma"],
    correctAnswer: 1,
    explanation: "Varuna is the guardian of cosmic order and moral law (ṛta)."
  },
  {
    id: 14,
    type: "metre",
    question: "What percentage of Rigveda uses Triṣṭubh metre?",
    options: ["20%", "30%", "40%", "50%"],
    correctAnswer: 2,
    explanation: "Approximately 40% of Rigvedic verses use the Triṣṭubh metre."
  },
  {
    id: 15,
    type: "deity",
    question: "Who is the chief priest among the gods?",
    options: ["Agni", "Bṛhaspati", "Indra", "Prajāpati"],
    correctAnswer: 1,
    explanation: "Bṛhaspati (also called Brahmaṇaspati) is the priest of the gods."
  }
]

export default function QuizPage() {
  const [questionCount, setQuestionCount] = useState<5 | 10 | 15>(5)
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [quizActive, setQuizActive] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showSetup, setShowSetup] = useState(true)

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    if (quizActive && !quizCompleted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleQuizComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [quizActive, quizCompleted, timeLeft])

  const startQuiz = (count: 5 | 10 | 15) => {
    setQuestionCount(count)
    setQuizQuestions(ALL_QUIZ_QUESTIONS.slice(0, count))
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setTimeLeft(count === 5 ? 60 : count === 10 ? 120 : 180)
    setQuizActive(true)
    setQuizCompleted(false)
    setShowSetup(false)
  }

  const handleQuizComplete = () => {
    setQuizCompleted(true)
    setQuizActive(false)
    if (score === quizQuestions.length) {
      toast.success("Perfect score! You're a Rigveda expert!")
    } else if (score >= 3) {
      toast.success("Great job! You know your Vedas!")
    } else {
      toast("Keep learning! The Rigveda holds endless wisdom.")
    }
  }

  const handleAnswer = (answerIndex: number) => {
    if (showResult) return
    setSelectedAnswer(answerIndex)
    setShowResult(true)
    
    if (answerIndex === quizQuestions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      handleQuizComplete()
    }
  }

  const handleReset = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setTimeLeft(60)
    setQuizActive(false)
    setQuizCompleted(false)
  }

  const question = quizQuestions[currentQuestion]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "metre": return "bg-primary/10 text-primary border-primary/30"
      case "deity": return "bg-accent/10 text-accent border-accent/30"
      case "accent": return "bg-secondary/10 text-secondary border-secondary/30"
      default: return "bg-muted"
    }
  }

  return (
    <div className="min-h-screen bg-background relative">
      <DecorativePattern />
      
      <div className="container mx-auto px-4 py-4 max-w-4xl relative z-10">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-10 w-10 text-primary animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold">Vedic Quiz</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Test your knowledge about metres, deities, and accents
          </p>
        </div>

        {showSetup && (
          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-primary" />
              <CardTitle className="text-2xl">Select Quiz Length</CardTitle>
              <CardDescription className="text-base">
                Choose how many questions you want to answer
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-2 border-primary/20 hover:border-primary hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => startQuiz(5)}>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-primary mb-2">5</div>
                    <div className="text-sm font-semibold mb-2">Quick Quiz</div>
                    <div className="text-xs text-muted-foreground mb-3">60 seconds</div>
                    <Button className="w-full">Start</Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-accent/20 hover:border-accent hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => startQuiz(10)}>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-accent mb-2">10</div>
                    <div className="text-sm font-semibold mb-2">Standard Quiz</div>
                    <div className="text-xs text-muted-foreground mb-3">120 seconds</div>
                    <Button className="w-full">Start</Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-secondary/20 hover:border-secondary hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => startQuiz(15)}>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-secondary mb-2">15</div>
                    <div className="text-sm font-semibold mb-2">Expert Quiz</div>
                    <div className="text-xs text-muted-foreground mb-3">180 seconds</div>
                    <Button className="w-full">Start</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}

        {quizActive && !quizCompleted && question && (
          <div className="space-y-6">
            {/* Progress Bar */}
            <Card className="border-2 border-accent/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <Badge className={getTypeColor(question.type)} variant="outline">
                      {question.type.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Question {currentQuestion + 1} of {quizQuestions.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className={`font-mono font-bold ${timeLeft <= 10 ? 'text-destructive animate-pulse' : ''}`}>
                      {timeLeft}s
                    </span>
                  </div>
                </div>
                <Progress value={(currentQuestion / quizQuestions.length) * 100} className="h-2" />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>Score: {score}/{currentQuestion + (showResult ? 1 : 0)}</span>
                  <span>{Math.round((currentQuestion / quizQuestions.length) * 100)}% Complete</span>
                </div>
              </CardContent>
            </Card>

            {/* Question Card */}
            <Card className="border-2 border-primary/30">
              <CardHeader>
                <CardTitle className="text-2xl">{question.question}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  {question.options.map((option, idx) => {
                    const isCorrect = idx === question.correctAnswer
                    const isSelected = idx === selectedAnswer
                    const showCorrectAnswer = showResult && isCorrect
                    const showWrongAnswer = showResult && isSelected && !isCorrect

                    return (
                      <Button
                        key={idx}
                        variant={showCorrectAnswer ? "default" : showWrongAnswer ? "destructive" : "outline"}
                        className={`h-auto py-4 px-6 text-left justify-start text-base ${
                          !showResult && 'hover:border-primary hover:bg-primary/5'
                        }`}
                        onClick={() => handleAnswer(idx)}
                        disabled={showResult}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            showCorrectAnswer ? 'bg-primary border-primary' : 
                            showWrongAnswer ? 'bg-destructive border-destructive' : 
                            'border-current'
                          }`}>
                            {showCorrectAnswer && <Check className="w-5 h-5" />}
                            {showWrongAnswer && <X className="w-5 h-5" />}
                            {!showResult && <span>{String.fromCharCode(65 + idx)}</span>}
                          </div>
                          <span className="flex-1">{option}</span>
                        </div>
                      </Button>
                    )
                  })}
                </div>

                {showResult && (
                  <div className="mt-6 p-6 rounded-xl bg-muted/50 border-2 border-border">
                    <p className="font-semibold mb-2">Explanation:</p>
                    <p className="text-sm text-muted-foreground">{question.explanation}</p>
                  </div>
                )}

                {showResult && (
                  <Button onClick={handleNext} size="lg" className="w-full mt-4">
                    {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "See Results"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {quizCompleted && (
          <Card className="border-2 border-primary/30">
            <CardHeader className="text-center bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10">
              <Trophy className="w-20 h-20 mx-auto mb-4 text-primary" />
              <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
              <CardDescription className="text-lg mt-2">
                Your final score: {score} out of {quizQuestions.length}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="mb-8">
                <div className="flex justify-center mb-4">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-primary mb-2">
                      {Math.round((score / quizQuestions.length) * 100)}%
                    </div>
                    <p className="text-muted-foreground">Accuracy</p>
                  </div>
                </div>
                
                <Progress value={(score / quizQuestions.length) * 100} className="h-4 mb-6" />
                
                <div className="grid grid-cols-3 gap-4 text-center mb-6">
                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                    <p className="text-2xl font-bold text-primary">{score}</p>
                    <p className="text-xs text-muted-foreground">Correct</p>
                  </div>
                  <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                    <p className="text-2xl font-bold text-destructive">{quizQuestions.length - score}</p>
                    <p className="text-xs text-muted-foreground">Wrong</p>
                  </div>
                  <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                    <p className="text-2xl font-bold text-accent">{60 - timeLeft}s</p>
                    <p className="text-xs text-muted-foreground">Time Used</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={startQuiz} size="lg" className="flex-1">
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Try Again
                </Button>
                <Link href="/features" className="flex-1">
                  <Button variant="outline" size="lg" className="w-full">
                    Explore Features
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}