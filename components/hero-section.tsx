import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background to-card py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Iluminación de{" "}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Lujo</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Descubre nuestra exclusiva colección de luminarias premium. Diseño minimalista, calidad excepcional y
            elegancia atemporal para transformar tus espacios.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg" className="px-8 py-3 bg-blue-600 text-white hover:bg-blue-700">
              <Link href="/productos">Explorar Colección</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-3 bg-transparent border-primary text-primary hover:bg-primary hover:text-white"
              asChild
            >
              <Link href="/sobre-nosotros">Conocer Más</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]">
          <div className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-primary/20 to-blue-400/20 opacity-20"></div>
        </div>
      </div>
    </section>
  )
}
