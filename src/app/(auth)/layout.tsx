import { Footer } from "@/components/layout/footer"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <main>{children}</main>
      <Footer />
    </div>
  )
}
