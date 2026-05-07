"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function InviteForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("TUTOR");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/invitations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, role }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Error")
      toast.success("Invitación enviada");
      setEmail("");
    } catch (err: any) {
      toast.error(err?.message ?? "No se pudo enviar la invitación");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Input placeholder="correo@dominio.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-2xl border border-border bg-white/70 px-3 py-2 text-sm">
        <option value="ADMIN">Admin</option>
        <option value="TEACHER">Teacher</option>
        <option value="TUTOR">Tutor</option>
      </select>
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>{loading ? "Enviando…" : "Enviar invitación"}</Button>
      </div>
    </form>
  );
}
