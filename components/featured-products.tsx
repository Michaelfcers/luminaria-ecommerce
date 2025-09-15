"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function FeaturedProducts() {
  const [activeFilter, setActiveFilter] = useState("recomendados")

  const filters = [
    { id: "recomendados", label: "Recomendados", icon: "⭐" },
    { id: "promociones", label: "Promociones", icon: "🔥" },
    { id: "mas-vendidos", label: "Más Vendidos", icon: "📈" },
    { id: "nuevos", label: "Nuevos", icon: "✨" },
  ]

  const productsByFilter = {
    recomendados: [
      {
        id: 1,
        name: "Lámpara Colgante Moderna",
        price: "$349",
        originalPrice: "$459",
        image: "/products/luminaria-plafon.webp",
        category: "Lámparas",
        isNew: true,
        rating: 4.8,
      },
      {
        id: 2,
        name: "Plafón LED Circular",
        price: "$219",
        image: "/products/luminaria-plafon.webp",
        category: "Luminarias",
        isNew: false,
        rating: 4.9,
      },
      {
        id: 3,
        name: "Aplique de Pared Elegante",
        price: "$179",
        image: "/products/luminaria-plafon.webp",
        category: "Lámparas",
        isNew: false,
        rating: 4.7,
      },
      {
        id: 4,
        name: "Lámpara de Mesa Premium",
        price: "$269",
        image: "/products/luminaria-plafon.webp",
        category: "Lámparas",
        isNew: true,
        rating: 4.6,
      },
      {
        id: 11,
        name: "Lámpara Araña Cristal",
        price: "$899",
        image: "/products/luminaria-plafon.webp",
        category: "Lámparas",
        isNew: false,
        rating: 4.9,
      },
      {
        id: 12,
        name: "Foco LED Regulable",
        price: "$45",
        image: "/products/luminaria-plafon.webp",
        category: "Luminarias",
        isNew: false,
        rating: 4.5,
      },
      {
        id: 13,
        name: "Lámpara Industrial Vintage",
        price: "$329",
        image: "/products/luminaria-plafon.webp",
        category: "Lámparas",
        isNew: false,
        rating: 4.7,
      },
      {
        id: 14,
        name: "Panel LED Empotrable",
        price: "$159",
        image: "/products/luminaria-plafon.webp",
        category: "Luminarias",
        isNew: false,
        rating: 4.8,
      },
    ],
    promociones: [
      {
        id: 1,
        name: "Lámpara Colgante Moderna",
        price: "$349",
        originalPrice: "$459",
        image: "/products/luminaria-plafon.webp",
        category: "Lámparas",
        discount: "24%",
        rating: 4.8,
      },
      {
        id: 5,
        name: "Spot Empotrado LED",
        price: "$89",
        originalPrice: "$129",
        image: "/products/luminaria-plafon.webp",
        category: "Luminarias",
        discount: "31%",
        rating: 4.5,
      },
      {
        id: 7,
        name: "Lámpara de Pie Minimalista",
        price: "$399",
        originalPrice: "$549",
        image: "/products/luminaria-plafon.webp",
        category: "Lámparas",
        discount: "27%",
        rating: 4.9,
      },
      {
        id: 8,
        name: "Tira LED Regulable",
        price: "$109",
        originalPrice: "$149",
        image: "/products/luminaria-plafon.webp",
        category: "Luminarias",
        discount: "27%",
        rating: 4.4,
      },
      {
        id: 15,
        name: "Lámpara Araña Cristal",
        price: "$699",
        originalPrice: "$899",
        image: "/products/luminaria-plafon.webp",
        category: "Lámparas",
        discount: "22%",
        rating: 4.9,
      },
      {
        id: 16,
        name: "Reflector LED Exterior",
        price: "$129",
        originalPrice: "$189",
        image: "/products/luminaria-plafon.webp",
        category: "Luminarias",
        discount: "32%",
        rating: 4.6,
      },
      {
        id: 17,
        name: "Enchufe Inteligente WiFi",
        price: "$39",
        originalPrice: "$59",
        image: "/products/luminaria-plafon.webp",
        category: "Accesorios",
        discount: "34%",
        rating: 4.4,
      },
      {
        id: 18,
        name: "Lámpara Escritorio LED",
        price: "$89",
        originalPrice: "$119",
        image: "/products/luminaria-plafon.webp",
        category: "Lámparas",
        discount: "25%",
        rating: 4.7,
      },
    ],
    "mas-vendidos": [
      {
        id: 2,
        name: "Plafón LED Circular",
        price: "$219",
        image: "/products/luminaria-plafon.webp",
        category: "Luminarias",
        sales: "2,450+",
        rating: 4.9,
      },
      {
        id: 6,
        name: "Interruptor Táctil",
        price: "$55",
        image: "/products/luminaria-plafon.webp",
        category: "Accesorios",
        sales: "1,890+",
        rating: 4.7,
      },
      {
        id: 8,
        name: "Tira LED Regulable",
        price: "$109",
        image: "/products/luminaria-plafon.webp",
        category: "Luminarias",
        sales: "1,650+",
        rating: 4.4,
      },
      {
        id: 1,
        name: "Lámpara Colgante Moderna",
        price: "$349",
        image: "/products/luminaria-plafon.webp",
        category: "Lámparas",
        sales: "1,200+",
        rating: 4.8,
      },
      {
        id: 19,
        name: "Foco LED Regulable",
        price: "$45",
        image: "/products/luminaria-plafon.webp",
        category: "Luminarias",
        sales: "3,200+",
        rating: 4.5,
      },
      {
        id: 20,
        name: "Lámpara Escritorio LED",
        price: "$89",
        image: "/products/luminaria-plafon.webp",
        category: "Lámparas",
        sales: "2,800+",
        rating: 4.7,
      },
      {
        id: 21,
        name: "Reflector LED Exterior",
        price: "$129",
        image: "/products/luminaria-plafon.webp",
        category: "Luminarias",
        sales: "2,100+",
        rating: 4.6,
      },
      {
        id: 22,
        name: "Panel LED Empotrable",
        price: "$159",
        image: "/products/luminaria-plafon.webp",
        category: "Luminarias",
        sales: "1,950+",
        rating: 4.8,
      },
    ],
    nuevos: [
      {
        id: 4,
        name: "Lámpara de Mesa Premium",
        price: "$269",
        image: "/products/luminaria-plafon.webp",
        category: "Lámparas",
        isNew: true,
        launchDate: "Hace 3 días",
        rating: 4.6,
      },
      {
        id: 1,
        name: "Lámpara Colgante Moderna",
        price: "$349",
        image: "/products/luminaria-plafon.webp",
        category: "Lámparas",
        isNew: true,
        launchDate: "Hace 1 semana",
        rating: 4.8,
      },
      {
        id: 9,
        name: "Panel LED Inteligente",
        price: "$189",
        image: "/products/luminaria-plafon.webp",
        category: "Luminarias",
        isNew: true,
        launchDate: "Hace 2 semanas",
        rating: 4.5,
      },
      {
        id: 10,
        name: "Dimmer WiFi Premium",
        price: "$79",
        image: "/products/luminaria-plafon.webp",
        category: "Accesorios",
        isNew: true,
        launchDate: "Hace 3 semanas",
        rating: 4.3,
      },
      {
        id: 23,
        name: "Lámpara Solar Jardín",
        price: "$119",
        image: "/products/luminaria-plafon.webp",
        category: "Luminarias",
        isNew: true,
        launchDate: "Hace 4 días",
        rating: 4.4,
      },
      {
        id: 24,
        name: "Sensor Movimiento PIR",
        price: "$35",
        image: "/products/luminaria-plafon.webp",
        category: "Accesorios",
        isNew: true,
        launchDate: "Hace 1 semana",
        rating: 4.2,
      },
      {
        id: 25,
        name: "Lámpara Neon Flexible",
        price: "$149",
        image: "/products/luminaria-plafon.webp",
        category: "Luminarias",
        isNew: true,
        launchDate: "Hace 2 semanas",
        rating: 4.6,
      },
      {
        id: 26,
        name: "Control Remoto Universal",
        price: "$59",
        image: "/products/luminaria-plafon.webp",
        category: "Accesorios",
        isNew: true,
        launchDate: "Hace 3 semanas",
        rating: 4.3,
      },
    ],
  }

  const currentProducts = productsByFilter[activeFilter] || []

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 fade-in-up">
          <h2 className="text-4xl font-bold text-foreground mb-6">Productos Destacados</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Descubre nuestra selección curada de los mejores productos de iluminación
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-16 fade-in-up stagger-1">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`
                px-6 py-3 rounded-full font-medium transition-all duration-300 
                ${
                  activeFilter === filter.id
                    ? "bg-primary text-white shadow-lg scale-105"
                    : "bg-card/50 text-muted-foreground hover:bg-primary/10 hover:text-primary border border-border/50"
                }
              `}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">{filter.icon}</span>
                {filter.label}
              </span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentProducts.map((product, index) => (
            <Card
              key={`${activeFilter}-${product.id}`}
              className={`group overflow-hidden border-0 elegant-shadow hover-lift fade-in-up stagger-${Math.min((index % 4) + 1, 4)} bg-card/50 backdrop-blur-sm`}
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="h-72 w-full object-cover transition-all duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {activeFilter === "promociones" && product.discount && (
                  <Badge className="absolute top-4 left-4 bg-red-500 text-white shadow-lg animate-bounce">
                    -{product.discount}
                  </Badge>
                )}
                {activeFilter === "mas-vendidos" && product.sales && (
                  <Badge className="absolute top-4 left-4 bg-green-500 text-white shadow-lg">
                    {product.sales} vendidos
                  </Badge>
                )}
                {activeFilter === "nuevos" && product.isNew && (
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground shadow-lg animate-pulse">
                    Nuevo
                  </Badge>
                )}
                {activeFilter === "recomendados" && product.rating && (
                  <Badge className="absolute top-4 left-4 bg-amber-500 text-white shadow-lg">⭐ {product.rating}</Badge>
                )}
              </div>
              <CardContent className="p-6">
                <div className="mb-3">
                  <Badge
                    variant="secondary"
                    className="text-xs bg-slate-100 text-slate-700 border-slate-200 font-medium"
                  >
                    {product.category}
                  </Badge>
                </div>
                <h3 className="font-bold text-base mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                  {product.name}
                </h3>

                {activeFilter === "nuevos" && product.launchDate && (
                  <p className="text-xs text-muted-foreground mb-2">Lanzado {product.launchDate}</p>
                )}

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl font-bold text-primary">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
                  )}
                </div>
                <Button asChild size="sm" className="w-full bg-primary hover:bg-primary/90 transition-all duration-300">
                  <Link href={`/producto/${product.id}`}>Ver Detalles</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16 fade-in-up stagger-4">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 px-8 py-3 bg-transparent"
          >
            <Link href="/productos">Ver Todos los Productos</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
