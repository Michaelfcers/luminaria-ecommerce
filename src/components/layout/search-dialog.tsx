"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Modal, TextInput, Stack, Text, UnstyledButton, Group, ScrollArea } from "@mantine/core"
import { searchProducts, type SearchResult } from "@/lib/actions/search"

interface SearchDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
    const [query, setQuery] = React.useState("")
    const [data, setData] = React.useState<SearchResult[]>([])
    const [isSearching, setIsSearching] = React.useState(false)
    const router = useRouter()

    // Simple debounce implementation
    React.useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length >= 2) {
                setIsSearching(true)
                try {
                    const results = await searchProducts(query)
                    setData(results)
                } catch (error) {
                    console.error("Search error:", error)
                } finally {
                    setIsSearching(false)
                }
            } else {
                setData([])
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [query])

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                onOpenChange(!open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [onOpenChange, open])

    const handleSelect = (url: string) => {
        onOpenChange(false)
        router.push(url)
    }

    return (
        <Modal
            opened={open}
            onClose={() => onOpenChange(false)}
            title="Buscar productos"
            size="lg"
        >
            <Stack gap="md">
                <TextInput
                    placeholder="Escribe para buscar..."
                    leftSection={<Search size={16} />}
                    value={query}
                    onChange={(event) => setQuery(event.currentTarget.value)}
                    data-autofocus
                />

                <ScrollArea.Autosize mah={300}>
                    {data.length === 0 && query.length >= 2 && !isSearching && (
                        <Text c="dimmed" size="sm" ta="center" py="md">No se encontraron resultados.</Text>
                    )}
                    {isSearching && (
                        <Text c="dimmed" size="sm" ta="center" py="md">Buscando...</Text>
                    )}

                    {data.length > 0 && (
                        <Stack gap={4}>
                            <Text size="xs" fw={700} c="dimmed" tt="uppercase">Resultados</Text>
                            {data.map((item) => (
                                <UnstyledButton
                                    key={`${item.type}-${item.id}`}
                                    onClick={() => handleSelect(item.url)}
                                    p="sm"
                                    style={{ borderRadius: 'var(--mantine-radius-md)' }}
                                    className="hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <Group>
                                        <Search size={16} className="text-muted-foreground" />
                                        <div className="flex flex-col">
                                            <Text size="sm">{item.title}</Text>
                                            {item.subtitle && (
                                                <Text size="xs" c="dimmed">
                                                    {item.subtitle}
                                                </Text>
                                            )}
                                        </div>
                                    </Group>
                                </UnstyledButton>
                            ))}
                        </Stack>
                    )}
                </ScrollArea.Autosize>
            </Stack>
        </Modal>
    )
}
