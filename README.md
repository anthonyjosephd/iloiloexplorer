# Iloilo Explorer 🌺

**Your comprehensive guide to Iloilo City — the Heart of the Philippines.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)

## Features

- 🏛️ **Tourist Attractions** — UNESCO heritage sites, churches, museums, beaches with visitor tips
- 🚌 **Jeepney Route Guide** — Navigate Iloilo City with route maps, fares, and riding instructions  
- 🍜 **Food Discovery** — Complete guide to Ilonggo cuisine with stories, locations, and prices
- 🏘️ **Neighborhood Explorer** — The 6 districts of Iloilo City profiled
- 📅 **Festival Calendar** — Dinagyang, Paraw Regatta, and more
- 📖 **History & Culture** — 400+ year timeline of Iloilo's rich heritage

## Tech Stack

- **Framework**: Next.js 14 (App Router, Static Site Generation)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS + Custom CSS with CSS Variables
- **Architecture**: Monorepo (apps/web)

## Getting Started

```bash
cd apps/web
npm install
npm run dev
```

## Project Structure

```
iloiloexplorer/
├── apps/
│   └── web/                    # Next.js web application
│       └── src/
│           ├── app/            # Pages (App Router)
│           │   ├── page.tsx         # Homepage
│           │   ├── attractions/     # Attractions guide
│           │   ├── jeepney/         # Route planner
│           │   ├── food/            # Food discovery
│           │   └── about/           # About Iloilo
│           ├── components/
│           │   └── layout/          # Nav, Footer
│           └── data/
│               └── index.ts         # All content data
└── README.md
```

## About Iloilo City

Iloilo City (*"Ang Iloilo, Puso sang Pilipinas"*) is the regional center of Western Visayas. 
Home to UNESCO World Heritage churches, the legendary La Paz Batchoy, Dinagyang Festival, 
and the sweetest mangoes in the world (Guimaras Island, just 15 minutes away).

---

*Made with ❤️ for Iloilo City, Philippines*
