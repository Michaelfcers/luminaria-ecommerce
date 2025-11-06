import { Navigation } from "@/components/layout/navigation"
import { HeroSection } from "@/features/store/components/hero-section"
import { BrandsSection } from "@/features/store/components/brands-section"
import { CategoriesSection } from "@/features/store/components/categories-section"
import { FeaturedProducts } from "@/features/store/components/featured-products"
import { Footer } from "@/components/layout/footer"
import { PromotionsCarousel } from "@/features/store/components/promotions-carousel"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <PromotionsCarousel />
        <BrandsSection />
        <CategoriesSection />
        <FeaturedProducts />
      </main>
      <Footer />
    </div>
  )
}
