# 🌍 GeoExplorer

Welcome to GeoExplorer! 🗺️ A web-based geography game that drops you in a random location around the world and challenges you to guess where you are. Inspired by the popular game GeoGuessr, this project is built with modern web technologies to provide a fun and interactive way to test and improve your geographical knowledge.

## 🎮 How to Play

1.  **Start a New Game**: A random Google Street View location will be displayed.
2.  **Explore**: Pan and zoom around the Street View to find clues about your location. Look for street signs, landmarks, and other hints.
3.  **Make Your Guess**: Open the interactive map and click on the location where you think you are.
4.  **See Your Score**: After you submit your guess, the actual location will be revealed, and you'll receive points based on how close your guess was. The closer you are, the higher your score!

## ✨ Features

- **📍 Random Location Generation**: Explore the globe by being dropped into a random outdoor location with Google Street View.
- **🗺️ Interactive Map**: Use an interactive map to pinpoint your guess with precision.
- **💯 Scoring System**: Receive up to 5000 points based on how close your guess is to the actual location.
- **📱 Responsive Design**: Play on any device, thanks to a responsive and mobile-first design.

## 🛠️ Tech Stack

- **⚛️ React**: A JavaScript library for building user interfaces.
- **⚡ Vite**: A fast and modern build tool for web development.
- **🔷 TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **🗺️ Google Maps API**: Provides the Street View imagery and mapping functionality.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js and npm (or pnpm/yarn)
- A Google Maps API key. You can obtain one from the [Google Cloud Console](https://console.cloud.google.com/).

### Installation

1.  Clone the repo:
    ```sh
    git clone https://github.com/emmajf2024-sketch/geoexplore-new.git
    ```
2.  Install NPM packages:
    ```sh
    pnpm install
    ```
3.  Create a `.env.local` file in the root of the project and add your Google Maps API key:
    ```
    VITE_GOOGLE_MAPS_API_KEY=YOUR_API_KEY
    ```
4.  Start the development server:
    ```sh
    pnpm run dev
    ```

The application will be available at `http://localhost:5173`.

## 📂 Project Structure

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

## 🧠 Core Logic

The game's core logic is handled by the services in the `src/services` directory.

- **`locationFinder.ts`**: This service is responsible for finding random, valid Street View locations. It repeatedly generates random latitude and longitude coordinates until it finds a location with an outdoor panorama, ensuring that players are not dropped in the middle of an ocean or a place without Street View.

- **`geo.ts`**: This service handles the mathematical calculations for the game. It calculates the great-circle distance between the player's guess and the actual location using the Haversine formula. It also includes the scoring logic, which awards up to 5000 points based on the proximity of the guess.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
