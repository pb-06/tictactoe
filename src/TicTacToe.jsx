import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [nextPlayer, setNextPlayer] = useState('X');
  const [winner, setWinner] = useState(null);

  const API_URL = 'http://localhost:3333/api/results';

  const postResult = async (result) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ result })
      });

      if (!response.ok) {
        throw new Error('Hiba a szerver válaszában');
      }

      const savedResult = await response.json();
      console.log('Sikeresen mentve:', savedResult);
    } catch (error) {
      console.error('Hiba az eredmény mentésekor:', error);
    }
  };

  useEffect(() => {
    const fetchPreviousResults = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Hiba a szerver válaszában');
        }
        const results = await response.json();
        console.log('Korábbi eredmények a szerverről:', results);
      } catch (error) {
        console.error('Hiba a korábbi eredmények lekérdezésekor:', error);
      }
    };

    fetchPreviousResults();
  }, []);

  const calculateWinner = (currentBoard) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return currentBoard[a];
      }
    }
    return null;
  };

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
    if (!winner) {
      const surrenderingPlayer = nextPlayer;
      const winningPlayer = surrenderingPlayer === 'X' ? 'O' : 'X';
      setWinner(winningPlayer);
      const resultMessage = `${surrenderingPlayer} feladta, ${winningPlayer} nyert!`;
      toast.warning(resultMessage);
      postResult(resultMessage);
    }
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
        <button onClick={handleSurrender}>Surrender</button>
      </div>
      {/*<ToastContainer position="top-center" />*/}
    </div>
  );
}

export default TicTacToe;
