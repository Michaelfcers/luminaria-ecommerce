"use client"
import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Grid, List } from "lucide-react"

// Define a type for the product prop for better type safety
type Product = {
  id: number | string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category?: string;
  brand?: string;
  isNew?: boolean;
  rating?: number;
  reviews?: number;
};

export function ProductsGrid({ products = [] }: { products: Product[] }) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("featured")

  // The hardcoded products array is removed. We now use the 'products' prop.
  
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
                {product.category && (
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>
                )}
                {product.brand && (
                  <Badge variant="outline" className="text-xs ml-2">
                    {product.brand}
                  </Badge>
                )}
              </div>

              <h3 className={`font-semibold mb-2 line-clamp-2 ${viewMode === "list" ? "text-base" : "text-sm"}`}>
                {product.name}
              </h3>

              {product.rating && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-muted-foreground ml-1">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-bold text-primary">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
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
