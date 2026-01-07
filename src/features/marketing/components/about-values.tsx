
import { Card, Text, Title, SimpleGrid, ThemeIcon, Stack, Container } from "@mantine/core"
import { IconBulb, IconAward, IconUsers, IconLeaf } from "@tabler/icons-react"

export function AboutValues() {
  const values = [
    {
      icon: IconBulb,
      title: "Innovación",
      description:
        "Buscamos constantemente las últimas tendencias y tecnologías en iluminación para ofrecer productos vanguardistas.",
    },
    {
      icon: IconAward,
      title: "Calidad Premium",
      description:
        "Trabajamos exclusivamente con marcas reconocidas mundialmente que garantizan la máxima calidad y durabilidad.",
    },
    {
      icon: IconUsers,
      title: "Servicio Personalizado",
      description:
        "Nuestro equipo de expertos está siempre disponible para asesorarte y encontrar la solución perfecta para tu proyecto.",
    },
    {
      icon: IconLeaf,
      title: "Sostenibilidad",
      description: "Promovemos el uso de tecnología LED y productos eco-eficientes para reducir el impacto ambiental.",
    },
  ]

  return (
    <section className="py-20 bg-muted/20">
      <Container size="xl">
        <div className="text-center mb-16">
          <Title order={2} mb="md">Nuestros Valores</Title>
          <Text c="dimmed" size="lg" maw={600} mx="auto">
            Los principios que guían nuestro trabajo y definen nuestra identidad como empresa
          </Text>
        </div>

        <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} spacing="lg">
          {values.map((value, index) => (
            <Card key={index} padding="xl" radius="md" withBorder className="text-center elegant-shadow hover-lift">
              <Stack align="center" gap="md">
                <ThemeIcon size={60} radius="xl" variant="light" color="blue">
                  <value.icon size={30} />
                </ThemeIcon>
                <Title order={3} size="h4">{value.title}</Title>
                <Text size="sm" c="dimmed" lh={1.6}>
                  {value.description}
                </Text>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </section>
  )
}


