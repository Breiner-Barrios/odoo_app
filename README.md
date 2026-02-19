<p align="center">
  <img src="https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular&logoColor=white" />
  <img src="https://img.shields.io/badge/Django-5.0-092E20?style=for-the-badge&logo=django&logoColor=white" />
  <img src="https://img.shields.io/badge/Odoo-ERP-714B67?style=for-the-badge&logo=odoo&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" />
</p>

<h1 align="center">🌉 Odoo CRM Bridge</h1>

<p align="center">
  <strong>Plataforma avanzada que conecta un Frontend moderno en Angular con un Backend Django que actúa como puente (Bridge) hacia el ERP Odoo, permitiendo gestionar oportunidades de venta mediante un tablero Kanban interactivo con diseño Neo-Tech.</strong>
</p>

---

## 📑 Tabla de Contenidos

- [🏗️ Arquitectura del Proyecto](#️-arquitectura-del-proyecto)
- [⚡ Stack Tecnológico](#-stack-tecnológico)
- [🎨 Diseño Neo-Tech / Dark Mode](#-diseño-neo-tech--dark-mode)
- [🔐 Seguridad y Roles](#-seguridad-y-roles)
- [📋 Funcionalidades del Kanban](#-funcionalidades-del-kanban)
- [🔌 API Endpoints](#-api-endpoints)
- [⚙️ Variables de Entorno](#️-variables-de-entorno)
- [🚀 Instalación y Configuración](#-instalación-y-configuración)
- [🧭 Flujo de Navegación (UX)](#-flujo-de-navegación-ux)
- [📂 Estructura del Proyecto](#-estructura-del-proyecto)
- [📄 Licencia](#-licencia)

---

## 🏗️ Arquitectura del Proyecto

El sistema sigue una arquitectura de **tres capas desacopladas**, donde Django actúa como un **puente REST** entre el frontend moderno y el ERP empresarial:

```
┌─────────────────────┐        ┌──────────────────────┐        ┌─────────────────┐
│                     │  HTTP  │                      │ XML-RPC│                 │
│   Angular Frontend  │◄──────►│  Django REST Bridge  │◄──────►│   Odoo ERP      │
│   (SPA + Signals)   │  JSON  │  (API + JWT Auth)    │        │   (crm.lead)    │
│                     │        │                      │        │                 │
└─────────────────────┘        └──────────────────────┘        └─────────────────┘
     Puerto 4200                    Puerto 8000                   Puerto 8069
```

### Flujo de Datos

1. **Angular** envía peticiones HTTP (JSON) al API REST de Django.
2. **Django** valida la autenticación JWT y los permisos del usuario.
3. **Django** traduce la petición a una llamada **XML-RPC** hacia Odoo.
4. **Odoo** ejecuta la operación sobre el modelo `crm.lead` o `crm.stage`.
5. La respuesta recorre el camino inverso hasta el frontend.

---

## ⚡ Stack Tecnológico

### Frontend

| Tecnología | Versión | Propósito |
|---|---|---|
| **Angular** | 21.x | Framework principal del SPA |
| **Angular CDK** | 21.x | Drag & Drop nativo para el Kanban |
| **Angular Signals** | Built-in | Manejo de estado reactivo sin librerías externas |
| **TypeScript** | 5.9 | Tipado estático y seguridad en el código |
| **RxJS** | 7.8 | Operadores reactivos para HTTP y streams |
| **SCSS** | Nativo | Estilos con variables, anidamiento y mixins |

### Backend

| Tecnología | Versión | Propósito |
|---|---|---|
| **Django** | 5.0.2 | Framework web principal |
| **Django REST Framework** | 3.14.0 | Construcción del API REST |
| **Simple JWT** | 5.5.1 | Autenticación con tokens JWT |
| **django-cors-headers** | 4.3.1 | Permitir peticiones cross-origin desde Angular |
| **django-environ** | 0.11.2 | Manejo seguro de variables de entorno |
| **XML-RPC** | stdlib | Protocolo de comunicación con Odoo |

### ERP

| Tecnología | Propósito |
|---|---|
| **Odoo** | ERP empresarial con módulo CRM |
| **crm.lead** | Modelo de oportunidades de venta |
| **crm.stage** | Modelo de etapas del pipeline |

---

## 🎨 Diseño Neo-Tech / Dark Mode

La interfaz implementa un diseño **Neo-Tech** con tema oscuro premium que incluye:

- 🌑 **Fondo Principal**: Gris pizarra oscuro (`#111827`)
- 💎 **Glassmorphism**: Tarjetas y modales con `backdrop-filter: blur()` y bordes de cristal
- 💜 **Acento Índigo**: Color primario vibrante (`#6366f1`)
- 🔵 **Neón Cian**: Acento secundario con resplandor (`#06b6d4`)
- 🟢 **Esmeralda**: Botones de acción positiva (`#10b981`)
- ✨ **Animaciones**: Pulsación neón en el título, transiciones suaves en hover, destello en columnas al soltar tarjetas
- 📊 **Datos Color-Coded**: Ingreso (cian), Probabilidad (verde), Contacto (gris)

---

## 🔐 Seguridad y Roles

### Capas de Seguridad

1. **Frontend Guard** (`authGuard`): Protege la ruta `/kanban` verificando la existencia del `access_token` en localStorage. Si no existe, redirige a `/login`.

2. **Backend JWT** (Simple JWT): Cada petición al API incluye el token en el header `Authorization: Bearer <token>`. Django valida el token antes de procesar la solicitud.

3. **Permisos por Vista**: Django REST Framework aplica `permission_classes` específicas en cada endpoint.

### Tabla de Permisos

| Acción | Endpoint | Permiso Requerido | Admin | Usuario Estándar |
|---|---|---|---|---|
| 📖 Ver Leads | `GET /api/leads/` | Ninguno | ✅ | ✅ |
| 📖 Ver Etapas | `GET /api/stages/` | Ninguno | ✅ | ✅ |
| ➕ Crear Lead | `POST /api/leads/create/` | `IsAuthenticated` | ✅ | ✅ |
| ✏️ Editar Lead | `PATCH /api/leads/{id}/update/` | `IsAuthenticated` | ✅ | ✅ |
| 🔄 Mover Etapa | `PATCH /api/leads/{id}/` | `IsAuthenticated` | ✅ | ✅ |
| 🗑️ Eliminar Lead | `DELETE /api/leads/{id}/delete/` | **`IsAdminUser`** | ✅ | ❌ |

> ⚠️ **Nota**: El botón de eliminar (×) solo se muestra en el frontend si `isAdmin` es `true`, proporcionando una doble capa de protección (UI + Backend).

---

## 📋 Funcionalidades del Kanban

### Sistema de Drag & Drop

- Implementado con **Angular CDK** (`DragDropModule`)
- Al soltar una tarjeta en una nueva columna, se actualiza el `stage_id` en Odoo vía el Bridge
- Vista previa al arrastrar con efecto de cristal y resplandor azul
- Animación de destello en la columna destino al recibir una tarjeta

### Sistema de Doble Modal

```
┌─────────────────┐     click en      ┌────────────────────┐     "Editar      ┌────────────────────┐
│  Tarjeta Kanban  ├──────────────────►│  Modal Información │────────────────►│  Modal Edición     │
│  (Vista rápida)  │                   │  (Solo Lectura)    │  Información"   │  (Formulario)      │
└─────────────────┘                    └────────────────────┘                  └────────────────────┘
```

1. **Modal de Información** (Solo Lectura): Muestra los detalles del lead como una ficha técnica con datos organizados en grid (título, ingreso, probabilidad, contacto, email, teléfono).

2. **Modal de Edición** (Reactivo): Formulario con campos pre-rellenados con `[value]` bindings. Al guardar, envía un `PATCH` al Bridge que actualiza Odoo en tiempo real.

### Creación de Leads

- Botón "+ Nuevo Lead" abre un modal con formulario completo
- Campos: Título, Contacto, Email, Ingreso Esperado, Probabilidad, Teléfono
- Se asigna automáticamente a la primera etapa del pipeline

---

## 🔌 API Endpoints

| Método | Ruta | Descripción | Vista Django |
|---|---|---|---|
| `POST` | `/api/token/` | Obtener JWT (login) | `TokenObtainPairView` |
| `POST` | `/api/token/refresh/` | Refrescar access token | `TokenRefreshView` |
| `GET` | `/api/leads/` | Listar todos los leads | `LeadListAPIView` |
| `GET` | `/api/stages/` | Listar etapas del CRM | `StageListAPIView` |
| `POST` | `/api/leads/create/` | Crear nuevo lead | `LeadCreateAPIView` |
| `PATCH` | `/api/leads/{id}/` | Actualizar etapa (drag) | `LeadUpdateStageAPIView` |
| `PATCH` | `/api/leads/{id}/update/` | Editar campos del lead | `LeadUpdateAPIView` |
| `DELETE` | `/api/leads/{id}/delete/` | Eliminar lead (admin) | `LeadDeleteAPIView` |

---

## ⚙️ Variables de Entorno

### Backend — archivo `.env`

Crea un archivo `.env` en la carpeta `backend/` con las siguientes variables:

```env
# 🔗 Conexión a Odoo
ODOO_URL=http://localhost:8069
ODOO_DB=odoo_dev
ODOO_USER=tu_email_de_odoo
ODOO_PASSWORD=tu_password_de_odoo

# 🔧 Configuración de Django
DEBUG=True
SECRET_KEY=genera_una_clave_aleatoria_aqui
```

| Variable | Descripción | Ejemplo |
|---|---|---|
| `ODOO_URL` | URL base de la instancia Odoo | `http://localhost:8069` |
| `ODOO_DB` | Nombre de la base de datos de Odoo | `odoo_dev` |
| `ODOO_USER` | Email/usuario del administrador de Odoo | `admin@example.com` |
| `ODOO_PASSWORD` | Contraseña del usuario de Odoo | `••••••••` |
| `DEBUG` | Modo debug de Django | `True` / `False` |
| `SECRET_KEY` | Clave secreta de Django para criptografía | Cadena aleatoria larga |

> 📁 Ya existe un archivo `.env.example` en `backend/` con la estructura lista para copiar.

### Frontend — URL del API

La URL del Bridge Django está configurada directamente en los servicios de Angular:

| Servicio | Variable | Valor por Defecto |
|---|---|---|
| `AuthService` | `apiUrl` | `http://localhost:8000/api/token/` |
| `LeadService` | `apiUrl` | `http://localhost:8000/api/leads/` |

> 💡 Para producción, estas URLs deben apuntar al dominio donde se despliegue el servidor Django.

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Python** 3.10+
- **Node.js** 18+ y **npm** 9+
- **Odoo** 16/17 con módulo CRM habilitado
- **Git**

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Breiner-Barrios/odoo_app.git
cd odoo_app
```

### 2. Configurar el Backend (Django)

```bash
# Navegar al backend
cd backend

# Crear entorno virtual
python -m venv .venv

# Activar entorno virtual (Windows)
.venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Copiar y configurar variables de entorno
cp .env.example .env
# Editar .env con las credenciales de tu Odoo

# Ejecutar migraciones
python manage.py migrate

# Crear un superusuario (será el Admin)
python manage.py createsuperuser

# Iniciar el servidor de desarrollo
python manage.py runserver
```

> 🔑 El superusuario creado con `createsuperuser` es quien tendrá permisos `IsAdminUser` para eliminar leads.

### 3. Configurar el Frontend (Angular)

```bash
# Navegar al frontend (desde la raíz del proyecto)
cd frontend/leads-frontend

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
ng serve
```

### 4. Verificar la Conexión

1. Asegúrate de que **Odoo** esté corriendo en el puerto `8069`
2. Verifica que **Django** esté en `http://localhost:8000`
3. Abre **Angular** en `http://localhost:4200`
4. Navega a la **Landing Page** → Haz clic en "Acceder al Sistema" → Inicia sesión

---

## 🧭 Flujo de Navegación (UX)

```
                                    ┌──────────────┐
                                    │  Landing     │
                              ┌─────│  Page (/)    │
                              │     └──────┬───────┘
                              │            │ "Acceder al Sistema"
                              │            ▼
                              │     ┌──────────────┐
            Logout            │     │  Login       │
  (Redirige automáticamente)──┘     │  Page        │
                                    └──────┬───────┘
                                           │ JWT Success
                                           ▼
                                    ┌──────────────┐
                                    │  Kanban      │◄── authGuard protege
                                    │  Board       │    esta ruta
                                    └──────────────┘
```

### Rutas Definidas

| Ruta | Componente | Guard | Descripción |
|---|---|---|---|
| `/` | `LandingComponent` | Ninguno | Página de bienvenida pública |
| `/login` | `LoginComponent` | Ninguno | Formulario de autenticación |
| `/kanban` | `KanbanComponent` | `authGuard` | Tablero Kanban (protegido) |
| `**` | Redirect → `/` | — | Cualquier ruta no reconocida |

> 🔄 **Redirección automática**: Al cerrar sesión, el usuario es redirigido a la **Landing Page** (`/`) garantizando una experiencia de navegación fluida y el ciclo completo del flujo de autenticación.

---

## 📂 Estructura del Proyecto

```
odoo_app/
├── backend/                          # 🐍 Django REST Bridge
│   ├── core/                         # Configuración principal de Django
│   │   └── urls.py                   # Rutas principales (JWT + API)
│   ├── leads_bridge/                 # App principal del Bridge
│   │   ├── services/
│   │   │   └── odoo_service.py       # Conexión XML-RPC con Odoo
│   │   ├── views.py                  # Vistas REST (CRUD + permisos)
│   │   └── urls.py                   # Rutas del API de leads
│   ├── .env.example                  # Plantilla de variables de entorno
│   ├── requirements.txt              # Dependencias Python
│   └── manage.py
│
├── frontend/                         # 🅰️ Angular SPA
│   └── leads-frontend/
│       └── src/app/
│           ├── components/
│           │   ├── landing/          # Landing Page (Hero)
│           │   ├── login/            # Login (Glassmorphism)
│           │   └── kanban/           # Tablero Kanban (Drag & Drop)
│           └── core/
│               ├── guards/
│               │   └── auth.guard.ts # Guard de autenticación
│               ├── models/
│               │   └── lead.model.ts # Interface TypeScript del Lead
│               └── services/
│                   ├── auth.service.ts  # Servicio JWT + Signals
│                   └── lead.service.ts  # CRUD de Leads + Signals
│
├── LICENSE                           # MIT License
└── README.md                         # Este archivo
```

---

## 📄 Licencia

Este proyecto está licenciado bajo la **MIT License**.

Copyright © 2026 [Breiner-Barrios](https://github.com/Breiner-Barrios)

---

<p align="center">
  Hecho con ❤️ usando <strong>Angular</strong>, <strong>Django</strong> y <strong>Odoo</strong>
</p>
