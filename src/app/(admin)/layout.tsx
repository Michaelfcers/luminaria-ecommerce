import { Footer } from "@/components/layout/footer"
import { AdminNavigation } from "@/components/layout/admin-navigation"
import { Box, Container } from "@mantine/core"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Box mih="100vh" bg="gray.0">
      <Container size="xl" py="md">
        <AdminNavigation />
        <Box component="main" py="md" style={{ minHeight: 'calc(100vh - 200px)' }}>
          {children}
        </Box>
        <Footer />
      </Container>
    </Box>
  )
}
