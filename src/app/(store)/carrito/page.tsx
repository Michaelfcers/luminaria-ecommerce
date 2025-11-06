import { Navigation } from "@/components/layout/navigation"
import { Footer } from "@/components/layout/footer"

export default function CartPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">AQUI VA EL CARRITO</h1>
      </main>
      <Footer />
    </div>
  )
}
