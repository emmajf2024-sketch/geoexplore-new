
import { LatLng } from '../types';

/**
 * Calculates the great-circle distance between two points on the Earth.
 * @param from The starting point.
 * @param to The ending point.
 * @returns The distance in kilometers.
 */
export const getDistanceInKm = (from: LatLng, to: LatLng): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (to.lat - from.lat) * (Math.PI / 180);
  const dLon = (to.lng - from.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(from.lat * (Math.PI / 180)) *
    Math.cos(to.lat * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Calculates the score based on the distance from the target.
 * The closer the guess, the higher the score, up to a maximum of 5000 points.
 * @param distance The distance in kilometers.
 * @returns The calculated score.
 */
export const calculateScore = (distance: number): number => {
  if (distance < 0.25) return 5000; // Almost perfect guess
  const score = 5000 * Math.exp(-distance / 2000);
  return Math.round(score);
};
