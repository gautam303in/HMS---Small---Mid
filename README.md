# The Grand Azure – Hotel Management System (HMS)

> A production-ready, domain-modular Hotel Management System (HMS) built around **PostgreSQL 16/17+ as the authoritative system of record**, event-driven asynchronous integration, and managed cloud deployments (AWS & GCP). Covers the complete hospitality lifecycle from omnichannel reservations to digital KYC, append-only folio billing with dual-slab GST, restaurant POS with Kitchen Display (KDS), stock ledgers, duty rosters, and guest loyalty.

Built with design inspiration from the modern **Lodgify** hospitality interface, featuring clean aesthetics, pastel visual hierarchy, and signature electric-lime accents.

---

## 🏛️ Architecture & System Blueprint

```text
                                [ Client Applications ]
  ┌─────────────────────────┬─────────────────────────┬─────────────────────────┐
  │ Front Desk Web (React)  │ Housekeeping & Staff App│ Restaurant POS (PWA)    │
  └────────────┬────────────┴────────────┬────────────┴────────────┬────────────┘
               │                         │                         │
               ▼                         ▼                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │         API Gateway / Domain-Modular Monolith (NestJS / Node.js API)        │
  │     [Identity] [Hotel] [Reservation] [Billing] [POS] [Inventory] [Staff]    │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 │                                               │
                 ▼ (ACID / RLS Transactions)                     ▼ (Async Events)
  ┌──────────────────────────────────────────────┐    ┌──────────────────────────┐
  │         PostgreSQL 16/17+ System of Record    │    │   Transactional Outbox   │
  │  13 Schemas: identity, hotel, guest, stay,   │───▶│   & Event Bus Engine     │
  │  reservation, billing, pos, inventory, hk,   │    └─────────────┬────────────┘
  │  workforce, audit, integration, reporting    │                  │
  │                                              │                  ▼
  │  - Append-Only Financial & Stock Ledgers     │       [ RabbitMQ / Redis PubSub ]
  │  - Multi-Tenant Row-Level Security (RLS)     │                  │
  │  - Daily Room Availability Matrix            │                  ▼
  │  - Monthly Table Partitioning                │    [ OTA Sync / KDS / Billing ]
  └──────────────────────────────────────────────┘
```

---

## 📦 Core Domain Modules & Technical Schemas

| Domain Module | Schema | Purpose & Key Tables | Concurrency & Ledger Controls |
| :--- | :--- | :--- | :--- |
| **Identity & RBAC** | `identity` | `tenants`, `users` | Multi-tenant isolation with scoped roles (Admin, Reception, Housekeeping, Kitchen). |
| **Hotel Catalog** | `hotel` | `properties`, `room_types`, `rooms`, `outlets` | Room operational state machine (`Available` → `Occupied` → `Dirty` → `Cleaning` → `Inspected`). |
| **Guest CRM & KYC** | `guest` | `guests`, `feedback`, `loyalty_members` | Encrypted KYC document verification (`Passport`, `National ID`), NPS sentiment scoring. |
| **Reservation Engine** | `reservation` | `reservations`, `room_inventory_daily`, `pricing_configs` | Daily matrix inventory allocation avoiding overselling; dynamic surge pricing engine. |
| **Stay & Front Desk** | `stay` | `checkin_records`, `checkout_records` | Check-in KYC sync; automated room turnover dispatch to Housekeeping on checkout. |
| **Folio & Billing** | `billing` | `folios`, `folio_entries`, `journal_entries`, `journal_lines` | **Append-only ledger** with reversals; dual-slab GST (`996311`/`996331`); payment settlement. |
| **POS & Kitchen** | `pos` | `pos_orders`, `pos_order_items` | Touch ordering; live KDS ticket progression; automatic charge-to-room folio routing. |
| **Inventory Ledger** | `inventory` | `items`, `stock_ledger`, `stock_balances` | **Append-only stock movements** (`PURCHASE`, `KITCHEN_ISSUE`, `WASTAGE`) + balance projections. |
| **Housekeeping** | `housekeeping` | `tasks`, `maintenance_work_orders` | Turnover tasks, inspection checklists, technician work order resolution workflows. |
| **Workforce & HR** | `workforce` | `staff`, `attendance_records`, `leave_requests` | Shift rosters, biometric punch-in/out attendance simulator, supervisor leave approvals. |
| **Audit & Security** | `audit` | `audit_log` | Immutable append-only audit trail logging actors, roles, actions, timestamps, and IPs. |
| **Integration & OTAs** | `integration` | `outbox_events`, `ota_channel_sync_logs` | **Transactional Outbox pattern**; 2-way rate parity broadcast (Booking.com, Expedia, Airbnb). |

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Web** | React 19, TypeScript, Vite 8, Lucide React, Modern Lodgify Design System |
| **Backend API** | Node.js v20+, TypeScript, Express / NestJS Modular Monolith Architecture |
| **System of Record** | PostgreSQL 16/17+ (Schemas, Append-Only Ledgers, RLS, Monthly Partitioning) |
| **Event Engine** | Transactional Outbox Pattern, Asynchronous Event Bus, RabbitMQ / Redis |
| **API Contracts** | OpenAPI 3.0 / Swagger Interactive UI (`/api/docs`) |
| **Tax & Pricing** | Dual-Slab GST Engine (12% vs 18% accommodation, 5% F&B), Dynamic Surge Multiplier |
| **Containers** | Docker Compose with PostgreSQL 16, Redis 7, RabbitMQ 3 Management |
| **Cloud Deployments** | **AWS** (ECS Fargate + RDS Multi-AZ + ElastiCache + S3) & **GCP** (Cloud Run + Cloud SQL HA + Memorystore + GCS) via Terraform |
| **CI/CD & Tests** | GitHub Actions pipeline, 19 End-to-End Enterprise UAT Hospitality Use Cases (`npm run test:uat`) |

---

## 🚀 Running Locally

### 1. Prerequisites

- Node.js v18+ and npm installed
- Optional: Docker & Docker Compose (for local PostgreSQL, Redis, and RabbitMQ)

### 2. Full-Stack Dev Environment

Start backend and frontend in a single unified command:

```bash
npm run dev
```

- 🌐 **Frontend Web App**: `http://localhost:3000/`
- 🏨 **Backend REST API**: `http://localhost:5000/api`
- 📖 **Interactive OpenAPI Docs**: `http://localhost:5000/api/docs`
- ❤️ **Health Check**: `http://localhost:5000/api/health`

### 3. Enterprise UAT Test Suite

Run the industry-standard 19 use-case acceptance suite:

```bash
npm run test:uat
```

*The UAT runner automatically verifies that the backend is responding, auto-starts it if necessary, seeds baseline data, and tests all 19 hospitality scenarios with 100% pass verification.*

---

## 🐳 Docker Compose Deployment

Launch the complete stack (PostgreSQL 16, Redis, RabbitMQ, Backend API, Frontend Nginx):

```bash
cd deploy/docker
docker compose up --build -d
```

- Frontend Application: `http://localhost`
- Backend API: `http://localhost:5000`
- RabbitMQ Management Console: `http://localhost:15672` (User: `hms_guest` / Pass: `hms_guest_pass`)
- PostgreSQL: `localhost:5432` (`grand_azure_hms`)

---

## ☁️ Cloud Deployments (Infrastructure as Code)

### AWS Deployment (ECS Fargate + RDS Multi-AZ + S3)

Located in [`deploy/terraform/aws/`](file:///d:/Projects/Gautam_Github/HMS%20-%20Small%20&%20Mid/deploy/terraform/aws/):

```bash
cd deploy/terraform/aws
terraform init
terraform plan
terraform apply
```

### GCP Deployment (Cloud Run + Cloud SQL HA + GCS)

Located in [`deploy/terraform/gcp/`](file:///d:/Projects/Gautam_Github/HMS%20-%20Small%20&%20Mid/deploy/terraform/gcp/):

```bash
cd deploy/terraform/gcp
terraform init
terraform plan
terraform apply
```

---

## 📄 License

MIT License. Built for hospitality excellence.
