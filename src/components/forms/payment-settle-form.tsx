"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, useWatch } from "react-hook-form";

type Values = {
  status: "PAID";
  method: "CASH" | "BANK_TRANSFER_1" | "BANK_TRANSFER_2" | "CARD" | "UPLOAD_PROOF";
  accountId: string;
  amountPaid: number;
  notes?: string;
};

export function PaymentSettleForm({
  paymentId,
  suggestedAmount,
  accounts,
}: {
  paymentId: string;
  suggestedAmount: number;
  accounts: Array<{ id: string; name: string }>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<Values>({
    defaultValues: {
      status: "PAID",
      method: "CASH",
      accountId: accounts[0]?.id ?? "",
      amountPaid: suggestedAmount,
      notes: "",
    },
  });
  const method = useWatch({ control: form.control, name: "method" });
  const accountId = useWatch({ control: form.control, name: "accountId" });

  function onSubmit(values: Values) {
    startTransition(async () => {
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error ?? "No pudimos actualizar el pago.");
        return;
      }

      toast.success("Pago aplicado.");
      router.refresh();
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Método de pago</Label>
        <Select value={method} onValueChange={(value) => form.setValue("method", value as Values["method"])}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CASH">Efectivo</SelectItem>
            <SelectItem value="BANK_TRANSFER_1">Transferencia Cuenta 1</SelectItem>
            <SelectItem value="BANK_TRANSFER_2">Transferencia Cuenta 2</SelectItem>
            <SelectItem value="CARD">Tarjeta</SelectItem>
            <SelectItem value="UPLOAD_PROOF">Comprobante</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Cuenta</Label>
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
      <div className="space-y-2">
        <Label>Monto pagado</Label>
        <Input type="number" {...form.register("amountPaid", { valueAsNumber: true })} />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Aplicando..." : "Confirmar pago"}
      </Button>
    </form>
  );
}
