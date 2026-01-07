"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ToastAction } from "@/components/ui/toast"
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, Check } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  brand: string
  category: string
  rating: number
  reviews: number
  inStock: boolean
  description: string
}

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const { addItem } = useCart()
  const { toast } = useToast()
  const router = useRouter()

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = async () => {
    await addItem({ id: product.id, name: product.name, price: product.price, image: undefined }, quantity)
    setIsAdded(true)
    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Product Title and Brand */}
      <div>
        <Badge variant="outline" className="mb-2">
          {product.brand}
        </Badge>
        <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
        <p className="text-muted-foreground">{product.category}</p>
      </div>

      {/* Rating and Reviews */}
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                }`}
            />
          ))}
          <span className="ml-2 text-sm font-medium">{product.rating}</span>
        </div>
        <span className="text-sm text-muted-foreground">({product.reviews} reseñas)</span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-4">
        <span className="text-3xl font-bold text-primary">${product.price}</span>
        {product.originalPrice && (
          <>
            <span className="text-xl text-muted-foreground line-through">${product.originalPrice}</span>
            <Badge variant="destructive">-{discount}%</Badge>
          </>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`} />
        <span className={`text-sm font-medium ${product.inStock ? "text-green-600" : "text-red-600"}`}>
          {product.inStock ? "En stock" : "Agotado"}
        </span>
      </div>

      {/* Description */}
      <div>
        <h3 className="font-semibold mb-2">Descripción</h3>
        <p className="text-muted-foreground leading-relaxed">{product.description}</p>
      </div>

      <Separator />

      {/* Quantity and Add to Cart */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Cantidad:</label>
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              -
            </Button>
            <span className="px-4 py-2 text-sm font-medium">{quantity}</span>
            <Button variant="ghost" size="sm" onClick={() => setQuantity(quantity + 1)}>
              +
            </Button>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            size="lg"
            className="flex-1"
            disabled={!product.inStock || isAdded}
            onClick={handleAddToCart}
          >
            {isAdded ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Añadido
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Hacer Pedido
              </>
            )}
          </Button>
          <Button variant="outline" size="lg" onClick={() => setIsFavorite(!isFavorite)}>
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button variant="outline" size="lg">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Benefits */}
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-3">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-sm">Envío gratuito en pedidos superiores a $100</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm">Garantía de 3 años incluida</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="h-5 w-5 text-primary" />
              <span className="text-sm">Devolución gratuita en 30 días</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
