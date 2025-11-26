"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error logging in:", error.message);
      toast({
        title: "Error al iniciar sesión",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    } else {
      toast({
        title: "Bienvenido",
        description: "Has iniciado sesión correctamente.",
      });
      router.push("/");
      router.refresh();
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md border-none shadow-2xl rounded-3xl bg-white">
      <CardHeader className="space-y-1 text-center pb-8 pt-10">
        <CardTitle className="text-3xl font-light tracking-tight text-neutral-900">
          Bienvenido de nuevo
        </CardTitle>
        <CardDescription className="text-neutral-500 text-lg">
          Ingresa a tu cuenta para continuar
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-10">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-neutral-600 font-medium">
              Correo Electrónico
            </Label>
            <Input
              id="email"
              placeholder="nombre@ejemplo.com"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-neutral-50 border-neutral-200 focus:ring-neutral-900 focus:border-neutral-900 rounded-xl transition-all"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-neutral-600 font-medium">
                Contraseña
              </Label>
              <Link
                className="text-sm font-medium text-neutral-900 hover:underline"
                href="#"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <Input
              id="password"
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 bg-neutral-50 border-neutral-200 focus:ring-neutral-900 focus:border-neutral-900 rounded-xl transition-all"
            />
          </div>
          <Button
            className="w-full h-12 text-lg font-medium bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl transition-all shadow-lg hover:shadow-xl"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Iniciando...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-neutral-500">
                O continúa con
              </span>
            </div>
          </div>

          <Button
            className="w-full h-12 font-medium border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900 rounded-xl transition-all"
            variant="outline"
            type="button"
          >
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            Google
          </Button>
        </form>
        <div className="mt-8 text-center text-sm text-neutral-600">
          ¿No tienes una cuenta?{" "}
          <Link className="font-bold text-neutral-900 hover:underline" href="/register">
            Regístrate
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}