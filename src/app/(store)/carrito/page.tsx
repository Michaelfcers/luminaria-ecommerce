"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart"
import { Loader2 } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, isLoading } = useCart()

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Tu Carrito</h1>

      {items.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">Tu carrito está vacío.</div>
      ) : (
        <div className="grid md:grid-cols-[2fr_1fr] gap-8">
          <div className="space-y-6">
            {items.map((item) => (
              <Card key={item.cartItemId}>
                <CardContent className="p-6 flex items-center gap-6">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} width={100} height={100} className="rounded-md" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      value={String(item.quantity)}
                      min={1}
                      className="w-20"
                      onChange={(e) => item.cartItemId && updateQuantity(item.cartItemId, Math.max(1, Number(e.target.value) || 1))}
                    />
                    <span className="font-semibold text-lg">€{item.price.toFixed(2)}</span>
                    <Button variant="ghost" size="icon" onClick={() => item.cartItemId && removeItem(item.cartItemId)}>
                      <Trash2Icon className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>€0.00</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                <Button className="w-full">Proceder al Pago</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function Trash2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}