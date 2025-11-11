"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
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
  brand_id: z.string().nonempty("La marca es obligatoria."),
  status: z.enum(["draft", "active", "inactive"]),
  list_price_usd: z.coerce.number().min(0, "El precio debe ser positivo."),
  stock: z.coerce.number().int("El stock debe ser un número entero."),
  category_ids: z.array(z.string()).optional(),
})

type ProductFormValues = z.infer<typeof productFormSchema>

interface ProductFormProps {
  product?: Partial<ProductFormValues> & {
    id?: string
    product_categories?: { category_id: string }[]
  }
  brands: { id: string; name: string }[]
  categories: { id: string; name: string }[]
}

export function ProductForm({
  product,
  brands,
  categories,
}: ProductFormProps) {
  const router = useRouter()
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      brand_id: product?.brand_id ?? "",
      status: product?.status ?? "draft",
      list_price_usd: product?.list_price_usd ?? 0,
      stock: product?.stock ?? 0,
      category_ids: product?.product_categories?.map((pc) => pc.category_id) ?? [],
    },
  })

  const onSubmit = async (values: ProductFormValues) => {
    const formData = new FormData()
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'category_ids' && Array.isArray(value)) {
        value.forEach(id => formData.append('category_ids[]', id))
      } else {
        formData.append(key, String(value))
      }
    })

    const result = product?.id
      ? await updateProduct(product.id, formData)
      : await addProduct(formData)

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
        {/* ... other fields ... */}
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
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
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
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="list_price_usd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio (USD)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="99.99" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
        </div>
        
        <FormField
          control={form.control}
          name="category_ids"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Categorías</FormLabel>
                <FormDescription>
                  Selecciona las categorías a las que pertenece el producto.
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((category) => (
                  <FormField
                    key={category.id}
                    control={form.control}
                    name="category_ids"
                    render={({ field }) => {
                      return (
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
                      )
                    }}
                  />
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
