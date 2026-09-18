# The Grand Azure – Hotel Management System (Frontend)

Modern, high-performance web interface for **The Grand Azure Hotel Management System**, designed with the aesthetics of **Lodgify** featuring a pastel hierarchy, responsive sidebar, native Indian Rupee (`₹ / INR`) pricing, and real-time operational views.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite 8
- **Icons**: Lucide React
- **Visualizations**: Recharts (Dynamic revenue curves, occupancy trends)
- **PDF Generation**: jsPDF (Daily financial audit summary reports)
- **Styling**: Modern Vanilla CSS Design Tokens (Lodgify Color Palette: Primary `#0E94A8`, Accent `#0F172A`, Background `#F8FAFC`, Dark Mode `#0B1120`)
- **Linter**: Oxlint (High-performance Rust-based JavaScript/TypeScript linter)

---

## 📱 Navigation & Operational Views

The frontend includes dedicated operational panels based on Role-Based Access Control (RBAC):

1. **Dashboard (`DashboardView`)**:
   - Live KPIs (Occupancy Rate, RevPAR, ADR, Pending Tasks, Active Guests), turnover state counters, and platform distribution feeds.
   - **Today's Arrivals (`TodaysArrivals`) Widget**: Real-time card surfacing all guests arriving today with booking status, room category, arrival timestamp, and a 1-click "Check-in" button that updates room occupancy instantly.

2. **Reservations (`ReservationsView`)**:
   - Omnichannel bookings list with direct check-in and digital KYC upload/verification.
   - **Interactive Month Calendar View**: 35-day grid displaying reservation chips by date with month navigation. Features native **HTML5 drag-and-drop rescheduling** to move reservations to new check-in dates while preserving booking duration (length of stay) and automatically updating check-out dates.

3. **Rooms Management (`RoomsView`)**:
   - Room operational status matrix (`Available`, `Occupied`, `Dirty`, `Cleaning`, `Inspected`), room maintenance blocks, and floor plans.

4. **Housekeeping (`HousekeepingView`)**:
   - Cleaning task queues, turnaround timers, maintenance work orders, and maid assignment workflows.

5. **Kitchen & POS (`ConciergeView`)**:
   - Touch-friendly restaurant POS ordering, live Kitchen Display System (KDS) progression, and charge-to-room folio settlement.

6. **Billing & Invoicing (`FinancialsView`)**:
   - Append-only folio ledgers, dual-slab GST calculations (12% vs 18% accommodation, 5% F&B), and payment reconciliation.
   - **30-Day Revenue Trend Line Chart**: Comparative Recharts visualization comparing current daily revenue against previous month's baseline with Revenue (₹) and Occupancy (%) toggles.
   - **Export Daily Summary PDF**: One-click generation of audit-grade daily financial summaries via jsPDF covering KPIs, department revenue breakdowns, and GST collections.

7. **Inventory Management (`InventoryView`)**:
   - Stock SKUs, unit costs in ₹, category filtering, and suppliers.
   - **Low-Stock Visual Indicators**: Amber alert badges highlighting SKUs at or below their minimum reorder threshold.
   - **Low-Stock Filter Banner**: Quick filter button to instantly isolate critical stock items requiring immediate vendor procurement.

8. **Master Data & Admin (`AdminMasterView`)**:
   - Rooms & Floor Matrix CRUD
   - Dynamic Pricing & Demand Surge Calculator
   - F&B Menu Items Catalog CRUD
   - Inventory Stock & SKU Catalog CRUD
   - Staff Roster & Employee Profiles CRUD
   - **Enterprise Field Validation Policy Engine**: Admin interface to configure validation rules (required flag, min/max length, custom regex, error messages) with preset rules (`phone`, `email`, `pan`, `gstin`, `aadhaar`, `pincode`, `currency`) and a **live interactive regex sandbox/simulator**.
   - Hotel Master Profile with **Brand Logo File Upload** & Live Sidebar Sync
   - **Supabase Cloud Link Hub** with connection probing and 1-click cloud sync

9. **Staff & HR (`StaffView`)**:
   - Duty roster, biometric fingerprint punch-in simulator, and attendance records.

10. **User Management (`UsersView`)**:
    - User provisioning, role assignments (`Admin`, `Reception`, `Housekeeping`, `Kitchen`), and permission scoping.

11. **Audit & Channels (`AuditView`)**:
    - Immutable system audit logs and 2-way OTA channel synchronization (Booking.com, Airbnb, Expedia).

---

## 🎨 Theming & Persistent Dark Mode

The application features a sleek dark mode tailored for low-light front desk and night auditor environments:

- **Header Theme Switcher**: Toggle button with Sun/Moon icons in the top bar.
- **Body Class Synchronization**: Toggles the `dark` class directly on `document.body` for consistent global styling across modal backdrops and portals.
- **Persistent Storage**: Stores user preference in `localStorage` under `hms_theme` (`'light'` or `'dark'`), preserving user preference across page reloads and sessions.

---

## 📋 Standardized Master Dropdowns & Validation Engine

To eliminate typing inconsistencies and support Indian hospitality compliance:

- **`dropdownData.ts`**:
  - **36 Indian States & Union Territories** with official 2-digit GST state codes (e.g. `27 - Maharashtra`, `07 - Delhi`, `30 - Goa`).
  - **Standardized Inventory UOM Units**: `KGS`, `LTRS`, `PCS`, `PACKS`, `BOTTLES`, `BOXES`, `ROLLS`, `TUBES`, `CANS`.
  - **Inventory Categories**: `Food & Beverage`, `Housekeeping Supplies`, `Linen & Bedding`, `Toiletries & Amenities`, `Maintenance & Engineering`, `Stationery & Office`.
  - **Staff Departments & Hospitality Roles**: Pre-configured corporate hierarchy from General Manager to Housekeeping Attendant.
  - **Shift Types**: Standard hospitality shifts (`Morning`, `Afternoon`, `Night`, `General`).
  - **Government Photo ID Types**: `Aadhaar Card`, `Passport`, `Driving License`, `Voter ID`, `PAN Card`.

- **`validationEngine.ts`**:
  - Centralized validation rules engine with regex presets for phone, email, PAN, GSTIN, Aadhaar, and currency.
  - Returns structured validation results (`isValid`, `errors`) with seamless backend policy synchronization.

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

Runs `oxlint` with 0 warnings and 0 errors across all component and view files.

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
