# GeoExplorer

GeoExplorer is a web-based geography game that challenges players to explore the world and guess their location based on Google Street View imagery. Inspired by the popular game GeoGuessr, this project is built with modern web technologies and provides a fun and interactive way to test your geographical knowledge.

## Features

- **Random Location Generation:** Explores the globe by dropping you in a random outdoor location with Google Street View.
- **Interactive Map:** Use an interactive map to pinpoint your guess.
- **Scoring System:** Receive points based on how close your guess is to the actual location. The closer you are, the higher your score!
- **Responsive Design:** Play on any device, thanks to a responsive and mobile-first design.

## Tech Stack

- **React:** A JavaScript library for building user interfaces.
- **Vite:** A fast and modern build tool for web development.
- **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
- **Google Maps API:** Provides the Street View imagery and mapping functionality.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js and npm (or pnpm/yarn)
- A Google Maps API key. You can obtain one from the [Google Cloud Console](https://console.cloud.google.com/).

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/emmajf2024-sketch/geoexplore-new.git
    ```
2.  Install NPM packages
    ```sh
    pnpm install
    ```
3.  Create a `.env.local` file in the root of the project and add your Google Maps API key:
    ```
    VITE_GOOGLE_MAPS_API_KEY=YOUR_API_KEY
    ```
4.  Start the development server
    ```sh
    pnpm run dev
    ```

The application will be available at `http://localhost:5173`.

## Project Structure

```
.
├── public/
├── src/
│   ├── components/         # React components
│   ├── services/           # Core game logic and API interactions
│   │   ├── geo.ts          # Distance calculation and scoring
│   │   └── locationFinder.ts # Fetches random locations
│   ├── types.ts            # TypeScript type definitions
│   ├── App.tsx             # Main application component
│   └── index.tsx           # Entry point of the application
├── package.json
└── README.md
```

## Core Logic

The game's core logic is handled by the services in the `src/services` directory.

- **`locationFinder.ts`**: This service is responsible for finding random, valid Street View locations. It repeatedly generates random latitude and longitude coordinates until it finds a location with an outdoor panorama, ensuring that players are not dropped in the middle of an ocean or a place without Street View.

- **`geo.ts`**: This service handles the mathematical calculations for the game. It calculates the great-circle distance between the player's guess and the actual location using the Haversine formula. It also includes the scoring logic, which awards up to 5000 points based on the proximity of the guess.
