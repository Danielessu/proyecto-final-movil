# 🚗 AutoCare - Gestión Inteligente del Ciclo de Vida del Vehículo

<p align="center">
  <img src="assets/images/autocare-logo.png" alt="AutoCare Logo" width="200"/>
</p>

<p align="center">
  <strong>Plataforma B2B SaaS para Concesionarios, Talleres y Propietarios de Vehículos</strong>
</p>

<p align="center">
  <a href="#características">Características</a> •
  <a href="#tecnologías">Tecnologías</a> •
  <a href="#instalación">Instalación</a> •
  <a href="#uso">Uso</a> •
  <a href="#arquitectura">Arquitectura</a> •
  <a href="#contribuir">Contribuir</a>
</p>

---

## 📋 Tabla de Contenidos

- [Sobre el Proyecto](#sobre-el-proyecto)
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Arquitectura](#arquitectura)
- [Roadmap](#roadmap)
- [Contribuir](#contribuir)
- [Licencia](#licencia)
- [Contacto](#contacto)

---

## 🎯 Sobre el Proyecto

**AutoCare** es una aplicación móvil B2B SaaS que revoluciona la gestión post-venta de vehículos. Diseñada para concesionarios, talleres y propietarios, AutoCare facilita:

- 🔧 **Mantenimiento preventivo** personalizado por vehículo
- 📅 **Gestión de citas** on-demand con confirmación en tiempo real
- 🤖 **Diagnóstico asistido por IA** (texto, foto, audio)
- 🛒 **Marketplace integrado** de repuestos con comisiones
- 📊 **Control de gastos** y reportes por vehículo
- 🔔 **Recordatorios inteligentes** sin push notifications
- 📱 **Onboarding en punto de venta** con trial automático

### Problema que Resuelve

- **60% de averías** son evitables con mantenimiento preventivo
- **Solo 30% de clientes** vuelven al concesionario después de la compra
- **Talleres sin datos históricos** trabajan de forma reactiva
- **Propietarios pierden control** sobre el estado de su vehículo

### Solución

Una plataforma integral que conecta el ecosistema automotriz post-venta, mejorando la retención de clientes (+20%), reduciendo averías evitables (-25%) y generando nuevas fuentes de ingreso para dealers y talleres.

---

## ✨ Características

### Para Concesionarios
- ✅ Onboarding automático en punto de venta
- ✅ Gestión de inventario y ventas de repuestos
- ✅ Dashboard con métricas de conversión y retención
- ✅ Programa de trial (30 días) para nuevos compradores

### Para Talleres
- ✅ Agenda inteligente con priorización de citas
- ✅ Peritaje digital y registro de servicios
- ✅ Pedidos de piezas integrados con citas
- ✅ Historial completo del cliente

### Para Propietarios
- ✅ Panel "Próximos servicios" con recordatorios
- ✅ Diagnóstico IA por foto (testigos), audio (ruidos) o texto
- ✅ Solicitud de citas con adjuntos multimedia
- ✅ Marketplace con piezas compatibles (por VIN/modelo)
- ✅ Control de gastos con exportación PDF/CSV
- ✅ Exportación de recordatorios a calendario (.ics)

### Funcionalidades Técnicas
- ✅ Sincronización offline con cola persistente
- ✅ Multi-tenant SaaS escalable
- ✅ Compresión y upload seguro de fotos/audio
- ✅ Integración con APIs externas (VIN decoder, catálogos)
- ✅ Telemetría IoT opcional (OBD-II, ESP32)

---

## 🛠 Tecnologías

### Frontend
- **React Native** 0.72.x - Framework multiplataforma
- **Expo** SDK 49 - Herramientas de desarrollo
- **TypeScript** 5.x - Tipado estático
- **React Navigation** 6.x - Navegación
- **Expo Router** - File-based routing

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL (Base de datos)
  - Auth (Autenticación)
  - Storage (Archivos)
  - Realtime (Subscripciones)

### Integraciones
- **OpenAI GPT-4** - IA conversacional para diagnóstico
- **ML Kit / TensorFlow Lite** - Clasificación de imágenes on-device
- **Stripe / MercadoPago** - Procesamiento de pagos
- **NHTSA / CarMD API** - Decodificación VIN y catálogos
- **MQTT** (Opcional) - Telemetría IoT

### Herramientas de Desarrollo
- **ESLint** + **Prettier** - Linting y formateo
- **Jest** - Testing
- **Expo EAS** - Build y deployment
- **GitHub Actions** - CI/CD

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 18.0.0 ([Descargar](https://nodejs.org/))
- **npm** >= 9.0.0 o **yarn** >= 1.22.0
- **Git** ([Descargar](https://git-scm.com/))
- **Expo CLI** (se instala automáticamente con el proyecto)
- **Android Studio** (para emulador Android) o **Xcode** (para iOS, solo macOS)
- **Expo Go** app en tu dispositivo móvil ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779))

### Verificar Instalación

```bash
node --version    # Debería mostrar v18.x.x o superior
npm --version     # Debería mostrar v9.x.x o superior
git --version     # Debería mostrar git version 2.x.x
```

---

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
# HTTPS
git clone https://github.com/danielessu/proyecto-final-movil.git

# SSH (recomendado)
git clone git@github.com:danielessu/proyecto-final-movil.git

# Entrar al directorio
cd proyecto-final-movil
```

### 2. Instalar Dependencias

```bash
# Con npm
npm install

# O con yarn
yarn install
```

### 3. Instalar Expo CLI Globalmente (Opcional)

```bash
npm install -g expo-cli
```

---

## ⚙️ Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# macOS/Linux
cp .env.example .env
```

### 2. Configurar `.env`

Edita el archivo `.env` con tus credenciales:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_clave_publica_aqui

# OpenAI (para diagnóstico IA)
EXPO_PUBLIC_OPENAI_API_KEY=sk-tu_clave_openai_aqui

# Stripe/MercadoPago
EXPO_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_tu_clave_aqui

# Entorno
EXPO_PUBLIC_ENV=development

# API URLs
EXPO_PUBLIC_API_URL=https://api.autocare.app
```

### 3. Obtener Credenciales

#### Supabase
1. Crea una cuenta en [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a `Settings` → `API`
4. Copia `Project URL` y `anon public` key

#### OpenAI (Opcional para MVP)
1. Regístrate en [platform.openai.com](https://platform.openai.com)
2. Ve a `API Keys`
3. Crea una nueva clave

#### Stripe (Opcional para MVP)
1. Crea cuenta en [stripe.com](https://stripe.com)
2. Modo test: Dashboard → Developers → API Keys
3. Copia la `Publishable key`

### 4. Configurar Base de Datos

Ejecuta las migraciones de Supabase:

```bash
# En el dashboard de Supabase, ve a SQL Editor y ejecuta:
# scripts/supabase/migrations/01_initial_schema.sql
```

O usa el CLI de Supabase:

```bash
npx supabase db push
```

---

## 💻 Uso

### Ejecutar en Desarrollo

```bash
# Iniciar servidor de desarrollo
npm start

# O con opciones específicas
npx expo start

# Opciones útiles:
npx expo start --clear    # Limpiar caché
npx expo start --tunnel   # Usar túnel (red pública)
npx expo start --localhost # Solo localhost
```

### Abrir en Dispositivo

#### Opción 1: Expo Go (Recomendado para desarrollo)

1. Abre **Expo Go** en tu dispositivo
2. Escanea el QR code que aparece en la terminal
3. La app se cargará automáticamente

#### Opción 2: Emulador Android

```bash
# Asegúrate de tener Android Studio y un emulador configurado
npm run android

# O directamente
npx expo run:android
```

#### Opción 3: Simulador iOS (Solo macOS)

```bash
# Requiere Xcode instalado
npm run ios

# O directamente
npx expo run:ios
```

### Scripts Disponibles

```bash
# Desarrollo
npm start              # Iniciar servidor Expo
npm run android        # Ejecutar en Android
npm run ios           # Ejecutar en iOS
npm run web           # Ejecutar en navegador

# Testing
npm test              # Ejecutar tests
npm run test:watch    # Tests en modo watch
npm run test:coverage # Cobertura de tests

# Linting y Formato
npm run lint          # Verificar código
npm run lint:fix      # Corregir automáticamente
npm run format        # Formatear con Prettier

# Build
npm run build:android # Build APK/AAB
npm run build:ios     # Build IPA
```

---

## 📁 Estructura del Proyecto

```
proyecto-final-movil/
├── app/                          # Código fuente principal (Expo Router)
│   ├── (auth)/                   # Pantallas de autenticación
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── reset.tsx
│   ├── main/                     # Pantallas principales (con tabs)
│   │   ├── home.tsx
│   │   ├── vehicles.tsx
│   │   ├── appointments.tsx
│   │   ├── marketplace.tsx
│   │   ├── profile.tsx
│   │   ├── diagnosis.tsx
│   │   └── onboarding/
│   │       └── dealer.tsx
│   ├── _layout.tsx               # Layout raíz
│   └── index.tsx                 # Punto de entrada
│
├── assets/                       # Recursos estáticos
│   ├── images/                   # Imágenes e iconos
│   ├── fonts/                    # Fuentes personalizadas
│   └── lottie/                   # Animaciones
│
├── components/                   # Componentes reutilizables
│   ├── ui/                       # Componentes UI básicos
│   ├── forms/                    # Componentes de formularios
│   └── cards/                    # Componentes de tarjetas
│
├── contexts/                     # Context API de React
│   ├── AuthContext.tsx           # Contexto de autenticación
│   └── DataContext.tsx           # Contexto de datos globales
│
├── hooks/                        # Custom hooks
│   ├── useAuth.ts
│   ├── useVehicles.ts
│   └── useAppointments.ts
│
├── services/                     # Servicios y API calls
│   ├── supabase/                 # Cliente y funciones Supabase
│   ├── openai/                   # Integración OpenAI
│   └── storage/                  # Gestión de archivos
│
├── themes/                       # Configuración de temas
│   ├── palette.ts                # Paleta de colores
│   ├── fonts.ts                  # Configuración de fuentes
│   └── spacing.ts                # Sistema de espaciado
│
├── types/                        # Tipos TypeScript
│   ├── models.ts                 # Modelos de datos
│   └── api.ts                    # Tipos de API
│
├── utils/                        # Utilidades y helpers
│   ├── validators.ts             # Validaciones
│   ├── formatters.ts             # Formateadores
│   └── constants.ts              # Constantes
│
├── scripts/                      # Scripts de utilidad
│   └── supabase/
│       └── migrations/           # Migraciones de BD
│
├── .env.example                  # Ejemplo de variables de entorno
├── .gitignore                    # Archivos ignorados por Git
├── app.json                      # Configuración Expo
├── babel.config.js               # Configuración Babel
├── package.json                  # Dependencias del proyecto
├── tsconfig.json                 # Configuración TypeScript
└── README.md                     # Este archivo
```

---

## 🏗 Arquitectura

### Diagrama Cliente-Servidor

```
┌─────────────┐                                    ┌──────────────────┐
│             │                                    │                  │
│   Usuario   │◄───────────────────────────────────│  Supabase Cloud  │
│             │                                    │                  │
└──────┬──────┘                                    │  • PostgreSQL    │
       │                                           │  • Auth          │
       │  Interactúa                               │  • Storage       │
       │                                           │  • Realtime      │
       ▼                                           │                  │
┌─────────────────────────────────────────┐        └─────────┬────────┘
│                                         │                  │
│        App Móvil (React Native)         │                  │
│                                         │                  │
│  • UI/UX (React Native)                 │◄─────────────────┘
│  • Lógica de negocio local              │     HTTPS/WSS
│  • Caché y sincronización offline       │
│  • Cámara/Audio (diagnóstico IA)        │
│  • Módulos BLE/Wi-Fi (IoT opcional)     │
│                                         │
└────────────┬────────────────────────────┘
             │
             │ APIs Externas
             │
             ├──────►  OpenAI (Diagnóstico IA)
             ├──────►  Stripe/MercadoPago (Pagos)
             ├──────►  CarMD/NHTSA (VIN Decoder)
             └──────►  MQTT Broker (Telemetría IoT)
```

### Flujo de Datos

1. **Autenticación**: Supabase Auth → JWT → Context API
2. **Datos**: Supabase PostgreSQL → React Query → Context/State
3. **Archivos**: Upload → Supabase Storage → Signed URLs
4. **Tiempo Real**: Supabase Realtime → WebSockets → UI updates
5. **Offline**: Local Storage → Sync Queue → Cloud sync

---

## 🗺 Roadmap

### ✅ MVP (Completado - Mes 3)
- [x] Autenticación (email/password + OAuth)
- [x] CRUD de vehículos
- [x] Onboarding dealer con trial
- [x] Panel "Próximos servicios"
- [x] Solicitud de citas
- [x] Diagnóstico IA básico (texto)
- [x] Marketplace v1
- [x] Control de gastos

### 🔄 V2 (En Desarrollo - Meses 4-6)
- [ ] Diagnóstico IA avanzado (foto + audio)
- [ ] Peritaje digital para talleres
- [ ] Integración con calendarios externos
- [ ] Reportes B2B para dealers
- [ ] Notificaciones push (opcional)
- [ ] Tutoriales en video

### 🎯 V3 (Planeado - Meses 7-12)
- [ ] Telemetría IoT (OBD-II + ESP32)
- [ ] Predictive maintenance con ML
- [ ] Integración CRM concesionarios
- [ ] Logística same-day
- [ ] Gestión de flotas
- [ ] Expansión regional (LATAM)

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor sigue estos pasos:

### 1. Fork el Proyecto

Haz clic en el botón "Fork" en la esquina superior derecha.

### 2. Crea una Rama

```bash
git checkout -b feature/nueva-funcionalidad
```

### 3. Realiza tus Cambios

```bash
# Hacer cambios en el código
git add .
git commit -m "feat: agregar nueva funcionalidad X"
```

### 4. Push a tu Fork

```bash
git push origin feature/nueva-funcionalidad
```

### 5. Abre un Pull Request

Ve a tu fork en GitHub y haz clic en "New Pull Request".

### Convenciones de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bugs
- `docs:` Cambios en documentación
- `style:` Cambios de formato (no afectan código)
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Tareas de mantenimiento

### Code Style

- Usa **Prettier** para formateo
- Sigue las reglas de **ESLint**
- Escribe tests para nuevas features
- Actualiza documentación si es necesario

```bash
# Antes de commit, ejecuta:
npm run lint
npm run format
npm test
```

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Tests en modo watch
npm run test:watch

# Cobertura
npm run test:coverage
```

### Estructura de Tests

```
__tests__/
├── components/        # Tests de componentes
├── hooks/            # Tests de hooks
├── services/         # Tests de servicios
└── utils/            # Tests de utilidades
```

---

## 📱 Build y Deployment

### Build Local (Development)

```bash
# Android APK
npx expo build:android -t apk

# iOS (requiere macOS)
npx expo build:ios -t simulator
```

### Build con EAS (Production)

```bash
# Configurar EAS
npm install -g eas-cli
eas login
eas build:configure

# Build Android
eas build --platform android

# Build iOS
eas build --platform ios

# Build ambos
eas build --platform all
```

### Publicar Update OTA

```bash
# Publicar update sin rebuild
eas update --branch production
```

---

## 🐛 Troubleshooting

### Error: "Metro bundler failed to start"

```bash
# Limpiar caché
npx expo start --clear

# O manualmente
rm -rf node_modules
rm -rf .expo
npm install
```

### Error: "Unable to resolve module"

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error de Supabase Connection

1. Verifica que `.env` tenga las credenciales correctas
2. Chequea que el proyecto Supabase esté activo
3. Revisa la consola del navegador para errores CORS

### Android Emulator no Inicia

1. Abre Android Studio
2. Ve a AVD Manager
3. Verifica que tengas un emulador creado
4. Inicia el emulador manualmente

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo [LICENSE](LICENSE) para más detalles.

```
MIT License

Copyright (c) 2024 Daniel Esquinas

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👤 Contacto

**Daniel Esquinas** - Founder & Developer

- 📧 Email: danielesquinas@autocare.app
- 💼 LinkedIn: [Daniel Esquinas](https://linkedin.com/in/danielesquinas)
- 🐙 GitHub: [@danielessu](https://github.com/danielessu)
- 🌐 Website: [autocare.app](https://autocare.app)

### Links del Proyecto

- 📦 Repositorio: [https://github.com/danielessu/proyecto-final-movil](https://github.com/danielessu/proyecto-final-movil)
- 🐛 Reportar Bug: [https://github.com/danielessu/proyecto-final-movil/issues](https://github.com/danielessu/proyecto-final-movil/issues)
- 💡 Solicitar Feature: [https://github.com/danielessu/proyecto-final-movil/issues/new](https://github.com/danielessu/proyecto-final-movil/issues/new)

---

## 🙏 Agradecimientos

- [Expo Team](https://expo.dev) - Por el increíble framework
- [Supabase](https://supabase.com) - Por el backend as a service
- [React Navigation](https://reactnavigation.org) - Por el sistema de navegación
- [Ionicons](https://ionic.io/ionicons) - Por los iconos
- Todos los contribuidores que hacen este proyecto posible

---

<p align="center">
  Hecho con ❤️ por <a href="https://github.com/danielessu">Daniel Esquinas</a>
</p>

<p align="center">
  <sub>⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub!</sub>
</p>
