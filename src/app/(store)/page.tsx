import { HeroSection } from "@/features/marketing/components/hero-section"
import { BrandsSection } from "@/features/marketing/components/brands-section"
import { PromotionsCarousel } from "@/features/marketing/components/promotions-carousel"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PromotionsCarousel />
      <BrandsSection />
    </>
  )
}
