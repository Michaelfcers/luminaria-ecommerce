import { AboutHero } from "@/features/store/components/about-hero"
import { AboutStory } from "@/features/store/components/about-story"
import { AboutValues } from "@/features/store/components/about-values"
import { AboutTeam } from "@/features/store/components/about-team"
import { AboutStats } from "@/features/store/components/about-stats"

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
