import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/section-header";
import { formatDate } from "@/lib/format";

export default async function NotificationsPage() {
  const notifications = await prisma.notification.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Comunicación" title="Avisos y recordatorios" description="Arquitectura lista para correo hoy y WhatsApp después." />
      <Card>
        <CardHeader><CardTitle>Notificaciones</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {notifications.map((item) => (
            <div key={item.id} className="rounded-3xl border border-border p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-medium">{item.title}</p>
                <Badge variant={item.status === "SENT" ? "success" : "muted"}>{item.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{item.message}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {item.audience} · {formatDate(item.createdAt)}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
