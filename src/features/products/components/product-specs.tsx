"use client"
import { Card, Tabs, Text, List, Group, ThemeIcon, Stack, Button, Box } from "@mantine/core"
import { Download, FileText } from "lucide-react"

interface ProductSpecsProps {
  features: string[]
  specifications: Record<string, string>
  technicalSheet: string
}

export function ProductSpecs({ features, specifications, technicalSheet }: ProductSpecsProps) {
  return (
    <Box mb="xl">
      <Tabs defaultValue="features" variant="outline">
        <Tabs.List grow>
          <Tabs.Tab value="features">Características</Tabs.Tab>
          <Tabs.Tab value="specs">Especificaciones</Tabs.Tab>
          <Tabs.Tab value="documents">Documentos</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="features" pt="md">
          <Card withBorder padding="lg">
            <Stack gap="md">
              <Text fw={600} size="lg">Características Principales</Text>
              <List spacing="xs" icon={<Box w={8} h={8} style={{ borderRadius: '50%', backgroundColor: 'var(--mantine-color-blue-6)' }} />}>
                {features.map((feature, index) => (
                  <List.Item key={index}>{feature}</List.Item>
                ))}
              </List>
            </Stack>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="specs" pt="md">
          <Card withBorder padding="lg">
            <Stack gap="md">
              <Text fw={600} size="lg">Especificaciones Técnicas</Text>
              <Stack gap="xs">
                {Object.entries(specifications).map(([key, value]) => (
                  <Group key={key} justify="space-between" style={{ borderBottom: '1px solid var(--mantine-color-gray-2)', paddingBottom: 8 }}>
                    <Text fw={500} c="dimmed">{key}</Text>
                    <Text>{value}</Text>
                  </Group>
                ))}
              </Stack>
            </Stack>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="documents" pt="md">
          <Card withBorder padding="lg">
            <Stack gap="md">
              <Text fw={600} size="lg">Documentación</Text>
              <Stack gap="md">
                <DocumentRow title="Ficha Técnica" description="Especificaciones completas del producto" />
                <DocumentRow title="Manual de Instalación" description="Guía paso a paso para la instalación" />
                <DocumentRow title="Certificados de Calidad" description="Certificaciones CE, RoHS y garantía" />
              </Stack>
            </Stack>
          </Card>
        </Tabs.Panel>
      </Tabs>
    </Box>
  )
}

function DocumentRow({ title, description }: { title: string, description: string }) {
  return (
    <Card withBorder padding="sm" radius="md">
      <Group justify="space-between">
        <Group>
          <ThemeIcon size="xl" variant="light" color="blue">
            <FileText size={24} />
          </ThemeIcon>
          <Stack gap={0}>
            <Text fw={600}>{title}</Text>
            <Text size="sm" c="dimmed">{description}</Text>
          </Stack>
        </Group>
        <Button variant="outline" size="sm" leftSection={<Download size={14} />}>
          Descargar PDF
        </Button>
      </Group>
    </Card>
  )
}
