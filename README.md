# Flooo — Pure Water. Healthy Life.

BIS-certified added mineral water e-commerce platform by **LSP Enterprises**.

## Tech Stack

- Next.js 14 (App Router)
- MongoDB + Mongoose
- Tailwind CSS + Zustand
- Phone OTP auth (mock in dev, Fast2SMS/MSG91 in prod)
- Cloudinary (admin product images)
- Nodemailer (contact form)
- QR code → `/stores` (live dealer list)

## Quick Start

1. Copy environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Set `MONGODB_URI` and other variables in `.env.local`

3. Install and seed:
   ```bash
   npm install
   npm run seed
   npm run qr
   ```

4. Run dev server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Default Admin

- Email: `admin@flooo.in`
- Password: `flooo@admin123`

## OTP (Development)

OTP is logged to the terminal when `NODE_ENV` is not `production`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run seed` | Seed products, dealers, admin |
| `npm run qr` | Generate `/public/flooo-qr.png` |

## Project Structure

See the project spec for full route and folder layout.
