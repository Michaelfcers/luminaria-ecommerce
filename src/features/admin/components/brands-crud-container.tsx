"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button, TextInput, Table, Modal, Group, Stack, Text, Title, ActionIcon } from "@mantine/core"
import { addBrand, updateBrand, deleteBrand } from "./brands-actions"
import { notifications } from "@mantine/notifications"
import { Edit, Trash } from "lucide-react"

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
      notifications.show({
        title: 'Error',
        message: errorMessages,
        color: 'red',
      })
    } else {
      notifications.show({
        title: 'Éxito',
        message: `Marca ${editingBrand ? "actualizada" : "creada"} con éxito.`,
        color: 'green',
      })
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
        notifications.show({
          title: 'Error',
          message: result.error,
          color: 'red',
        })
      } else {
        notifications.show({
          title: 'Éxito',
          message: "Marca eliminada con éxito.",
          color: 'green',
        })
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
        <Title order={3} mb="md">
          {editingBrand ? "Editar Marca" : "Crear Nueva Marca"}
        </Title>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Nombre"
              placeholder="Philips"
              {...form.register("name")}
              error={form.formState.errors.name?.message}
            />
            <TextInput
              label="Slug"
              placeholder="philips"
              {...form.register("slug")}
              error={form.formState.errors.slug?.message}
            />
            <Group>
              <Button type="submit" loading={form.formState.isSubmitting}>
                {editingBrand ? "Guardar Cambios" : "Crear Marca"}
              </Button>
              {editingBrand && (
                <Button variant="default" onClick={() => { setEditingBrand(null); form.reset(); }}>
                  Cancelar
                </Button>
              )}
            </Group>
          </Stack>
        </form>
      </div>
      <div className="md:col-span-2">
        <Title order={3} mb="md">Listado de Marcas</Title>
        <Table highlightOnHover>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Slug</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id}>
                <td>{brand.name}</td>
                <td>{brand.slug}</td>
                <td style={{ textAlign: 'right' }}>
                  <Group justify="flex-end" gap="xs">
                    <ActionIcon variant="subtle" color="blue" onClick={() => handleEdit(brand)}>
                      <Edit size={16} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="red" onClick={() => openDeleteDialog(brand.id)}>
                      <Trash size={16} />
                    </ActionIcon>
                  </Group>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Modal opened={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} title="¿Estás seguro?">
        <Text size="sm">Esta acción marcará la marca como eliminada.</Text>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
          <Button color="red" onClick={handleDeleteConfirm}>Confirmar</Button>
        </Group>
      </Modal>
    </div>
  )
}
