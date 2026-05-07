"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function AcceptInviteForm({ token, email }: { token: string; email: string }) {
  const router = useRouter();
  const { register, handleSubmit } = useForm();

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
    <div className="max-w-md mx-auto p-6">
      <h2 className="font-heading text-2xl mb-4">Aceptar invitación</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input placeholder="Nombre completo" defaultValue={email} {...register("fullName")} className="w-full" />
        <input placeholder="Contraseña" type="password" {...register("password")} className="w-full" />
        <button className="btn">Activar cuenta</button>
      </form>
    </div>
  );
}
