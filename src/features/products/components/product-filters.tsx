"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Accordion,
  Checkbox,
  Button,
  ScrollArea,
  Badge,
  Text,
  Group,
  Stack,
  Box,
  Flex,
  ActionIcon
} from "@mantine/core"
import { X } from "lucide-react"

// Define types for the filter items
type FilterItem = {
  id: string;
  name: string;
  count: number;
};

export function ProductFilters({
  categories,
  brands,
  families = [],
  groups = [],
}: {
  categories: FilterItem[]
  brands: FilterItem[]
  families?: FilterItem[]
  groups?: FilterItem[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([])
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])

  // Initialize state from URL search params on component mount
  useEffect(() => {
    const categoriesParam = searchParams.get("categories")
    if (categoriesParam) {
      setSelectedCategories(categoriesParam.split(","))
    }
    const brandsParam = searchParams.get("brands")
    if (brandsParam) {
      setSelectedBrands(brandsParam.split(","))
    }
    const familiesParam = searchParams.get("families")
    if (familiesParam) {
      setSelectedFamilies(familiesParam.split(","))
    }
    const groupsParam = searchParams.get("groups")
    if (groupsParam) {
      setSelectedGroups(groupsParam.split(","))
    }
    // Price range initialization could be added here if needed
  }, [searchParams])

  const updateSearchParams = (newCategories: string[], newBrands: string[]) => {
    const params = new URLSearchParams(searchParams.toString())
    if (newCategories.length > 0) {
      params.set("categories", newCategories.join(","))
    } else {
      params.delete("categories")
    }
    if (newBrands.length > 0) {
      params.set("brands", newBrands.join(","))
    } else {
      params.delete("brands")
    }
    if (selectedFamilies.length > 0) {
      params.set("families", selectedFamilies.join(","))
    }
    if (selectedGroups.length > 0) {
      params.set("groups", selectedGroups.join(","))
    }
    // Price range could be added here
    router.push(`/productos?${params.toString()}`)
  }

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter((id) => id !== categoryId)
    setSelectedCategories(newCategories)
    updateSearchParams(newCategories, selectedBrands)
  }

  const handleBrandChange = (brandId: string, checked: boolean) => {
    const newBrands = checked
      ? [...selectedBrands, brandId]
      : selectedBrands.filter((id) => id !== brandId)
    setSelectedBrands(newBrands)
    updateSearchParams(selectedCategories, newBrands)
  }

  const handleFamilyChange = (familyId: string, checked: boolean) => {
    const newFamilies = checked
      ? [...selectedFamilies, familyId]
      : selectedFamilies.filter((id) => id !== familyId)
    setSelectedFamilies(newFamilies)

    const params = new URLSearchParams(searchParams.toString())
    if (newFamilies.length > 0) {
      params.set("families", newFamilies.join(","))
    } else {
      params.delete("families")
    }
    router.push(`/productos?${params.toString()}`)
  }

  const handleGroupChange = (groupId: string, checked: boolean) => {
    const newGroups = checked
      ? [...selectedGroups, groupId]
      : selectedGroups.filter((id) => id !== groupId)
    setSelectedGroups(newGroups)

    const params = new URLSearchParams(searchParams.toString())
    if (newGroups.length > 0) {
      params.set("groups", newGroups.join(","))
    } else {
      params.delete("groups")
    }
    router.push(`/productos?${params.toString()}`)
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setSelectedFamilies([])
    setSelectedGroups([])
    setPriceRange([0, 1000]) // Reset price range state
    router.push("/productos") // Clear all search params
  }

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    selectedFamilies.length > 0 ||
    selectedGroups.length > 0

  return (
    <Box className="bg-white rounded-xl shadow-sm p-6" style={{ position: 'sticky', top: 96 }}>
      <Flex justify="space-between" align="center" mb="md">
        <Text fw={700} size="lg">Filtros</Text>
        {hasActiveFilters && (
          <Button
            variant="subtle"
            size="compact-xs"
            color="red"
            onClick={clearFilters}
            rightSection={<X size={12} />}
          >
            Borrar
          </Button>
        )}
      </Flex>

      <Stack gap="md">
        <Text size="xs" fw={700} tt="uppercase" c="dimmed">General</Text>
        <Accordion
          multiple
          defaultValue={["categories", "brands"]}
          variant="separated"
          radius="md"
        >
          {/* Categories Filter */}
          <Accordion.Item value="categories" bg="transparent" style={{ border: 'none' }}>
            <Accordion.Control ><Text fw={600}>Categorías</Text></Accordion.Control>
            <Accordion.Panel>
              <ScrollArea h={200} type="always" offsetScrollbars>
                <Stack gap="sm" pt="xs">
                  {categories.map((category) => (
                    <Checkbox
                      key={category.id}
                      label={category.name}
                      checked={selectedCategories.includes(String(category.id))}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleCategoryChange(String(category.id), event.currentTarget.checked)}
                      styles={{ label: { cursor: 'pointer' } }}
                    />
                  ))}
                </Stack>
              </ScrollArea>
            </Accordion.Panel>
          </Accordion.Item>

          {/* Brands Filter */}
          <Accordion.Item value="brands" bg="transparent" style={{ border: 'none' }}>
            <Accordion.Control><Text fw={600}>Marcas</Text></Accordion.Control>
            <Accordion.Panel>
              <ScrollArea h={200} type="always" offsetScrollbars>
                <Stack gap="sm" pt="xs">
                  {brands.map((brand) => (
                    <Checkbox
                      key={brand.id}
                      label={brand.name}
                      checked={selectedBrands.includes(String(brand.id))}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleBrandChange(String(brand.id), event.currentTarget.checked)}
                      styles={{ label: { cursor: 'pointer' } }}
                    />
                  ))}
                </Stack>
              </ScrollArea>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Stack>

      {(families.length > 0 || groups.length > 0) && (
        <Stack gap="md" mt="md" pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
          <Text size="xs" fw={700} tt="uppercase" c="dimmed">Producto</Text>
          <Accordion
            multiple
            defaultValue={["families", "groups"]}
            variant="separated"
          >
            {/* Families Filter */}
            {families.length > 0 && (
              <Accordion.Item value="families" bg="transparent" style={{ border: 'none' }}>
                <Accordion.Control><Text fw={600}>Familias</Text></Accordion.Control>
                <Accordion.Panel>
                  <ScrollArea h={200} type="always" offsetScrollbars>
                    <Stack gap="sm" pt="xs">
                      {families.map((family) => (
                        <Checkbox
                          key={family.id}
                          label={
                            <Group gap={4} wrap="nowrap">
                              <Text size="sm">{family.name}</Text>
                              {family.count > 0 && (
                                <Badge size="xs" color="gray" variant="light">{family.count}</Badge>
                              )}
                            </Group>
                          }
                          checked={selectedFamilies.includes(String(family.id))}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleFamilyChange(String(family.id), event.currentTarget.checked)}
                          styles={{ label: { cursor: 'pointer', width: '100%' } }}
                        />
                      ))}
                    </Stack>
                  </ScrollArea>
                </Accordion.Panel>
              </Accordion.Item>
            )}

            {/* Groups Filter */}
            {groups.length > 0 && (
              <Accordion.Item value="groups" bg="transparent" style={{ border: 'none' }}>
                <Accordion.Control><Text fw={600}>Grupos</Text></Accordion.Control>
                <Accordion.Panel>
                  <ScrollArea h={200} type="always" offsetScrollbars>
                    <Stack gap="sm" pt="xs">
                      {groups.map((group) => (
                        <Checkbox
                          key={group.id}
                          label={
                            <Group gap={4} wrap="nowrap">
                              <Text size="sm">{group.name}</Text>
                              {group.count > 0 && (
                                <Badge size="xs" color="gray" variant="light">{group.count}</Badge>
                              )}
                            </Group>
                          }
                          checked={selectedGroups.includes(String(group.id))}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleGroupChange(String(group.id), event.currentTarget.checked)}
                          styles={{ label: { cursor: 'pointer', width: '100%' } }}
                        />
                      ))}
                    </Stack>
                  </ScrollArea>
                </Accordion.Panel>
              </Accordion.Item>
            )}
          </Accordion>
        </Stack>
      )}
    </Box>
  )
}
