"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FileText } from "lucide-react"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { AddToCartButton } from "./add-to-cart-button"
// A helper function to format attributes for display
const formatAttributes = (attributes: Record<string, any>): string => {
  return Object.entries(attributes)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ")
}

export function ProductDetailClient({
  product,
  technicalSheet,
}: {
  product: any
  technicalSheet?: string
}) {
  // Initialize with the first variant, or null if there are no variants
  const [selectedVariant, setSelectedVariant] = useState(
    product.product_variants && product.product_variants.length > 0
      ? product.product_variants[0]
      : null
  )

  const handleVariantChange = (variantId: string) => {
    const newVariant = product.product_variants.find(
      (v: any) => v.id === variantId
    )
    if (newVariant) {
      setSelectedVariant(newVariant)
    }
  }

  // Find the primary image for the main product
  const primaryProductImage = "/products/luminaria-plafon.webp"

  return (
    <div className="space-y-8">
      {/* Main Product "Group" Header */}
      <div className="pb-4 border-b">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {product.name}
        </h1>
        {product.description && (
          <p className="mt-2 text-lg text-muted-foreground">
            {product.description}
          </p>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left side: Image & Attributes */}
        <div className="space-y-6">
          <Card className="overflow-hidden w-full">
            <CardContent className="p-0">
              <Image
                src={primaryProductImage}
                alt={product.name}
                width={800}
                height={800}
                className="object-cover w-full h-full"
                priority
              />
            </CardContent>
          </Card>

          {product.attributes && Object.keys(product.attributes).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Atributos Generales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(product.attributes).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="font-medium text-muted-foreground">{key}:</span>
                    <span>{String(value)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right side: Variant Selection and Details */}
        <div className="space-y-6">
          {selectedVariant && (
            <h2 className="text-3xl font-bold">{selectedVariant.name || formatAttributes(selectedVariant.attributes)}</h2>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Selecciona una Versión</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                onValueChange={handleVariantChange}
                defaultValue={selectedVariant?.id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Elige una versión..." />
                </SelectTrigger>
                <SelectContent>
                  {product.product_variants?.map((variant: any) => (
                    <SelectItem key={variant.id} value={variant.id}>
                      {variant.name || formatAttributes(variant.attributes)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {technicalSheet ? (
                <Button asChild className="w-full" size="lg">
                  <Link href={technicalSheet} target="_blank" rel="noopener noreferrer">
                    <FileText className="mr-2 h-4 w-4" />
                    Descargar ficha tecnica
                  </Link>
                </Button>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span tabIndex={0} className="w-full inline-block">
                        <Button className="w-full" size="lg" disabled>
                          <FileText className="mr-2 h-4 w-4" />
                          Descargar ficha tecnica
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ficha técnica no disponible</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <AddToCartButton variant={selectedVariant} product={product} />
            </CardContent>
          </Card>

          {selectedVariant && (
            <Card>
              <CardHeader>
                <CardTitle>Detalles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">Precio:</h3>
                  <p className="text-2xl font-bold text-primary">
                    ${selectedVariant.list_price_usd}
                  </p>
                </div>
                
                <Separator />
                <div>
                  <h3 className="font-semibold">Código:</h3>
                  <p>{selectedVariant.code}</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold">Atributos:</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Object.entries(selectedVariant.attributes).map(
                      ([key, value]) => (
                        <Badge key={key} variant="secondary">
                          <span className="font-normal mr-1">{key}:</span> {String(value)}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold">Disponibilidad:</h3>
                  <Badge
                    variant={
                      selectedVariant.sourcing_status === "active"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {selectedVariant.sourcing_status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
