"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Card,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Divider,
  Stack,
  Anchor,
  Center,
  Group,
  Box
} from "@mantine/core";
import { createClient } from "@/lib/supabase/client";
import { notifications } from "@mantine/notifications";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error logging in:", error.message);
      notifications.show({
        title: "Error al iniciar sesión",
        message: error.message,
        color: "red",
      });
      setLoading(false);
    } else {
      notifications.show({
        title: "Bienvenido",
        message: "Has iniciado sesión correctamente.",
        color: "green",
      });
      router.push("/");
      router.refresh();
    }
  };

  return (
    <Card radius="xl" p="xl" withBorder shadow="xl" maw={450} w="100%" bg="white">
      <Stack gap="xs" align="center" mb="xl">
        <Title order={2} fw={300} style={{ letterSpacing: '-0.5px' }}>
          Bienvenido de nuevo
        </Title>
        <Text c="dimmed" size="lg">
          Ingresa a tu cuenta para continuar
        </Text>
      </Stack>

      <form onSubmit={handleLogin}>
        <Stack gap="md">
          <TextInput
            label="Correo Electrónico"
            placeholder="nombre@ejemplo.com"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            radius="md"
            size="md"
          />

          <Box>
            <Group justify="space-between" mb={4}>
              <Text component="label" size="sm" fw={500} htmlFor="password">Contraseña</Text>
              <Anchor component={Link} href="#" size="sm" c="dark" underline="hover">
                ¿Olvidaste tu contraseña?
              </Anchor>
            </Group>
            <PasswordInput
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              radius="md"
              size="md"
            />
          </Box>

          <Button
            type="submit"
            loading={loading}
            fullWidth
            size="lg"
            radius="md"
            color="dark"
          >
            Iniciar Sesión
          </Button>

          <Divider label="O continúa con" labelPosition="center" my="sm" />

          <Button
            fullWidth
            size="lg"
            radius="md"
            variant="default"
            type="button"
            leftSection={
              <svg style={{ width: 16, height: 16 }} aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
              </svg>
            }
          >
            Google
          </Button>
        </Stack>
      </form>

      <Center mt="xl">
        <Text size="sm" c="dimmed">
          ¿No tienes una cuenta?{" "}
          <Anchor component={Link} href="/register" fw={700} c="dark">
            Regístrate
          </Anchor>
        </Text>
      </Center>
    </Card>
  );
}
