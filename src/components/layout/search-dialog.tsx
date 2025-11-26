"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { searchProducts, type SearchResult } from "@/lib/actions/search"

export function SearchDialog() {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const [data, setData] = React.useState<SearchResult[]>([])
    const [isSearching, setIsSearching] = React.useState(false)
    const router = useRouter()

    // Simple debounce implementation if hook doesn't exist
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
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(true)}
                className="relative"
            >
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder="Buscar productos..."
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList>
                    <CommandEmpty>
                        {isSearching ? "Buscando..." : "No se encontraron resultados."}
                    </CommandEmpty>

                    {data.length > 0 && (
                        <CommandGroup heading="Resultados">
                            {data.map((item) => (
                                <CommandItem
                                    key={`${item.type}-${item.id}`}
                                    value={`${item.title} ${item.subtitle}`}
                                    onSelect={() => {
                                        runCommand(() => router.push(item.url))
                                    }}
                                >
                                    <Search className="mr-2 h-4 w-4" />
                                    <div className="flex flex-col">
                                        <span>{item.title}</span>
                                        {item.subtitle && (
                                            <span className="text-xs text-muted-foreground">
                                                {item.subtitle}
                                            </span>
                                        )}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    )
}
