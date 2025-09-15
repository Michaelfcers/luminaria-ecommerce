import { Navigation } from "@/components/navigation"
import { AboutHero } from "@/components/about-hero"
import { AboutStory } from "@/components/about-story"
import { AboutValues } from "@/components/about-values"
import { AboutTeam } from "@/components/about-team"
import { AboutStats } from "@/components/about-stats"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <AboutHero />
        <AboutStory />
        <AboutValues />
        <AboutStats />
        <AboutTeam />
      </main>
      <Footer />
    </div>
  )
}
