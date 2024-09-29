import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { RefreshCw } from 'lucide-react';

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

function Square({ value, onSquareClick, isWinningSquare, disabled }) {
  return (
    <button
      onClick={onSquareClick}
      disabled={disabled}
      className={`w-20 h-20 text-3xl font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 transform hover:scale-105 ${
        isWinningSquare
          ? 'bg-green-400 text-white'
          : value
          ? 'bg-blue-100 text-blue-600'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
    >
      {value}
    </button>
  );
}

export default function Board() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const winInfo = calculateWinner(currentSquares);
  const winner = winInfo?.winner;
  const winningLine = winInfo?.line || [];

  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (currentSquares.every(Boolean)) {
    status = 'Draw!';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const handleClick = (i) => {
    if (currentMove !== history.length - 1) {
      toast.error("Can't make moves on historical board state!");
      return;
    }
    const nextHistory = history.slice(0, currentMove + 1);
    const squares = currentSquares.slice();
    if (calculateWinner(squares) || squares[i]) {
      toast.error('Invalid move!');
      return;
    }
    squares[i] = xIsNext ? 'X' : 'O';
    setHistory([...nextHistory, squares]);
    setCurrentMove(nextHistory.length);
  };

  const jumpTo = (move) => {
    setCurrentMove(move);
  };

  const resetGame = () => {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    toast.success('Game reset!');
  };

  const moves = history.map((_, move) => {
    const description = move ? `Go to move #${move}` : 'Go to game start';
    return (
      <li key={move} className="mb-2">
        <button
          className={`px-3 py-1 text-sm rounded transition-colors duration-200 ${
            move === currentMove
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => jumpTo(move)}
        >
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-4">
      <Toaster position="top-center" />
      <div className="bg-white p-8 rounded-xl shadow-2xl flex">
        <div>
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">{status}</h1>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {currentSquares.map((square, index) => (
              <Square
                key={index}
                value={square}
                onSquareClick={() => handleClick(index)}
                isWinningSquare={winningLine.includes(index)}
                disabled={currentMove !== history.length - 1 || winner}
              />
            ))}
          </div>
          <div className="flex justify-center items-center mb-6">
            <button
              onClick={resetGame}
              className="flex items-center px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
            >
              <RefreshCw className="mr-2" size={18} />
              Restart Game
            </button>
          </div>
        </div>
        <div className="ml-8 bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">Move History</h2>
          <ol className="list-decimal list-inside">{moves}</ol>
        </div>
      </div>
    </div>
  );
}