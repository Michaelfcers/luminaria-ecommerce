import Link from "next/link"

import { LayoutDashboard, Package, ShoppingBag } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { UserNav } from "./user-nav"
import { CartIcon } from "./cart-icon"
import { ProductsDropdown } from "./products-dropdown" // Import the new component
import { SearchDialog } from "./search-dialog"

type Category = {
  id: string
  name: string
  slug: string
  parent_id: string | null
}

export async function Navigation() {
  const supabase = await createClient()

  const { data: categoriesData, error } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id")
    .is("deleted_at", null)

  if (error) {
    console.error("Error fetching categories:", error)
  }

  const allCategories = (categoriesData as Category[]) || []

  const mainCategories = allCategories.filter((cat) => cat.parent_id === null)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary"></div>
            <span className="text-xl font-bold tracking-tight">Luminaria</span>
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden md:flex">
            <ul className="flex flex-1 list-none items-center justify-center gap-1">
              <li>
                <Link href="/" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                  Inicio
                </Link>
              </li>

              <li>
                <ProductsDropdown mainCategories={mainCategories} />
              </li>

              <li>
                <Link href="/sobre-nosotros" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                  Sobre Nosotros
                </Link>
              </li>

              <li>
                <Link href="/ofertas" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                  Ofertas
                </Link>
              </li>


            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <SearchDialog />
            <UserNav />
            <CartIcon />
          </div>
        </div>
      </div>
    </header>
  )
}
