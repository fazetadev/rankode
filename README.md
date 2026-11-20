# rankode

Plataforma minimalista de programación competitiva y práctica algorítmica ejecutada 100% en local.

## Características principales

- **60 desafíos interactivos** en 4 categorías (`Lógica`, `Debugging`, `Resolución de problemas`, `Optimización`) y 4 niveles de dificultad (`Fácil`, `Media`, `Difícil`, `Experto`).
- **Ejecución real de JavaScript** en Web Worker aislado con límite de 3s, captura de consola, pruebas personalizadas y pruebas de rendimiento.
- **Juez simulado** en cliente para `Python`, `Java` y `C++` (etiquetado explícitamente como *Ejecución simulada*).
- **Práctica rápida (`/practice`)**: 60 microejercicios en sesiones de 10 preguntas sobre salida de código, detección de bugs y complejidad temporal.
- **Autenticación local (`Demo local`)**: registro, inicio de sesión, cambio de cuenta o acceso como invitado; toda cuenta nueva inicia desde `0 XP`.
- **Progreso persistente en `localStorage`** (`rankode_state_v2`) con migración automática desde versiones anteriores.

## Desarrollo y scripts

El servidor de desarrollo corre en el puerto **3000** (`http://localhost:3000`).

```bash
npm install
npm run dev        # Inicia Vite en el puerto 3000
npm run build      # Compila la aplicación para producción
npm run preview    # Previsualiza el build generado
npm run lint       # Verifica tipos con TypeScript (tsc --noEmit)
npm run typecheck  # Alias de verificación de tipos
npm test           # Ejecuta los tests unitarios con tsx --test
npm run clean      # Elimina la carpeta dist
```

## Estructura del proyecto

- `src/components/{ui,features,layout}` — Componentes reutilizables, editor CodeMirror, barra superior y navegación.
- `src/pages` — `Login`, `Dashboard`, `Challenges`, `ChallengeDetail`, `Practice`, `Ranking`, `Profile`, `Ranks`.
- `src/data` — Catálogo de 60 desafíos (`challenges.ts` + `challenges/*`), 60 quizzes (`quizzes.ts`), jugadores simulados y estado inicial en cero (`seed.ts`).
- `src/lib` — Ejecutor JS/Worker (`jsRunner.ts`, `runner.worker.ts`, `judge.ts`), sistema XP y rangos (`xp.ts`), analizador heurístico de complejidad (`complexity.ts`), racha (`streak.ts`), migración (`migration.ts`) y tests unitarios (`*.test.ts`).
- `src/store/useAppStore.ts` — Estado global con Zustand + persistencia versionada.
- `src/i18n` — Diccionario tipado `es`/`en` y hook `useT()`.
