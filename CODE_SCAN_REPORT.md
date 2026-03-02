# Code Scan Report – Akions / Ekions App

**Scan date:** Feb 18, 2025  
**Scope:** `akions-app/frontend/src`, `akions-app/backend` (excluding node_modules)

---

## 1. Summary counts

| Category | Count | Notes |
|----------|------|--------|
| **Console statements (app code)** | ~90+ | Frontend ~55, Backend ~35 (logs, errors, warns) |
| **`any` types (frontend)** | ~35+ | Weak typing in screens, context, components |
| **Security / config issues** | 5 | Hardcoded secrets, weak defaults |
| **Missing patterns** | 4 | No Error Boundary, no ESLint/Prettier, no request validation lib |
| **Oversized file** | 1 | HomeScreen.tsx ~1984 lines |
| **Package name typo** | 1 | Frontend package "ekions-app" vs project "akions" |

---

## 2. Errors and flaws

### 2.1 Security (critical / high)

| # | Location | Issue | Risk |
|---|----------|--------|------|
| 1 | `backend/scripts/createAdmin.js` | **Hardcoded admin password** `Mohit@123` and email `admin@akionsmpss` | Credential leak if repo is shared; weak default admin |
| 2 | `backend/server.js` | `JWT_SECRET` fallback `'change-me-dev-secret'` when env not set | If deployed without env, tokens are weak/predictable |
| 3 | `backend/middleware/auth.js` | Same JWT fallback `'change-me-dev-secret'` | Same as above |
| 4 | `backend/routes/payment.js` | Razorpay fallbacks `'rzp_test_1234567890'` and `'test_secret_1234567890'` | Payment API may run with test/placeholder keys in production |
| 5 | `backend/server.js` | CORS allows all origins in non-dev (callback(null, true) for unknown origins) | Overly permissive; should restrict in production |

### 2.2 Code quality

| # | Location | Issue |
|---|----------|--------|
| 6 | Frontend screens (many) | **Heavy use of `any`**: `navigation: any`, `route: any`, `error: any`, `(process as any).env`, `(i as any).skills`, etc. (~35+ usages) |
| 7 | `frontend/src/config/api.ts` | `(process as any).env` – should use proper typing (e.g. Expo types or declare process.env) |
| 8 | `frontend/src/screens/HomeScreen.tsx` | **~1984 lines** – single file too large; hard to maintain and test |
| 9 | Frontend package.json | No **ESLint**, **Prettier**, or lint scripts | Inconsistent style and no automated checks |
| 10 | Backend package.json | No **ESLint** / **Prettier** for app code | Same as above |
| 11 | Frontend | **No React Error Boundary** | Uncaught errors can white-screen the app |
| 12 | Backend routes | No **express-validator / joi / zod** – only ad‑hoc checks (e.g. validateEmail, validatePassword in server.js) | Inconsistent and incomplete input validation |

### 2.3 Logging and debugging

| # | Location | Issue |
|---|----------|--------|
| 13 | Frontend (multiple) | **console.log** in production code (e.g. API config, carousel, image load, chatbot) – can leak info and clutter console |
| 14 | Frontend | **console.error** used for user-facing errors – no central error reporting (e.g. Sentry) |
| 15 | Backend | Many **console.log/error** – no structured logger (e.g. winston/pino); sensitive data might be logged |

### 2.4 Naming and consistency

| # | Location | Issue |
|---|----------|--------|
| 16 | `frontend/package.json` | Package name **"ekions-app"** vs project/folder **"akions"** – typo or inconsistency |
| 17 | `backend/scripts/createAdmin.js` | Admin email **admin@akionsmpss** – likely typo (akions vs akionsmpss) |

---

## 3. Changes a senior developer would make

### 3.1 Security (priority 1)

- **Remove all hardcoded secrets**
  - `createAdmin.js`: Read admin email and password from **env** (e.g. `ADMIN_EMAIL`, `ADMIN_PASSWORD`) or CLI args; fail fast if missing in production.
- **No default JWT_SECRET in production**
  - In `server.js` and `middleware/auth.js`: if `process.env.JWT_SECRET` is empty and `NODE_ENV === 'production'`, **exit** with a clear error instead of using `'change-me-dev-secret'`.
- **Razorpay**
  - In `payment.js`: do **not** fall back to test keys; require `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in production and exit or return 503 if missing.
- **CORS**
  - In production, **allow only known origins** (e.g. frontend domain(s)); remove the branch that does `callback(null, true)` for every unknown origin.

### 3.2 Frontend structure and types

- **Replace `any` with proper types**
  - Use React Navigation types: `NativeStackNavigationProp`, `NativeStackScreenProps`, etc., and shared types from `src/types` (e.g. for API responses and errors).
- **Centralize API config**
  - Type `process.env` (e.g. for Expo use `EXPO_PUBLIC_*`) and remove `(process as any).env` in `api.ts`.
- **Split HomeScreen**
  - Break into smaller components: e.g. Carousel, Hero, ServicesPreview, Testimonials, Footer section, each in its own file; keep HomeScreen as composition only (~100–200 lines).
- **Add Error Boundary**
  - One global (or per major section) Error Boundary component; log to a service (e.g. Sentry) and show a fallback UI instead of white screen.

### 3.3 Backend robustness

- **Structured logging**
  - Introduce a logger (e.g. **winston** or **pino**) with levels; replace raw `console.log`/`console.error` and avoid logging secrets or full request bodies.
- **Input validation**
  - Add **express-validator** (or joi/zod) for all auth, payment, contact, and admin routes: validate body/params/query and sanitize; return 400 with clear messages on failure.
- **Error handling**
  - Use a central error middleware and optional error codes; avoid leaking stack or internal details in production responses.

### 3.4 Tooling and consistency

- **ESLint + Prettier**
  - Add to both frontend and backend (app code only): TypeScript/React rules on frontend, Node/ESLint on backend; run in CI and fix critical rules first.
- **Fix naming**
  - Align package name with product (e.g. `akions-app` if the product is Akions) and fix admin email domain (e.g. `admin@akions...` instead of `admin@akionsmpss` if it’s a typo).

### 3.5 Production readiness

- **Remove or guard console.log**
  - In frontend: remove debug logs or wrap in `if (__DEV__)` / env check; keep only intentional error reporting.
- **Env checklist**
  - Document and enforce required env vars for production: `JWT_SECRET`, `MONGODB_URI`, `RAZORPAY_*`, `SMTP_*`, `ADMIN_EMAIL`, and for createAdmin `ADMIN_EMAIL`/`ADMIN_PASSWORD` (or equivalent).

---

## 4. Quick reference – files to touch first

| Priority | File(s) | Action |
|----------|---------|--------|
| P0 | `backend/scripts/createAdmin.js` | Env-based credentials; no hardcoded password/email |
| P0 | `backend/server.js`, `backend/middleware/auth.js` | JWT_SECRET required in production; tighten CORS |
| P0 | `backend/routes/payment.js` | No Razorpay key fallbacks in production |
| P1 | `frontend/src/config/api.ts` | Type env; remove or guard console.log |
| P1 | `frontend/src/screens/HomeScreen.tsx` | Split into smaller components |
| P1 | All screens using `any` | Add proper navigation and data types |
| P2 | Frontend + backend package.json | Add ESLint + Prettier and lint script |
| P2 | App root / layout | Add React Error Boundary |
| P2 | Backend routes | Add express-validator (or similar) and central error middleware |

---

**Report generated by automated scan.** Address P0 security items first, then types and structure, then tooling and logging.
