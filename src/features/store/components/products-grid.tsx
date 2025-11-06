"use client"
import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Grid, List } from "lucide-react"

export function ProductsGrid() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("featured")

  const products = [
    {
      id: 1,
      name: "Lámpara Colgante Moderna Minimalista",
      price: 299,
      originalPrice: 399,
      image: "/modern-pendant-lamp-minimalist.jpg",
      category: "Lámparas",
      brand: "Artemide",
      isNew: true,
      rating: 4.8,
      reviews: 24,
    },
    {
      id: 2,
      name: "Plafón LED Circular Premium",
      price: 189,
      image: "/circular-led-ceiling-light.jpg",
      category: "Luminarias",
      brand: "Philips",
      isNew: false,
      rating: 4.6,
      reviews: 18,
    },
    {
      id: 3,
      name: "Aplique de Pared Elegante",
      price: 149,
      image: "/elegant-wall-sconce-light.jpg",
      category: "Lámparas",
      brand: "Flos",
      isNew: false,
      rating: 4.7,
      reviews: 32,
    },
    {
      id: 4,
      name: "Lámpara de Mesa Premium Luxury",
      price: 229,
      image: "/premium-table-lamp-luxury.jpg",
      category: "Lámparas",
      brand: "Louis Poulsen",
      isNew: true,
      rating: 4.9,
      reviews: 15,
    },
    {
      id: 5,
      name: "Spot Empotrado LED Regulable",
      price: 79,
      image: "/recessed-led-spotlight.png",
      category: "Luminarias",
      brand: "Osram",
      isNew: false,
      rating: 4.5,
      reviews: 41,
    },
    {
      id: 6,
      name: "Interruptor Táctil Moderno",
      price: 45,
      image: "/touch-light-switch-modern.jpg",
      category: "Accesorios",
      brand: "Philips",
      isNew: false,
      rating: 4.4,
      reviews: 28,
    },
    {
      id: 7,
      name: "Lámpara de Pie Minimalista Blanca",
      price: 349,
      image: "/minimalist-floor-lamp-white.jpg",
      category: "Lámparas",
      brand: "Foscarini",
      isNew: true,
      rating: 4.8,
      reviews: 12,
    },
    {
      id: 8,
      name: "Tira LED Regulable Smart",
      price: 89,
      image: "/placeholder.svg?height=300&width=300",
      category: "Luminarias",
      brand: "Philips",
      isNew: false,
      rating: 4.3,
      reviews: 67,
    },
    // Add more products...
    {
      id: 9,
      name: "Chandelier Cristal Elegante",
      price: 899,
      image: "/placeholder.svg?height=300&width=300",
      category: "Lámparas",
      brand: "Artemide",
      isNew: false,
      rating: 4.9,
      reviews: 8,
    },
    {
      id: 10,
      name: "Panel LED Cuadrado",
      price: 125,
      image: "/placeholder.svg?height=300&width=300",
      category: "Luminarias",
      brand: "Osram",
      isNew: false,
      rating: 4.6,
      reviews: 22,
    },
    {
      id: 11,
      name: "Lámpara Escritorio Articulada",
      price: 179,
      image: "/placeholder.svg?height=300&width=300",
      category: "Lámparas",
      brand: "Flos",
      isNew: true,
      rating: 4.7,
      reviews: 19,
    },
    {
      id: 12,
      name: "Regulador de Intensidad WiFi",
      price: 65,
      image: "/placeholder.svg?height=300&width=300",
      category: "Accesorios",
      brand: "Philips",
      isNew: false,
      rating: 4.5,
      reviews: 35,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header with sorting and view options */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-muted-foreground">Mostrando {products.length} productos</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Sort dropdown */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Destacados</SelectItem>
              <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
              <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
              <SelectItem value="newest">Más Nuevos</SelectItem>
              <SelectItem value="rating">Mejor Valorados</SelectItem>
            </SelectContent>
          </Select>

          {/* View mode toggle */}
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div
        className={
          viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
        }
      >
        {products.map((product) => (
          <Card
            key={product.id}
            className={`group overflow-hidden border-0 elegant-shadow hover-lift ${
              viewMode === "list" ? "flex flex-row" : ""
            }`}
          >
            <div className={`relative overflow-hidden ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                  viewMode === "list" ? "h-32 w-full" : "h-64 w-full"
                }`}
              />
              {product.isNew && (
                <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">Nuevo</Badge>
              )}
              {product.originalPrice && (
                <Badge variant="destructive" className="absolute top-3 right-3">
                  Oferta
                </Badge>
              )}
            </div>

            <CardContent className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
              <div className="mb-2">
                <Badge variant="secondary" className="text-xs">
                  {product.category}
                </Badge>
                <Badge variant="outline" className="text-xs ml-2">
                  {product.brand}
                </Badge>
              </div>

              <h3 className={`font-semibold mb-2 line-clamp-2 ${viewMode === "list" ? "text-base" : "text-sm"}`}>
                {product.name}
              </h3>

              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm text-muted-foreground ml-1">
                    {product.rating} ({product.reviews})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-bold text-primary">€{product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">€{product.originalPrice}</span>
                )}
              </div>

              <Button asChild size="sm" className="w-full">
                <Link href={`/producto/${product.id}`}>Ver Detalles</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination could be added here */}
      <div className="flex justify-center mt-12">
        <Button variant="outline" size="lg">
          Cargar Más Productos
        </Button>
      </div>
    </div>
  )
}
