"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import { Button, Box, Container, Title, Text, Group, ActionIcon, Badge, Flex } from "@mantine/core"

const promotions = [
  {
    id: 1,
    title: "ILUMINACIÓN INTELIGENTE",
    subtitle: "Controla tu hogar con un toque",
    description: "Lámparas LED que se adaptan a tu estilo de vida.",
    buttonText: "Comprar ahora",
    backgroundColor: "blue.9",
    textColor: "white",
    placeholderType: "smart",
  },
  {
    id: 2,
    title: "DISEÑO MINIMALISTA",
    subtitle: "Elegancia en cada detalle",
    description: "Luminarias que transforman cualquier espacio.",
    buttonText: "Ver colección",
    backgroundColor: "dark.8",
    textColor: "white",
    placeholderType: "minimal",
  },
  {
    id: 3,
    title: "AHORRO ENERGÉTICO",
    subtitle: "Tecnología LED avanzada",
    description: "Hasta 80% menos consumo de energía.",
    buttonText: "Descubrir más",
    backgroundColor: "teal.9",
    textColor: "white",
    placeholderType: "eco",
  },
  {
    id: 4,
    title: "PROMOCIÓN ESPECIAL",
    subtitle: "Descuentos hasta 40% OFF",
    description: "En toda nuestra línea de lámparas premium.",
    buttonText: "Ver ofertas",
    backgroundColor: "orange.8",
    textColor: "white",
    placeholderType: "promo",
  },
  {
    id: 5,
    title: "NUEVA COLECCIÓN",
    subtitle: "Tendencias 2024",
    description: "Diseños exclusivos que marcan la diferencia.",
    buttonText: "Explorar",
    backgroundColor: "violet.9",
    textColor: "white",
    placeholderType: "new",
  },
  {
    id: 6,
    title: "ILUMINACIÓN EXTERIOR",
    subtitle: "Jardines y terrazas",
    description: "Resistentes al agua con garantía extendida.",
    buttonText: "Ver modelos",
    backgroundColor: "cyan.9",
    textColor: "white",
    placeholderType: "outdoor",
  },
]

const renderPlaceholder = (type: string) => {
  // Simplified placeholders for Mantine version
  return (
    <Box w={220} h={160} style={{ position: 'relative', overflow: 'hidden', borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
      {/* Abstract shapes */}
      <Box style={{ position: 'absolute', top: 20, left: 20, width: 40, height: 40, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.3)' }} />
      <Box style={{ position: 'absolute', bottom: 20, right: 20, width: 80, height: 80, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)' }} />
    </Box>
  )
}

export function PromotionsCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promotions.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % promotions.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + promotions.length) % promotions.length)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <Box py={80} bg="gray.0">
      <Container size="xl">
        <Box ta="center" mb={60}>
          <Title order={2} size="h1" fw={900} mb="sm">OFERTAS ESPECIALES</Title>
          <Text size="xl" c="dimmed">Descubre nuestras promociones exclusivas</Text>
        </Box>

        <Box style={{ position: 'relative', overflow: 'hidden' }}>
          <Flex
            gap="md"
            style={{
              transition: 'transform 500ms ease-in-out',
              transform: `translateX(calc(-${currentSlide * 50}% - ${currentSlide * 16}px))`, // 16px is gap-"md" approx
              paddingLeft: "10%",
              paddingRight: "10%",
            }}
          >
            {[...promotions, ...promotions].map((promo, index) => (
              <Box
                key={`${promo.id}-${index}`}
                style={{
                  width: '45%',
                  flexShrink: 0,
                  position: 'relative',
                  height: 340,
                  borderRadius: 24,
                  overflow: 'hidden',
                }}
                bg={promo.backgroundColor}
                p="xl"
              >
                <Flex justify="space-between" align="center" h="100%" style={{ position: 'relative', zIndex: 10 }}>
                  <Box style={{ flex: 1 }}>
                    <Title order={3} c="white" size="h2" fw={800} lh={1.1} mb="xs">{promo.title}</Title>
                    <Text c="white" size="lg" fw={500} mb="xs" style={{ opacity: 0.9 }}>{promo.subtitle}</Text>
                    <Text c="white" size="sm" mb="lg" style={{ opacity: 0.8 }} maw={300}>
                      {promo.description}
                    </Text>
                    <Button size="md" variant="white" color="dark" radius="xl">
                      {promo.buttonText}
                    </Button>
                  </Box>
                  <Box ml="xl">
                    {renderPlaceholder(promo.placeholderType)}
                  </Box>
                </Flex>

                {/* Decorative background blobs */}
                <Box pos="absolute" top={0} right={0} w={200} h={200} bg="white" style={{ opacity: 0.05, filter: 'blur(50px)', borderRadius: '50%' }} />
                <Box pos="absolute" bottom={0} left={0} w={150} h={150} bg="white" style={{ opacity: 0.05, filter: 'blur(40px)', borderRadius: '50%' }} />
              </Box>
            ))}
          </Flex>

          {/* Controls */}
          <Group justify="center" mt="xl" gap="md">
            <ActionIcon variant="light" color="gray" radius="xl" size="lg" onClick={prevSlide}>
              <ChevronLeft size={20} />
            </ActionIcon>
            <ActionIcon variant="light" color="gray" radius="xl" size="lg" onClick={togglePlayPause}>
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </ActionIcon>
            <ActionIcon variant="light" color="gray" radius="xl" size="lg" onClick={nextSlide}>
              <ChevronRight size={20} />
            </ActionIcon>
          </Group>

          {/* Dots */}
          <Group justify="center" mt="md" gap="xs">
            {promotions.map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentSlide(index)}
                w={index === currentSlide ? 24 : 8}
                h={8}
                bg={index === currentSlide ? "blue" : "gray.3"}
                style={{ borderRadius: 4, cursor: 'pointer', transition: 'width 0.3s' }}
              />
            ))}
          </Group>
        </Box>
      </Container>
    </Box>
  )
}
