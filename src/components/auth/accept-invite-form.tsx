"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthCard } from "@/components/auth/auth-card";

export function AcceptInviteForm({ token, email }: { token: string; email: string }) {
  const router = useRouter();
  const { register, handleSubmit } = useForm();
  const [validating, setValidating] = useState(true);
  const [valid, setValid] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function validate() {
      setValidating(true);
      const res = await fetch(`/api/invitations/validate?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`);
      const json = await res.json();
      if (!mounted) return;
      if (!res.ok) {
        setValid(false);
        setError(json.error ?? json ?? "Enlace inválido o expirado.");
      } else {
        setValid(true);
      }
      setValidating(false);
    }
    if (token && email) validate();
    return () => {
      mounted = false;
    };
  }, [token, email]);

  async function onSubmit(data: any) {
    const res = await fetch(`/api/invitations/accept`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, email, password: data.password, fullName: data.fullName }) });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json.error ?? "No se pudo aceptar la invitación.");
      return;
    }
    toast.success("Cuenta activada.");
    router.push("/login");
  }

  return (
    <AuthCard title="Aceptar invitación" subtitle="Activa tu cuenta en Moov">
      {validating ? (
        <p className="text-muted-foreground">Validando enlace…</p>
      ) : valid ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input {...register("fullName")} defaultValue={email} placeholder="Nombre completo" />
          <Input {...register("password")} type="password" placeholder="Contraseña" />
          <div className="flex justify-end">
            <Button type="submit">Activar cuenta</Button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{error ?? "El enlace es inválido o expiró."}</p>
          <div className="flex gap-2">
            <Button asChild>
              <a href="/forgot-password">Solicitar nuevo enlace</a>
            </Button>
            <Button variant="secondary" onClick={() => router.push("/login")}>Volver al login</Button>
          </div>
        </div>
      )}
    </AuthCard>
  );
}
