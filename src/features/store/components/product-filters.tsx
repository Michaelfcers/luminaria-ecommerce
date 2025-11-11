"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useRouter, useSearchParams } from "next/navigation"

// Define types for the filter items
type FilterItem = {
  id: string;
  name: string;
  count: number;
};

export function ProductFilters({ categories, brands }: { categories: FilterItem[]; brands: FilterItem[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])

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

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setPriceRange([0, 1000]) // Reset price range state
    router.push("/productos") // Clear all search params
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Categories Filter */}
          <div>
            <h3 className="font-semibold mb-3">Categorías</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`} // Use a unique ID for checkbox
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
                  >
                    {category.name}
                  </label>
                  <span className="text-xs text-muted-foreground">({category.count})</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Brands Filter */}
          <div>
            <h3 className="font-semibold mb-3">Marcas</h3>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand.id}`} // Use a unique ID for checkbox
                    checked={selectedBrands.includes(brand.id)}
                    onCheckedChange={(checked) => handleBrandChange(brand.id, checked as boolean)}
                  />
                  <label
                    htmlFor={`brand-${brand.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
                  >
                    {brand.name}
                  </label>
                  <span className="text-xs text-muted-foreground">({brand.count})</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Price Range Filter */}
          <div>
            <h3 className="font-semibold mb-3">Rango de Precio</h3>
            <div className="space-y-4">
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={1000}
                min={0}
                step={10}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>€{priceRange[0]}</span>
                <span>€{priceRange[1]}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Clear Filters Button */}
          <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
            Limpiar Filtros
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
