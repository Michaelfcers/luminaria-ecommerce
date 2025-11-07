import { HeroSection } from "@/features/store/components/hero-section"
import { BrandsSection } from "@/features/store/components/brands-section"
import { CategoriesSection } from "@/features/store/components/categories-section"
import { FeaturedProducts } from "@/features/store/components/featured-products"
import { PromotionsCarousel } from "@/features/store/components/promotions-carousel"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PromotionsCarousel />
      <BrandsSection />
      <CategoriesSection />
      <FeaturedProducts />
    </>
  )
}
