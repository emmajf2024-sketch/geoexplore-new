export interface LatLng {
  lat: number;
  lng: number;
}

export interface GameLocation {
  id: string;
  name: string;
  coords: LatLng;
}

export type GameState = 'start' | 'loading' | 'mode-select' | 'difficulty-select' | 'playing' | 'round-end' | 'finished' | 'highscore-entry' | 'leaderboard';
export type GameMode = 'single' | 'multiplayer';
export type Difficulty = 'beginner' | 'pro' | 'elite';

export interface RoundResult {
  distance: number;
  points: number;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
}
