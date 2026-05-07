"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

function statusForInvite(invite: any) {
  if (invite.used) return { label: "Accepted", variant: "success" } as any;
  if (new Date(invite.expiresAt) < new Date()) return { label: "Expired", variant: "warning" } as any;
  return { label: "Pending", variant: "default" } as any;
}

export function UsersTable({ users, invites }: { users: any[]; invites: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function resend(id: string) {
    setLoadingId(id);
    try {
      const res = await fetch("/api/invitations/resend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Error");
      toast.success("Invitación reenviada");
    } catch (err: any) {
      toast.error(err?.message ?? "No se pudo reenviar");
    } finally {
      setLoadingId(null);
    }
  }

  async function revoke(id: string) {
    setLoadingId(id);
    try {
      const res = await fetch("/api/invitations/revoke", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Error");
      toast.success("Invitación revocada");
    } catch (err: any) {
      toast.error(err?.message ?? "No se pudo revocar");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">Usuarios</h4>

        {/* Desktop / wide: horizontally scrollable table */}
        <div className="hidden md:block overflow-x-auto rounded-md border">
          <table className="min-w-full text-sm table-auto">
            <thead className="bg-muted/30 text-left text-xs uppercase">
              <tr>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Nombre</th>
                <th className="px-3 py-2">Rol</th>
                <th className="px-3 py-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="px-3 py-2 align-top max-w-[20rem] break-words whitespace-normal">{u.email}</td>
                  <td className="px-3 py-2 align-top max-w-[16rem] break-words whitespace-normal">{u.fullName}</td>
                  <td className="px-3 py-2 align-top">{u.role}</td>
                  <td className="px-3 py-2 align-top">{u.isActive ? <Badge variant="success">Active</Badge> : <Badge variant="danger">Disabled</Badge>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: stacked cards */}
        <div className="md:hidden space-y-2">
          {users.map((u) => (
            <div key={u.id} className="rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium truncate">{u.email}</div>
                <div>{u.isActive ? <Badge variant="success">Active</Badge> : <Badge variant="danger">Disabled</Badge>}</div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{u.fullName} • {u.role}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Invitaciones</h4>

        {/* Desktop / wide: table with actions */}
        <div className="hidden md:block overflow-x-auto rounded-md border">
          <table className="min-w-full text-sm table-auto">
            <thead className="bg-muted/30 text-left text-xs uppercase">
              <tr>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Rol</th>
                <th className="px-3 py-2">Expira</th>
                <th className="px-3 py-2">Estado</th>
                <th className="px-3 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {invites.map((inv) => {
                const s = statusForInvite(inv);
                return (
                  <tr key={inv.id} className="border-t">
                    <td className="px-3 py-2 align-top max-w-[20rem] break-words whitespace-normal">{inv.email}</td>
                    <td className="px-3 py-2 align-top">{inv.role}</td>
                    <td className="px-3 py-2 align-top">{new Date(inv.expiresAt).toLocaleString()}</td>
                    <td className="px-3 py-2 align-top"><Badge variant={s.variant as any}>{s.label}</Badge></td>
                    <td className="px-3 py-2 align-top">
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => resend(inv.id)} disabled={loadingId === inv.id}>Reenviar</Button>
                        <Button size="sm" variant="danger" onClick={() => revoke(inv.id)} disabled={loadingId === inv.id}>Revocar</Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile: stacked invite cards */}
        <div className="md:hidden space-y-2">
          {invites.map((inv) => {
            const s = statusForInvite(inv);
            return (
              <div key={inv.id} className="rounded-lg border p-3">
                <div className="flex items-start justify-between">
                  <div className="text-sm font-medium break-words">{inv.email}</div>
                  <div className="ml-2"><Badge variant={s.variant as any}>{s.label}</Badge></div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{inv.role} • Expira: {new Date(inv.expiresAt).toLocaleString()}</div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" onClick={() => resend(inv.id)} disabled={loadingId === inv.id}>Reenviar</Button>
                  <Button size="sm" variant="danger" onClick={() => revoke(inv.id)} disabled={loadingId === inv.id}>Revocar</Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
