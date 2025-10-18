import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [nextPlayer, setNextPlayer] = useState('X');
  const [winner, setWinner] = useState(null);

  const postResult = async (result) => {
    // TODO - implement backend POST
    await fetch('/api/result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ result })
    });
  };
  // TODO - implement backend GET: query previous match results

  const calculateWinner = function (board) {/* TODO - implement */ }

  const handleClick = (idx) => {
    if (board[idx] || winner) {
      return;
    }

    const newBoard = board.slice();
    newBoard[idx] = nextPlayer;

    setBoard(newBoard);
    const newNextPlayer = nextPlayer === 'X' ? 'O' : 'X';
    setNextPlayer(newNextPlayer);

    const win = calculateWinner(newBoard);
    if (win) {
      setWinner(win);
      toast.success(`${win} wins!`);
      postResult(`${win} wins`);
    } else if (!newBoard.includes(null)) {
      toast.info('Draw!');
      postResult('Draw');
    }
  };

  const handleRestart = () => {
    setBoard(Array(9).fill(null));
    setNextPlayer('X');
    setWinner(null);
  };

  const handleSurrender = () => {
    if (!winner) {/* TODO */ }
  };

  return (
    <div className="gameContainer">
      <h1>TicTacToe!</h1>
      <div className="grid">
        {
          [0, 1, 2].map(row => (
            <div className="board-row" key={row}>
              {[0, 1, 2].map(col => {
                const idx = row * 3 + col;
                return (
                  <button
                    key={idx}
                    className="square"
                    onClick={() => handleClick(idx)}
                    disabled={winner || board[idx]}
                  >
                    {board[idx]}
                  </button>
                );
              })}
            </div>
          ))
        }
      </div>
      <div className="controls">
        <button onClick={handleRestart}>Restart</button>
        <button >Surrender</button>
      </div>
      {/*<ToastContainer position="top-center" />*/}
    </div>
  );
}

export default TicTacToe;
