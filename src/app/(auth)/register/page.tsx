"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { registerUser } from "@/lib/actions/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
    Center
} from "@mantine/core";
import { notifications } from "@mantine/notifications";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            loading={pending}
            fullWidth
            size="lg"
            radius="md"
            color="dark"
        >
            {pending ? "Creando cuenta..." : "Registrarse"}
        </Button>
    );
}

export default function RegisterPage() {
    const [state, formAction] = useFormState(registerUser, null);
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        if (state?.error) {
            notifications.show({
                title: "Error al registrarse",
                message: state.error,
                color: "red",
            });
        } else if (state?.success) {
            notifications.show({
                title: "Cuenta creada",
                message: "Revisa tu correo para confirmar tu cuenta.",
                color: "green",
            });
            router.push("/login");
        }
    }, [state, router]);

    const handleSubmit = (formData: FormData) => {
        if (password !== confirmPassword) {
            notifications.show({
                title: "Error",
                message: "Las contraseñas no coinciden.",
                color: "red",
            });
            return;
        }
        formAction(formData);
    };

    return (
        <Card radius="xl" p="xl" withBorder shadow="xl" maw={450} w="100%" bg="white">
            <Stack gap="xs" align="center" mb="xl">
                <Title order={2} fw={300} style={{ letterSpacing: '-0.5px' }}>
                    Crear Cuenta
                </Title>
                <Text c="dimmed" size="lg">
                    Únete a nosotros para empezar
                </Text>
            </Stack>

            <form action={handleSubmit}>
                <Stack gap="md">
                    <TextInput
                        name="fullName"
                        label="Nombre Completo"
                        placeholder="Juan Pérez"
                        required
                        radius="md"
                        size="md"
                    />
                    <TextInput
                        name="email"
                        label="Correo Electrónico"
                        placeholder="nombre@ejemplo.com"
                        required
                        type="email"
                        radius="md"
                        size="md"
                    />
                    <PasswordInput
                        name="password"
                        label="Contraseña"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        radius="md"
                        size="md"
                    />
                    <PasswordInput
                        name="confirmPassword"
                        label="Confirmar Contraseña"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        radius="md"
                        size="md"
                    />

                    <SubmitButton />

                    <Divider label="O regístrate con" labelPosition="center" my="sm" />

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
                    ¿Ya tienes una cuenta?{" "}
                    <Anchor component={Link} href="/login" fw={700} c="dark">
                        Inicia Sesión
                    </Anchor>
                </Text>
            </Center>
        </Card>
    );
}
