import React, { useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { LatLng, GameLocation, GameState, RoundResult, GameMode, LeaderboardEntry, Difficulty } from './types';
import { TOTAL_ROUNDS, LEADERBOARD_KEY, LEADERBOARD_SIZE } from './constants';
import { loadGoogleMapsApi } from './services/googleMapsLoader';
import { getDistanceInKm, calculateScore } from './services/geo';
import { findRandomLocations } from './services/locationFinder';
import StreetView from './components/StreetView';
import MapView from './components/MapView';
import HighScoreInput from './components/HighScoreInput';
import Leaderboard from './components/Leaderboard';
import { TrophyIcon, ClockIcon } from './components/Icons';

const App: React.FC = () => {
  const apiKey = 'AIzaSyBgSoejR5LlHL9kVJqhQLQswGre3SLng_o';
  const [isApiReady, setIsApiReady] = useState(false);
  const [gameState, setGameState] = useState<GameState>('start');
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');

  const [gameLocations, setGameLocations] = useState<GameLocation[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  
  const [userGuess, setUserGuess] = useState<LatLng | null>(null);
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
  
  const [activePlayer, setActivePlayer] = useState<1 | 2>(1);
  const [p1Guess, setP1Guess] = useState<LatLng | null>(null);
  const [p2Guess, setP2Guess] = useState<LatLng | null>(null);
  const [p1RoundResults, setP1RoundResults] = useState<RoundResult[]>([]);
  const [p2RoundResults, setP2RoundResults] = useState<RoundResult[]>([]);
  const [timeLeft, setTimeLeft] = useState(45);
  const [timerId, setTimerId] = useState<number | null>(null);

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [highScoreQueue, setHighScoreQueue] = useState<(0 | 1 | 2)[]>([]);


  useEffect(() => {
    if (apiKey) {
      loadGoogleMapsApi(apiKey)
        .then(() => setIsApiReady(true))
        .catch(err => console.error("API Key Error:", err));
    }
     try {
      const saved = localStorage.getItem(LEADERBOARD_KEY);
      if (saved) {
        setLeaderboardData(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load leaderboard:", error);
      setLeaderboardData([]);
    }
  }, [apiKey]);
  
  useEffect(() => {
    if (gameState === 'playing' && gameMode === 'multiplayer' && !timerId) {
      const newTimerId = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(newTimerId);
            endRound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerId(newTimerId);
    } else if (gameState !== 'playing' && timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
    
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [gameState, gameMode, timerId]);

  useEffect(() => {
    if (gameState === 'finished') {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

        function randomInRange(min: number, max: number) {
            return Math.random() * (max - min) + min;
        }

        const interval = window.setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => {
            clearInterval(interval);
            confetti.reset();
        };
    }
  }, [gameState]);


  const selectMode = (mode: GameMode) => {
    setGameMode(mode);
    if (mode === 'single') {
        startGame(mode, 'beginner');
    } else {
        setGameState('difficulty-select');
    }
  };

  const handleDifficultySelect = (selectedDifficulty: Difficulty) => {
      startGame('multiplayer', selectedDifficulty);
  };

  const startGame = useCallback(async (mode: GameMode, selectedDifficulty: Difficulty) => {
    setGameState('loading');
    setDifficulty(selectedDifficulty);
    const locations = await findRandomLocations(TOTAL_ROUNDS);
    setGameLocations(locations);
    setCurrentRound(0);
    setUserGuess(null);

    if (mode === 'single') {
        setRoundResults([]);
    } else {
        setP1Guess(null);
        setP2Guess(null);
        setP1RoundResults([]);
        setP2RoundResults([]);
        setActivePlayer(1);
        setTimeLeft(45);
    }
    setGameState('playing');
  }, []);

  const handleMapClick = useCallback((coords: LatLng) => {
    if (gameState === 'playing') {
      setUserGuess(coords);
    }
  }, [gameState]);

  const endRound = useCallback(() => {
    if (!gameLocations[currentRound]) return;
    const actualLocation = gameLocations[currentRound].coords;

    const calculatePlayerResult = (guess: LatLng | null) => {
        if (!guess) return { distance: Infinity, points: 0 };
        const distance = getDistanceInKm(guess, actualLocation);
        const points = calculateScore(distance);
        return { distance, points };
    };

    if (gameMode === 'single') {
        const result = calculatePlayerResult(userGuess);
        setRoundResults(prev => [...prev, result]);
    } else {
        const p1Result = calculatePlayerResult(p1Guess);
        const p2Result = calculatePlayerResult(p2Guess);
        setP1RoundResults(prev => [...prev, p1Result]);
        setP2RoundResults(prev => [...prev, p2Result]);
    }

    setGameState('round-end');
  }, [userGuess, p1Guess, p2Guess, currentRound, gameLocations, gameMode]);

  const handleGuess = useCallback(() => {
    if (!userGuess) return;
    if (gameMode === 'single') {
        endRound();
    } else {
        if (activePlayer === 1) {
            setP1Guess(userGuess);
            setActivePlayer(2);
            setUserGuess(null);
        } else {
            setP2Guess(userGuess);
            endRound();
        }
    }
  }, [userGuess, gameMode, activePlayer, endRound]);
  
  const handleNextRound = useCallback(() => {
    if (currentRound < TOTAL_ROUNDS - 1) {
      setCurrentRound(prev => prev + 1);
      setUserGuess(null);
      if (gameMode === 'multiplayer') {
          setP1Guess(null);
          setP2Guess(null);
          setActivePlayer(1);
          setTimeLeft(45);
      }
      setGameState('playing');
    } else {
      setGameState('finished');
    }
  }, [currentRound, gameMode]);
  
  const totalScore = useMemo(() => roundResults.reduce((sum, result) => sum + result.points, 0), [roundResults]);
  const p1TotalScore = useMemo(() => p1RoundResults.reduce((sum, result) => sum + result.points, 0), [p1RoundResults]);
  const p2TotalScore = useMemo(() => p2RoundResults.reduce((sum, result) => sum + result.points, 0), [p2RoundResults]);

  const isHighScore = useCallback((score: number) => {
    if (leaderboardData.length < LEADERBOARD_SIZE) {
        return true;
    }
    return score > leaderboardData[leaderboardData.length - 1].score;
  }, [leaderboardData]);

  const handleFinishedGameContinue = () => {
    const scoresToCheck: { player: (0 | 1 | 2); score: number }[] = [];
    if (gameMode === 'single') {
        scoresToCheck.push({ player: 0, score: totalScore });
    } else {
        scoresToCheck.push({ player: 1, score: p1TotalScore });
        scoresToCheck.push({ player: 2, score: p2TotalScore });
    }
    
    const newQueue = scoresToCheck
        .filter(item => isHighScore(item.score))
        .sort((a, b) => b.score - a.score)
        .map(item => item.player);

    if (newQueue.length > 0) {
        setHighScoreQueue(newQueue);
        setGameState('highscore-entry');
    } else {
        setGameState('leaderboard');
    }
  };

  const handleHighScoreSubmit = (name: string) => {
    if (highScoreQueue.length === 0) return;

    const currentPlayer = highScoreQueue[0];
    const score = currentPlayer === 0 ? totalScore : (currentPlayer === 1 ? p1TotalScore : p2TotalScore);

    const newEntry: LeaderboardEntry = { name, score };
    const newLeaderboard = [...leaderboardData, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, LEADERBOARD_SIZE);
    
    setLeaderboardData(newLeaderboard);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(newLeaderboard));

    const newQueue = highScoreQueue.slice(1);
    setHighScoreQueue(newQueue);

    if (newQueue.length === 0) {
        setGameState('leaderboard');
    }
  };

  const actualLocation = gameLocations[currentRound]?.coords;

  const renderContent = () => {
    if (!apiKey) return <div className="flex flex-col items-center justify-center h-screen text-center p-4"><h1 className="text-3xl font-bold text-red-500 mb-4">Configuration Error</h1><p className="text-lg text-gray-300">Google Maps API Key is missing.</p></div>;
    if (!isApiReady || gameState === 'loading') return <div className="flex flex-col items-center justify-center h-screen"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-400"></div><p className="mt-4 text-lg text-gray-300">Finding a new world for you...</p></div>;

    switch (gameState) {
      case 'start':
        return (
          <div className="flex flex-col items-center justify-center h-screen bg-gray-900 bg-opacity-70 backdrop-blur-sm">
            <h1 className="text-6xl font-extrabold text-white mb-2 tracking-tight">Geo Explorer</h1>
            <p className="text-xl text-gray-300 mb-8">Can you guess where you are in the world?</p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button onClick={() => setGameState('mode-select')} className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300 ease-in-out">
                  Play Game
                </button>
                <button onClick={() => setGameState('leaderboard')} className="px-8 py-4 bg-gray-700 text-white font-bold rounded-lg shadow-lg hover:bg-gray-600 transform hover:scale-105 transition-all duration-300 ease-in-out">
                  Leaderboard
                </button>
            </div>
          </div>
        );
      case 'mode-select':
        return (
          <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-4xl font-bold mb-8">Choose Game Mode</h2>
            <div className="flex space-x-6">
              <button onClick={() => selectMode('single')} className="px-8 py-4 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-300">Single Player</button>
              <button onClick={() => selectMode('multiplayer')} className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300">Two Player</button>
            </div>
            <button onClick={() => setGameState('start')} className="mt-8 text-indigo-400 hover:text-indigo-300 transition-colors">
              &larr; Back to Main Menu
            </button>
          </div>
        );
      case 'difficulty-select':
          return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-4xl font-bold mb-8">Select Difficulty</h2>
                <div className="flex flex-col space-y-4 w-64">
                    <button onClick={() => handleDifficultySelect('beginner')} className="px-8 py-4 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-300">Beginner</button>
                    <button onClick={() => handleDifficultySelect('pro')} className="px-8 py-4 bg-yellow-600 text-white font-bold rounded-lg shadow-lg hover:bg-yellow-700 transform hover:scale-105 transition-all duration-300">Pro</button>
                    <button onClick={() => handleDifficultySelect('elite')} className="px-8 py-4 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700 transform hover:scale-105 transition-all duration-300">Elite</button>
                </div>
                 <button onClick={() => setGameState('mode-select')} className="mt-8 text-indigo-400 hover:text-indigo-300 transition-colors">
                    &larr; Back to Mode Select
                </button>
            </div>
          );
      case 'finished':
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 bg-opacity-80 backdrop-blur-md p-4">
              <TrophyIcon className="w-24 h-24 text-yellow-400 mb-4" />
              <h2 className="text-4xl font-bold text-white mb-2">Game Over!</h2>
              {gameMode === 'single' ? (
                <>
                    <p className="text-2xl text-indigo-300 mb-6">Total Score: {totalScore.toLocaleString()}</p>
                </>
              ) : (
                <div className="w-full max-w-2xl text-center">
                  <div className="flex justify-around items-center mb-6">
                      <div className="p-4 rounded-lg bg-blue-900/50">
                          <p className="text-xl text-blue-300">Player 1 Total</p>
                          <p className="text-3xl font-bold">{p1TotalScore.toLocaleString()}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-red-900/50">
                          <p className="text-xl text-red-300">Player 2 Total</p>
                          <p className="text-3xl font-bold">{p2TotalScore.toLocaleString()}</p>
                      </div>
                  </div>
                  <h3 className="text-3xl font-bold text-yellow-400 mb-6">
                    {p1TotalScore > p2TotalScore ? 'Player 1 Wins!' : p2TotalScore > p1TotalScore ? 'Player 2 Wins!' : "It's a Tie!"}
                  </h3>
                </div>
              )}
              <div className="flex items-center space-x-4 mt-8">
                <button onClick={handleFinishedGameContinue} className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300">
                    Continue
                </button>
                <button onClick={() => setGameState('start')} className="px-8 py-4 bg-gray-700 text-white font-bold rounded-lg shadow-lg hover:bg-gray-600 transform hover:scale-105 transition-all duration-300">
                    Main Menu
                </button>
              </div>
          </div>
        );
      case 'highscore-entry': {
          const currentPlayer = highScoreQueue[0];
          const score = currentPlayer === 0 ? totalScore : (currentPlayer === 1 ? p1TotalScore : p2TotalScore);
          const playerInfo = gameMode === 'single' ? '' : `Player ${currentPlayer}'s turn`;
          return <HighScoreInput score={score} playerInfo={playerInfo} onSubmit={handleHighScoreSubmit} />;
      }
      case 'leaderboard':
          return <Leaderboard entries={leaderboardData} onClose={() => setGameState('start')} />;
      case 'playing':
      case 'round-end':
        const isGuessed = gameState === 'round-end';
        return (
          <div className="relative w-full h-screen overflow-hidden">
            {actualLocation && <StreetView location={actualLocation} difficulty={difficulty} />}
            <header className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent flex justify-between items-center z-10">
              <div className="text-xl font-bold">Round {currentRound + 1} / {TOTAL_ROUNDS}</div>
               {gameMode === 'single' ? (
                  <div className="text-xl font-bold">Score: {totalScore.toLocaleString()}</div>
               ) : (
                <div className="flex items-center space-x-6">
                  <div className="text-xl font-bold text-blue-300">P1: {p1TotalScore.toLocaleString()}</div>
                  <div className="text-xl font-bold text-red-300">P2: {p2TotalScore.toLocaleString()}</div>
                </div>
               )}
            </header>

            <footer className="absolute bottom-0 right-0 p-4 z-10">
                {!isGuessed ? (
                  <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow-2xl flex flex-col items-end space-y-4">
                      {gameMode === 'multiplayer' && (
                          <div className={`w-full flex items-center justify-center p-2 rounded-md ${activePlayer === 1 ? 'bg-blue-600' : 'bg-red-600'}`}>
                            <span className="font-bold text-lg mr-4">Player {activePlayer}'s Turn</span>
                            <div className="flex items-center space-x-2">
                                <ClockIcon className="w-6 h-6"/>
                                <span className="text-xl font-mono font-bold">{timeLeft}</span>
                            </div>
                          </div>
                      )}
                      <div className="w-[350px] h-[250px] md:w-[400px] md:h-[300px]">
                        <MapView center={{ lat: 20, lng: 0 }} zoom={2} onMapClick={handleMapClick} guessLocation={userGuess} />
                      </div>
                      <button onClick={handleGuess} disabled={!userGuess} className="w-full px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
                          {gameMode === 'single' ? 'Make Guess' : `Lock in P${activePlayer} Guess`}
                      </button>
                  </div>
              ) : (
                <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow-2xl flex flex-col items-center space-y-4 w-[400px] md:w-[500px]">
                    <h2 className="text-2xl font-bold text-yellow-400">Round {currentRound + 1} Result</h2>
                    <div className="w-full h-[250px] md:h-[300px]">
                        <MapView center={actualLocation} zoom={3} guessLocation={gameMode === 'single' ? userGuess : p1Guess} player2GuessLocation={p2Guess} actualLocation={actualLocation} showResult={true}/>
                    </div>
                    {gameMode === 'single' ? (
                        <div className="text-center w-full">
                            <p className="text-lg">Distance: <span className="font-bold text-white">{roundResults[currentRound]?.distance.toFixed(1)} km</span></p>
                            <p className="text-lg">Points: <span className="font-bold text-green-400">{roundResults[currentRound]?.points.toLocaleString()}</span></p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 w-full text-center">
                            <div className="bg-blue-900/50 p-2 rounded">
                                <p className="font-bold text-blue-300">Player 1</p>
                                <p>{p1RoundResults[currentRound]?.distance.toFixed(1)} km</p>
                                <p className="font-semibold text-green-400">{p1RoundResults[currentRound]?.points.toLocaleString()} pts</p>
                            </div>
                             <div className="bg-red-900/50 p-2 rounded">
                                <p className="font-bold text-red-300">Player 2</p>
                                <p>{p2RoundResults[currentRound]?.distance.toFixed(1)} km</p>
                                <p className="font-semibold text-green-400">{p2RoundResults[currentRound]?.points.toLocaleString()} pts</p>
                            </div>
                        </div>
                    )}
                    <button onClick={handleNextRound} className="w-full px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transition-colors">
                        {currentRound < TOTAL_ROUNDS - 1 ? 'Next Round' : 'View Final Score'}
                    </button>
                </div>
              )}
            </footer>
          </div>
        );
    }
  };

  return <main className="w-full h-screen bg-gray-900">{renderContent()}</main>;
};

export default App;