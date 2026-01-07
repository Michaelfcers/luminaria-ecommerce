"use client"

import { Card, Text, Title, SimpleGrid, Avatar, Stack, Container } from "@mantine/core"

export function AboutTeam() {
  const team = [
    {
      name: "María González",
      role: "Directora General",
      image: "/brands/philips-logo.webp",
      description: "25 años de experiencia en el sector de la iluminación y diseño de interiores.",
    },
    {
      name: "Carlos Ruiz",
      role: "Director Técnico",
      image: "/brands/philips-logo.webp",
      description: "Especialista en tecnología LED y sistemas de iluminación inteligente.",
    },
    {
      name: "Ana Martín",
      role: "Responsable de Diseño",
      image: "/brands/philips-logo.webp",
      description: "Diseñadora industrial con enfoque en iluminación arquitectónica y decorativa.",
    },
    {
      name: "David López",
      role: "Atención al Cliente",
      image: "/brands/philips-logo.webp",
      description: "Experto en asesoramiento personalizado y soluciones de iluminación a medida.",
    },
  ]

  return (
    <section className="py-20 bg-background">
      <Container size="xl">
        <div className="text-center mb-16">
          <Title order={2} mb="md">Nuestro Equipo</Title>
          <Text c="dimmed" size="lg" maw={600} mx="auto">
            Profesionales apasionados por la iluminación, comprometidos con tu satisfacción
          </Text>
        </div>

        <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} spacing="lg">
          {team.map((member, index) => (
            <Card key={index} padding="lg" radius="md" withBorder className="text-center elegant-shadow hover-lift">
              <Stack align="center" gap="sm">
                <Avatar
                  src={member.image}
                  alt={member.name}
                  size={100}
                  radius="xl"
                />
                <div>
                  <Text fw={600} size="lg">{member.name}</Text>
                  <Text c="blue" fw={500} size="sm">{member.role}</Text>
                </div>
                <Text size="sm" c="dimmed" lh={1.6}>{member.description}</Text>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </section>
  )
}


