"use client";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <Button variant="danger" onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = '/login'; }}>
      Cerrar sesión
    </Button>
  );
}
