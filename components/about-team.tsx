import { Card, CardContent } from "@/components/ui/card"

export function AboutTeam() {
  const team = [
    {
      name: "María González",
      role: "Directora General",
      image: "/placeholder.svg?height=300&width=300",
      description: "25 años de experiencia en el sector de la iluminación y diseño de interiores.",
    },
    {
      name: "Carlos Ruiz",
      role: "Director Técnico",
      image: "/placeholder.svg?height=300&width=300",
      description: "Especialista en tecnología LED y sistemas de iluminación inteligente.",
    },
    {
      name: "Ana Martín",
      role: "Responsable de Diseño",
      image: "/placeholder.svg?height=300&width=300",
      description: "Diseñadora industrial con enfoque en iluminación arquitectónica y decorativa.",
    },
    {
      name: "David López",
      role: "Atención al Cliente",
      image: "/placeholder.svg?height=300&width=300",
      description: "Experto en asesoramiento personalizado y soluciones de iluminación a medida.",
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Nuestro Equipo</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Profesionales apasionados por la iluminación, comprometidos con tu satisfacción
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <Card key={index} className="text-center border-0 elegant-shadow hover-lift">
              <CardContent className="p-6">
                <div className="mb-4">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover mb-4"
                  />
                  <h3 className="font-semibold text-lg text-foreground">{member.name}</h3>
                  <p className="text-primary font-medium text-sm mb-3">{member.role}</p>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{member.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
