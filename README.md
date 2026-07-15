# TodoList

> A portfolio task management SPA built as the capstone project of the [IT-Incubator](https://it-incubator.io) React course.

Manage multiple todo lists, organize tasks with drag-and-drop, filter by status, and sync everything with a real REST API — all wrapped in a polished, responsive UI with dark mode support.

---

## Live Demo

[https://todolist-beta-ruddy-85.vercel.app](https://todolist-beta-ruddy-85.vercel.app)

### Demo credentials

| | |
|---|---|
| **Email** | `178.kronos.178@gmail.com` |
| **Password** | `TodolistDemo2026!@#` |

Use these to sign in without creating an account.

---

## Deployment

### Vercel (recommended)

1. Push the repository to [GitHub](https://github.com/nvmit95/Todolist).
2. Import the project in [Vercel](https://vercel.com/new).
3. Vercel auto-detects Vite — `buildCommand` and `outputDirectory` are set in `vercel.json`.
4. Add environment variables in **Project → Settings → Environment Variables**:

| Variable | Value |
|----------|-------|
| `VITE_BASE_URL` | `https://social-network.samuraijs.com/api/1.1/` (local only; production hardcodes `/backend/`) |
| `VITE_API_KEY` | Your SamuraiJS API key |

> **Why `/backend` + `api/bridge.ts`?** For a normal Vite SPA, Vercel docs recommend SPA rewrites + (optionally) rewriting `/api` to an upstream. That is enough for most APIs. **SamuraiJS is not a normal API here:** browser POSTs that include `Origin: https://*.vercel.app` get **HTTP 403** (even with a valid API key). A plain rewrite still forwards `Origin`, so create/login fail. The small serverless bridge re-fetches SamuraiJS **without** `Origin` / cookies. Locally the browser still talks to SamuraiJS directly (`VITE_BASE_URL`) — CORS on `localhost` works.

5. Deploy. Client-side routes (`/login`, etc.) are handled via SPA rewrites in `vercel.json`. After changing env vars, **redeploy** (Vite inlines `VITE_*` at build time).

### GitHub

The repo includes a CI workflow (`.github/workflows/ci.yml`) that runs on every push and pull request to `main`:

- `pnpm install --frozen-lockfile`
- `pnpm build` (type-check + Vite production build)
- `pnpm test:run`

To publish changes:

```bash
git add .
git commit -m "your message"
git push origin main
```

---

## Screenshots

<!-- Add screenshots after deployment -->
<!-- ![Main page](./docs/screenshots/main.png) -->

---

## Features

| Feature | Description |
|---------|-------------|
| **Authentication** | JWT login with captcha support, protected routes, session persistence |
| **CRUD** | Full create / read / update / delete for todo lists and tasks |
| **Drag & Drop** | Reorder tasks within a list using `@dnd-kit` with optimistic UI |
| **Filtering** | All / Active / Done per list. `All` uses server-paginated data; `Active` / `Done` load all tasks for the list, filter client-side, then paginate the result |
| **Pagination** | Server-side for `All`; client-side for filtered views (page size configurable) |
| **Task progress** | Completed / total progress bar in each list header |
| **Optimistic Updates** | Instant UI feedback on task edits and list deletion, with automatic rollback on error |
| **Dark Mode** | Light / dark theme toggle with custom MUI palette |
| **Error Handling** | Global snackbar for API errors, loading indicator in header |
| **Skeleton Loaders** | Graceful loading states for lists and tasks |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI | React 19, TypeScript, Material UI 7 |
| State | Redux Toolkit, RTK Query |
| Routing | React Router 7 |
| Forms | React Hook Form + Zod |
| DnD | @dnd-kit |
| Build | Vite 7, SWC |
| Tests | Vitest |
| API | [SamuraiJS Social Network API](https://social-network.samuraijs.com) |

---

## Architecture

The project follows **Feature-Sliced Design** principles:

```
src/
├── app/                  # App shell, store, routing entry
│   ├── App.tsx
│   ├── Main.tsx
│   ├── store.ts
│   └── baseApi.ts        # RTK Query base API (auth headers, cache config)
├── features/
│   ├── auth/             # Login, auth API, validation schemas
│   └── todolists/        # Lists, tasks, API slices, UI components
└── common/               # Shared components, hooks, theme, utils
    ├── components/
    ├── hooks/
    ├── theme/
    └── routing/
```

### Data Flow

```
UI Component
    ↓ dispatch / hook
RTK Query endpoint  →  REST API (SamuraiJS)
    ↓ cache update
Redux store  →  UI re-render
```

**Key RTK Query patterns used:**
- `providesTags` / `invalidatesTags` for automatic cache invalidation
- `onQueryStarted` + `updateQueryData` for optimistic updates
- `refetchOnFocus` / `refetchOnReconnect` for data freshness
- `keepUnusedDataFor: 10800` (3-hour cache TTL)

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+

### 1. Clone & install

```bash
git clone git@github.com:nvmit95/Todolist.git
cd Todolist
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `VITE_BASE_URL` | SamuraiJS API base URL |
| `VITE_API_KEY` | Your API key from [social-network.samuraijs.com](https://social-network.samuraijs.com) |

### 3. Run

```bash
pnpm dev        # http://localhost:3000
pnpm build      # production build
pnpm preview    # preview production build
pnpm test       # run unit tests
```

---

## API Integration

The app communicates with the SamuraiJS backend:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | Login, returns JWT token |
| `GET` | `/auth/me` | Validate session on app init |
| `DELETE` | `/auth/login` | Logout |
| `GET` | `/todo-lists` | Fetch all lists |
| `POST` | `/todo-lists` | Create list |
| `PUT` | `/todo-lists/:id` | Rename list |
| `DELETE` | `/todo-lists/:id` | Delete list |
| `GET` | `/todo-lists/:id/tasks` | Fetch tasks (paginated) |
| `POST` | `/todo-lists/:id/tasks` | Create task |
| `PUT` | `/todo-lists/:id/tasks/:taskId` | Update task (title, status, order) |
| `DELETE` | `/todo-lists/:id/tasks/:taskId` | Delete task |

All requests include `API-KEY` header and `Authorization: Bearer <token>`.

---

## Testing

```bash
pnpm test
```

Unit tests cover:
- `loginSchema` — Zod validation rules for the login form
- `createTaskModel` — task update model builder (used in optimistic updates & DnD)
- `appSlice` — global app state reducers and selectors

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server on port 3000 |
| `pnpm build` | Type-check + production build |
| `pnpm preview` | Serve production build locally |
| `pnpm test` | Run Vitest in watch mode |
| `pnpm test:run` | Run Vitest once (used in CI) |

---

## Author

**Nikita** — [GitHub](https://github.com/nvmit95)

Final project of the IT-Incubator React/TypeScript course.

---

## Credits

Favicon: **Stock Todo Icon** by **Gartoon Team** (Gartoon Redux Misc Icons), GPL. Commercial use allowed.
