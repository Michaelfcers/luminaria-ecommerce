import { Navigation } from "@/components/layout/navigation"
import { AboutHero } from "@/features/store/components/about-hero"
import { AboutStory } from "@/features/store/components/about-story"
import { AboutValues } from "@/features/store/components/about-values"
import { AboutTeam } from "@/features/store/components/about-team"
import { AboutStats } from "@/features/store/components/about-stats"
import { Footer } from "@/components/layout/footer"

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
