export function AboutHero() {
  return (
    <section className="relative py-24 lg:py-32 bg-gradient-to-br from-background to-card">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl mb-6">
            Iluminando espacios desde{" "}
            <span className="bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">1995</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Somos especialistas en iluminación de alta gama, comprometidos con la excelencia en diseño, calidad y
            servicio. Transformamos espacios a través de la luz con soluciones elegantes y funcionales.
          </p>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]">
          <div className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-primary/10 to-amber-400/10 opacity-30"></div>
        </div>
      </div>
    </section>
  )
}
