"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const { register, handleSubmit } = useForm();

  async function onSubmit(data: any) {
    await fetch(`/api/password-reset/request`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: data.email }) });
    toast.success("Si existe una cuenta, te hemos enviado un enlace para restablecer la contraseña.");
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="font-heading text-2xl mb-4">Recuperar contraseña</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input placeholder="Correo" {...register("email")} className="w-full" />
        <button className="btn">Enviar enlace</button>
      </form>
    </div>
  );
}
