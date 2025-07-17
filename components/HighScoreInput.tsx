import React, { useState } from 'react';

interface HighScoreInputProps {
  score: number;
  playerInfo: string;
  onSubmit: (name: string) => void;
}

const HighScoreInput: React.FC<HighScoreInputProps> = ({ score, playerInfo, onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim().toUpperCase());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 bg-opacity-80 backdrop-blur-md p-4 text-center">
      <h2 className="text-3xl font-bold text-yellow-400 mb-2">New High Score!</h2>
      <p className="text-xl text-white mb-2">{playerInfo}</p>
      <p className="text-2xl text-white mb-6">Score: {score.toLocaleString()}</p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <label htmlFor="initials" className="text-lg text-gray-300 mb-2">Enter your initials (3 characters)</label>
        <input
          id="initials"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.substring(0, 3).toUpperCase())}
          maxLength={3}
          className="w-48 text-center bg-gray-700 text-white text-3xl font-bold p-2 rounded-lg border-2 border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 tracking-[0.5em]"
          autoFocus
        />
        <button
          type="submit"
          disabled={name.length === 0}
          className="mt-6 px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          Save Score
        </button>
      </form>
    </div>
  );
};

export default HighScoreInput;
