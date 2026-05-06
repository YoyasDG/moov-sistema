import { redirect } from "next/navigation";
import { LoginForm } from "@/components/forms/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { getCurrentSession } from "@/lib/auth/dal";

export default async function LoginPage() {
  const session = await getCurrentSession();

  if (session) {
    redirect(session.role === "TUTOR" ? "/portal" : "/dashboard");
  }

  return (
    <main className="grid min-h-screen place-items-center px-6 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center py-4">
            <Image src="/moov.svg" alt="Moov Aerial Studio" width={140} height={40} className="h-10 w-auto" priority />
          </div>
          <CardTitle className="font-heading text-4xl text-center">Bienvenida</CardTitle>
          <CardDescription className="text-center">
            Usa las credenciales del seed para entrar como admin, maestra o tutor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <div className="mt-6 rounded-[1.5rem] bg-muted p-4 text-sm text-muted-foreground">
            Admin: <strong>admin@moovstudio.com</strong> · Contrasena: <strong>Moov2026!</strong>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
