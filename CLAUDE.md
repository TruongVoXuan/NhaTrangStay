# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

NhaTrangStay — a React 19 SPA (Create React App) for browsing/renting rooms in Nha Trang. Talks to a separate backend over HTTP; this repo is frontend-only.

## Commands

```bash
npm install
npm start              # dev server at http://localhost:3000
npm run build           # production build to build/
npm test                 # Jest + React Testing Library, watch mode
npm test -- --watchAll=false                  # single CI run, all tests
npm test -- --testPathPattern=LoginPage        # run one test file
```

There is no separate lint script; ESLint runs via `react-app`/`react-app/jest` config embedded in CRA's build/test pipeline (warnings show up in `npm start`/`npm run build` output).

## Environment variables

The app requires a `.env` file at the repo root (gitignored — see `.env.example` for the required keys):

- `REACT_APP_API_BASE_URL` — backend base URL, defaults to `http://localhost:8080` if unset.
- `REACT_APP_SUPABASE_URL` / `REACT_APP_SUPABASE_KEY` — used by `src/lib/supabaseClient.js` for Google OAuth.
- `REACT_APP_OPENROUTER_API_KEY` — used by the ChatBot (`src/components/shared/User/common/ChatBot/ChatBot.jsx`) to call OpenRouter directly from the browser.

CRA only inlines vars prefixed `REACT_APP_`, and only at build/start time — changing `.env` requires restarting `npm start`. Never hardcode keys back into source; add new secrets to `.env` + `.env.example` (placeholder only) instead.

## Architecture

### Routing & auth guards
- `src/App.jsx` is the root: wraps `AuthProvider` > `FavoriteProvider` > `BrowserRouter`, plus the global `ToastContainer` and the always-mounted `ChatBot`.
- `src/routes/AppRoutes.jsx` defines all routes. `src/routes/RoleBasedRoute.jsx` guards `/admin/*` and `/user/*` by reading `localStorage.authUser.role` (stripping a `ROLE_` prefix) and checking it against an `allowedRoles` list; mismatches redirect to `/forbidden` (no page currently handles that route — falls through). `AuthRoute` does the inverse for `/login`, `/register`, etc., redirecting already-authenticated users to `/admin/dashboard` (ADMIN) or `/` (USER).
- Only two roles exist: `ADMIN` and `USER`.

### Auth/token state
- `src/hooks/useAuth.js` exposes the `AuthProvider`/`useAuth()` context: `{ user, loading, isAuthenticated, login, logout, signup, refreshUser }`. On mount it restores the session by calling `getProfile()` if a token is present.
- Persisted in `localStorage`: `authToken`, `refreshToken`, `authUser` (JSON).
- `src/lib/api.js` is the single Axios instance: injects `Authorization: Bearer <authToken>` on every request, and on a 401 attempts one silent refresh via `POST /api/auth/refresh` before retrying the original request; if refresh fails it clears auth and redirects to `/login`.
- `src/lib/auth.js` has role/subscription helpers: `isAdmin()`, `isUser()`, `isPro()`, `canPostMoreRooms()` (FREE tier capped at 3 posts, PRO unlimited).

### API layer
- `src/lib/apiService.js` centralizes all backend calls, grouped by domain: `authAPI`, `postAPI`, `homeAPI`, `rentalAPI` (pre-orders/contracts), `userAPI` (admin user management), `reviewAPI`, `favoriteAPI`. All of them go through the shared Axios instance in `src/lib/api.js` — new API calls should be added here rather than calling `axios`/`fetch` ad hoc.
- Exception: `ChatBot.jsx` calls `fetch()` directly against `/api/posts/search` and the OpenRouter endpoint, bypassing `apiService`/`api.js` (so it does not get the auth header or 401-refresh behavior — that's intentional, the chat endpoint is public).

### Context providers
- `AuthProvider` (above) and `FavoriteProvider` (`src/components/contexts/FavoriteContext.jsx`, exposing `{ likedPostIds, favoriteCount, toggleFavorite }`) are the two app-wide contexts. `FavoriteProvider` fetches `favoriteAPI.getMyFavorites()` on mount when authenticated, and shows a "please login" toast instead of toggling when not.

### Other conventions
- `react-toastify`'s `ToastContainer` is mounted once in `App.jsx`; use `toast.success/error(...)` rather than adding another container.
- Maps (`src/components/shared/User/Post/MapSection/MapSection.jsx`) use `react-leaflet` with OSRM (no API key) for turn-by-turn routes from the user's location to a listing.
- Structure: `src/pages/User/*` and `src/pages/Admin/*` are route-level pages; `src/components/shared/*` are feature components shared across pages; `src/components/layout/*` are chrome (headers/sidebars).
