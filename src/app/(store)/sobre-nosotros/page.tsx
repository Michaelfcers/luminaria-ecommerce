import { AboutHero } from "@/features/marketing/components/about-hero"
import { AboutStory } from "@/features/marketing/components/about-story"
import { AboutValues } from "@/features/marketing/components/about-values"
import { AboutTeam } from "@/features/marketing/components/about-team"
import { AboutStats } from "@/features/marketing/components/about-stats"

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutValues />
      <AboutStats />
      <AboutTeam />
    </>
  )
}
