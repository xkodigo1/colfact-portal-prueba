# Colfact Portal — Prueba Técnica Frontend

Portal administrativo para **Colfact**, la plataforma de facturación electrónica de CONEXUSIT SAS.  
La aplicación fue construida con el stack solicitado en la prueba y simula la API mediante **MSW** durante desarrollo.

## Stack

| Tecnología | Uso |
| --- | --- |
| React 18 + TypeScript + Vite | Base SPA |
| React Router v6 | Navegación y rutas protegidas |
| TanStack Query v5 | Estado servidor y cache |
| React Hook Form + Zod | Formularios y validación |
| Tailwind CSS | Estilos |
| Axios | Cliente HTTP con interceptores |
| MSW v2 | Mock de endpoints en desarrollo |

## Módulos implementados

### Autenticación
- Login con validación y errores inline
- `AuthContext + AuthProvider` para sesión reactiva
- Persistencia de `accessToken` y `refreshToken` en `localStorage`
- `ProtectedRoute` para rutas privadas
- Logout reactivo desde layout
- Manejo de `401` con limpieza de tokens y sincronización del contexto

### Usuarios
- Lista paginada de usuarios
- Búsqueda por `fullName`, `identification` y `userName`
- Filtros por `role` e `isActive`
- Formulario inline para creación de usuarios
- Detalle de usuario en ruta dedicada: `/users/:id`
- Estados visibles de `loading`, `error` y `empty`

## Rutas

| Ruta | Tipo | Descripción |
| --- | --- | --- |
| `/login` | Pública | Acceso al portal |
| `/dashboard` | Protegida | Vista de entrada del portal |
| `/users` | Protegida | Gestión de usuarios |
| `/users/:id` | Protegida | Detalle individual de usuario |

## Instalación

```bash
npm install
cp .env.example .env.local
npm run dev
```

La aplicación queda disponible en [http://localhost:5173](http://localhost:5173).

## Credenciales de prueba

```txt
Usuario: admin
Contraseña: Admin123!
```

## Scripts

```bash
npm run dev
npm run typecheck
npm run lint
npm run build
npm run preview
```

## Variables de entorno

```bash
VITE_API_BASE_URL=/api
```

## Decisiones técnicas

### Arquitectura por capas
Se respetó la estructura definida en `AGENTS.md`: `types` → `api` → `mocks` → `hooks` → `schemas` → `components` → `pages` → `router`.  
Las páginas son delgadas y la lógica vive en hooks de feature o en funciones puras.

### Autenticación reactiva
`useAuth` consume un contexto global, no lee `localStorage` directamente.  
Esto permite que `ProtectedRoute`, `Sidebar` y `Header` reaccionen de inmediato a login, logout o `401`.

### Axios + sincronización de sesión
El interceptor de request añade `Authorization` automáticamente.  
El interceptor de response limpia tokens y emite un evento de logout forzado para que `AuthProvider` sincronice estado antes de redirigir.

### MSW para desarrollo
Los endpoints se mockean solo en `development`, por lo que el código de producción sigue apuntando a `VITE_API_BASE_URL` sin cambios internos.

### UI y experiencia
La interfaz mantiene un estilo administrativo limpio y responsivo, con navegación persistente, feedback inline y estados visibles en cada flujo.

## Mock API

Endpoints simulados:

- `POST /api/auth/login`
- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users`

## Flujo Git recomendado

Se siguió el modelo de la guía `Git Flow – Guía de Trabajo 2026.md`, adaptado a una prueba técnica:

- `main`: línea estable final
- `develop`: integración diaria
- `feature/*`: trabajo por bloques funcionales
- `release/v1.0.0`: congelación final de entrega
- `hotfix/*`: reservado para correcciones urgentes posteriores

Convención de commits:

- `feat:`
- `fix:`
- `chore:`
- `docs:`
- `style:`

Validación mínima antes de integrar una feature:

```bash
npm run typecheck
npm run build
```

## Validación final realizada

```bash
npm run typecheck
npm run lint
npm run build
```

## Estructura principal

```txt
src/
├── api/
├── components/
│   ├── layout/
│   └── ui/
├── features/
│   ├── auth/
│   └── users/
├── hooks/
├── lib/
├── mocks/
├── pages/
├── router/
├── types/
└── utils/
```
