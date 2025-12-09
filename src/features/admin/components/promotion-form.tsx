"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createPromotion, updatePromotion } from "@/lib/actions/promotions"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search, Image as ImageIcon, Calendar, Tag, Percent, DollarSign, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface ProductVariant {
    id: string
    name: string
    attributes: Record<string, any>
}

interface ProductMedia {
    url: string
    alt_text: string | null
}

interface Product {
    id: string
    name: string
    code?: string
    product_variants: ProductVariant[]
    product_media?: ProductMedia[]
}

interface PromotionFormProps {
    storeId: string
    products: Product[]
    initialData?: any
    initialProductIds?: string[]
    initialVariantIds?: string[]
    isEditing?: boolean
}

export function PromotionForm({
    storeId,
    products,
    initialData,
    initialProductIds = [],
    initialVariantIds = [],
    isEditing = false
}: PromotionFormProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        type: initialData?.type || "percentage",
        value: initialData?.value || "",
        starts_at: initialData?.starts_at ? new Date(initialData.starts_at).toISOString().slice(0, 16) : "",
        ends_at: initialData?.ends_at ? new Date(initialData.ends_at).toISOString().slice(0, 16) : "",
        status: initialData?.status || "scheduled",
    })

    const [promotionLevel, setPromotionLevel] = useState<"product" | "variant">(
        initialVariantIds.length > 0 ? "variant" : "product"
    )

    const [selectedProductIds, setSelectedProductIds] = useState<string[]>(initialProductIds)
    const [selectedVariantIds, setSelectedVariantIds] = useState<string[]>(initialVariantIds)

    // Filter products based on search term
    const filteredProducts = useMemo(() => {
        if (!searchTerm) return products
        const lowerTerm = searchTerm.toLowerCase()
        return products.filter(p =>
            p.name.toLowerCase().includes(lowerTerm) ||
            p.code?.toLowerCase().includes(lowerTerm)
        )
    }, [products, searchTerm])

    const handleProductToggle = (productId: string) => {
        setSelectedProductIds(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        )
    }

    const handleVariantToggle = (variantId: string) => {
        setSelectedVariantIds(prev =>
            prev.includes(variantId)
                ? prev.filter(id => id !== variantId)
                : [...prev, variantId]
        )
    }

    const handleSelectAll = () => {
        if (promotionLevel === "product") {
            const allIds = filteredProducts.map(p => p.id)
            const allSelected = allIds.every(id => selectedProductIds.includes(id))

            if (allSelected) {
                setSelectedProductIds(prev => prev.filter(id => !allIds.includes(id)))
            } else {
                setSelectedProductIds(prev => [...new Set([...prev, ...allIds])])
            }
        } else {
            const allVariantIds = filteredProducts.flatMap(p => p.product_variants.map(v => v.id))
            const allSelected = allVariantIds.every(id => selectedVariantIds.includes(id))

            if (allSelected) {
                setSelectedVariantIds(prev => prev.filter(id => !allVariantIds.includes(id)))
            } else {
                setSelectedVariantIds(prev => [...new Set([...prev, ...allVariantIds])])
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const payload = {
                ...formData,
                store_id: storeId,
                value: Number(formData.value),
            }

            let result
            if (isEditing && initialData?.id) {
                result = await updatePromotion(
                    initialData.id,
                    payload,
                    promotionLevel === "product" ? selectedProductIds : [],
                    promotionLevel === "variant" ? selectedVariantIds : []
                )
            } else {
                result = await createPromotion(
                    payload,
                    promotionLevel === "product" ? selectedProductIds : [],
                    promotionLevel === "variant" ? selectedVariantIds : []
                )
            }

            if (result.error) {
                toast({ title: "Error", description: result.error, variant: "destructive" })
            } else {
                toast({ title: "Éxito", description: `Promoción ${isEditing ? "actualizada" : "creada"} correctamente.` })
                router.push("/promotions")
                router.refresh()
            }
        } catch (error) {
            console.error(error)
            toast({ title: "Error", description: "Ocurrió un error inesperado.", variant: "destructive" })
        } finally {
            setIsLoading(false)
        }
    }

    const formatVariantName = (variant: ProductVariant) => {
        if (variant.name) return variant.name
        return Object.entries(variant.attributes)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-6xl mx-auto pb-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Basic Info */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-xl">Detalles de la Promoción</CardTitle>
                            <CardDescription>Configura los datos básicos</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium">Nombre</Label>
                                <div className="relative">
                                    <Tag className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        placeholder="Ej. Oferta de Verano"
                                        className="pl-9"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Tipo</Label>
                                    <div className="relative">
                                        <select
                                            id="type"
                                            className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        >
                                            <option value="percentage">Porcentaje (%)</option>
                                            <option value="amount">Monto Fijo ($)</option>
                                        </select>
                                        <div className="absolute right-3 top-2.5 pointer-events-none opacity-50">
                                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="value">Valor</Label>
                                    <Input
                                        id="value"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.value}
                                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Estado</Label>
                                <div className="relative">
                                    <select
                                        id="status"
                                        className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="scheduled">Programada</option>
                                        <option value="active">Activa</option>
                                        <option value="expired">Expirada</option>
                                    </select>
                                    <div className="absolute right-3 top-2.5 pointer-events-none opacity-50">
                                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-2 border-t">
                                <div className="space-y-2">
                                    <Label htmlFor="starts_at" className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" /> Inicio
                                    </Label>
                                    <Input
                                        id="starts_at"
                                        type="datetime-local"
                                        value={formData.starts_at}
                                        onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ends_at" className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" /> Fin
                                    </Label>
                                    <Input
                                        id="ends_at"
                                        type="datetime-local"
                                        value={formData.ends_at}
                                        onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Product Selection */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="h-full flex flex-col border-none shadow-md overflow-hidden">
                        <Tabs
                            value={promotionLevel}
                            onValueChange={(val) => setPromotionLevel(val as "product" | "variant")}
                            className="flex flex-col h-full"
                        >
                            <div className="p-6 pb-0 space-y-6 bg-muted/30">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-xl">Selección de Productos</CardTitle>
                                        <CardDescription className="mt-1">
                                            Elige los productos o versiones para aplicar el descuento
                                        </CardDescription>
                                    </div>
                                    <TabsList className="grid w-full sm:w-auto grid-cols-2">
                                        <TabsTrigger value="product">Productos</TabsTrigger>
                                        <TabsTrigger value="variant">Versiones</TabsTrigger>
                                    </TabsList>
                                </div>

                                <div className="flex items-center gap-3 pb-6">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Buscar productos..."
                                            className="pl-9 bg-background border-muted-foreground/20"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleSelectAll}
                                        className="whitespace-nowrap hover:bg-primary hover:text-primary-foreground transition-colors"
                                    >
                                        {promotionLevel === "product"
                                            ? (selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0 ? "Deseleccionar Todo" : "Seleccionar Todo")
                                            : (selectedVariantIds.length > 0 ? "Deseleccionar Todo" : "Seleccionar Todo")
                                        }
                                    </Button>
                                </div>
                            </div>

                            <div className="flex-1 bg-card relative">
                                <div className="absolute inset-0 overflow-y-auto">
                                    <TabsContent value="product" className="m-0 h-full">
                                        <div className="p-4 grid grid-cols-1 gap-3">
                                            {filteredProducts.map((product) => {
                                                const isSelected = selectedProductIds.includes(product.id);
                                                return (
                                                    <label
                                                        key={product.id}
                                                        className={cn(
                                                            "group flex items-center p-3 rounded-xl border transition-all duration-200 cursor-pointer",
                                                            isSelected
                                                                ? "bg-primary/5 border-primary/50 shadow-sm"
                                                                : "bg-background border-border hover:border-primary/30 hover:shadow-sm"
                                                        )}
                                                    >
                                                        <Checkbox
                                                            checked={isSelected}
                                                            onCheckedChange={() => handleProductToggle(product.id)}
                                                            className={cn(
                                                                "mr-4 transition-transform duration-200",
                                                                isSelected ? "scale-110" : "group-hover:scale-110"
                                                            )}
                                                        />
                                                        <div className="h-16 w-16 relative rounded-lg overflow-hidden bg-muted mr-4 flex-shrink-0 border shadow-sm group-hover:shadow transition-all">
                                                            {product.product_media?.[0]?.url ? (
                                                                <Image
                                                                    src={product.product_media[0].url}
                                                                    alt={product.product_media[0].alt_text || product.name}
                                                                    fill
                                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                                />
                                                            ) : (
                                                                <div className="flex items-center justify-center h-full w-full text-muted-foreground bg-muted/50">
                                                                    <ImageIcon className="h-6 w-6 opacity-50" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="font-semibold text-base truncate">
                                                                    {product.name}
                                                                </span>
                                                                {isSelected && <CheckCircle2 className="h-4 w-4 text-primary animate-in zoom-in" />}
                                                            </div>
                                                            {product.code && (
                                                                <Badge variant="secondary" className="text-xs font-normal text-muted-foreground bg-muted/50">
                                                                    {product.code}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                            {filteredProducts.length === 0 && (
                                                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                                                    <Search className="h-12 w-12 mb-4 opacity-20" />
                                                    <p>No se encontraron productos</p>
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="variant" className="m-0 h-full">
                                        <div className="p-4 space-y-4">
                                            {filteredProducts.map((product) => (
                                                <div key={product.id} className="rounded-xl border bg-card overflow-hidden shadow-sm">
                                                    <div className="p-3 bg-muted/30 border-b flex items-center gap-3">
                                                        <div className="h-10 w-10 relative rounded-md overflow-hidden bg-muted flex-shrink-0 border">
                                                            {product.product_media?.[0]?.url ? (
                                                                <Image
                                                                    src={product.product_media[0].url}
                                                                    alt={product.product_media[0].alt_text || product.name}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex items-center justify-center h-full w-full text-muted-foreground">
                                                                    <ImageIcon className="h-4 w-4" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-sm">{product.name}</h4>
                                                            {product.code && <span className="text-xs text-muted-foreground">{product.code}</span>}
                                                        </div>
                                                    </div>

                                                    <div className="p-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {product.product_variants?.map((variant) => {
                                                            const isSelected = selectedVariantIds.includes(variant.id);
                                                            return (
                                                                <label
                                                                    key={variant.id}
                                                                    className={cn(
                                                                        "flex items-center p-2 rounded-lg border transition-colors cursor-pointer",
                                                                        isSelected
                                                                            ? "bg-primary/5 border-primary/50"
                                                                            : "hover:bg-muted/50 border-transparent hover:border-border"
                                                                    )}
                                                                >
                                                                    <Checkbox
                                                                        checked={isSelected}
                                                                        onCheckedChange={() => handleVariantToggle(variant.id)}
                                                                        className="mr-3"
                                                                    />
                                                                    <span className="text-sm flex-1">
                                                                        {formatVariantName(variant)}
                                                                    </span>
                                                                </label>
                                                            );
                                                        })}
                                                        {(!product.product_variants || product.product_variants.length === 0) && (
                                                            <div className="col-span-full p-4 text-center text-xs text-muted-foreground italic">
                                                                Sin versiones disponibles
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            {filteredProducts.length === 0 && (
                                                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                                                    <Search className="h-12 w-12 mb-4 opacity-20" />
                                                    <p>No se encontraron productos</p>
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>
                                </div>
                            </div>

                            <div className="p-4 border-t bg-muted/10 text-xs text-muted-foreground flex justify-between items-center">
                                <span>
                                    {promotionLevel === "product"
                                        ? `${selectedProductIds.length} productos seleccionados`
                                        : `${selectedVariantIds.length} versiones seleccionadas`
                                    }
                                </span>
                            </div>
                        </Tabs>
                    </Card>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t z-50 flex justify-end gap-4 md:static md:bg-transparent md:border-none md:p-0 md:mt-8">
                <Button type="button" variant="outline" onClick={() => router.back()} className="h-11 px-8">
                    Cancelar
                </Button>
                <Button type="submit" disabled={isLoading} className="h-11 px-8 min-w-[180px] shadow-lg shadow-primary/20">
                    {isLoading ? "Guardando..." : (isEditing ? "Guardar Cambios" : "Crear Promoción")}
                </Button>
            </div>
        </form>
    )
}
