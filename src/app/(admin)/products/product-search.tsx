"use client"

import { TextInput } from "@mantine/core"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "@mantine/hooks"
import { IconSearch } from "@tabler/icons-react"

export function ProductSearch() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', '1') // Reset a la primera página al buscar
    if (term) {
      params.set('q', term)
    } else {
      params.delete('q')
    }
    replace(`${pathname}?${params.toString()}`)
  }, 300)

  return (
    <TextInput
      placeholder="Buscar por nombre o código..."
      leftSection={<IconSearch size={16} />}
      defaultValue={searchParams.get('q')?.toString()}
      onChange={(e) => handleSearch(e.currentTarget.value)}
      size="sm"
      style={{ width: 300 }}
    />
  )
}