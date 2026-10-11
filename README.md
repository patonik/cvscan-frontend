# Candidate Service UI

A Vue 3 + TypeScript admin UI for every endpoint of the `candidate-service` REST API
(`GET/POST/PUT/DELETE /api/v1/candidates`, `PATCH .../status`, `GET .../status-history`).

Built to run behind a reverse-proxied Node.js server: the browser only ever calls relative
`/api/...` paths, and a small Express server proxies those to the real backend. There is no
base-URL field in the UI and no CORS configuration to manage — frontend and backend are
same-origin from the browser's point of view in both development and production.

## Stack

| | |
|---|---|
| Vue 3 (Composition API, `<script setup>`) | UI |
| TypeScript, checked with `vue-tsc` | types shared between components, the API client, and the DTOs below |
| Vite | dev server + build |
| Express + `http-proxy-middleware` | production reverse proxy / static file server (`server.ts`) |
| `tsx` | runs `server.ts` directly, no separate server build step |

## Project layout

```
index.html                     Vite entry
vite.config.ts                 dev-server proxy: /api -> API_TARGET
server.ts                      production server: serves dist/, proxies /api -> API_TARGET
src/
  main.ts                      mounts App
  App.vue                      wires the pieces below together
  types.ts                     TS types mirroring the backend's DTOs (openapi.yaml)
  api.ts                       typed fetch wrapper, one function per endpoint
  composables/
    useCandidates.ts           shared state (list, filters, pagination, selected candidate,
                                history) + the actions that call api.ts; also mirrors the
                                backend's status state machine so the UI only ever offers a
                                transition PATCH /status would actually accept
  components/
    CandidateFilters.vue       verdict / status / position / search / sort / page size
    CandidateTable.vue         result list + pagination
    CandidateForm.vue          create (POST) and edit (PUT) form, including the
                                criteria / experience / questions arrays
    CandidateDetail.vue        selected candidate: edit / delete, status change (PATCH),
                                status history (GET .../status-history)
    ErrorBanner.vue            renders the backend's ErrorResponse shape (status, code,
                                message, field-level details)
```

## Running it

### Development

```bash
npm install
npm run dev
```

Opens on Vite's dev server (default `http://localhost:5173`). The dev-server proxy in
`vite.config.ts` forwards `/api/*` to the backend at `http://localhost:8080` by default;
point it elsewhere with:

```bash
VITE_API_TARGET=http://localhost:9000 npm run dev
```

### Production (the reverse-proxy setup this was built for)

```bash
npm run build     # vue-tsc -b && vite build -> dist/
npm start         # tsx server.ts
```

`server.ts` serves `dist/` as static files and reverse-proxies `/api/*` to `API_TARGET`
(env var, defaults to `http://localhost:8080`), on `PORT` (defaults to `3000`):

```bash
API_TARGET=http://backend-host:8080 PORT=3000 npm start
```

### Type-checking only

```bash
npx vue-tsc -b --noEmit
```

(`npm run build` already runs this before `vite build`; `.vue` files are type-checked
through `tsconfig.app.json`, `vite.config.ts` and `server.ts` through `tsconfig.node.json`.)

## Notes

- **No CORS config needed on the backend.** If the Spring app still has a permissive
  `CorsConfig` left over from an earlier non-proxied version of this UI, it's dead weight
  now, not a requirement — everything here goes through the proxy as same-origin requests.
- **Status transitions are client-validated against the same rules as `CandidateStatus`
  on the backend** (`NEW → IN_REVIEW → INVITED/REJECTED`, `INVITED → APPROVED/REJECTED`),
  purely to avoid a round trip that would come back `422`. The backend remains the actual
  source of truth; if the two ever drift, the backend wins and the UI just shows the error.
- **Known minor limitation:** in `CandidateForm.vue`, clicking "Новый кандидат" twice in a
  row while the form is already open and has unsaved edits won't reset it — Vue's `watch`
  doesn't refire when the `editing` prop goes from `null` to `null`. Closing the form first
  avoids it.
- `criteria`, `experience`, and `questions` are edited as real add/remove row lists (not
  serialized text), each row typed against `CriteriaItem` / `ExperienceItem` from `types.ts`.