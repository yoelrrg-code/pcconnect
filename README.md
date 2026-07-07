# PCConnect Dashboard

PCConnect es una aplicación web moderna orientada a la gestión de clientes, casos de inscripción y administración de usuarios, desarrollada utilizando una arquitectura sólida con separación de componentes estructurales y de negocio.

## 🚀 Tech Stack

El proyecto fue construido con un stack frontend moderno y de alto rendimiento:

- **Framework Core**: React 19 + TypeScript
- **Bundler & Tooling**: Vite
- **UI & Componentes**: Material UI (MUI) 9, Lucide React (íconos adicionales)
- **Estilos**: Emotion (integrado en MUI)
- **Visualización de Datos**: ApexCharts (`react-apexcharts`)
- **Manejo de Fechas**: Day.js
- **Linter**: ESLint (configurado para type-aware rules)

## 📁 Arquitectura y Estructura de Carpetas

El proyecto está organizado siguiendo patrones de separación de responsabilidades para garantizar mantenibilidad:

```
src/
├── components/       # Componentes de UI reusables (Logo, Loading Screen, Tooltips, etc.)
├── layouts/          # Layouts estructurales (Dashboard Layout, Sidebar, Navegación principal)
├── sections/         # Vistas con la lógica de negocio, organizadas por feature
│   ├── auth/         # Autenticación
│   ├── cmanagement/  # Client Management (Listado y perfiles)
│   ├── educational/  # Módulos educativos
│   ├── enrollment/   # Enrollment y casos activos/incompletos
│   ├── overview/     # Dashboard Overview principal
│   └── umanagement/  # Users Management
├── theme/            # Configuración de Material UI (Paleta, Tipografía, Overrides, Componentes)
├── App.tsx           # Entry point de componentes y enrutador principal/tabs
└── main.tsx          # Entry point de React a nivel de DOM
```

## 🛠 Instalación y Uso Local

Para levantar el entorno de desarrollo localmente:

1. Clonar el repositorio.
2. Asegurarse de tener Node.js instalado.
3. Instalar dependencias:
   ```bash
   npm install
   ```
4. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

### 📜 Scripts Disponibles

- `npm run dev`: Levanta el entorno de desarrollo usando Vite (Hot Module Replacement activado).
- `npm run build`: Ejecuta el compilador de TypeScript (`tsc -b`) y construye los archivos estáticos de producción en la carpeta `dist`.
- `npm run preview`: Levanta un servidor para previsualizar los archivos de la carpeta `dist` localmente.
- `npm run lint`: Ejecuta ESLint sobre el proyecto para verificar las reglas de estilo y errores comunes.

## 📝 Documentación del Código (TSDoc/JSDoc)

El código fuente contiene documentación inline estilo JSDoc/TSDoc en los componentes principales, entry points y vistas (en `src/sections/`). Esto permite que los IDEs y editores como VS Code puedan autocompletar e informar sobre las *props*, responsabilidades y flujos de las distintas entidades del sistema.
