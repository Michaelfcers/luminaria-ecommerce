import { Footer } from "@/components/layout/footer"
import { Box, Flex } from "@mantine/core"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Flex direction="column" mih="100vh" bg="gray.0">
      <Flex style={{ flex: 1 }} align="center" justify="center" p="md">
        {children}
      </Flex>
      <Footer />
    </Flex>
  )
}
