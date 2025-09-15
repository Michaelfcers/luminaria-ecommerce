"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function ProductFilters() {
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])

  const categories = [
    { id: "luminarias", name: "Luminarias", count: 45 },
    { id: "lamparas-techo", name: "Lámparas de Techo", count: 32 },
    { id: "lamparas-mesa", name: "Lámparas de Mesa", count: 28 },
    { id: "lamparas-pie", name: "Lámparas de Pie", count: 18 },
    { id: "apliques", name: "Apliques de Pared", count: 24 },
    { id: "accesorios", name: "Accesorios Eléctricos", count: 36 },
  ]

  const brands = [
    { id: "philips", name: "Philips", count: 42 },
    { id: "osram", name: "Osram", count: 38 },
    { id: "artemide", name: "Artemide", count: 15 },
    { id: "flos", name: "Flos", count: 12 },
    { id: "louis-poulsen", name: "Louis Poulsen", count: 8 },
    { id: "foscarini", name: "Foscarini", count: 6 },
  ]

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId])
    } else {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId))
    }
  }

  const handleBrandChange = (brandId: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brandId])
    } else {
      setSelectedBrands(selectedBrands.filter((id) => id !== brandId))
    }
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setPriceRange([0, 1000])
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
                    id={category.id}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                  />
                  <label
                    htmlFor={category.id}
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
                    id={brand.id}
                    checked={selectedBrands.includes(brand.id)}
                    onCheckedChange={(checked) => handleBrandChange(brand.id, checked as boolean)}
                  />
                  <label
                    htmlFor={brand.id}
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
