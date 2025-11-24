"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { addProduct, updateProduct } from "./products-actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

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
      status: product?.status ?? "draft",
      sourcing_status: product?.sourcing_status ?? "active",
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
      toast.error(`Error: ${result.error}`)
    } else {
      toast.success(
        `Producto ${product?.id ? "actualizado" : "creado"} con éxito.`
      )
      router.push("/products")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Producto</FormLabel>
              <FormControl>
                <Input placeholder="Lámpara de Techo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea placeholder="Descripción del producto..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input placeholder="SKU12345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="brand_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una marca" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={String(brand.id)}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Card className="rounded-3xl elegant-shadow bg-white">
          <CardHeader>
            <CardTitle>Disponibilidad y Estado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado de Publicación</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Borrador</SelectItem>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="inactive">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sourcing_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado de Abastecimiento</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="backorder">Pedido Pendiente</SelectItem>
                        <SelectItem value="discontinued">Descontinuado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="pieces_per_box"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Piezas por Caja</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl elegant-shadow bg-white">
          <CardHeader>
            <CardTitle>Precios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="list_price_usd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio de Lista (USD)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="99.99" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Moneda</FormLabel>
                    <FormControl>
                      <Input placeholder="USD" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl elegant-shadow bg-white">
          <CardHeader>
            <CardTitle>Especificaciones Técnicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="life_hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horas de Vida</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="50000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lumens"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lúmenes</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="800" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="attributes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Atributos Adicionales</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='{ "color": "blanco", "voltaje": "110-220V" }'
                        {...field}
                        rows={5}
                      />
                    </FormControl>
                     <FormDescription>
                      Introduce un objeto JSON válido con atributos adicionales.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </CardContent>
        </Card>

        <FormField
          control={form.control}
          name="category_ids"
          render={({ field }) => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Categorías</FormLabel>
                <FormDescription>
                  Selecciona las categorías a las que pertenece el producto.
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((category) => (
                  <FormItem
                    key={category.id}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(category.id)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...(field.value ?? []), category.id])
                            : field.onChange(
                                field.value?.filter(
                                  (value) => value !== category.id
                                )
                              )
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {category.name}
                    </FormLabel>
                  </FormItem>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? "Guardando..."
            : product?.id
            ? "Guardar Cambios"
            : "Crear Producto"}
        </Button>
      </form>
    </Form>
  )
}