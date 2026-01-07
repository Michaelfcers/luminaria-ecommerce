"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button, Card, TextInput, Select, NumberInput, Checkbox, Tabs, Badge, Text, Group, Stack, Grid, ActionIcon, Title, ScrollArea } from "@mantine/core"
import { DateInput } from "@mantine/dates";
import { createPromotion, updatePromotion } from "@/lib/actions/promotions"
import { notifications } from "@mantine/notifications"
import { Search, Image as ImageIcon, Calendar, Tag, CheckCircle2 } from "lucide-react"
import Image from "next/image"

interface ProductVariant {
    id: string
    name: string
    attributes: Record<string, any>
}

interface ProductMedia {
    url: string
    alt_text: string | null
}

interface Product {
    id: string
    name: string
    code?: string
    product_variants: ProductVariant[]
    product_media?: ProductMedia[]
}

interface PromotionFormProps {
    storeId: string
    products: Product[]
    initialData?: any
    initialProductIds?: string[]
    initialVariantIds?: string[]
    isEditing?: boolean
}

export function PromotionForm({
    storeId,
    products,
    initialData,
    initialProductIds = [],
    initialVariantIds = [],
    isEditing = false
}: PromotionFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        type: initialData?.type || "percentage",
        value: initialData?.value || "",
        starts_at: initialData?.starts_at ? new Date(initialData.starts_at) : null,
        ends_at: initialData?.ends_at ? new Date(initialData.ends_at) : null,
        status: initialData?.status || "scheduled",
    })

    const [promotionLevel, setPromotionLevel] = useState<string | null>(
        initialVariantIds.length > 0 ? "variant" : "product"
    )

    const [selectedProductIds, setSelectedProductIds] = useState<string[]>(initialProductIds)
    const [selectedVariantIds, setSelectedVariantIds] = useState<string[]>(initialVariantIds)

    // Filter products based on search term
    const filteredProducts = useMemo(() => {
        if (!searchTerm) return products
        const lowerTerm = searchTerm.toLowerCase()
        return products.filter(p =>
            p.name.toLowerCase().includes(lowerTerm) ||
            p.code?.toLowerCase().includes(lowerTerm)
        )
    }, [products, searchTerm])

    const handleProductToggle = (productId: string) => {
        setSelectedProductIds(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        )
    }

    const handleVariantToggle = (variantId: string) => {
        setSelectedVariantIds(prev =>
            prev.includes(variantId)
                ? prev.filter(id => id !== variantId)
                : [...prev, variantId]
        )
    }

    const handleSelectAll = () => {
        if (promotionLevel === "product") {
            const allIds = filteredProducts.map(p => p.id)
            const allSelected = allIds.every(id => selectedProductIds.includes(id))

            if (allSelected) {
                setSelectedProductIds(prev => prev.filter(id => !allIds.includes(id)))
            } else {
                setSelectedProductIds(prev => [...new Set([...prev, ...allIds])])
            }
        } else {
            const allVariantIds = filteredProducts.flatMap(p => p.product_variants.map(v => v.id))
            const allSelected = allVariantIds.every(id => selectedVariantIds.includes(id))

            if (allSelected) {
                setSelectedVariantIds(prev => prev.filter(id => !allVariantIds.includes(id)))
            } else {
                setSelectedVariantIds(prev => [...new Set([...prev, ...allVariantIds])])
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const payload = {
                ...formData,
                store_id: storeId,
                value: Number(formData.value),
                starts_at: formData.starts_at && formData.starts_at instanceof Date ? formData.starts_at.toISOString() : null,
                ends_at: formData.ends_at && formData.ends_at instanceof Date ? formData.ends_at.toISOString() : null,
            }

            let result
            if (isEditing && initialData?.id) {
                result = await updatePromotion(
                    initialData.id,
                    payload,
                    promotionLevel === "product" ? selectedProductIds : [],
                    promotionLevel === "variant" ? selectedVariantIds : []
                )
            } else {
                result = await createPromotion(
                    payload,
                    promotionLevel === "product" ? selectedProductIds : [],
                    promotionLevel === "variant" ? selectedVariantIds : []
                )
            }

            if (result.error) {
                notifications.show({ title: "Error", message: result.error, color: "red" })
            } else {
                notifications.show({ title: "Éxito", message: `Promoción ${isEditing ? "actualizada" : "creada"} correctamente.`, color: "green" })
                router.push("/promotions")
                router.refresh()
            }
        } catch (error) {
            console.error(error)
            notifications.show({ title: "Error", message: "Ocurrió un error inesperado.", color: "red" })
        } finally {
            setIsLoading(false)
        }
    }

    const formatVariantName = (variant: ProductVariant) => {
        if (variant.name) return variant.name
        return Object.entries(variant.attributes)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")
    }

    return (
        <form onSubmit={handleSubmit}>
            <Grid gutter="lg">
                {/* Left Column: Basic Info */}
                <Grid.Col span={{ base: 12, lg: 4 }}>
                    <Stack gap="lg">
                        <Card withBorder radius="lg" padding="lg">
                            <Stack gap="md">
                                <div>
                                    <Title order={4}>Detalles de la Promoción</Title>
                                    <Text c="dimmed" size="sm">Configura los datos básicos</Text>
                                </div>

                                <TextInput
                                    label="Nombre"
                                    placeholder="Ej. Oferta de Verano"
                                    leftSection={<Tag size={16} />}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />

                                <Group grow>
                                    <Select
                                        label="Tipo"
                                        data={[
                                            { value: "percentage", label: "Porcentaje (%)" },
                                            { value: "amount", label: "Monto Fijo ($)" }
                                        ]}
                                        value={formData.type}
                                        onChange={(val: string | null) => setFormData({ ...formData, type: val || "percentage" })}
                                        allowDeselect={false}
                                    />
                                    <NumberInput
                                        label="Valor"
                                        min={0}
                                        decimalScale={2}
                                        placeholder="0.00"
                                        value={formData.value}
                                        onChange={(val) => setFormData({ ...formData, value: val })}
                                        required
                                    />
                                </Group>

                                <Select
                                    label="Estado"
                                    data={[
                                        { value: "scheduled", label: "Programada" },
                                        { value: "active", label: "Activa" },
                                        { value: "expired", label: "Expirada" }
                                    ]}
                                    value={formData.status}
                                    onChange={(val) => setFormData({ ...formData, status: val || "scheduled" })}
                                    allowDeselect={false}
                                />

                                <Stack gap="xs" style={{ borderTop: '1px solid var(--mantine-color-gray-2)', paddingTop: 16 }}>
                                    <DateInput
                                        label="Inicio"
                                        placeholder="Seleccionar fecha"
                                        leftSection={<Calendar size={16} />}
                                        value={formData.starts_at}
                                        onChange={(val) => setFormData({ ...formData, starts_at: val as Date | null })}
                                        className="w-full"
                                        clearable
                                    />
                                    <DateInput
                                        label="Fin"
                                        placeholder="Seleccionar fecha"
                                        leftSection={<Calendar size={16} />}
                                        value={formData.ends_at}
                                        onChange={(val) => setFormData({ ...formData, ends_at: val as Date | null })}
                                        className="w-full"
                                        clearable
                                    />
                                </Stack>
                            </Stack>
                        </Card>
                    </Stack>
                </Grid.Col>

                {/* Right Column: Product Selection */}
                <Grid.Col span={{ base: 12, lg: 8 }}>
                    <Card withBorder radius="lg" padding={0} style={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Tabs
                            value={promotionLevel}
                            onChange={(val) => setPromotionLevel(val)}
                            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                        >
                            <Stack gap="md" p="lg" bg="gray.0">
                                <Group justify="space-between" align="flex-start">
                                    <div>
                                        <Title order={4}>Selección de Productos</Title>
                                        <Text c="dimmed" size="sm">Elige los productos o versiones para aplicar el descuento</Text>
                                    </div>
                                    <Tabs.List>
                                        <Tabs.Tab value="product">Productos</Tabs.Tab>
                                        <Tabs.Tab value="variant">Versiones</Tabs.Tab>
                                    </Tabs.List>
                                </Group>

                                <Group>
                                    <TextInput
                                        placeholder="Buscar productos..."
                                        leftSection={<Search size={16} />}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ flex: 1 }}
                                    />
                                    <Button variant="default" onClick={handleSelectAll}>
                                        {promotionLevel === "product"
                                            ? (selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0 ? "Deseleccionar Todo" : "Seleccionar Todo")
                                            : (selectedVariantIds.length > 0 ? "Deseleccionar Todo" : "Seleccionar Todo")
                                        }
                                    </Button>
                                </Group>
                            </Stack>

                            <ScrollArea style={{ flex: 1, position: 'relative' }} type="auto">
                                <Tabs.Panel value="product" px="lg" py="md">
                                    <Stack gap="xs">
                                        {filteredProducts.map((product) => {
                                            const isSelected = selectedProductIds.includes(product.id);
                                            return (
                                                <Group
                                                    key={product.id}
                                                    wrap="nowrap"
                                                    p="xs"
                                                    style={{
                                                        borderRadius: 8,
                                                        border: `1px solid ${isSelected ? 'var(--mantine-color-blue-4)' : 'var(--mantine-color-gray-3)'}`,
                                                        backgroundColor: isSelected ? 'var(--mantine-color-blue-0)' : 'var(--mantine-color-white)',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onClick={() => handleProductToggle(product.id)}
                                                >
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onChange={() => { }}
                                                        style={{ pointerEvents: 'none' }}
                                                        mr="xs"
                                                    />
                                                    <div style={{ width: 48, height: 48, position: 'relative', borderRadius: 6, overflow: 'hidden', backgroundColor: '#f1f1f1' }}>
                                                        {product.product_media?.[0]?.url ? (
                                                            <Image
                                                                src={product.product_media[0].url}
                                                                alt={product.product_media[0].alt_text || product.name}
                                                                fill
                                                                style={{ objectFit: 'cover' }}
                                                            />
                                                        ) : (
                                                            <Group justify="center" align="center" h="100%"><ImageIcon size={20} color="gray" /></Group>
                                                        )}
                                                    </div>
                                                    <Stack gap={0} style={{ flex: 1 }}>
                                                        <Group gap={4}>
                                                            <Text fw={600} size="sm" lineClamp={1} title={product.name}>{product.name}</Text>
                                                            {isSelected && <CheckCircle2 size={14} color="var(--mantine-color-blue-6)" />}
                                                        </Group>
                                                        {product.code && <Badge variant="dot" color="gray" size="xs">{product.code}</Badge>}
                                                    </Stack>
                                                </Group>
                                            );
                                        })}
                                        {filteredProducts.length === 0 && (
                                            <Stack align="center" py="xl">
                                                <Search size={32} color="gray" style={{ opacity: 0.3 }} />
                                                <Text c="dimmed">No se encontraron productos</Text>
                                            </Stack>
                                        )}
                                    </Stack>
                                </Tabs.Panel>

                                <Tabs.Panel value="variant" px="lg" py="md">
                                    <Stack gap="md">
                                        {filteredProducts.map((product) => (
                                            <Card key={product.id} withBorder radius="md" padding="xs">
                                                <Group gap="sm" mb="xs" style={{ borderBottom: '1px solid #eee', paddingBottom: 8 }}>
                                                    <div style={{ width: 32, height: 32, position: 'relative', borderRadius: 4, overflow: 'hidden', backgroundColor: '#f1f1f1' }}>
                                                        {product.product_media?.[0]?.url ? (
                                                            <Image
                                                                src={product.product_media[0].url}
                                                                alt={product.product_media[0].alt_text || product.name}
                                                                fill
                                                                style={{ objectFit: 'cover' }}
                                                            />
                                                        ) : (
                                                            <Group justify="center" align="center" h="100%"><ImageIcon size={16} color="gray" /></Group>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <Text fw={600} size="sm">{product.name}</Text>
                                                        {product.code && <Text size="xs" c="dimmed">{product.code}</Text>}
                                                    </div>
                                                </Group>

                                                <Grid gutter="xs">
                                                    {product.product_variants?.map((variant) => {
                                                        const isSelected = selectedVariantIds.includes(variant.id);
                                                        return (
                                                            <Grid.Col span={{ base: 12, md: 6 }} key={variant.id}>
                                                                <Group
                                                                    wrap="nowrap"
                                                                    p={6}
                                                                    style={{
                                                                        borderRadius: 6,
                                                                        border: `1px solid ${isSelected ? 'var(--mantine-color-blue-4)' : 'transparent'}`,
                                                                        backgroundColor: isSelected ? 'var(--mantine-color-blue-0)' : 'transparent',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                    onClick={() => handleVariantToggle(variant.id)}
                                                                    className="hover:bg-gray-50"
                                                                >
                                                                    <Checkbox
                                                                        checked={isSelected}
                                                                        onChange={() => { }}
                                                                        style={{ pointerEvents: 'none' }}
                                                                        size="xs"
                                                                    />
                                                                    <Text size="sm" lineClamp={1} title={formatVariantName(variant)}>
                                                                        {formatVariantName(variant)}
                                                                    </Text>
                                                                </Group>
                                                            </Grid.Col>
                                                        );
                                                    })}
                                                    {(!product.product_variants || product.product_variants.length === 0) && (
                                                        <Text size="xs" c="dimmed" fs="italic" p="xs">Sin versiones disponibles</Text>
                                                    )}
                                                </Grid>
                                            </Card>
                                        ))}
                                        {filteredProducts.length === 0 && (
                                            <Stack align="center" py="xl">
                                                <Search size={32} color="gray" style={{ opacity: 0.3 }} />
                                                <Text c="dimmed">No se encontraron productos</Text>
                                            </Stack>
                                        )}
                                    </Stack>
                                </Tabs.Panel>
                            </ScrollArea>

                            <div style={{ padding: 16, borderTop: '1px solid #eee', backgroundColor: '#fafafa', fontSize: 12, color: '#888' }}>
                                {promotionLevel === "product"
                                    ? `${selectedProductIds.length} productos seleccionados`
                                    : `${selectedVariantIds.length} versiones seleccionadas`
                                }
                            </div>
                        </Tabs>
                    </Card>
                </Grid.Col>
            </Grid>

            <Group justify="flex-end" mt="xl">
                <Button variant="default" onClick={() => router.back()}>Cancelar</Button>
                <Button type="submit" loading={isLoading}>
                    {isEditing ? "Guardar Cambios" : "Crear Promoción"}
                </Button>
            </Group>
        </form>
    )
}
