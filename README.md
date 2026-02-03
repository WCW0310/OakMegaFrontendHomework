# OakMega Map React

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=Leaflet&logoColor=white)

A React-based web application for visualizing urban renewal locations in New Taipei City. This project integrates Google & Facebook login authentication with session management and features interactive maps using Leaflet.

## Features

- **Robust Authentication**:
  - Native integration with Google Identity Services and Facebook SDK.
  - **Session Management**: Automatic expiration handling (auto-logout) based on token validity.
  - **Guest Access**: Guest Login option to explore the map without binding the FB account.
  - Secure local storage of user profiles.
- **Interactive Map Visualization**:
  - **Renewal Zones**: Polygon rendering of urban renewal areas.
  - **Nearby Stops**: Visualization of transport/location stops based on user position.
  - **User Location**: Real-time geolocation tracking with custom markers (displaying user profile picture).
  - **Fly-to Navigation**: Smooth transitions when selecting locations.
- **Responsive UI**:
  - Mobile-optimized sidebar and map layout.
  - Collapsible/Expandable lists for location results.
  - Filterable search functionality.

## Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: React Hooks (Custom hooks for Auth, Geolocation, Data Fetching)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Map Library**: [Leaflet](https://leafletjs.com/) + [React Leaflet](https://react-leaflet.js.org/)
- **Testing**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/)

## Project Structure

```
src/
├── components/
│   ├── map/        # Map-related components (Markers, Layers, Controller)
│   ├── sidebar/    # Sidebar UI (Search, List, Header)
│   └── ...         # Auth steps (Login, Bind)
├── hooks/          # Custom Hooks (useSocialAuth, useNearbyLocations, useRenewalZones)
├── services/       # API Services (apiClient, nearbyLocations, polygons)
├── utils/          # Utilities (JWT parsing, URL helpers, Leaflet setup)
├── types.ts        # Shared TypeScript interfaces
└── App.tsx         # Main Orchestrator
```

## Prerequisites

- [Node.js](https://nodejs.org/) (Version v20.19.6) - You can run `nvm use` to select the correct version.
- [npm](https://www.npmjs.com/)

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment Setup**

   Create a `.env` file in the root directory and add the following variables:

   ```env
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   VITE_FB_APP_ID=your_facebook_app_id
   VITE_API_BASE_URL=your_api_base_url
   ```

3. **Run Development Server**

   ```bash
   npm run dev
   ```

   The app will run at `http://localhost:5173` (or the port shown in your terminal).

## Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Type-check and build for production.
- `npm run preview`: Preview the production build locally.
- `npm run lint`: Run ESLint to check code quality.
- `npm test`: Run tests using Vitest.

## Deployment

To deploy this application, you need to build it for production.

```bash
npm run build
```

This command will create a `dist` directory containing the optimized production build. You can deploy the contents of this directory to any static site hosting service (e.g., Vercel, Netlify, GitHub Pages).

> **Note**: Since this app uses client-side routing, ensure your host is configured to redirect all requests to `index.html`.
