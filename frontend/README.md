# The Grand Azure – Hotel Management System (Frontend)

Modern, high-performance web interface for **The Grand Azure Hotel Management System**, designed with the aesthetics of **Lodgify** featuring a pastel hierarchy, responsive sidebar, native Indian Rupee (`₹ / INR`) pricing, and real-time operational views.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite 8
- **Icons**: Lucide React
- **Styling**: Modern Vanilla CSS Design Tokens (Lodgify Color Palette: Primary `#0E94A8`, Accent `#0F172A`, Background `#F8FAFC`)
- **Linter**: Oxlint (High-performance Rust-based JavaScript/TypeScript linter)

---

## 📱 Navigation & Operational Views

The frontend includes dedicated operational panels based on Role-Based Access Control (RBAC):

1. **Dashboard (`DashboardView`)**: Live KPIs (Occupancy Rate, RevPAR, ADR, Pending Tasks, Active Guests), room turnover state counters, real-time revenue curves, and platform distribution feeds.
2. **Reservations (`ReservationView`)**: Omnichannel bookings list, direct check-in, digital KYC document upload and verification.
3. **Rooms Management (`RoomsView`)**: Room status matrix (`Available`, `Occupied`, `Dirty`, `Cleaning`, `Inspected`), room maintenance blocks, and floor plans.
4. **Housekeeping (`HousekeepingView`)**: Cleaning task queues, turnaround timers, maintenance work orders, and maid assignment.
5. **Kitchen & POS (`ConciergeView`)**: Touch-friendly restaurant POS ordering, live Kitchen Display System (KDS) progression, and charge-to-room folio settlement.
6. **Billing & Invoicing (`FinancialsView`)**: Append-only folio ledgers, dual-slab GST calculations (12% vs 18% accommodation, 5% F&B), and payment reconciliation.
7. **Master Data & Admin (`AdminMasterView`)**:
   - Rooms & Floor Matrix CRUD
   - Dynamic Pricing & Demand Surge Calculator
   - F&B Menu Items Catalog CRUD
   - Inventory Stock & SKU Catalog CRUD
   - Staff Roster & Employee Profiles CRUD
   - Hotel Master Profile with **Brand Logo File Upload** & Live Sidebar Sync
   - **Supabase Cloud Link Hub** with connection probing and 1-click cloud sync
8. **Staff & HR (`StaffView`)**: Duty roster, biometric fingerprint punch-in simulator, and attendance records.
9. **User Management (`UsersView`)**: User provisioning, role assignments (`Admin`, `Reception`, `Housekeeping`, `Kitchen`), and permission scoping.
10. **Audit & Channels (`AuditView`)**: Immutable system audit logs and 2-way OTA channel synchronization (Booking.com, Airbnb, Expedia).

---

## 🚀 Development & Build Scripts

Run within the `frontend/` directory (or use workspace commands from the root):

### 1. Start Local Dev Server

```bash
npm run dev
```

Launches the Vite dev server at `http://localhost:3000/` with Hot Module Replacement (HMR).

### 2. Lint Codebase

```bash
npm run lint
```

Runs `oxlint` with 0 warnings and 0 errors across all 19 component and view files.

### 3. Build Production Bundle

```bash
npm run build
```

Executes TypeScript typecheck (`tsc -b`) and bundles static assets into `dist/` ready for Nginx deployment.

---

## ⚙️ Environment Variables

Create `.env` or `.env.production`:

```env
# Base URL for Backend REST API
VITE_API_BASE_URL=http://localhost:5000/api
```

When deployed behind Nginx reverse proxy, set `VITE_API_BASE_URL=/api`.
