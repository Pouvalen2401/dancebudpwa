# Copilot / AI Agent Instructions for DanceBud PWA

Goal: help an AI code assistant become productive quickly in this repository (single-page PWA). Keep edits small and preserve load-order and global contract patterns.

Quick architecture (big picture)
- Single-page Progressive Web App. `index.html` is the shell; all UI screens are HTML fragments in `screens/*.html` and are loaded at runtime by `js/navigation.js` via `Navigation.navigate('screenName')`.
- JS modules live in `js/` and are loaded as plain <script> tags in a strict order inside `index.html`. Order matters: `storage.js` → `database.js` → `theme.js` → sensors (`camera.js`, `audio.js`, `motion.js`) → `notifications.js`/`online-detector.js` → `session.js` → `navigation.js` → `app.js`.
- Modules export globals on `window` (e.g., `window.Storage`, `window.Database`, `window.ThemeSystem`, `window.CameraModule`, `window.Session`, `window.Navigation`). Do not convert to ES modules without updating `index.html` loading order and all consumers.
- Persistent storage uses IndexedDB via `js/database.js` (stores: `sessions`, `settings`, `statistics`). `Database.init()` runs on load.
- Camera & pose detection use TensorFlow.js + `@tensorflow-models/pose-detection` (MoveNet). These run in `js/camera.js` and expect the TF scripts to be included in `index.html` before the module.
- Service worker is `sw.js` (minimal). PWA manifest is `manifest.json`.

Developer workflows & important run/debug notes
- The app requires HTTP(S) to access camera (getUserMedia) and for service worker functionality. Use a local HTTP server — e.g. VS Code Live Server, `python -m http.server 8080`, or `npx http-server -c-1 -p 8080`.
- VS Code debug config exists at `.vscode/launch.json` (launches Chrome at `http://localhost:8080`). Use that for quick browser debugging.
- If testing camera or MoveNet locally, use `https://` or `http://localhost` (localhost counts as secure). Avoid opening files with `file://`.
- To inspect persistent state: open DevTools → Application → IndexedDB (DanceBudDB) or Local Storage for `Storage` wrapper values.
- Logs: modules use extensive console logging phrases (emoji prefixes). Search for phrases like `"✅ Database"`, `"🧭 Navigating to"`, `"🎬 Starting session"` to find run-time events.

Project-specific conventions and patterns
- Global module pattern: modules attach objects to `window`. When interacting with a module, call it via the global name (e.g., `Navigation.navigate('home')`).
- Load-order is critical: adding new modules must preserve dependency order in `index.html`. If a module uses `Database`/`Storage`, it must be loaded after `database.js`/`storage.js`.
- Screens are static HTML snippets (no build step). Each `screens/<name>.html` should provide markup and call global modules for behavior. `navigation.initializeScreen(screenName)` is the place to add programmatic initialization for a new screen.
- Database shape: session objects saved by `Database.saveSession(session)` expect fields like `routineName`, `duration`, `score`, `steps`, `turns`, `avgBPM`, and `date`. The DB auto-increments `id`.
- Theme persistence: `ThemeSystem` reads/writes `darkMode` in `settings` store via `Database.saveSetting('darkMode', ...)`.
- Camera/pose: `CameraModule` exposes `startCamera(videoElem, canvasElem)`, `startPoseDetection(onPoseDetected)`, `calculatePostureScore(pose)`. Pose detection assumes MoveNet and uses `pose.keypoints` indices consistent with TF MoveNet.

Integration points & external dependencies
- CDN dependencies in `index.html`: Bootstrap CSS/JS, Bootstrap Icons, TensorFlow.js, `@tensorflow-models/pose-detection`, Chart.js. Keep versions consistent when updating.
- Service worker registration occurs in `index.html`; file is `sw.js` in repo root.
- No package.json/build pipeline: repository is static; prefer lightweight local servers for testing.

How to add features safely (examples)
- Add a new screen: create `screens/<name>.html` → ensure any DOM hooks are initialized by adding a case in `js/navigation.js` `initializeScreen()` for `<name>` that wires event handlers and calls global modules.
- Add a new module: create `js/<new>.js`, attach implementation to `window.NewModule`, and insert a script tag in `index.html` before `js/app.js`. Update any code that expects the global.
- Add an IndexedDB store: modify `js/database.js` `onupgradeneeded` (increment `dbVersion`) and add object store creation. Be cautious: changing DB version will trigger upgrade flows in browsers.

Debugging tips specific to this project
- If a screen fails to load, `Navigation.showError` renders a helpful debug view (including the exact path it tried to fetch). Use that to verify `screens/<name>.html` exists and fetch returns 200.
- Camera issues: check `window.isSecureContext` and DevTools console for `getUserMedia` errors. `CameraModule.requestPermission()` shows friendly alerts for `NotAllowedError` and `NotFoundError`.
- Pose detector errors often mean the TF scripts weren't loaded or version mismatch. Confirm `<script>` tags order in `index.html`.

Files of interest (quick reference)
- `index.html` — app shell, script load order, PWA config, and runtime registration (service worker, online/offline handlers).
- `js/storage.js` — localStorage wrapper, used by lightweight features.
- `js/database.js` — IndexedDB wrapper (sessions/settings/statistics) — central persistence.
- `js/theme.js` — loads saved theme from DB and toggles dark/light.
- `js/camera.js` — camera + MoveNet pose detection and posture scoring.
- `js/session.js` — session lifecycle (start/pause/resume/end) and summary generation.
- `js/navigation.js` — dynamic screen loader and initializer (where to wire screen-specific JS).
- `js/app.js` — bootstraps ThemeSystem, Database, and initial navigation.
- `sw.js` — service worker (minimal), update flow in `index.html` listens for `updatefound`.
- `screens/*.html` — UI fragments loaded at runtime.

When making edits
- Preserve the current global-attach pattern or convert the whole app to modules in one coordinated change (not piecemeal).
- Preserve script load order in `index.html` — adding/removing script tags can break runtime assumptions.
- Prefer small, reversible PRs; keep behavior observable in the browser and use `Navigation.showError` for quick debugging.

If anything is unclear or you need a deeper walkthrough of a particular module (e.g., `camera.js` posture scoring or `database.js` upgrade flow), tell me which area and I will expand the instructions or add small code examples.

---
Please review this draft and tell me which areas you want expanded (examples, coding conventions, or more file-level notes).