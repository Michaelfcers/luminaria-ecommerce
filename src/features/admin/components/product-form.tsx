"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button, Card, TextInput, Textarea, Select, NumberInput, Checkbox, Stack, Grid, Title, Text, Group } from "@mantine/core"
import { addProduct, updateProduct } from "./products-actions"
import { useRouter } from "next/navigation"
import { notifications } from "@mantine/notifications"

const productFormSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  description: z.string().optional(),
  code: z.string().optional(),
  store_id: z.string().nonempty("La tienda es obligatoria."),
  brand_id: z.string().nonempty("La marca es obligatoria."),
  status: z.enum(["draft", "active", "inactive"]),
  sourcing_status: z
    .enum(["active", "backorder", "discontinued"])
    .optional(),
  life_hours: z.coerce.number().int().optional(),
  lumens: z.coerce.number().int().optional(),
  pieces_per_box: z.coerce.number().int().optional(),
  list_price_usd: z.coerce.number().min(0, "El precio debe ser positivo."),
  currency: z.string().optional(),
  stock: z.coerce.number().int("El stock debe ser un número entero."),
  attributes: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true
        try {
          JSON.parse(val)
          return true
        } catch (e) {
          return false
        }
      },
      { message: "Debe ser un JSON válido." }
    ),
  category_ids: z.array(z.string()).optional(),
})

type ProductFormValues = z.infer<typeof productFormSchema>

interface ProductFormProps {
  product?: Partial<ProductFormValues> & {
    id?: string
    product_categories?: { category_id: string }[]
    attributes?: Record<string, any>
  }
  brands?: { id: string; name: string }[]
  categories?: { id: string; name: string }[]
  store_id: string;
}

export function ProductForm({
  product,
  brands = [],
  categories = [],
  store_id,
}: ProductFormProps) {
  const router = useRouter()
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      code: product?.code ?? "",
      store_id: product?.store_id ?? store_id,
      brand_id: product?.brand_id ?? "",
      status: product?.status as any ?? "draft",
      sourcing_status: product?.sourcing_status as any ?? "active",
      life_hours: product?.life_hours ?? undefined,
      lumens: product?.lumens ?? undefined,
      pieces_per_box: product?.pieces_per_box ?? undefined,
      list_price_usd: product?.list_price_usd ?? 0,
      currency: product?.currency ?? "USD",
      stock: product?.stock ?? 0,
      attributes: product?.attributes
        ? JSON.stringify(product.attributes, null, 2)
        : "",
      category_ids:
        product?.product_categories?.map((pc) => pc.category_id) ?? [],
    },
  })

  const onSubmit = async (values: ProductFormValues) => {
    const result = product?.id
      ? await updateProduct(product.id, values)
      : await addProduct(values)

    if (result?.error) {
      notifications.show({
        title: 'Error',
        message: result.error,
        color: 'red',
      })
    } else {
      notifications.show({
        title: 'Éxito',
        message: `Producto ${product?.id ? "actualizado" : "creado"} con éxito.`,
        color: 'green',
      })
      router.push("/products")
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Stack gap="xl">
        <TextInput
          label="Nombre del Producto"
          placeholder="Lámpara de Techo"
          {...form.register("name")}
          error={form.formState.errors.name?.message}
        />

        <Textarea
          label="Descripción"
          placeholder="Descripción del producto..."
          {...form.register("description")}
          error={form.formState.errors.description?.message}
        />

        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Código"
              placeholder="SKU12345"
              {...form.register("code")}
              error={form.formState.errors.code?.message}
            />
          </Grid.Col>
        </Grid>

        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Controller
              control={form.control}
              name="brand_id"
              render={({ field }) => (
                <Select
                  label="Marca"
                  placeholder="Selecciona una marca"
                  data={brands.map(b => ({ value: String(b.id), label: b.name }))}
                  value={field.value}
                  onChange={field.onChange}
                  error={form.formState.errors.brand_id?.message}
                />
              )}
            />
          </Grid.Col>
        </Grid>

        <Card withBorder radius="lg" padding="lg">
          <Stack gap="md">
            <Title order={3}>Disponibilidad y Estado</Title>
            <Grid gutter="lg">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Controller
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      label="Estado de Publicación"
                      placeholder="Selecciona un estado"
                      data={[
                        { value: "draft", label: "Borrador" },
                        { value: "active", label: "Activo" },
                        { value: "inactive", label: "Inactivo" },
                      ]}
                      value={field.value}
                      onChange={field.onChange}
                      error={form.formState.errors.status?.message}
                    />
                  )}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Controller
                  control={form.control}
                  name="sourcing_status"
                  render={({ field }) => (
                    <Select
                      label="Estado de Abastecimiento"
                      placeholder="Selecciona un estado"
                      data={[
                        { value: "active", label: "Activo" },
                        { value: "backorder", label: "Pedido Pendiente" },
                        { value: "discontinued", label: "Descontinuado" },
                      ]}
                      value={field.value}
                      onChange={field.onChange}
                      error={form.formState.errors.sourcing_status?.message}
                    />
                  )}
                />
              </Grid.Col>
            </Grid>
            <Grid gutter="lg">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Controller
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <NumberInput
                      label="Stock"
                      placeholder="100"
                      value={field.value}
                      min={0}
                      onChange={(val) => field.onChange(val)}
                      error={form.formState.errors.stock?.message}
                    />
                  )}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Controller
                  control={form.control}
                  name="pieces_per_box"
                  render={({ field }) => (
                    <NumberInput
                      label="Piezas por Caja"
                      placeholder="12"
                      value={field.value}
                      min={1}
                      onChange={(val) => field.onChange(val)}
                      error={form.formState.errors.pieces_per_box?.message}
                    />
                  )}
                />
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>

        <Card withBorder radius="lg" padding="lg">
          <Stack gap="md">
            <Title order={3}>Precios</Title>
            <Grid gutter="lg">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Controller
                  control={form.control}
                  name="list_price_usd"
                  render={({ field }) => (
                    <NumberInput
                      label="Precio de Lista (USD)"
                      placeholder="99.99"
                      decimalScale={2}
                      fixedDecimalScale
                      prefix="$"
                      min={0}
                      value={field.value}
                      onChange={(val) => field.onChange(val)}
                      error={form.formState.errors.list_price_usd?.message}
                    />
                  )}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Moneda"
                  placeholder="USD"
                  {...form.register("currency")}
                  error={form.formState.errors.currency?.message}
                />
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>

        <Card withBorder radius="lg" padding="lg">
          <Stack gap="md">
            <Title order={3}>Especificaciones Técnicas</Title>
            <Grid gutter="lg">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Controller
                  control={form.control}
                  name="life_hours"
                  render={({ field }) => (
                    <NumberInput
                      label="Horas de Vida"
                      placeholder="50000"
                      min={0}
                      value={field.value}
                      onChange={(val) => field.onChange(val)}
                      error={form.formState.errors.life_hours?.message}
                    />
                  )}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Controller
                  control={form.control}
                  name="lumens"
                  render={({ field }) => (
                    <NumberInput
                      label="Lúmenes"
                      placeholder="800"
                      min={0}
                      value={field.value}
                      onChange={(val) => field.onChange(val)}
                      error={form.formState.errors.lumens?.message}
                    />
                  )}
                />
              </Grid.Col>
            </Grid>
            <Textarea
              label="Atributos Adicionales (JSON)"
              placeholder='{ "color": "blanco", "voltaje": "110-220V" }'
              rows={5}
              {...form.register("attributes")}
              error={form.formState.errors.attributes?.message}
            />
            <Text c="dimmed" size="xs">Introduce un objeto JSON válido con atributos adicionales.</Text>
          </Stack>
        </Card>

        <Stack gap="xs">
          <Text fw={500}>Categorías</Text>
          <Text c="dimmed" size="sm">Selecciona las categorías a las que pertenece el producto.</Text>
          <Grid gutter="sm">
            {categories.map((category) => (
              <Grid.Col span={{ base: 6, md: 4, lg: 3 }} key={category.id}>
                <Controller
                  control={form.control}
                  name="category_ids"
                  render={({ field }) => (
                    <Checkbox
                      label={category.name}
                      checked={field.value?.includes(category.id)}
                      onChange={(event) => {
                        const checked = event.currentTarget.checked;
                        const current = field.value || [];
                        if (checked) {
                          field.onChange([...current, category.id]);
                        } else {
                          field.onChange(current.filter((id) => id !== category.id));
                        }
                      }}
                    />
                  )}
                />
              </Grid.Col>
            ))}
          </Grid>
          {form.formState.errors.category_ids && (
            <Text c="red" size="sm">{form.formState.errors.category_ids.message}</Text>
          )}
        </Stack>

        <Button type="submit" loading={form.formState.isSubmitting}>
          {product?.id ? "Guardar Cambios" : "Crear Producto"}
        </Button>
      </Stack>
    </form>
  )
}