"use client"

import { DecorativePattern } from "@/components/mystical/decorative-pattern"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Construction } from "lucide-react"
import { LucideIcon } from "lucide-react"

interface FeaturePlaceholderProps {
  title: string
  description: string
  icon: LucideIcon
  features: string[]
  comingSoon?: boolean
}

export function FeaturePlaceholder({ 
  title, 
  description, 
  icon: Icon, 
  features,
  comingSoon = true 
}: FeaturePlaceholderProps) {
  return (
    <div className="min-h-screen bg-background relative">
      <DecorativePattern />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <Link href="/features">
          <Button variant="ghost" className="gap-2 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Features
          </Button>
        </Link>
        
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icon className="h-10 w-10 text-primary animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {comingSoon ? (
          <Card className="border-2 border-primary/30 mb-6">
            <CardHeader className="text-center bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Construction className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Coming Soon</CardTitle>
              <CardDescription className="text-base">
                This feature is currently under development
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-4">
                <p className="text-center text-muted-foreground mb-6">
                  We're working on bringing you an exceptional experience with this feature.
                </p>
                
                <div className="bg-muted/30 p-6 rounded-xl">
                  <p className="font-semibold mb-3">Planned Features:</p>
                  <ul className="space-y-2">
                    {features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-center pt-6">
                  <Link href="/features">
                    <Button size="lg">
                      Explore Other Features
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Content will be added here for implemented features */}
          </div>
        )}
      </div>
    </div>
  )
}