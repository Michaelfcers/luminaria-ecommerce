import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-primary"></div>
              <span className="text-xl font-bold">Luminaria</span>
            </div>
            <p className="text-background/80 max-w-md">
              Especialistas en iluminación de lujo. Transformamos espacios con diseño minimalista y calidad excepcional
              desde 1995.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-background/80">
              <li>
                <Link href="/productos" className="hover:text-primary transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/sobre-nosotros" className="hover:text-primary transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-primary transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/garantia" className="hover:text-primary transition-colors">
                  Garantía
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-background/80">
              <li>+34 900 123 456</li>
              <li>info@luminaria.es</li>
              <li>Lun - Vie: 9:00 - 18:00</li>
              <li>Sáb: 10:00 - 14:00</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-12 pt-8 text-center text-background/60">
          <p>&copy; 2024 Luminaria. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
