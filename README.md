# Xenon Weather Dashboard

A fast, responsive weather dashboard built with Vite, React, TypeScript, Tailwind CSS, and shadcn-ui. It fetches live weather data from OpenWeatherMap and provides an engaging, mobile-friendly experience.

## Features

- Current conditions, forecasts, and geocoding via OpenWeatherMap
- Responsive UI with shadcn-ui and Tailwind CSS
- Component-based architecture with React and TypeScript
- Performance-minded Vite configuration and code-splitting

## Getting Started

Prerequisites:

- Node.js (LTS recommended)
- npm (comes with Node.js) or bun/pnpm if you prefer

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Environment Variables

Create a `.env` file in the project root with your OpenWeatherMap API key:

```bash
VITE_OPENWEATHER_API_KEY=your_openweathermap_api_key
```

This is used by `src/lib/weatherApi.ts` to request live data.

## Project Structure

- `src/` – Application source code
  - `components/` – UI components
  - `contexts/` – React context providers (e.g., `WeatherContext`)
  - `hooks/` – Reusable hooks
  - `lib/` – Utilities and API clients (e.g., `weatherApi.ts`, `weatherUtils.ts`)
- `public/` – Static assets
- `vite.config.ts` – Vite configuration
- `tailwind.config.ts` – Tailwind configuration

## Tech Stack

- Vite
- React 18
- TypeScript
- Tailwind CSS + shadcn-ui
- @tanstack/react-query

## Deployment

You can deploy the built site (`dist/`) to any static hosting provider (e.g., Netlify, Vercel, GitHub Pages).

General steps:

1. Set `VITE_OPENWEATHER_API_KEY` in your hosting provider's environment variables.
2. Build the app with `npm run build`.
3. Deploy the `dist/` folder (Netlify/Vercel can build automatically from your repository).

## License

This project is provided as-is. Add your preferred license if needed.
