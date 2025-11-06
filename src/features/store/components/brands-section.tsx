"use client"

import { useState, useEffect } from "react"

export function BrandsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const brands = [
    { name: "Philips", logo: "/brands/philips-logo.webp" },
    { name: "Osram", logo: "/brands/philips-logo.webp" },
    { name: "Artemide", logo: "/brands/philips-logo.webp" },
    { name: "Flos", logo: "/brands/philips-logo.webp" },
    { name: "Louis Poulsen", logo: "/brands/philips-logo.webp" },
    { name: "Foscarini", logo: "/brands/philips-logo.webp" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % brands.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [brands.length])

  return (
    <section className="py-24 bg-gradient-to-r from-primary/5 via-background to-primary/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20 fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm border border-primary/20">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Marcas de Confianza
          </div>
          <h2 className="text-5xl font-bold text-foreground mb-6">Marcas Aliadas</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-xl leading-relaxed">
            Colaboramos con las marcas más prestigiosas y reconocidas mundialmente en el sector de la iluminación
            premium
          </p>
        </div>

        <div className="text-center mb-16 fade-in-up stagger-2">
          <div className="inline-block p-8 bg-background rounded-2xl elegant-shadow-lg border border-primary/20">
            <div className="text-sm text-primary font-medium mb-4">Marca Destacada</div>
            <img
              src={brands[currentIndex].logo || "/placeholder.svg"}
              alt={`Logo de ${brands[currentIndex].name}`}
              className="h-16 w-auto mx-auto transition-all duration-500 transform hover:scale-110"
            />
            <div className="text-lg font-bold text-foreground mt-4">{brands[currentIndex].name}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {brands.map((brand, index) => (
            <div
              key={brand.name}
              className={`group relative p-8 bg-background/80 backdrop-blur-sm rounded-xl elegant-shadow hover:shadow-2xl transition-all duration-500 elegant-hover fade-in-up stagger-${Math.min(index + 1, 4)} border border-transparent hover:border-primary/30`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />

              <div className="relative z-10 flex items-center justify-center">
                <img
                  src={brand.logo || "/placeholder.svg"}
                  alt={`Logo de ${brand.name}`}
                  className="h-12 w-auto max-w-full object-contain opacity-70 group-hover:opacity-100 transition-all duration-500 filter grayscale group-hover:grayscale-0 transform group-hover:scale-110"
                />
              </div>

              {index === currentIndex && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full animate-ping" />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 fade-in-up stagger-4">
          <div className="text-center p-6 bg-background/50 rounded-xl elegant-shadow">
            <div className="text-3xl font-bold text-primary mb-2">25+</div>
            <div className="text-muted-foreground">Años de Experiencia</div>
          </div>
          <div className="text-center p-6 bg-background/50 rounded-xl elegant-shadow">
            <div className="text-3xl font-bold text-primary mb-2">500+</div>
            <div className="text-muted-foreground">Productos Premium</div>
          </div>
          <div className="text-center p-6 bg-background/50 rounded-xl elegant-shadow">
            <div className="text-3xl font-bold text-primary mb-2">10K+</div>
            <div className="text-muted-foreground">Clientes Satisfechos</div>
          </div>
        </div>
      </div>
    </section>
  )
}
