"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { groupSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type GroupValues = z.infer<typeof groupSchema>;

export function GroupForm({
  teachers,
}: {
  teachers: Array<{ id: string; fullName: string }>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<GroupValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      schedule: "",
      monthlyFee: 1800,
      discountedMonthlyFee: 1600,
      capacity: 12,
      description: "",
      teacherId: undefined,
    },
  });
  const teacherId = useWatch({ control: form.control, name: "teacherId" });

  function onSubmit(values: GroupValues) {
    startTransition(async () => {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error ?? "No pudimos crear el grupo.");
        return;
      }

      toast.success("Grupo creado.");
      form.reset();
      router.refresh();
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label>Nombre</Label>
        <Input {...form.register("name")} />
      </div>
      <div className="space-y-2">
        <Label>Horario</Label>
        <Input {...form.register("schedule")} />
      </div>
      <div className="space-y-2">
        <Label>Costo mensual</Label>
        <Input type="number" {...form.register("monthlyFee")} />
      </div>
      <div className="space-y-2">
        <Label>Precio con descuento</Label>
        <Input type="number" {...form.register("discountedMonthlyFee")} />
      </div>
      <div className="space-y-2">
        <Label>Capacidad</Label>
        <Input type="number" {...form.register("capacity")} />
      </div>
      <div className="space-y-2">
        <Label>Maestra</Label>
        <Select value={teacherId ?? ""} onValueChange={(value) => form.setValue("teacherId", value || null)}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar maestra" />
          </SelectTrigger>
          <SelectContent>
            {teachers.map((teacher) => (
              <SelectItem key={teacher.id} value={teacher.id}>
                {teacher.fullName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Descripción</Label>
        <Textarea {...form.register("description")} />
      </div>
      <div className="md:col-span-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : "Crear grupo"}
        </Button>
      </div>
    </form>
  );
}
