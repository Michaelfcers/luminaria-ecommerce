"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button, Card, TextInput, NumberInput, Select, Title, Stack, Group, Divider, Text } from "@mantine/core"
import { updateVariant } from "@/lib/actions/product-variants"
import { notifications } from "@mantine/notifications"
import { IconPlus } from "@tabler/icons-react"

export function EditVariantForm({ variant }: { variant: any }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState(variant)
  const [attributes, setAttributes] = useState(variant.attributes || {})

  const handleAttributeChange = (key: string, value: string) => {
    setAttributes((prev: any) => ({ ...prev, [key]: value }))
  }

  const handleAddAttribute = () => {
    const newKey = `new_attribute_${Object.keys(attributes).length}`
    setAttributes((prev: any) => ({ ...prev, [newKey]: "" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const dataToUpdate = {
      name: formData.name,
      code: formData.code,
      list_price_usd: formData.list_price_usd,
      stock: formData.stock,
      sourcing_status: formData.sourcing_status,
      attributes: attributes,
    }

    const { error } = await updateVariant(variant.id, dataToUpdate)

    setIsSubmitting(false)

    if (error) {
      notifications.show({
        title: "Error",
        message: "No se pudo actualizar la versión: " + error,
        color: "red",
      })
    } else {
      notifications.show({
        title: "Éxito",
        message: "La versión ha sido actualizada.",
        color: "green",
      })
      router.push(`/products/${variant.product_id}/versions`)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card withBorder radius="lg" padding="lg">
        <Stack gap="lg">
          <Title order={3}>Detalles de la Versión</Title>
          <Stack gap="md">
            <TextInput
              label="Nombre"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextInput
              label="Código"
              value={formData.code || ""}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
            <Group grow>
              <NumberInput
                label="Precio (USD)"
                value={formData.list_price_usd || 0}
                onChange={(val) =>
                  setFormData({ ...formData, list_price_usd: Number(val) })
                }
              />
              <NumberInput
                label="Stock"
                value={formData.stock || 0}
                onChange={(val) =>
                  setFormData({ ...formData, stock: Number(val) })
                }
              />
            </Group>
            <Select
              label="Estado de Sourcing"
              value={formData.sourcing_status || ""}
              onChange={(value) =>
                setFormData({ ...formData, sourcing_status: value })
              }
              data={[
                { value: "active", label: "Active" },
                { value: "backorder", label: "Backorder" },
                { value: "discontinued", label: "Discontinued" },
              ]}
            />
          </Stack>

          <Divider />

          <Stack gap="md">
            <Title order={4}>Atributos Dinámicos</Title>
            {Object.entries(attributes).map(([key, value]) => (
              <Group key={key} gap="xs">
                <TextInput value={key} disabled style={{ flex: 1 }} />
                <TextInput
                  value={value as string}
                  onChange={(e) => handleAttributeChange(key, e.target.value)}
                  style={{ flex: 1 }}
                />
              </Group>
            ))}
            <Button
              variant="default"
              size="xs"
              leftSection={<IconPlus size={14} />}
              onClick={handleAddAttribute}
              style={{ alignSelf: 'flex-start' }}
            >
              Añadir Atributo
            </Button>
          </Stack>
        </Stack>
      </Card>
      <Button type="submit" mt="md" loading={isSubmitting}>
        {isSubmitting ? "Guardando..." : "Guardar Cambios"}
      </Button>
    </form>
  )
}
