"use client"

import Link from "next/link"
import { Container, Title, Text, Button, Group, Box, Overlay } from "@mantine/core"

export function HeroSection() {
  return (
    <Box
      component="section"
      pos="relative"
      py={{ base: 60, lg: 120 }}
      style={{ overflow: 'hidden', background: 'linear-gradient(135deg, var(--mantine-color-white) 0%, var(--mantine-color-gray-0) 100%)' }}
    >
      <Container size="lg" pos="relative" style={{ zIndex: 10 }}>
        <Box ta="center" maw={800} mx="auto">
          <Title
            order={1}
            fz={{ base: 40, sm: 60, lg: 72 }}
            fw={700}
            lh={1.1}
            mb="md"
            c="dark"
          >
            Iluminación de{" "}
            <Text
              span
              component="span"
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
              inherit
            >
              Lujo
            </Text>
          </Title>
          <Text
            size="xl"
            c="dimmed"
            mt="lg"
            maw={600}
            mx="auto"
            lh={1.6}
          >
            Descubre nuestra exclusiva colección de luminarias premium. Diseño minimalista, calidad excepcional y
            elegancia atemporal para transformar tus espacios.
          </Text>
          <Group justify="center" gap="md" mt={40}>
            <Button
              component={Link}
              href="/productos"
              size="xl"
              color="blue"
              radius="md"
            >
              Explorar Colección
            </Button>
            <Button
              component={Link}
              href="/sobre-nosotros"
              variant="outline"
              size="xl"
              color="blue"
              radius="md"
            >
              Conocer Más
            </Button>
          </Group>
        </Box>
      </Container>


      {/* Decorative elements - Simplified adaptation */}
      <Box
        pos="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        style={{ zIndex: 0, pointerEvents: 'none' }}
      >
        <Box
          pos="absolute"
          top="10%"
          left="20%"
          w={300}
          h={300}
          bg="blue"
          style={{ filter: 'blur(100px)', opacity: 0.1, borderRadius: '50%' }}
        />
        <Box
          pos="absolute"
          bottom="10%"
          right="10%"
          w={400}
          h={400}
          bg="cyan"
          style={{ filter: 'blur(120px)', opacity: 0.1, borderRadius: '50%' }}
        />
      </Box>
    </Box>
  )
}
