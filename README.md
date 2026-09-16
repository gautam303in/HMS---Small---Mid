# The Grand Azure – Hotel Management System (HMS)

> A production-ready, modular Hotel Management System designed for small-to-mid size boutique hotels and resorts. Covers the complete guest lifecycle from multi-channel reservations to digital check-in with KYC, folio billing with GST compliance, restaurant POS with Kitchen Display (KDS), housekeeping dispatch, inventory management, duty rosters, and guest loyalty.

Built with design inspiration from the modern **Lodgify** hospitality interface, featuring clean aesthetics, pastel visual hierarchy, and signature electric-lime accents.

---

## Architecture Diagram

Refer to the visual system blueprint in [Architecture Diagram.png](file:///d:/Projects/Gautam_Github/HMS%20-%20Small%20&%20Mid/Architecture%20Diagram.png):

```text
       [ Client Applications ]
┌─────────────────┬──────────────────┬─────────────────┐
│ Front Desk Web  │ Housekeeping App │ Restaurant POS  │
└────────┬────────┴────────┬─────────┴────────┬────────┘
         │                 │                  │
         ▼                 ▼                  ▼
┌──────────────────────────────────────────────────────┐
│                    API Gateway                       │
└──────────────────────────┬───────────────────────────┘
                           │
 ┌─────────────────────────┼─────────────────────────┐
 │                         │                         │
 ▼                         ▼                         ▼
[ Reservation Engine ]  [ Billing & Tax ]  [ POS & Inventory ]
 - Multi-room Matrix     - Dual-slab GST    - Touch Ordering
 - 2-Way OTA Sync        - Dynamic Surge    - Kitchen Display
 - Digital KYC Check-in  - Folios & Stripe  - Linen & Laundry
```

---

## 📦 Core Modules

### 1. Dashboard (UI Match)

- **Top Metric Cards**: New Bookings (`840`, `+8.70%`), Check-In (`231`, `+3.56%`), Check-Out (`124`, `-1.06%`), Total Revenue (`$123,980`, `+5.70%`).
- **Room Availability Progress Bar**: Visual segmented occupancy bar with 4 live counters: Occupied (`286`), Reserved (`87`), Available (`32`), and Not Ready (`13`).
- **Revenue Curve**: Curved SVG line chart with area fill and interactive floating badge tag (`$315,060`).
- **Overall Rating Breakdown**: `4.6/5` Impressive badge with category ratings (Facilities `4.4`, Cleanliness `4.7`, Services `4.6`, Comfort `4.8`, Location `4.5`).
- **Reservations 7-Day Chart**: Grouped bar visualization comparing booked vs canceled across dates.
- **Booking by Platform Donut**: Multi-colored donut chart (Direct Booking `61%`, Booking.com `12%`, Agoda `11%`, Airbnb `9%`, Hotels.com `5%`, Others `2%`).
- **Quick Tasks Widget**: Real-time operational tasks with priority pills and one-click task addition.

### 2. Guest Management & Front Desk

- Searchable reservations with real-time status: `Confirmed`, `CheckedIn`, `CheckedOut`.
- **Digital KYC & ID Verification**: Encrypted document type (`Passport`, `Driving License`, `National ID`) and number recording.
- One-click Check-in and Check-out workflows with automated room status updates to `Dirty` for Housekeeping.

### 3. Visual Reservation Calendar Matrix

- 14-day interactive multi-room timeline grid across floors (`Floor 1`, `Floor 2`, `Floor 3`).
- Color-coded booking blocks with guest names and source platform badges.

### 4. Housekeeping & Room Service

- **Room Status Board**: Live cards with status highlights (`Available`, `Occupied`, `Dirty`, `Cleaning`, `Inspected`, `OutOfOrder`).
- One-click transitions: `Start Cleaning` → `Mark Inspected` → `Ready for Guest`.
- Cleaning & maintenance dispatch tasks with priority badges (`High`, `Medium`, `Low`).

### 5. Billing, GST Compliance & Dynamic Pricing

- **Itemized Guest Folios**: Unified folio aggregating Room stay, Restaurant dining, Minibar, and Laundry expenses.
- **Dual-Slab GST Engine**:
  - Below ₹7,500/night: **12% GST** (6% CGST + 6% SGST)
  - ₹7,500 and above: **18% GST** (9% CGST + 9% SGST)
  - F&B Dining: **5% GST**
  - HSN/SAC code tracking (`996311` Accommodation, `996331` Restaurant & Minibar).
- **Dynamic Pricing Simulator**: Interactive sliders for Occupancy Surge Threshold (%), Surge Multiplier (`1.25x`), and Weekend Multipliers with live price previews.
- **Payment Gateways**: Simulated checkout flows via Stripe, Razorpay, and PayPal.
- **Printable Tax Invoice**: Clean PDF/print modal layout with GSTIN, customer details, and tax breakdowns.

### 6. Restaurant POS & Kitchen Display System (KDS)

- Touch-friendly menu categorized by Mains, Appetizers, Beverages, and Desserts.
- **"Charge to Room Folio"**: Instantly appends food charges to active guest stays.
- **Kitchen Display System (KDS)**: Live kitchen ticket state machine (`Received` → `Preparing` → `Ready` → `Delivered`).

### 7. Inventory & Laundry Operations

- Stock tracking across Kitchen, Amenities, Linen, Minibar, and Cleaning supplies with minimum threshold alerts.
- Restock modal for swift inward inventory processing.
- Linen and laundry turnaround batch tracker (`Washing` → `Ironing` → `Returned`).

### 8. Staff Management & HR

- Shift duty rosters across Front Office, Housekeeping, F&B, Engineering, and Administration.
- Biometric fingerprint and mobile geofence punch clock simulator.
- Leave request management and supervisor approval workflows.

### 9. Guest Reviews & Loyalty Club

- Net Promoter Score (NPS) tracking and sentiment tags (`Positive`, `Neutral`, `Negative`).
- Tiered loyalty program (`Silver`, `Gold`, `Platinum`) with accrued points, nights, and customized hospitality perks.

### 10. Channel Manager & Security Audit

- 2-way OTA channel synchronization with Booking.com, Expedia, and Airbnb.
- "Sync All OTAs Now" manual parity broadcast.
- Immutable security audit logs with timestamps, actors, and IP addresses.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | React 19, TypeScript, Vite 8, Vanilla CSS Design System, Lucide React Icons |
| **Backend** | Node.js v20+, TypeScript, Express, Modular Service Architecture |
| **Tax & Pricing** | Custom GST Compliance Engine, Dynamic Occupancy Surge Algorithm |
| **Containers** | Docker, Docker Compose, Multi-stage alpine builds |
| **Cloud & K8s** | Azure Kubernetes Service (AKS), Ingress Nginx, Azure Container Registry |
| **CI/CD** | GitHub Actions automated test, build, container push, and AKS deploy |

---

## 🚀 Running Locally

### 1. Prerequisites

- Node.js v18+ and npm installed

### 2. Backend Setup

```bash
cd backend
npm install
npm run build
npm start
```

*The backend API will run on `http://localhost:5000` (Health: `http://localhost:5000/api/health`).*

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

*Open your browser and navigate to `http://localhost:3000/`.*

---

## 🐳 Docker Deployment

To launch both frontend and backend in isolated production containers:

```bash
cd deploy/docker
docker-compose up --build -d
```

- Web Application: `http://localhost`
- Backend API: `http://localhost:5000`

---

## ☸️ Azure Kubernetes Service (AKS) Deployment

1. Build and push container images to Azure Container Registry (ACR):

   ```bash
   docker build -t <acr-name>.azurecr.io/hms-backend:latest -f deploy/docker/Dockerfile.backend .
   docker build -t <acr-name>.azurecr.io/hms-frontend:latest -f deploy/docker/Dockerfile.frontend .

   docker push <acr-name>.azurecr.io/hms-backend:latest
   docker push <acr-name>.azurecr.io/hms-frontend:latest
   ```

1. Apply Kubernetes manifests to your AKS cluster:

   ```bash
   kubectl apply -f deploy/k8s/backend-deployment.yaml
   kubectl apply -f deploy/k8s/frontend-deployment.yaml
   kubectl apply -f deploy/k8s/ingress.yaml
   ```

---

## 📄 License

MIT License. Built for hospitality excellence.
