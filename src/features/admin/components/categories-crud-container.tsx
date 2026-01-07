"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button, TextInput, Select, Table, Modal, Group, Stack, Text, Title, ActionIcon } from "@mantine/core"
import { addCategory, updateCategory, deleteCategory } from "./categories-actions"
import { notifications } from "@mantine/notifications"
import { IconEdit, IconTrash } from "@tabler/icons-react"

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
      notifications.show({
        title: 'Error',
        message: errorMessages,
        color: 'red',
      })
    } else {
      notifications.show({
        title: 'Éxito',
        message: `Categoría ${editingCategory ? "actualizada" : "creada"} con éxito.`,
        color: 'green',
      })

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
        notifications.show({
          title: 'Error',
          message: result.error,
          color: 'red',
        })
      } else {
        notifications.show({
          title: 'Éxito',
          message: "Categoría eliminada con éxito.",
          color: 'green',
        })
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
        <Title order={3} mb="md">
          {editingCategory ? "Editar Categoría" : "Crear Nueva Categoría"}
        </Title>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Nombre"
              placeholder="Iluminación Interior"
              {...form.register("name")}
              error={form.formState.errors.name?.message}
            />
            <TextInput
              label="Slug"
              placeholder="iluminacion-interior"
              {...form.register("slug")}
              error={form.formState.errors.slug?.message}
            />
            <Controller
              control={form.control}
              name="parent_id"
              render={({ field }) => (
                <Select
                  label="Categoría Padre"
                  placeholder="Selecciona una categoría padre (opcional)"
                  data={[
                    { value: "none", label: "Ninguna" },
                    ...categories
                      .filter(c => c.id !== editingCategory?.id)
                      .map(c => ({ value: String(c.id), label: c.name }))
                  ]}
                  value={field.value || "none"}
                  onChange={field.onChange}
                  error={form.formState.errors.parent_id?.message}
                />
              )}
            />
            <Group>
              <Button type="submit" loading={form.formState.isSubmitting}>
                {editingCategory ? "Guardar Cambios" : "Crear Categoría"}
              </Button>
              {editingCategory && (
                <Button variant="default" onClick={() => { setEditingCategory(null); form.reset(); }}>
                  Cancelar
                </Button>
              )}
            </Group>
          </Stack>
        </form>
      </div>
      <div className="md:col-span-2">
        <Title order={3} mb="md">Listado de Categorías</Title>
        <Table highlightOnHover>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría Padre</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.parent_name || "N/A"}</td>
                <td style={{ textAlign: 'right' }}>
                  <Group justify="flex-end" gap="xs">
                    <ActionIcon variant="subtle" color="blue" onClick={() => handleEdit(category)}>
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="red" onClick={() => openDeleteDialog(category.id)}>
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Modal opened={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} title="¿Estás seguro?">
        <Text size="sm">Esta acción marcará la categoría como eliminada.</Text>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
          <Button color="red" onClick={handleDeleteConfirm}>Confirmar</Button>
        </Group>
      </Modal>
    </div>
  )
}
