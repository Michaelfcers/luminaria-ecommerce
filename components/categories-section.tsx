import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CategoriesSection() {
  const categories = [
    {
      name: "Luminarias",
      description: "Iluminación general y ambiental",
      image: "/products/luminaria-plafon.webp",
      href: "/productos?categoria=luminarias",
      count: "120+ productos",
    },
    {
      name: "Lámparas",
      description: "Lámparas de mesa, pie y decorativas",
      image: "/products/luminaria-plafon.webp",
      href: "/productos?categoria=lamparas",
      count: "85+ productos",
    },
    {
      name: "Accesorios Eléctricos",
      description: "Interruptores, enchufes y más",
      image: "/products/luminaria-plafon.webp",
      href: "/productos?categoria=accesorios",
      count: "60+ productos",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl font-bold text-foreground mb-4">Nuestras Categorías</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Explora nuestra amplia gama de productos de iluminación premium
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div
              key={category.name}
              className={`group relative overflow-hidden rounded-2xl elegant-shadow hover-lift fade-in-up stagger-${index + 1} h-80 cursor-pointer`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${category.image})` }}
              />

              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300" />

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-xs font-medium mb-1 text-white/90 drop-shadow-lg">{category.count}</p>
                <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">{category.name}</h3>
                <p className="text-white/95 mb-4 text-sm leading-relaxed drop-shadow">{category.description}</p>
                <Button
                  asChild
                  size="sm"
                  className="bg-white text-black hover:bg-white/90 transition-all duration-300 font-medium"
                >
                  <Link href={category.href}>Ver Productos</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
