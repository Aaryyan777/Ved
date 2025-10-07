"use client"

import { useState, useEffect } from "react"
import { DecorativePattern } from "@/components/mystical/decorative-pattern"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ArrowLeft, Bookmark, Plus, Trash2, Share2, BookOpen } from "lucide-react"

interface VerseBookmark {
  id: string
  mandala: number
  hymn: number
  verse: number
  note: string
  collection: string
  timestamp: number
}

const presetCollections = [
  { id: "peace", name: "Peace & Meditation", description: "Calming verses for reflection" },
  { id: "cosmic", name: "Cosmic Hymns", description: "Creation and universe" },
  { id: "fire", name: "Agni Worship", description: "Fire ritual verses" }
]

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<VerseBookmark[]>([])
  const [newBookmark, setNewBookmark] = useState({ mandala: "", hymn: "", verse: "", note: "", collection: "personal" })
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("rigveda_bookmarks")
    if (saved) {
      setBookmarks(JSON.parse(saved))
    }
  }, [])

  const saveBookmarks = (updatedBookmarks: VerseBookmark[]) => {
    setBookmarks(updatedBookmarks)
    localStorage.setItem("rigveda_bookmarks", JSON.stringify(updatedBookmarks))
  }

  const addBookmark = () => {
    if (!newBookmark.mandala || !newBookmark.hymn || !newBookmark.verse) return
    
    const bookmark: VerseBookmark = {
      id: Date.now().toString(),
      mandala: parseInt(newBookmark.mandala),
      hymn: parseInt(newBookmark.hymn),
      verse: parseInt(newBookmark.verse),
      note: newBookmark.note,
      collection: newBookmark.collection,
      timestamp: Date.now()
    }
    
    saveBookmarks([...bookmarks, bookmark])
    setNewBookmark({ mandala: "", hymn: "", verse: "", note: "", collection: "personal" })
  }

  const deleteBookmark = (id: string) => {
    saveBookmarks(bookmarks.filter(b => b.id !== id))
  }

  const filteredBookmarks = selectedCollection
    ? bookmarks.filter(b => b.collection === selectedCollection)
    : bookmarks

  const shareCollection = () => {
    const url = `${window.location.origin}/features/bookmarks?collection=${selectedCollection || "all"}&bookmarks=${encodeURIComponent(JSON.stringify(filteredBookmarks))}`
    navigator.clipboard.writeText(url)
    alert("Collection link copied to clipboard!")
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <DecorativePattern />
      
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
            <Bookmark className="h-10 w-10 text-primary animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Verse Collections
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Save favorite verses • Add personal notes • Create custom collections
          </p>
        </div>

        {/* Add New Bookmark */}
        <Card className="border-2 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Add New Bookmark
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <Input
                placeholder="Maṇḍala"
                type="number"
                value={newBookmark.mandala}
                onChange={e => setNewBookmark({...newBookmark, mandala: e.target.value})}
              />
              <Input
                placeholder="Hymn"
                type="number"
                value={newBookmark.hymn}
                onChange={e => setNewBookmark({...newBookmark, hymn: e.target.value})}
              />
              <Input
                placeholder="Verse"
                type="number"
                value={newBookmark.verse}
                onChange={e => setNewBookmark({...newBookmark, verse: e.target.value})}
              />
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newBookmark.collection}
                onChange={e => setNewBookmark({...newBookmark, collection: e.target.value})}
              >
                <option value="personal">Personal</option>
                {presetCollections.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <Textarea
              placeholder="Add personal notes (optional)..."
              value={newBookmark.note}
              onChange={e => setNewBookmark({...newBookmark, note: e.target.value})}
              className="mb-4"
            />
            <Button onClick={addBookmark} className="w-full gap-2">
              <Plus className="w-4 h-4" />
              Add Bookmark
            </Button>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Collections Sidebar */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Collections</h3>
            
            <button
              onClick={() => setSelectedCollection(null)}
              className={`w-full text-left p-4 rounded-xl transition-all ${
                selectedCollection === null
                  ? 'bg-primary/10 border-2 border-primary'
                  : 'bg-muted hover:bg-muted/80 border-2 border-border'
              }`}
            >
              <div className="font-semibold">All Bookmarks</div>
              <div className="text-sm text-muted-foreground">{bookmarks.length} verses</div>
            </button>

            <button
              onClick={() => setSelectedCollection("personal")}
              className={`w-full text-left p-4 rounded-xl transition-all ${
                selectedCollection === "personal"
                  ? 'bg-primary/10 border-2 border-primary'
                  : 'bg-muted hover:bg-muted/80 border-2 border-border'
              }`}
            >
              <div className="font-semibold">Personal</div>
              <div className="text-sm text-muted-foreground">
                {bookmarks.filter(b => b.collection === "personal").length} verses
              </div>
            </button>

            {presetCollections.map(collection => (
              <button
                key={collection.id}
                onClick={() => setSelectedCollection(collection.id)}
                className={`w-full text-left p-4 rounded-xl transition-all ${
                  selectedCollection === collection.id
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'bg-muted hover:bg-muted/80 border-2 border-border'
                }`}
              >
                <div className="font-semibold">{collection.name}</div>
                <div className="text-xs text-muted-foreground mb-2">{collection.description}</div>
                <div className="text-sm text-muted-foreground">
                  {bookmarks.filter(b => b.collection === collection.id).length} verses
                </div>
              </button>
            ))}
          </div>

          {/* Bookmarks List */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">
                {selectedCollection
                  ? presetCollections.find(c => c.id === selectedCollection)?.name || "Personal"
                  : "All Bookmarks"}
              </h3>
              {filteredBookmarks.length > 0 && (
                <Button onClick={shareCollection} variant="outline" size="sm" className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Share Collection
                </Button>
              )}
            </div>

            {filteredBookmarks.length === 0 ? (
              <Card className="border-2 shadow-xl">
                <CardContent className="pt-12 pb-12 text-center text-muted-foreground">
                  <Bookmark className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>No bookmarks in this collection yet</p>
                  <p className="text-sm mt-2">Add verses above to start building your collection</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredBookmarks.map(bookmark => (
                  <Card key={bookmark.id} className="border-2 shadow-xl">
                    <CardHeader className="bg-gradient-to-br from-primary/5 to-accent/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent">
                            <BookOpen className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">
                              Rigveda {bookmark.mandala}.{bookmark.hymn}.{bookmark.verse}
                            </CardTitle>
                            <Badge variant="secondary" className="mt-1">
                              {presetCollections.find(c => c.id === bookmark.collection)?.name || "Personal"}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          onClick={() => deleteBookmark(bookmark.id)}
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    {bookmark.note && (
                      <CardContent className="pt-4">
                        <div className="p-4 rounded-xl bg-muted/30 border border-border">
                          <div className="text-xs text-muted-foreground mb-2">Personal Note:</div>
                          <p className="text-sm leading-relaxed">{bookmark.note}</p>
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          Added {new Date(bookmark.timestamp).toLocaleDateString()}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}