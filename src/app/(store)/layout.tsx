import { Footer } from "@/components/layout/footer"

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fafafa" }}>
      <main>{children}</main>
      <Footer />
    </div>
  )
}
