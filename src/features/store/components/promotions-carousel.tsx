"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"

const promotions = [
  {
    id: 1,
    title: "ILUMINACIÓN INTELIGENTE",
    subtitle: "Controla tu hogar con un toque",
    description: "Lámparas LED que se adaptan a tu estilo de vida.",
    buttonText: "Comprar ahora",
    backgroundColor: "bg-blue-800", // usando color sólido en lugar de gradiente
    textColor: "text-white",
    placeholderType: "smart",
  },
  {
    id: 2,
    title: "DISEÑO MINIMALISTA",
    subtitle: "Elegancia en cada detalle",
    description: "Luminarias que transforman cualquier espacio.",
    buttonText: "Ver colección",
    backgroundColor: "bg-slate-900", // usando color sólido en lugar de gradiente
    textColor: "text-white",
    placeholderType: "minimal",
  },
  {
    id: 3,
    title: "AHORRO ENERGÉTICO",
    subtitle: "Tecnología LED avanzada",
    description: "Hasta 80% menos consumo de energía.",
    buttonText: "Descubrir más",
    backgroundColor: "bg-emerald-800", // usando color sólido en lugar de gradiente
    textColor: "text-white",
    placeholderType: "eco",
  },
  {
    id: 4,
    title: "PROMOCIÓN ESPECIAL",
    subtitle: "Descuentos hasta 40% OFF",
    description: "En toda nuestra línea de lámparas premium.",
    buttonText: "Ver ofertas",
    backgroundColor: "bg-orange-700", // usando color sólido en lugar de gradiente
    textColor: "text-white",
    placeholderType: "promo",
  },
  {
    id: 5,
    title: "NUEVA COLECCIÓN",
    subtitle: "Tendencias 2024",
    description: "Diseños exclusivos que marcan la diferencia.",
    buttonText: "Explorar",
    backgroundColor: "bg-purple-800", // usando color sólido en lugar de gradiente
    textColor: "text-white",
    placeholderType: "new",
  },
  {
    id: 6,
    title: "ILUMINACIÓN EXTERIOR",
    subtitle: "Jardines y terrazas",
    description: "Resistentes al agua con garantía extendida.",
    buttonText: "Ver modelos",
    backgroundColor: "bg-teal-800", // usando color sólido en lugar de gradiente
    textColor: "text-white",
    placeholderType: "outdoor",
  },
]

const renderPlaceholder = (type: string) => {
  switch (type) {
    case "smart":
      return (
        <div className="w-56 h-40 relative">
          <div className="absolute inset-0 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
            <div className="absolute top-4 left-4 w-8 h-8 bg-white/40 rounded-lg"></div>
            <div className="absolute top-4 right-4 w-6 h-6 bg-white/30 rounded-full"></div>
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-32 h-20 bg-white/30 rounded-xl flex items-center justify-center">
              <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-white/70 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )
    case "minimal":
      return (
        <div className="w-56 h-40 relative">
          <div className="absolute inset-0 bg-white/15 rounded-2xl backdrop-blur-sm border border-white/20">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-24 h-32 bg-white/30 rounded-lg"></div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-white/20 rounded-full"></div>
            </div>
          </div>
        </div>
      )
    case "eco":
      return (
        <div className="w-56 h-40 relative">
          <div className="absolute inset-0 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-white/40 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-white/60 rounded-full"></div>
            </div>
            <div className="absolute bottom-6 left-4 w-4 h-8 bg-white/30 rounded-full"></div>
            <div className="absolute bottom-6 right-4 w-4 h-12 bg-white/40 rounded-full"></div>
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-4 h-6 bg-white/35 rounded-full"></div>
          </div>
        </div>
      )
    case "promo":
      return (
        <div className="w-56 h-40 relative">
          <div className="absolute inset-0 bg-white/25 rounded-2xl backdrop-blur-sm border border-white/40">
            <div className="absolute top-3 right-3 w-12 h-6 bg-white/60 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-orange-800">40%</span>
            </div>
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-28 h-16 bg-white/40 rounded-xl"></div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-white/30 rounded-full"></div>
          </div>
        </div>
      )
    case "new":
      return (
        <div className="w-56 h-40 relative">
          <div className="absolute inset-0 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
            <div className="absolute top-4 left-4 w-6 h-6 bg-white/50 rounded-full"></div>
            <div className="absolute top-4 right-4 w-8 h-4 bg-white/40 rounded-full"></div>
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-20 bg-white/35 rounded-2xl">
              <div className="absolute top-2 left-2 w-6 h-6 bg-white/50 rounded-lg"></div>
              <div className="absolute top-2 right-2 w-6 h-6 bg-white/50 rounded-lg"></div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-white/40 rounded-lg"></div>
            </div>
          </div>
        </div>
      )
    case "outdoor":
      return (
        <div className="w-56 h-40 relative">
          <div className="absolute inset-0 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
            <div className="absolute top-6 left-6 w-16 h-24 bg-white/40 rounded-lg"></div>
            <div className="absolute top-12 right-8 w-12 h-16 bg-white/35 rounded-lg"></div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-white/30 rounded-full"></div>
            <div className="absolute bottom-6 left-4 w-2 h-2 bg-white/50 rounded-full"></div>
            <div className="absolute bottom-6 right-4 w-2 h-2 bg-white/50 rounded-full"></div>
          </div>
        </div>
      )
    default:
      return (
        <div className="w-56 h-40 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30 flex items-center justify-center">
          <div className="w-24 h-24 bg-white/30 rounded-lg flex items-center justify-center">
            <div className="w-12 h-12 bg-white/50 rounded-full"></div>
          </div>
        </div>
      )
  }
}

export function PromotionsCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promotions.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % promotions.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + promotions.length) % promotions.length)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">OFERTAS ESPECIALES</h2>
          <p className="text-xl text-muted-foreground">Descubre nuestras promociones exclusivas</p>
        </div>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out gap-6"
            style={{
              transform: `translateX(calc(-${currentSlide * 50}% - ${currentSlide * 12}px))`,
              paddingLeft: "10%",
              paddingRight: "10%",
            }}
          >
            {[...promotions, ...promotions].map((promo, index) => (
              <div
                key={`${promo.id}-${index}`}
                className={`w-[45%] flex-shrink-0 relative h-80 ${promo.backgroundColor} rounded-2xl flex items-center justify-between px-8 py-6 shadow-2xl overflow-hidden`}
              >
                {/* Content */}
                <div className="flex-1 space-y-4 z-10 relative">
                  <div className="space-y-2">
                    <h3 className={`text-3xl font-bold ${promo.textColor} tracking-tight`}>{promo.title}</h3>
                    <p className={`text-lg ${promo.textColor} opacity-90 font-medium`}>{promo.subtitle}</p>
                    <p className={`text-base ${promo.textColor} opacity-80 max-w-sm leading-relaxed`}>
                      {promo.description}
                    </p>
                  </div>
                  <Button
                    size="lg"
                    className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    {promo.buttonText}
                  </Button>
                </div>

                <div className="flex-shrink-0 ml-6 z-10 relative">{renderPlaceholder(promo.placeholderType)}</div>

                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                <div className="absolute top-1/2 right-4 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevSlide}
              className="bg-black/30 hover:bg-black/50 text-white border-white/20 rounded-full p-3 backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlayPause}
              className="bg-black/30 hover:bg-black/50 text-white border-white/20 rounded-full p-3 backdrop-blur-sm"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={nextSlide}
              className="bg-black/30 hover:bg-black/50 text-white border-white/20 rounded-full p-3 backdrop-blur-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="absolute bottom-6 right-6 flex space-x-2">
            {promotions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-white w-8" : "bg-white/50 w-2"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
