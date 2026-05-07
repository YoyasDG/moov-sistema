"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function TutorActions({ tutorId }: { tutorId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function togglePortal(enabled: boolean) {
    startTransition(async () => {
      const res = await fetch(`/api/tutors/${tutorId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ portalEnabled: enabled }) });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "No se pudo actualizar.");
        return;
      }
      toast.success("Actualizado");
      router.refresh();
    });
  }

  return (
    <div className="flex gap-2">
      <Button onClick={() => togglePortal(true)} disabled={isPending}>Habilitar portal</Button>
      <Button variant="secondary" onClick={() => togglePortal(false)} disabled={isPending}>Deshabilitar portal</Button>
    </div>
  );
}

export function UnlinkStudentButton({ studentId }: { studentId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function unlink() {
    startTransition(async () => {
      const res = await fetch(`/api/students/${studentId}/unlink`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "No se pudo desvincular.");
        return;
      }
      toast.success("Desvinculado");
      router.refresh();
    });
  }

  return <Button variant="ghost" size="sm" onClick={unlink} disabled={isPending}>Desvincular</Button>;
}
