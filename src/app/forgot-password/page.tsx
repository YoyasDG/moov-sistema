"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/auth/auth-card";

export default function ForgotPasswordPage() {
  const { register, handleSubmit } = useForm();
  const [sent, setSent] = useState(false);

  async function onSubmit(data: any) {
    await fetch(`/api/password-reset/request`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: data.email }) });
    setSent(true);
    toast.success("Si existe una cuenta, te hemos enviado un enlace para restablecer la contraseña.");
  }

  return (
    <AuthCard title="Recuperar contraseña" subtitle="Recibe un enlace para restablecer tu contraseña">
      {sent ? (
        <div className="space-y-3">
          <p className="text-muted-foreground">Si existe una cuenta asociada, recibirás un correo con instrucciones.</p>
          <div className="flex justify-end">
            <Button asChild>
              <a href="/login">Volver al inicio</a>
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input {...register("email")} placeholder="Correo electrónico" />
          <div className="flex justify-end">
            <Button type="submit">Enviar enlace</Button>
          </div>
        </form>
      )}
    </AuthCard>
  );
}
