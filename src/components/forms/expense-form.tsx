"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { expenseSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Values = z.infer<typeof expenseSchema>;

export function ExpenseForm({
  accounts,
}: {
  accounts: Array<{ id: string; name: string }>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<Values>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: 0,
      date: new Date().toISOString().slice(0, 10),
      category: "OTHER",
      accountId: accounts[0]?.id ?? "",
      description: "",
      invoiced: false,
    },
  });
  const category = useWatch({ control: form.control, name: "category" });
  const accountId = useWatch({ control: form.control, name: "accountId" });

  function onSubmit(values: Values) {
    startTransition(async () => {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error ?? "No pudimos guardar el gasto.");
        return;
      }

      toast.success("Gasto registrado.");
      form.reset();
      router.refresh();
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label>Monto</Label>
        <Input type="number" {...form.register("amount", { valueAsNumber: true })} />
      </div>
      <div className="space-y-2">
        <Label>Fecha</Label>
        <Input type="date" {...form.register("date")} />
      </div>
      <div className="space-y-2">
        <Label>Categoría</Label>
        <Select value={category} onValueChange={(value) => form.setValue("category", value as Values["category"])}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="RENT">Renta</SelectItem>
            <SelectItem value="MATERIAL">Material</SelectItem>
            <SelectItem value="SERVICES">Servicios</SelectItem>
            <SelectItem value="MARKETING">Marketing</SelectItem>
            <SelectItem value="OTHER">Otros</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Cuenta origen</Label>
        <Select value={accountId} onValueChange={(value) => form.setValue("accountId", value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {accounts.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Descripción</Label>
        <Input {...form.register("description")} />
      </div>
      <div className="md:col-span-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : "Agregar gasto"}
        </Button>
      </div>
    </form>
  );
}
