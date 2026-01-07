"use client"

import { useEffect, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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
    <div className="bg-white rounded-3xl elegant-shadow p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold tracking-tight">Filtros</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 px-2 text-muted-foreground hover:text-destructive transition-colors"
          >
            <span className="text-xs mr-1">Borrar</span>
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-2">General</h3>
        <Accordion
          type="multiple"
          defaultValue={["categories", "brands"]}
          className="w-full space-y-4"
        >
          {/* Categories Filter */}
          <AccordionItem value="categories" className="border-none">
            <AccordionTrigger className="py-2 hover:no-underline">
              <span className="font-semibold text-base">Categorías</span>
            </AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-3 pt-1">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-3 group">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <label
                        htmlFor={`category-${category.id}`}
                        className="text-sm text-muted-foreground group-hover:text-foreground transition-colors flex-1 cursor-pointer flex justify-between items-center"
                      >
                        <span>{category.name}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>

          {/* Brands Filter */}
          <AccordionItem value="brands" className="border-none">
            <AccordionTrigger className="py-2 hover:no-underline">
              <span className="font-semibold text-base">Marcas</span>
            </AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-3 pt-1">
                  {brands.map((brand) => (
                    <div key={brand.id} className="flex items-center space-x-3 group">
                      <Checkbox
                        id={`brand-${brand.id}`}
                        checked={selectedBrands.includes(brand.id)}
                        onCheckedChange={(checked) => handleBrandChange(brand.id, checked as boolean)}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <label
                        htmlFor={`brand-${brand.id}`}
                        className="text-sm text-muted-foreground group-hover:text-foreground transition-colors flex-1 cursor-pointer flex justify-between items-center"
                      >
                        <span>{brand.name}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {(families.length > 0 || groups.length > 0) && (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-2">Producto</h3>
          <Accordion
            type="multiple"
            defaultValue={["families", "groups"]}
            className="w-full space-y-4"
          >
            {/* Families Filter */}
            {families.length > 0 && (
              <AccordionItem value="families" className="border-none">
                <AccordionTrigger className="py-2 hover:no-underline">
                  <span className="font-semibold text-base">Familias</span>
                </AccordionTrigger>
                <AccordionContent>
                  <ScrollArea className="h-[200px] pr-4">
                    <div className="space-y-3 pt-1">
                      {families.map((family) => (
                        <div key={family.id} className="flex items-center space-x-3 group">
                          <Checkbox
                            id={`family-${family.id}`}
                            checked={selectedFamilies.includes(family.id)}
                            onCheckedChange={(checked) =>
                              handleFamilyChange(family.id, checked as boolean)
                            }
                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <label
                            htmlFor={`family-${family.id}`}
                            className="text-sm text-muted-foreground group-hover:text-foreground transition-colors flex-1 cursor-pointer flex justify-between items-center"
                          >
                            <span>{family.name}</span>
                            {family.count > 0 && (
                              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                                {family.count}
                              </span>
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Groups Filter */}
            {groups.length > 0 && (
              <AccordionItem value="groups" className="border-none">
                <AccordionTrigger className="py-2 hover:no-underline">
                  <span className="font-semibold text-base">Grupos</span>
                </AccordionTrigger>
                <AccordionContent>
                  <ScrollArea className="h-[200px] pr-4">
                    <div className="space-y-3 pt-1">
                      {groups.map((group) => (
                        <div key={group.id} className="flex items-center space-x-3 group">
                          <Checkbox
                            id={`group-${group.id}`}
                            checked={selectedGroups.includes(group.id)}
                            onCheckedChange={(checked) =>
                              handleGroupChange(group.id, checked as boolean)
                            }
                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <label
                            htmlFor={`group-${group.id}`}
                            className="text-sm text-muted-foreground group-hover:text-foreground transition-colors flex-1 cursor-pointer flex justify-between items-center"
                          >
                            <span>{group.name}</span>
                            {group.count > 0 && (
                              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                                {group.count}
                              </span>
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      )}
    </div>
  )
}
