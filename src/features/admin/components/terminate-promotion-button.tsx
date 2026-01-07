"use client"

import { useState } from "react"
import { Button, Modal, Group, Text } from "@mantine/core"
import { Trash2 } from "lucide-react"
import { deletePromotion } from "@/lib/actions/promotions"
import { notifications } from "@mantine/notifications"

interface TerminatePromotionButtonProps {
    promotionId: string
}

export function TerminatePromotionButton({ promotionId }: TerminatePromotionButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const result = await deletePromotion(promotionId)
            if (result.error) {
                notifications.show({
                    title: "Error",
                    message: result.error,
                    color: "red",
                })
            } else {
                notifications.show({
                    title: "Promoción eliminada",
                    message: "La promoción ha sido terminada y eliminada correctamente.",
                    color: "green",
                })
            }
        } catch (error) {
            notifications.show({
                title: "Error",
                message: "Ocurrió un error al eliminar la promoción.",
                color: "red",
            })
        } finally {
            setIsDeleting(false)
            setModalOpen(false)
        }
    }

    return (
        <>
            <Button
                variant="subtle"
                color="red"
                size="xs"
                disabled={isDeleting}
                onClick={() => setModalOpen(true)}
                leftSection={<Trash2 size={16} />}
            >
                Terminar
            </Button>

            <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="¿Estás seguro?">
                <Text size="sm">
                    Esta acción no se puede deshacer. Esto eliminará permanentemente la promoción y la desvinculará de todos los productos.
                </Text>
                <Group justify="flex-end" mt="md">
                    <Button variant="default" onClick={() => setModalOpen(false)}>Cancelar</Button>
                    <Button color="red" onClick={handleDelete} loading={isDeleting}>
                        {isDeleting ? "Eliminando..." : "Terminar Promoción"}
                    </Button>
                </Group>
            </Modal>
        </>
    )
}
