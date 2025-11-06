"use client"
import Link from "next/link"
import { Search, ShoppingBag, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

const categories = {
  luminarias: {
    title: "Luminarias",
    items: [
      { name: "Lámparas de Techo", href: "/productos?categoria=lamparas-techo" },
      { name: "Lámparas Colgantes", href: "/productos?categoria=lamparas-colgantes" },
      { name: "Plafones", href: "/productos?categoria=plafones" },
      { name: "Spots Empotrados", href: "/productos?categoria=spots" },
    ],
  },
  lamparas: {
    title: "Lámparas",
    items: [
      { name: "Lámparas de Mesa", href: "/productos?categoria=lamparas-mesa" },
      { name: "Lámparas de Pie", href: "/productos?categoria=lamparas-pie" },
      { name: "Apliques de Pared", href: "/productos?categoria=apliques" },
      { name: "Lámparas Decorativas", href: "/productos?categoria=decorativas" },
    ],
  },
  accesorios: {
    title: "Accesorios Eléctricos",
    items: [
      { name: "Interruptores", href: "/productos?categoria=interruptores" },
      { name: "Enchufes", href: "/productos?categoria=enchufes" },
      { name: "Reguladores", href: "/productos?categoria=reguladores" },
      { name: "Cables y Conectores", href: "/productos?categoria=cables" },
    ],
  },
}

export function Navigation() {
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
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    Inicio
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              {Object.entries(categories).map(([key, category]) => (
                <NavigationMenuItem key={key}>
                  <NavigationMenuTrigger className="text-sm font-medium">{category.title}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4">
                      {category.items.map((item) => (
                        <NavigationMenuLink key={item.name} asChild>
                          <Link
                            href={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{item.name}</div>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}

              <NavigationMenuItem>
                <Link href="/sobre-nosotros" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    Sobre Nosotros
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Search className="h-4 w-4" />
            </Button>
            <Link href="/login">
              <Button variant="ghost" size="icon">
                <User className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/carrito">
              <Button variant="ghost" size="icon">
                <ShoppingBag className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
               <Button variant="ghost" size="icon">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
               </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
