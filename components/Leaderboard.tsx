import React from 'react';
import { LeaderboardEntry } from '../types';
import { TrophyIcon } from './Icons';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  onClose: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries, onClose }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 bg-opacity-90 backdrop-blur-lg p-4">
      <div className="w-full max-w-md bg-gray-800/80 rounded-2xl shadow-2xl p-6 border border-gray-700">
        <div className="flex items-center justify-center mb-6">
          <TrophyIcon className="w-10 h-10 text-yellow-400 mr-3" />
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Leaderboard</h1>
        </div>
        <ul className="space-y-3">
          {entries.length > 0 ? (
            entries.map((entry, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center">
                  <span className={`text-xl font-bold w-8 ${index < 3 ? 'text-yellow-400' : 'text-gray-400'}`}>{index + 1}.</span>
                  <span className="text-2xl font-semibold text-indigo-300 tracking-widest">{entry.name}</span>
                </div>
                <span className="text-2xl font-bold text-green-400">{entry.score.toLocaleString()}</span>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-400 py-8">No scores yet. Be the first!</p>
          )}
        </ul>
        <button
          onClick={onClose}
          className="mt-8 w-full px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
        >
          Main Menu
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
