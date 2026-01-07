"use client"

import { useState, useTransition } from "react"
import { Button, Modal, Group, Text } from "@mantine/core"
import { deleteProduct } from "./products-actions"
import { notifications } from "@mantine/notifications"

interface DeleteProductButtonProps {
  productId: string
}

export function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(async () => {
      const result = await deleteProduct(productId)
      if (result?.error) {
        notifications.show({
          title: "Error",
          message: result.error,
          color: "red",
        })
      } else {
        notifications.show({
          title: "Éxito",
          message: "Producto eliminado con éxito.",
          color: "green",
        })
        setIsOpen(false)
      }
    })
  }

  return (
    <>
      <Button variant="filled" color="red" size="sm" onClick={() => setIsOpen(true)}>
        Eliminar
      </Button>
      <Modal opened={isOpen} onClose={() => setIsOpen(false)} title="¿Estás seguro?">
        <Text size="sm">
          Esta acción no se puede deshacer. El producto será marcado como
          eliminado.
        </Text>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setIsOpen(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button color="red" onClick={handleClick} loading={isPending}>
            Confirmar
          </Button>
        </Group>
      </Modal>
    </>
  )
}
