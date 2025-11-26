import { Footer } from "@/components/layout/footer"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>
      <Footer />
    </div>
  )
}
