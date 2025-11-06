"use client"
import { useRef } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface RecommendedProductsProps {
  currentProductId: number
}

export function RecommendedProducts({ currentProductId }: RecommendedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const recommendedProducts = [
    {
      id: 2,
      name: "Plafón LED Circular Premium",
      price: 189,
      image: "/circular-led-ceiling-light.jpg",
      category: "Luminarias",
      rating: 4.6,
    },
    {
      id: 3,
      name: "Aplique de Pared Elegante",
      price: 149,
      image: "/elegant-wall-sconce-light.jpg",
      category: "Lámparas",
      rating: 4.7,
    },
    {
      id: 4,
      name: "Lámpara de Mesa Premium",
      price: 229,
      image: "/premium-table-lamp-luxury.jpg",
      category: "Lámparas",
      rating: 4.9,
    },
    {
      id: 7,
      name: "Lámpara de Pie Minimalista",
      price: 349,
      image: "/minimalist-floor-lamp-white.jpg",
      category: "Lámparas",
      rating: 4.8,
    },
    {
      id: 5,
      name: "Spot Empotrado LED",
      price: 79,
      image: "/recessed-led-spotlight.png",
      category: "Luminarias",
      rating: 4.5,
    },
  ].filter((product) => product.id !== currentProductId)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section>
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
        {recommendedProducts.map((product) => (
          <Card
            key={product.id}
            className="flex-shrink-0 w-80 group overflow-hidden border-0 elegant-shadow hover-lift"
          >
            <div className="relative overflow-hidden">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <CardContent className="p-4">
              <Badge variant="secondary" className="text-xs mb-2">
                {product.category}
              </Badge>
              <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-yellow-400">★</span>
                <span className="text-sm text-muted-foreground">{product.rating}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">€{product.price}</span>
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
