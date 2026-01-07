
import Link from "next/link"
import { Button, Container, Title, Text, SimpleGrid, BackgroundImage, Stack, Box, Overlay } from "@mantine/core"

export function CategoriesSection() {
  const categories = [
    {
      name: "Luminarias",
      description: "Iluminación general y ambiental",
      image: "/products/luminaria-plafon.webp",
      href: "/productos?categoria=luminarias",
      count: "120+ productos",
    },
    {
      name: "Lámparas",
      description: "Lámparas de mesa, pie y decorativas",
      image: "/products/luminaria-plafon.webp",
      href: "/productos?categoria=lamparas",
      count: "85+ productos",
    },
    {
      name: "Accesorios Eléctricos",
      description: "Interruptores, enchufes y más",
      image: "/products/luminaria-plafon.webp",
      href: "/productos?categoria=accesorios",
      count: "60+ productos",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <Container size="xl">
        <div className="text-center mb-16 fade-in-up">
          <Title order={2} mb="md" style={{ fontSize: '2.5rem' }}>Nuestras Categorías</Title>
          <Text c="dimmed" size="lg" maw={600} mx="auto">
            Explora nuestra amplia gama de productos de iluminación premium
          </Text>
        </div>

        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
          {categories.map((category, index) => (
            <Box
              key={category.name}
              className={`group relative overflow-hidden rounded-2xl elegant-shadow hover-lift fade-in-up stagger-${index + 1}`}
              style={{ height: 320, cursor: 'pointer', position: 'relative' }}
            >
              <BackgroundImage
                src={category.image}
                h="100%"
                w="100%"
                className="transition-transform duration-700 group-hover:scale-110"
              />

              <Overlay color="#000" opacity={0.5} zIndex={1} className="group-hover:opacity-40 transition-opacity" />

              <Stack
                justify="flex-end"
                p="xl"
                h="100%"
                style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2 }}
                gap="xs"
              >
                <Text size="xs" fw={500} c="white" style={{ opacity: 0.9 }}>{category.count}</Text>
                <Title order={3} c="white">{category.name}</Title>
                <Text size="sm" c="gray.2" mb="sm">{category.description}</Text>
                <div>
                  <Button
                    component={Link}
                    href={category.href}
                    size="sm"
                    variant="white"
                    color="dark"
                  >
                    Ver Productos
                  </Button>
                </div>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </section>
  )
}


