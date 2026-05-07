"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function ChangePasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/settings/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword: current, newPassword: next }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Error");
      toast.success("Contraseña actualizada");
      setCurrent(""); setNext("");
    } catch (err: any) {
      toast.error(err?.message ?? "No se pudo cambiar la contraseña");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Input type="password" placeholder="Contraseña actual" value={current} onChange={(e) => setCurrent(e.target.value)} />
      <Input type="password" placeholder="Nueva contraseña" value={next} onChange={(e) => setNext(e.target.value)} />
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>{loading ? "Guardando…" : "Cambiar contraseña"}</Button>
      </div>
    </form>
  );
}
