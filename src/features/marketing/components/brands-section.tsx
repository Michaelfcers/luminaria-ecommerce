"use client"

import { useState, useEffect } from "react"
import { Container, Title, Text, SimpleGrid, Card, Image, Box, Badge, Center, Grid } from "@mantine/core"
import philipsLogo from "@/assets/brands/philips-logo.webp"

export function BrandsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const brands = [
    { name: "Philips", logo: philipsLogo.src },
    { name: "Osram", logo: philipsLogo.src },
    { name: "Artemide", logo: philipsLogo.src },
    { name: "Flos", logo: philipsLogo.src },
    { name: "Louis Poulsen", logo: philipsLogo.src },
    { name: "Foscarini", logo: philipsLogo.src },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % brands.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [brands.length])

  return (
    <Box py={{ base: 60, md: 100 }} bg="gray.0" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background decorations - optional or simplified */}
      <Box
        pos="absolute" top={0} left={0} w="100%" h="100%"
        style={{ opacity: 0.03, background: 'radial-gradient(circle, var(--mantine-color-blue-9) 0%, transparent 70%)' }}
      />

      <Container size="xl" pos="relative">
        <Box ta="center" mb={60}>
          <Center mb="md">
            <Badge variant="light" size="lg" color="blue" tt="uppercase" opacity={0.8}>
              Marcas de Confianza
            </Badge>
          </Center>
          <Title order={2} size="h1" fw={800} mb="sm" c="dark.8">Marcas Aliadas</Title>
          <Text size="xl" c="dimmed" maw={700} mx="auto">
            Colaboramos con las marcas más prestigiosas y reconocidas mundialmente en el sector de la iluminación
            premium
          </Text>
        </Box>

        <Center mb={60}>
          <Card padding="xl" radius="lg" withBorder shadow="sm" miw={300}>
            <Text size="sm" fw={700} c="blue" ta="center" mb="md" tt="uppercase">Marca Destacada</Text>
            <Image
              src={brands[currentIndex].logo}
              alt={`Logo de ${brands[currentIndex].name}`}
              h={64}
              fit="contain"
              mb="md"
            />
            <Text size="xl" fw={700} ta="center">{brands[currentIndex].name}</Text>
          </Card>
        </Center>

        <SimpleGrid cols={{ base: 2, sm: 3, md: 6 }} spacing="lg">
          {brands.map((brand, index) => (
            <Card
              key={brand.name}
              padding="lg"
              radius="md"
              withBorder={false}
              bg="white"
              style={{
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'default',
                boxShadow: index === currentIndex ? '0 0 0 2px var(--mantine-color-blue-5)' : 'none'
              }}
            >
              <Center h={60}>
                <Image
                  src={brand.logo}
                  alt={`Logo de ${brand.name}`}
                  h={40}
                  w="auto"
                  fit="contain"
                  style={{ filter: index === currentIndex ? 'none' : 'grayscale(100%)', opacity: index === currentIndex ? 1 : 0.6, transition: 'filter 0.3s' }}
                />
              </Center>
            </Card>
          ))}
        </SimpleGrid>

        <Grid mt={80} gutter={40}>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Box ta="center" p="xl" bg="white" style={{ borderRadius: 16 }}>
              <Text size="3rem" fw={900} c="blue" lh={1}>25+</Text>
              <Text size="lg" c="dimmed" mt="xs">Años de Experiencia</Text>
            </Box>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Box ta="center" p="xl" bg="white" style={{ borderRadius: 16 }}>
              <Text size="3rem" fw={900} c="blue" lh={1}>500+</Text>
              <Text size="lg" c="dimmed" mt="xs">Productos Premium</Text>
            </Box>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Box ta="center" p="xl" bg="white" style={{ borderRadius: 16 }}>
              <Text size="3rem" fw={900} c="blue" lh={1}>10K+</Text>
              <Text size="lg" c="dimmed" mt="xs">Clientes Satisfechos</Text>
            </Box>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  )
}
