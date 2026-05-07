"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const tutorSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  portalEnabled: z.boolean().optional(),
});

type TutorValues = z.infer<typeof tutorSchema>;

export function TutorForm({ mode = "create", tutor }: { mode?: "create" | "update"; tutor?: Partial<TutorValues> & { id?: string } }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<TutorValues>({
    resolver: zodResolver(tutorSchema),
    defaultValues: {
      fullName: tutor?.fullName ?? "",
      email: tutor?.email ?? "",
      phone: tutor?.phone ?? "",
      portalEnabled: tutor?.portalEnabled ?? true,
    },
  });

  function onSubmit(values: TutorValues) {
    startTransition(async () => {
      const url = mode === "create" ? "/api/tutors" : `/api/tutors/${tutor?.id}`;
      const method = mode === "create" ? "POST" : "PUT";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "No pudimos guardar el tutor.");
        return;
      }
      toast.success(mode === "create" ? "Tutor creado." : "Tutor actualizado.");
      router.refresh();
      if (mode === "create") form.reset();
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label>Nombre completo</Label>
        <Input {...form.register("fullName")} />
      </div>
      <div className="space-y-2">
        <Label>Correo</Label>
        <Input type="email" {...form.register("email")} />
      </div>
      <div className="space-y-2">
        <Label>Teléfono</Label>
        <Input {...form.register("phone")} />
      </div>
      <div className="space-y-2 flex items-center gap-3">
        <Label>Portal habilitado</Label>
        <Switch {...form.register("portalEnabled")} defaultChecked={form.getValues("portalEnabled")} />
      </div>
      <div className="md:col-span-2">
        <Button type="submit" disabled={isPending}>{isPending ? "Guardando..." : mode === "create" ? "Crear tutor" : "Guardar cambios"}</Button>
      </div>
    </form>
  );
}
