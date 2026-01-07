"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button, Card, TextInput, NumberInput, Select, Title, Stack, Group, ActionIcon, Divider, Text } from "@mantine/core"
import { createVariant } from "@/lib/actions/product-variants"
import { notifications } from "@mantine/notifications"
import { IconTrash, IconPlus } from "@tabler/icons-react"

export function CreateVariantForm({ productId }: { productId: string }) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        list_price_usd: 0,
        stock: 0,
        sourcing_status: "active",
    })
    const [attributes, setAttributes] = useState<{ key: string; value: string }[]>([])

    const handleAttributeChange = (index: number, field: "key" | "value", newValue: string) => {
        setAttributes((prev) => {
            const newAttributes = [...prev]
            newAttributes[index][field] = newValue
            return newAttributes
        })
    }

    const handleAddAttribute = () => {
        setAttributes((prev) => [...prev, { key: "", value: "" }])
    }

    const handleRemoveAttribute = (index: number) => {
        setAttributes((prev) => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const attributesObject = attributes.reduce((acc, curr) => {
            if (curr.key.trim()) {
                acc[curr.key.trim()] = curr.value
            }
            return acc
        }, {} as Record<string, string>)

        const dataToCreate = {
            name: formData.name,
            code: formData.code,
            list_price_usd: formData.list_price_usd,
            stock: formData.stock,
            sourcing_status: formData.sourcing_status,
            attributes: attributesObject,
        }

        const { error } = await createVariant(productId, dataToCreate)

        setIsSubmitting(false)

        if (error) {
            notifications.show({
                title: "Error",
                message: "No se pudo crear la versión: " + error,
                color: "red",
            })
        } else {
            notifications.show({
                title: "Éxito",
                message: "La versión ha sido creada.",
                color: "green",
            })
            router.push(`/products/${productId}/versions`)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Card withBorder radius="lg" padding="lg">
                <Stack gap="lg">
                    <Title order={3}>Detalles de la Nueva Versión</Title>
                    <Stack gap="md">
                        <TextInput
                            label="Nombre"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ej. Color Rojo, Talla M"
                            required
                        />
                        <TextInput
                            label="Código (SKU)"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            placeholder="Ej. PROD-RED-M"
                            required
                        />
                        <Group grow>
                            <NumberInput
                                label="Precio (USD)"
                                min={0}
                                decimalScale={2}
                                value={formData.list_price_usd}
                                onChange={(val) =>
                                    setFormData({ ...formData, list_price_usd: Number(val) })
                                }
                                required
                            />
                            <NumberInput
                                label="Stock"
                                min={0}
                                value={formData.stock}
                                onChange={(val) =>
                                    setFormData({ ...formData, stock: Number(val) })
                                }
                                required
                            />
                        </Group>
                        <Select
                            label="Estado de Sourcing"
                            value={formData.sourcing_status}
                            onChange={(value) =>
                                setFormData({ ...formData, sourcing_status: value || "active" })
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
                        {attributes.map((attr, index) => (
                            <Group key={index} gap="xs">
                                <TextInput
                                    value={attr.key}
                                    onChange={(e) => handleAttributeChange(index, "key", e.target.value)}
                                    placeholder="Nombre (ej. Color)"
                                    style={{ flex: 1 }}
                                />
                                <TextInput
                                    value={attr.value}
                                    onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                                    placeholder="Valor (ej. Rojo)"
                                    style={{ flex: 1 }}
                                />
                                <ActionIcon
                                    variant="subtle"
                                    color="red"
                                    onClick={() => handleRemoveAttribute(index)}
                                >
                                    <IconTrash size={16} />
                                </ActionIcon>
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
                Crear Versión
            </Button>
        </form>
    )
}
