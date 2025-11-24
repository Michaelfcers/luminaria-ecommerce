import { HeroSection } from "@/features/store/components/hero-section"
import { BrandsSection } from "@/features/store/components/brands-section"
import { PromotionsCarousel } from "@/features/store/components/promotions-carousel"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PromotionsCarousel />
      <BrandsSection />
    </>
  )
}
