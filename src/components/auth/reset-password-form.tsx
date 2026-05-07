"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function ResetPasswordForm({ token, email }: { token: string; email: string }) {
  const router = useRouter();
  const { register, handleSubmit } = useForm();

  async function onSubmit(data: any) {
    const res = await fetch(`/api/password-reset/reset`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, email, password: data.password }) });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json.error ?? "No se pudo restablecer la contraseña.");
      return;
    }
    toast.success("Contraseña restablecida.");
    router.push('/login');
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="font-heading text-2xl mb-4">Restablecer contraseña</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input placeholder="Nueva contraseña" type="password" {...register("password")} className="w-full" />
        <button className="btn">Restablecer</button>
      </form>
    </div>
  );
}
