"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { addBrand, updateBrand, deleteBrand } from "./brands-actions"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const brandFormSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  slug: z.string().optional(),
})

type BrandFormValues = z.infer<typeof brandFormSchema>

interface Brand {
  id: string
  name: string
  slug: string | null
}

interface BrandsCrudContainerProps {
  brands: Brand[]
}

export function BrandsCrudContainer({ brands: initialBrands }: BrandsCrudContainerProps) {
  const [brands, setBrands] = useState(initialBrands)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingBrandId, setDeletingBrandId] = useState<string | null>(null)

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: { name: "", slug: "" },
  })

  const onSubmit = async (values: BrandFormValues) => {
    const formData = new FormData()
    formData.append("name", values.name)
    formData.append("slug", values.slug || "")

    const result = editingBrand
      ? await updateBrand(editingBrand.id, formData)
      : await addBrand(formData)

    if (result?.error) {
      // @ts-ignore
      const errorMessages = Object.values(result.error).flat().join(", ")
      toast.error(`Error: ${errorMessages}`)
    } else {
      toast.success(`Marca ${editingBrand ? "actualizada" : "creada"} con éxito.`)
      // This is a simple way to refresh data. For a more robust solution,
      // you might want to re-fetch or use a state management library.
      window.location.reload()
    }
    form.reset()
    setEditingBrand(null)
  }

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand)
    form.reset({ name: brand.name, slug: brand.slug || "" })
  }

  const handleDeleteConfirm = async () => {
    if (deletingBrandId) {
      const result = await deleteBrand(deletingBrandId)
      if (result?.error) {
        toast.error(`Error: ${result.error}`)
      } else {
        toast.success("Marca eliminada con éxito.")
        setBrands(brands.filter((b) => b.id !== deletingBrandId))
      }
      setIsDeleteDialogOpen(false)
      setDeletingBrandId(null)
    }
  }

  const openDeleteDialog = (id: string) => {
    setDeletingBrandId(id)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-1">
        <h2 className="text-2xl font-bold mb-4">
          {editingBrand ? "Editar Marca" : "Crear Nueva Marca"}
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Philips" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="philips" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Guardando..." : (editingBrand ? "Guardar Cambios" : "Crear Marca")}
              </Button>
              {editingBrand && (
                <Button variant="outline" onClick={() => { setEditingBrand(null); form.reset(); }}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold mb-4">Listado de Marcas</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.map((brand) => (
              <TableRow key={brand.id}>
                <TableCell>{brand.name}</TableCell>
                <TableCell>{brand.slug}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEdit(brand)}>
                    Editar
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(brand.id)}>
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción marcará la marca como eliminada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
