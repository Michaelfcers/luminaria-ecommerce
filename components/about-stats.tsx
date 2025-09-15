export function AboutStats() {
  const stats = [
    { number: "25+", label: "Años de experiencia" },
    { number: "500+", label: "Productos en catálogo" },
    { number: "15,000+", label: "Clientes satisfechos" },
    { number: "50+", label: "Marcas premium" },
  ]

  return (
    <section className="py-20 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Luminaria en Números</h2>
          <p className="text-background/80 max-w-2xl mx-auto text-lg">
            Más de dos décadas construyendo confianza y excelencia en iluminación
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-background/80 text-sm lg:text-base">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
