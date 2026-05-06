"use client";

import { useSyncExternalStore } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PaymentSettleForm } from "@/components/forms/payment-settle-form";

const emptySubscribe = () => () => {};

export function PaymentActionDialog({
  paymentId,
  suggestedAmount,
  accounts,
}: {
  paymentId: string;
  suggestedAmount: number;
  accounts: Array<{ id: string; name: string }>;
}) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  if (!mounted) {
    return (
      <Button variant="secondary" type="button" disabled>
        Aplicar pago
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" type="button">
          Aplicar pago
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar pago</DialogTitle>
        </DialogHeader>
        <PaymentSettleForm paymentId={paymentId} suggestedAmount={suggestedAmount} accounts={accounts} />
      </DialogContent>
    </Dialog>
  );
}
