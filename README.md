# Moov Aerial Studio

Webapp full stack para administrar un estudio de danza aérea con dashboard premium, CRM de alumnas, pagos, inscripciones, finanzas y portal para mamás/tutores.

## Arquitectura

- `Next.js 16 App Router` para frontend, layouts, route handlers y rendering híbrido.
- `Prisma + PostgreSQL` como capa de datos con relaciones, índices, timestamps y soft deletes.
- `JWT en cookie httpOnly` para autenticación y permisos por rol: `ADMIN`, `TEACHER`, `TUTOR`.
- `DAL + servicios` para centralizar autorización, lógica de mensualidades, dashboard y portal.
- `TailwindCSS v4 + componentes estilo shadcn/ui` para una UI responsive y moderna.

## Módulos incluidos

- Dashboard con KPIs, balances, alertas y gráfica de ingresos.
- CRUD de alumnas con ficha detallada, filtros, búsqueda y paginación.
- Gestión de grupos con ocupación y costo mensual.
- Pagos con descuento automático, estados y aplicación a cuentas.
- Control de inscripciones y vencimientos.
- Finanzas con cuentas, gastos y proyección.
- Portal mamá/tutor con saldo, pagos y avisos.

## Estructura

```txt
prisma/
src/
  app/
    (public)/
    (auth)/
    (dashboard)/
    (portal)/
    api/
  components/
  lib/
proxy.ts
```

## Instalación

```bash
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

## Variables de entorno

```bash
DATABASE_URL=""
JWT_SECRET=""
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Usuarios demo del seed

- Admin: `admin@moovstudio.com`
- Maestra: `maestra@moovstudio.com`
- Tutor: `mama@moovstudio.com`
- Contraseña para todos: `Moov2026!`

## Deployment

- Frontend: Vercel
- Base de datos: Railway, Supabase o cualquier PostgreSQL compatible
- Ajusta `DATABASE_URL`, `JWT_SECRET` y `NEXT_PUBLIC_APP_URL`
