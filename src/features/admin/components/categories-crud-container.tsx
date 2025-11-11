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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { addCategory, updateCategory, deleteCategory } from "./categories-actions"
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
} from "@/components/ui/alert-dialog"

const categoryFormSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  slug: z.string().optional(),
  parent_id: z.string().optional(),
})

type CategoryFormValues = z.infer<typeof categoryFormSchema>

interface Category {
  id: string
  name: string
  slug: string | null
  parent_id: string | null
  parent_name?: string | null
}

interface CategoriesCrudContainerProps {
  categories: Category[]
}

export function CategoriesCrudContainer({ categories: initialCategories }: CategoriesCrudContainerProps) {
  const [categories, setCategories] = useState(initialCategories)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null)

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { name: "", slug: "", parent_id: "" },
  })

  const onSubmit = async (values: CategoryFormValues) => {
    const formData = new FormData()
    formData.append("name", values.name)
    formData.append("slug", values.slug || "")
    if (values.parent_id && values.parent_id !== "none") {
      formData.append("parent_id", values.parent_id)
    }

    const result = editingCategory
      ? await updateCategory(editingCategory.id, formData)
      : await addCategory(formData)

    if (result?.error) {
      // @ts-ignore
      const errorMessages = Object.values(result.error).flat().join(", ")
      toast.error(`Error: ${errorMessages}`)
    } else {
      toast.success(`Categoría ${editingCategory ? "actualizada" : "creada"} con éxito.`)
      
      const newCategory = result.data?.[0]
      if (newCategory) {
        const parent = categories.find(c => String(c.id) === String(newCategory.parent_id))
        const newCategoryWithParent = {
          ...newCategory,
          id: String(newCategory.id),
          parent_id: newCategory.parent_id ? String(newCategory.parent_id) : null,
          parent_name: parent?.name || null
        }

        if (editingCategory) {
          setCategories(categories.map(c => c.id === editingCategory.id ? newCategoryWithParent : c))
        } else {
          setCategories([...categories, newCategoryWithParent])
        }
      }
    }
    form.reset({ name: "", slug: "", parent_id: "" })
    setEditingCategory(null)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    form.reset({ name: category.name, slug: category.slug || "", parent_id: category.parent_id || "" })
  }

  const handleDeleteConfirm = async () => {
    if (deletingCategoryId) {
      const result = await deleteCategory(deletingCategoryId)
      if (result?.error) {
        toast.error(`Error: ${result.error}`)
      } else {
        toast.success("Categoría eliminada con éxito.")
        setCategories(categories.filter((c) => c.id !== deletingCategoryId))
      }
      setIsDeleteDialogOpen(false)
      setDeletingCategoryId(null)
    }
  }

  const openDeleteDialog = (id: string) => {
    setDeletingCategoryId(id)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-1">
        <h2 className="text-2xl font-bold mb-4">
          {editingCategory ? "Editar Categoría" : "Crear Nueva Categoría"}
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
                    <Input placeholder="Iluminación Interior" {...field} />
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
                    <Input placeholder="iluminacion-interior" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parent_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría Padre</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría padre (opcional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Ninguna</SelectItem>
                      {categories
                        .filter(c => c.id !== editingCategory?.id) // Prevent self-parenting
                        .map((category) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Guardando..." : (editingCategory ? "Guardar Cambios" : "Crear Categoría")}
              </Button>
              {editingCategory && (
                <Button variant="outline" onClick={() => { setEditingCategory(null); form.reset(); }}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold mb-4">Listado de Categorías</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría Padre</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.parent_name || "N/A"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEdit(category)}>
                    Editar
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(category.id)}>
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
              Esta acción marcará la categoría como eliminada.
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
