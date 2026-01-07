"use client"
import { useRef } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export type RecommendedProduct = {
  id: string
  name: string
  price: number | null
  image: string
}

interface RecommendedProductsProps {
  currentProductId: string
  recommendedProducts: RecommendedProduct[]
}

export function RecommendedProducts({
  currentProductId,
  recommendedProducts,
}: RecommendedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const products = recommendedProducts.filter(
    (product) => String(product.id) !== String(currentProductId)
  )

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section className="p-8 rounded-lg">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-foreground">Productos Recomendados</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => scroll("left")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => scroll("right")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => (
          <Card
            key={product.id}
            className="flex-shrink-0 w-80 group overflow-hidden bg-white rounded-2xl elegant-shadow hover-lift"
          >
            <div className="relative overflow-hidden">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-2 line-clamp-2 h-10">{product.name}</h3>
              <div className="flex items-center justify-between">
                {product.price && (
                  <span className="text-lg font-bold text-primary">${product.price}</span>
                )}
                <Button asChild size="sm">
                  <Link href={`/producto/${product.id}`}>Ver</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
