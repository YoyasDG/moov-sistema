import { ChangePasswordForm } from "@/components/settings/change-password-form";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/settings/logout-button";

export default async function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl">Configuración de la cuenta</h2>
        <p className="text-muted-foreground">Gestiona tu cuenta y seguridad</p>
      </div>

      <section className="surface-panel rounded-lg p-6">
        <h3 className="font-medium mb-4">Detalles de la cuenta</h3>
        <p className="text-sm text-muted-foreground">Edita tu perfil desde el panel de usuario (próximamente)</p>
      </section>

      <section className="surface-panel rounded-lg p-6">
        <h3 className="font-medium mb-4">Seguridad</h3>
        <ChangePasswordForm />
      </section>

      <section className="surface-panel rounded-lg p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Sesión</h3>
          <div>
            <LogoutButton />
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-3">Cierra la sesión actual o gestiona sesiones desde el administrador.</p>
      </section>
    </div>
  );
}

