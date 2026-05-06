import Link from "next/link";
import { ArrowRight, Orbit, ShieldCheck, Sparkles, WalletCards } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const highlights = [
  {
    title: "Control total de alumnas",
    text: "Historial, estatus, lesiones, grupos y tutorias en un solo flujo limpio.",
    icon: Orbit,
  },
  {
    title: "Cobranza inteligente",
    text: "Mensualidades automaticas, descuento por pronto pago y alertas de vencimiento.",
    icon: WalletCards,
  },
  {
    title: "Permisos por rol",
    text: "Admin, maestra y mama o tutor con experiencia personalizada y segura.",
    icon: ShieldCheck,
  },
];

export default function MarketingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 md:px-10">
      <header className="flex items-center justify-between">
        <div className="flex items-center">
          <Image src="/moov.svg" alt="Moov Aerial Studio" width={140} height={40} priority className="h-9 w-auto" />
        </div>
        <Link href="/login">
          <Button variant="secondary">Acceder</Button>
        </Link>
      </header>

      <section className="grid flex-1 items-center gap-8 py-16 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-8">
          <div className="space-y-5">
            <p className="font-subtitle text-xl text-primary">Sistema operativo del estudio</p>
            <h1 className="font-heading text-6xl leading-[0.92] text-balance md:text-7xl">
              Un SaaS elegante para administrar tu estudio aereo sin friccion.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
              Dashboard premium, pagos mensuales automaticos, reinscripciones, contabilidad y portal para mamas
              en una experiencia pensada para operacion real.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/login">
              <Button size="lg">
                Entrar al sistema
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <div className="rounded-full border border-primary/10 px-5 py-3 text-sm text-muted-foreground">
              Demo seeds incluidas para Admin, Maestra y Tutor
            </div>
          </div>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="grid gap-4 p-5">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-[1.6rem] border border-primary/10 bg-white/55 p-5 dark:bg-white/4">
                  <div className="mb-4 inline-flex rounded-[1rem] bg-accent p-3 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="font-heading text-2xl">{item.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.text}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
