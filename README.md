# Arena (Prototipo local)

Prototipo web interactivo de una plataforma minimalista de programación competitiva construido con Vite, React, TypeScript estricto, Tailwind CSS, Zustand y CodeMirror 6. Funciona 100% en local sin backend ni llamadas a APIs externas.

## Requisitos previos

- **Node.js 18+** (recomendado 20+)
- **npm 9+**

## Ejecución local paso a paso

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:5173](http://localhost:5173) (o el puerto configurado por Vite en el entorno actual) en tu navegador.

3. Generar compilación de producción:
   ```bash
   npm run build
   ```

4. Previsualizar la compilación de producción localmente:
   ```bash
   npm run preview
   ```

5. Verificación de tipos y tests unitarios:
   ```bash
   npm run lint
   npx --yes tsx --test src/lib/xp.test.ts src/lib/challenges.test.ts
   ```

## Estructura del proyecto

```text
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── App.tsx                 # Enrutado principal y carga diferida del editor
    ├── config.ts               # Constante única APP_NAME y metadatos de plataforma
    ├── index.css               # Fuentes @fontsource locales y configuración Tailwind
    ├── main.tsx
    ├── types.ts                # Interfaces TypeScript estrictas
    ├── components/
    │   ├── features/           # CodeEditor, TestResults, XpBar, XpChart, Heatmap, Ranking...
    │   ├── layout/             # Sidebar (escritorio) y MobileNav (móvil)
    │   └── ui/                 # Button, Card, Badge, Tabs, Modal, ProgressBar, Select, Input, Toast
    ├── data/
    │   ├── challenges.ts       # 24 desafíos (6 por categoría) con tests y soluciones
    │   ├── players.ts          # 50 jugadores ficticios con semilla determinista
    │   └── seed.ts             # Estado inicial de demostración
    ├── lib/
    │   ├── format.ts           # Formateo de fechas, números y serialización segura
    │   ├── judge.ts            # Interfaz Runner, orquestador Worker JS y juez simulado
    │   ├── jsRunner.ts         # Ejecutor de JavaScript compartido (acepta `export` y `module.exports`)
    │   ├── runner.worker.ts    # Web Worker aislado para ejecución real de JavaScript
    │   └── xp.ts               # Funciones puras de XP, bonificaciones y rangos
    ├── pages/
    │   ├── Dashboard.tsx
    │   ├── Challenges.tsx
    │   ├── ChallengeDetail.tsx
    │   ├── Ranking.tsx
    │   ├── Profile.tsx
    │   ├── Ranks.tsx
    │   └── NotFound.tsx
    └── store/
        └── useAppStore.ts      # Estado global Zustand con persistencia versionada en localStorage
```

## Cómo cambiar `APP_NAME`

Abre `src/config.ts` y modifica únicamente la constante `APP_NAME`:

```ts
export const APP_NAME = 'TuNuevoNombre';
```

El nombre se propaga automáticamente a la barra lateral, título e información de la plataforma. (Actualiza también `<title>` en `index.html` si deseas cambiar el título de la pestaña del navegador).

## Cómo añadir un desafío nuevo

1. Abre `src/data/challenges.ts` y añade un objeto al arreglo `CHALLENGES` siguiendo la interfaz `Challenge` definida en `src/types.ts`.
2. Define `id`, `title`, `category` (`logic` | `debugging` | `problem-solving` | `optimization`), `difficulty`, `xp`, `entryPoint`, `description`, `examples`, `constraints`, `hints` (3 pistas), `starterCode`, `referenceSolution` y `tests` (`visible` y `hidden`).
3. Ejecuta `npx --yes tsx --test src/lib/challenges.test.ts` para verificar automáticamente que tu solución de referencia en JavaScript pasa todos los casos y que las plantillas iniciales fallan como se espera.

## Cómo restablecer los datos de demo

1. Navega a **Perfil** (`/profile`).
2. Pulsa **Restablecer datos de demo** en la esquina superior derecha y confirma la acción en el diálogo modal.
3. También puedes limpiar manualmente la clave `arena_platform_state_v1` en `localStorage` desde las herramientas de desarrollo del navegador.
