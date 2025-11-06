import { Navigation } from "@/components/layout/navigation"
import { ProductsGrid } from "@/features/store/components/products-grid"
import { ProductFilters } from "@/features/store/components/product-filters"
import { Footer } from "@/components/layout/footer"

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Nuestros Productos</h1>
          <p className="text-muted-foreground">
            Descubre nuestra completa colección de luminarias y accesorios de alta calidad
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <ProductFilters />
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <ProductsGrid />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
