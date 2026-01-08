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
import { IconX, IconPlus, IconMinus } from "@tabler/icons-react"
import { getProductsByCategory } from "@/actions/products"

// Define types for the filter items
type FilterItem = {
  id: string;
  name: string;
  count: number;
  // ... any other properties
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

  // New state for product expansion and selection
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [productsByCategory, setProductsByCategory] = useState<Record<string, { id: string, name: string }[]>>({})
  const [loadingProducts, setLoadingProducts] = useState<Set<string>>(new Set())
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

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
    const productsParam = searchParams.get("products")
    if (productsParam) {
      setSelectedProducts(productsParam.split(","))
    }
    // Price range initialization could be added here if needed
  }, [searchParams])

  const updateSearchParams = (newCategories: string[], newBrands: string[], newProducts: string[]) => {
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
    if (newProducts.length > 0) {
      params.set("products", newProducts.join(","))
    } else {
      params.delete("products")
    }
    if (selectedFamilies.length > 0) {
      params.set("families", selectedFamilies.join(","))
    }
    if (selectedGroups.length > 0) {
      params.set("groups", selectedGroups.join(","))
    }
    // Price range could be added here
    params.delete("page") // Reset pagination on filter change
    router.push(`/productos?${params.toString()}`)
  }

  // Modified to handle click on text (toggle selection + expand)
  // Modified to handle click on text (toggle selection + expand)
  const handleCategoryClick = (categoryId: string) => {
    const isSelected = selectedCategories.includes(categoryId)
    const newCategories = isSelected
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId]

    setSelectedCategories(newCategories)

    // ACCORDION LOGIC:
    if (!isSelected) {
      // If selecting: Expand ONLY this one (Compress others)
      // Since toggleCategoryExpansion toggles, we should manually set the set.
      const newExpanded = new Set<string>();
      newExpanded.add(categoryId);
      setExpandedCategories(newExpanded);

      // We also need to trigger product fetch if needed, defaulting to the logic inside toggleCategoryExpansion
      // simpler way is to replicate the fetch logic or call toggle logic carefully.
      // But toggle logic is just a wrapper around state.
      // Let's call the fetch logic directly or refactor. 
      // Actually, since we are resetting the whole set, let's just do it manually here.
      if (!productsByCategory[categoryId]) {
        setLoadingProducts(prev => new Set(prev).add(categoryId))
        getProductsByCategory(categoryId).then(products => {
          setProductsByCategory(prev => ({ ...prev, [categoryId]: products }))
        }).catch(err => console.error(err))
          .finally(() => setLoadingProducts(prev => {
            const next = new Set(prev)
            next.delete(categoryId)
            return next
          }))
      }

    } else {
      // If deselecting: Compress this one
      const newExpanded = new Set(expandedCategories)
      newExpanded.delete(categoryId)
      setExpandedCategories(newExpanded)
    }

    updateSearchParams(newCategories, selectedBrands, selectedProducts)
  }

  // Legacy handler removed/replaced
  /* const handleCategoryChange = ... */

  const handleBrandChange = (brandId: string, checked: boolean) => {
    const newBrands = checked
      ? [...selectedBrands, brandId]
      : selectedBrands.filter((id) => id !== brandId)
    setSelectedBrands(newBrands)
    updateSearchParams(selectedCategories, newBrands, selectedProducts)
  }

  const handleProductSelect = (productId: string) => {
    const isSelected = selectedProducts.includes(productId)
    const newProducts = isSelected ? [] : [productId]
    setSelectedProducts(newProducts)
    updateSearchParams(selectedCategories, selectedBrands, newProducts)
  }

  const toggleCategoryExpansion = async (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    const isExpanding = !newExpanded.has(categoryId)

    if (isExpanding) {
      newExpanded.add(categoryId)
      // Fetch products if not already loaded
      if (!productsByCategory[categoryId]) {
        setLoadingProducts(prev => new Set(prev).add(categoryId))
        try {
          // Dynamic import or passed action needed? 
          // We need to import the action at the top of the file, assuming it's available.
          // Since this is a client component, we use the imported server action.
          const products = await getProductsByCategory(categoryId)
          setProductsByCategory(prev => ({ ...prev, [categoryId]: products }))
        } catch (error) {
          console.error("Failed to load products", error)
        } finally {
          setLoadingProducts(prev => {
            const next = new Set(prev)
            next.delete(categoryId)
            return next
          })
        }
      }
    } else {
      newExpanded.delete(categoryId)
    }
    setExpandedCategories(newExpanded)
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
    params.delete("page")
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
    params.delete("page")
    router.push(`/productos?${params.toString()}`)
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setSelectedFamilies([])
    setSelectedGroups([])
    setSelectedProducts([])
    setPriceRange([0, 1000]) // Reset price range state
    router.push("/productos") // Clear all search params
  }

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    selectedFamilies.length > 0 ||
    selectedGroups.length > 0 ||
    selectedProducts.length > 0

  return (
    <Box className="bg-white rounded-xl shadow-sm p-6" style={{ position: 'sticky', top: 96, maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
      <Flex justify="space-between" align="center" mb="md">
        <Text fw={700} size="lg">Filtros</Text>
        {hasActiveFilters && (
          <Button
            variant="subtle"
            size="compact-xs"
            color="red"
            onClick={clearFilters}
            rightSection={<IconX size={12} />}
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
              {/* Categories Filter - ScrollArea removed */}
              <Stack gap="sm" pt="xs">
                {categories.map((category) => {
                  const isSelected = selectedCategories.includes(String(category.id))
                  return (
                    <Box key={category.id}>
                      <Group wrap="nowrap" align="center"
                        onClick={() => handleCategoryClick(String(category.id))}
                        style={{ cursor: 'pointer' }}
                        className="hover:bg-gray-50 rounded-md p-1 -mx-1"
                      >
                        {/* Replaced Checkbox with Text */}
                        <Text
                          fw={isSelected ? 700 : 400}
                          c={isSelected ? "blue" : "dark"}
                          size="sm"
                          style={{ flex: 1 }}
                        >
                          {category.name}
                        </Text>
                        {/* Removed explicit +/- button since the whole row triggers it (mostly) 
                          Actually, keeps code cleaner to just let the row click do both. 
                      */}
                      </Group>

                      {expandedCategories.has(String(category.id)) && (
                        <Box pl="lg" mt="xs" mb="xs" style={{ borderLeft: '1px solid var(--mantine-color-gray-2)' }}>
                          {loadingProducts.has(String(category.id)) ? (
                            <Text size="xs" c="dimmed" fs="italic">Cargando productos...</Text>
                          ) : (
                            <Stack gap="xs">
                              {productsByCategory[String(category.id)]?.length > 0 ? (
                                productsByCategory[String(category.id)].map(product => {
                                  const isSelected = selectedProducts.includes(String(product.id))
                                  return (
                                    <Text
                                      key={product.id}
                                      size="sm"
                                      c={isSelected ? "blue" : "dimmed"}
                                      fw={isSelected ? 600 : 400}
                                      style={{ cursor: 'pointer' }}
                                      onClick={() => handleProductSelect(String(product.id))}
                                      className="hover:text-blue-600 transition-colors"
                                      pl={4}
                                    >
                                      {product.name}
                                    </Text>
                                  )
                                })
                              ) : (
                                <Text size="xs" c="dimmed">No hay productos disponibles.</Text>
                              )}
                            </Stack>
                          )}
                        </Box>
                      )}
                    </Box>
                  )
                })}
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          {/* Brands Filter */}
          <Accordion.Item value="brands" bg="transparent" style={{ border: 'none' }}>
            <Accordion.Control><Text fw={600}>Marcas</Text></Accordion.Control>
            <Accordion.Panel>
              {/* <ScrollArea h={200} type="always" offsetScrollbars> */}
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
              {/* </ScrollArea> */}
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
                  {/* <ScrollArea h={200} type="always" offsetScrollbars> */}
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
                  {/* </ScrollArea> */}
                </Accordion.Panel>
              </Accordion.Item>
            )}

            {/* Groups Filter */}
            {groups.length > 0 && (
              <Accordion.Item value="groups" bg="transparent" style={{ border: 'none' }}>
                <Accordion.Control><Text fw={600}>Grupos</Text></Accordion.Control>
                <Accordion.Panel>
                  {/* <ScrollArea h={200} type="always" offsetScrollbars> */}
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
                  {/* </ScrollArea> */}
                </Accordion.Panel>
              </Accordion.Item>
            )}
          </Accordion>
        </Stack>
      )}
    </Box>
  )
}
