# KosHub

**Tugas 3 - Integrasi Layanan (II3160 UAS)**

Platform web yang mengintegrasikan dua microservices: Pemesanan Akomodasi dan Layanan Pendukung Kehidupan (Laundry & Catering).

## Fitur Utama

**Living Support (Layanan Utama)**
- Laundry - Cuci, Cuci+Setrika, Dry Clean, Setrika Saja
- Catering - Sarapan, Makan Siang, Makan Malam, Snack
- Notifikasi real-time

**Accommodation (Layanan Partner Kelompok)**
- Pencarian akomodasi kos
- Sistem diskon keanggotaan (BASIC, SILVER 5%, GOLD 10%)
- Pemesanan dengan pelacakan status

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS 4 |
| Backend Living Support | Express.js + PostgreSQL (Supabase) |
| Backend Accommodation | Express.js + PostgreSQL (Supabase) |

## Penggunaan

Buka https://tugas-3-kos-hub-18223054.vercel.app

## Environment

```env
NEXT_PUBLIC_ACCOMMODATION_API=https://18223088.tesatepadang.space
NEXT_PUBLIC_LIVING_SUPPORT_API=https://18223054.tesatepadang.space
```

## Struktur Folder

```
koshub/
├── app/
│   ├── accommodations/     # Halaman akomodasi
│   ├── auth/               # Login & Register
│   ├── components/         # Navbar, Footer
│   ├── dashboard/          # Dashboard user
│   ├── lib/                # API service & AuthContext
│   ├── notifications/      # Halaman notifikasi
│   ├── services/           # Laundry & Catering
│   └── types/              # TypeScript definitions
├── public/
└── package.json
```

## API Endpoints

**Living Support (18223054)**
- `POST /auth/login` - Login
- `POST /auth/register` - Register  
- `GET /api/laundry` - List laundry orders
- `POST /api/laundry` - Create laundry order
- `GET /api/catering/menu` - Get menu
- `POST /api/catering` - Create catering order
- `GET /api/notifications` - Get notifications

**Accommodation (18223088)**
- `POST /auth/login` - Login
- `POST /auth/register` - Register
- `GET /accommodations` - List accommodations
- `GET /bookings/:userId` - Get user bookings
- `POST /bookings` - Create booking
- `PUT /bookings/:id` - Update booking status

## Arsitektur

Menggunakan Domain-Driven Design (DDD) dengan dua bounded context:

1. **Living Support Context** - Autentikasi terpisah, layanan laundry & catering
2. **Accommodation Context** - Autentikasi terpisah, pemesanan kos

## Kelompok

- **18223054** - Living Support Service
- **18223088** - Accommodation Service

---

II3160 - Teknologi Sistem Terintegrasi | Institut Teknologi Bandung
