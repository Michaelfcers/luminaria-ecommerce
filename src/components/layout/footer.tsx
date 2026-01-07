
import Link from "next/link"
import { IconBrandFacebook, IconBrandInstagram, IconBrandTwitter, IconMail, IconMapPin, IconPhone } from "@tabler/icons-react"
import { Container, Grid, Stack, Text, Title, Group, ActionIcon, Box } from "@mantine/core"

export function Footer() {
  return (
    <Box component="footer" bg="#111827" c="gray.4" py="xl" mt="auto">
      <Container size="xl">
        <Grid gutter={50}>
          {/* Brand Column */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="md">
              <Link href="/">
                <Text size="xl" fw={700} c="white">
                  LUMINARIA
                </Text>
              </Link>
              <Text size="sm" style={{ maxWidth: 300 }}>
                Iluminando espacios con diseño y elegancia. Tu destino premium para luminarias y accesorios eléctricos.
              </Text>
              <Group gap="sm">
                <ActionIcon component={Link} href="#" variant="subtle" color="gray" size="lg">
                  <IconBrandFacebook size={20} />
                </ActionIcon>
                <ActionIcon component={Link} href="#" variant="subtle" color="gray" size="lg">
                  <IconBrandInstagram size={20} />
                </ActionIcon>
                <ActionIcon component={Link} href="#" variant="subtle" color="gray" size="lg">
                  <IconBrandTwitter size={20} />
                </ActionIcon>
              </Group>
            </Stack>
          </Grid.Col>

          {/* Quick Links */}
          <Grid.Col span={{ base: 6, sm: 6, md: 2 }}>
            <Stack gap="md">
              <Title order={4} c="white" size="h5">Enlaces</Title>
              <Stack gap="xs">
                <Text component={Link} href="/productos" size="sm" c="dimmed" style={{ textDecoration: 'none' }} className="hover:text-white transition-colors">
                  Productos
                </Text>
                <Text component={Link} href="/ofertas" size="sm" c="dimmed" style={{ textDecoration: 'none' }} className="hover:text-white transition-colors">
                  Ofertas
                </Text>
                <Text component={Link} href="/sobre-nosotros" size="sm" c="dimmed" style={{ textDecoration: 'none' }} className="hover:text-white transition-colors">
                  Nosotros
                </Text>
                <Text component={Link} href="/blog" size="sm" c="dimmed" style={{ textDecoration: 'none' }} className="hover:text-white transition-colors">
                  Blog
                </Text>
              </Stack>
            </Stack>
          </Grid.Col>

          {/* Categories */}
          <Grid.Col span={{ base: 6, sm: 6, md: 2 }}>
            <Stack gap="md">
              <Title order={4} c="white" size="h5">Categorías</Title>
              <Stack gap="xs">
                <Text component={Link} href="/productos?category=interior" size="sm" c="dimmed" style={{ textDecoration: 'none' }} className="hover:text-white transition-colors">
                  Interior
                </Text>
                <Text component={Link} href="/productos?category=exterior" size="sm" c="dimmed" style={{ textDecoration: 'none' }} className="hover:text-white transition-colors">
                  Exterior
                </Text>
                <Text component={Link} href="/productos?category=smart" size="sm" c="dimmed" style={{ textDecoration: 'none' }} className="hover:text-white transition-colors">
                  Smart Home
                </Text>
                <Text component={Link} href="/productos?category=industrial" size="sm" c="dimmed" style={{ textDecoration: 'none' }} className="hover:text-white transition-colors">
                  Industrial
                </Text>
              </Stack>
            </Stack>
          </Grid.Col>

          {/* Contact */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="md">
              <Title order={4} c="white" size="h5">Contacto</Title>
              <Stack gap="sm">
                <Group wrap="nowrap" align="flex-start">
                  <IconMapPin size={18} style={{ marginTop: 4 }} />
                  <Text size="sm">Av. Principal 123, Ciudad de México, CP 12345</Text>
                </Group>
                <Group wrap="nowrap">
                  <IconPhone size={18} />
                  <Text size="sm">+52 (55) 1234-5678</Text>
                </Group>
                <Group wrap="nowrap">
                  <IconMail size={18} />
                  <Text size="sm">contacto@luminaria.com</Text>
                </Group>
              </Stack>
            </Stack>
          </Grid.Col>
        </Grid>

        <Box mt={40} pt="md" style={{ borderTop: '1px solid #374151' }}>
          <Text ta="center" size="sm" c="dimmed">
            © {new Date().getFullYear()} Luminaria. Todos los derechos reservados.
          </Text>
        </Box>
      </Container>
    </Box>
  )
}
