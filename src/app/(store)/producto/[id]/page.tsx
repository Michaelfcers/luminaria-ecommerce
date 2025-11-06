import { Navigation } from "@/components/layout/navigation"
import { ProductGallery } from "@/features/store/components/product-gallery"
import { ProductInfo } from "@/features/store/components/product-info"
import { ProductSpecs } from "@/features/store/components/product-specs"
import { RecommendedProducts } from "@/features/store/components/recommended-products"
import { Footer } from "@/components/layout/footer"

// This would typically come from a database or API
const getProduct = (id: string) => {
  return {
    id: Number.parseInt(id),
    name: "Lámpara Colgante Moderna Minimalista",
    price: 299,
    originalPrice: 399,
    brand: "Artemide",
    category: "Lámparas Colgantes",
    rating: 4.8,
    reviews: 24,
    inStock: true,
    description:
      "Elegante lámpara colgante de diseño minimalista que combina funcionalidad y estética. Perfecta para espacios modernos que buscan una iluminación sofisticada y contemporánea.",
    features: [
      "Diseño minimalista y elegante",
      "Iluminación LED de alta eficiencia",
      "Regulable con dimmer compatible",
      "Instalación fácil y segura",
      "Garantía de 3 años",
      "Certificación CE y RoHS",
    ],
    specifications: {
      Potencia: "15W LED",
      "Flujo luminoso": "1200 lúmenes",
      "Temperatura de color": "3000K (Blanco cálido)",
      Dimensiones: "Ø 25cm x 120cm altura",
      Material: "Aluminio anodizado y vidrio",
      Peso: "1.2 kg",
      Voltaje: "220-240V AC",
      "Vida útil": "50,000 horas",
      "Índice de protección": "IP20",
      Regulable: "Sí (dimmer no incluido)",
    },
    images: [
      "/modern-pendant-lamp-minimalist.jpg",
      "/brands/philips-logo.webp",
      "/brands/philips-logo.webp",
      "/brands/philips-logo.webp",
    ],
    technicalSheet: "/docs/lampara-colgante-moderna-ficha-tecnica.pdf",
  }
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = getProduct(params.id)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <a href="/" className="hover:text-foreground">
            Inicio
          </a>
          <span>/</span>
          <a href="/productos" className="hover:text-foreground">
            Productos
          </a>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <ProductGallery images={product.images} productName={product.name} />
          <ProductInfo product={product} />
        </div>

        {/* Product Specifications */}
        <ProductSpecs
          features={product.features}
          specifications={product.specifications}
          technicalSheet={product.technicalSheet}
        />

        {/* Recommended Products */}
        <RecommendedProducts currentProductId={product.id} />
      </main>
      <Footer />
    </div>
  )
}
