"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { studentSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type StudentValues = z.infer<typeof studentSchema>;

export function StudentForm({
  mode,
  student,
  groups,
  tutors,
}: {
  mode: "create" | "update";
  student?: Partial<StudentValues> & { id?: string };
  groups: Array<{ id: string; name: string }>;
  tutors: Array<{ id: string; fullName: string }>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<StudentValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      fullName: student?.fullName ?? "",
      birthDate: student?.birthDate ?? "",
      tutorName: student?.tutorName ?? "",
      phone: student?.phone ?? "",
      email: student?.email ?? "",
      allergies: student?.allergies ?? "",
      injuries: student?.injuries ?? "",
      notes: student?.notes ?? "",
      groupId: student?.groupId ?? undefined,
      primaryTutorId: student?.primaryTutorId ?? undefined,
      status: student?.status ?? "ACTIVE",
    },
  });
  const groupId = useWatch({ control: form.control, name: "groupId" });
  const primaryTutorId = useWatch({ control: form.control, name: "primaryTutorId" });
  const statusValue = useWatch({ control: form.control, name: "status" });

  function onSubmit(values: StudentValues) {
    startTransition(async () => {
      const response = await fetch(mode === "create" ? "/api/students" : `/api/students/${student?.id}`, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error ?? "No pudimos guardar la alumna.");
        return;
      }

      toast.success(mode === "create" ? "Alumna creada." : "Alumna actualizada.");
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
        <Label>Fecha de nacimiento</Label>
        <Input type="date" {...form.register("birthDate")} />
      </div>
      <div className="space-y-2">
        <Label>Mamá / Tutor</Label>
        <Input {...form.register("tutorName")} />
      </div>
      <div className="space-y-2">
        <Label>Teléfono</Label>
        <Input {...form.register("phone")} />
      </div>
      <div className="space-y-2">
        <Label>Correo</Label>
        <Input type="email" {...form.register("email")} />
      </div>
      <div className="space-y-2">
        <Label>Grupo</Label>
        <Select value={groupId ?? ""} onValueChange={(value) => form.setValue("groupId", value || null)}>
          <SelectTrigger>
            <SelectValue placeholder="Asignar grupo" />
          </SelectTrigger>
          <SelectContent>
            {groups.map((group) => (
              <SelectItem key={group.id} value={group.id}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Vincular tutor con portal</Label>
        <Select value={primaryTutorId ?? ""} onValueChange={(value) => form.setValue("primaryTutorId", value || null)}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar tutor" />
          </SelectTrigger>
          <SelectContent>
            {tutors.map((tutor) => (
              <SelectItem key={tutor.id} value={tutor.id}>
                {tutor.fullName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Estatus</Label>
        <Select value={statusValue} onValueChange={(value) => form.setValue("status", value as "ACTIVE" | "INACTIVE")}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Activa</SelectItem>
            <SelectItem value="INACTIVE">Baja</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Alergias</Label>
        <Textarea {...form.register("allergies")} />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Lesiones</Label>
        <Textarea {...form.register("injuries")} />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Notas</Label>
        <Textarea {...form.register("notes")} />
      </div>
      <div className="md:col-span-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : mode === "create" ? "Crear alumna" : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
}
