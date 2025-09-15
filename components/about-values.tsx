import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Award, Users, Leaf } from "lucide-react"

export function AboutValues() {
  const values = [
    {
      icon: Lightbulb,
      title: "Innovación",
      description:
        "Buscamos constantemente las últimas tendencias y tecnologías en iluminación para ofrecer productos vanguardistas.",
    },
    {
      icon: Award,
      title: "Calidad Premium",
      description:
        "Trabajamos exclusivamente con marcas reconocidas mundialmente que garantizan la máxima calidad y durabilidad.",
    },
    {
      icon: Users,
      title: "Servicio Personalizado",
      description:
        "Nuestro equipo de expertos está siempre disponible para asesorarte y encontrar la solución perfecta para tu proyecto.",
    },
    {
      icon: Leaf,
      title: "Sostenibilidad",
      description: "Promovemos el uso de tecnología LED y productos eco-eficientes para reducir el impacto ambiental.",
    },
  ]

  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Nuestros Valores</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Los principios que guían nuestro trabajo y definen nuestra identidad como empresa
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="text-center border-0 elegant-shadow hover-lift">
              <CardHeader>
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
