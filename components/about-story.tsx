export function AboutStory() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">Nuestra Historia</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Fundada en 1995 por un grupo de diseñadores apasionados por la iluminación, Luminaria nació con la
                visión de democratizar el acceso a productos de iluminación de alta calidad y diseño excepcional.
              </p>
              <p>
                Durante más de 25 años, hemos trabajado incansablemente para establecer relaciones sólidas con los
                mejores fabricantes europeos, garantizando que cada producto en nuestro catálogo cumpla con los más
                altos estándares de calidad y diseño.
              </p>
              <p>
                Hoy, somos reconocidos como líderes en el sector de la iluminación premium, sirviendo tanto a
                profesionales del diseño como a particulares que buscan transformar sus espacios con luz de calidad
                excepcional.
              </p>
            </div>
          </div>

          <div className="relative">
            <img
              src="/placeholder.svg?height=500&width=600"
              alt="Historia de Luminaria"
              className="rounded-lg elegant-shadow w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
