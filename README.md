# TMore Cakes - Custom Cake Ordering Platform

This is a [Next.js](https://nextjs.org) project built with the App Router for a custom cake ordering platform.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Project Structure

```
app/
├── admin/        # Admin dashboard
│   ├── layout.tsx
│   └── page.tsx
├── api/          # API routes
│   └── submit/   # Cake submission endpoint
├── components/   # React components
│   ├── AdminLogin.tsx
│   ├── CakeForm.tsx
│   ├── FeaturesSection.tsx
│   ├── Footer.tsx
│   ├── GalleryPreview.tsx
│   ├── HeroSection.tsx
│   ├── Navbar.tsx
│   └── PricingSection.tsx
├── lib/          # Utility libraries
│   └── supabaseClient.ts
├── styles/       # Global styles
│   └── globals.css
├── images/       # Static images
├── layout.tsx    # Root layout
└── page.tsx      # Home page
```

## Features

- **Modern Design**: Clean, spacious layout with bright colors (white, gold, pink)
- **Hero Section**: Rotating cake images with compelling call-to-actions
- **About Section**: Baker introduction with interactive tabs
- **Pricing Guide**: Comprehensive cake sizes, flavors, and pricing
- **Gallery Preview**: Cake categories with sample images
- **Order Form**: Streamlined custom cake ordering
- **Admin Dashboard**: Cost calculator, order management, and document vault
- **Mobile Responsive**: Optimized for all device sizes

## Environment Setup

Copy `env.template` to `.env.local` and configure your Supabase credentials:

```bash
cp env.template .env.local
```

Then edit `.env.local` with your actual Supabase URL and API key.

## Admin Access

Access the admin dashboard at `/admin` or click the "Admin" button in the navigation.
Demo credentials: admin@tmorescakes.com / admin123

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
