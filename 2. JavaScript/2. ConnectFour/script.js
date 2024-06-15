function GameBoard() {
  const rows = 6;
  const columns = 7;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const dropToken = (column, player) => {
    const availableCells = board
      .filter((row) => row[column].getValue() === 0)
      .map((row) => row[column]);

    if (!availableCells.length) return;

    const lowestRow = availableCells.length - 1;
    board[lowestRow][column].addToken(player);
    return { row: lowestRow, column };
  };

  const checkWin = (player) => {
    const token = player.token;

    // 수평 체크
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col <= columns - 4; col++) {
        if (
          board[row][col].getValue() === token &&
          board[row][col + 1].getValue() === token &&
          board[row][col + 2].getValue() === token &&
          board[row][col + 3].getValue() === token
        ) {
          return [
            { row, col },
            { row, col: col + 1 },
            { row, col: col + 2 },
            { row, col: col + 3 },
          ];
        }
      }
    }

    // 수직 체크
    for (let col = 0; col < columns; col++) {
      for (let row = 0; row <= rows - 4; row++) {
        if (
          board[row][col].getValue() === token &&
          board[row + 1][col].getValue() === token &&
          board[row + 2][col].getValue() === token &&
          board[row + 3][col].getValue() === token
        ) {
          return [
            { row, col },
            { row: row + 1, col },
            { row: row + 2, col },
            { row: row + 3, col },
          ];
        }
      }
    }

    // 대각선 체크 (왼쪽 상단에서 오른쪽 하단)
    for (let row = 0; row <= rows - 4; row++) {
      for (let col = 0; col <= columns - 4; col++) {
        if (
          board[row][col].getValue() === token &&
          board[row + 1][col + 1].getValue() === token &&
          board[row + 2][col + 2].getValue() === token &&
          board[row + 3][col + 3].getValue() === token
        ) {
          return [
            { row, col },
            { row: row + 1, col: col + 1 },
            { row: row + 2, col: col + 2 },
            { row: row + 3, col: col + 3 },
          ];
        }
      }
    }

    // 대각선 체크 (왼쪽 하단에서 오른쪽 상단)
    for (let row = 3; row < rows; row++) {
      for (let col = 0; col <= columns - 4; col++) {
        if (
          board[row][col].getValue() === token &&
          board[row - 1][col + 1].getValue() === token &&
          board[row - 2][col + 2].getValue() === token &&
          board[row - 3][col + 3].getValue() === token
        ) {
          return [
            { row, col },
            { row: row - 1, col: col + 1 },
            { row: row - 2, col: col + 2 },
            { row: row - 3, col: col + 3 },
          ];
        }
      }
    }

    return false;
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );

  };

  return { getBoard, dropToken, checkWin, printBoard };
}

function Cell() {
  let value = 0;

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return { addToken, getValue };
}

function GameController(playerOneName = "Player1", playerTwoName = "Player2") {
  const board = GameBoard();

  const players = [
    { name: playerOneName, token: 1 },
    { name: playerTwoName, token: 2 },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
  };

  const playRound = (column) => {
 

    const droppedTokenPosition = board.dropToken(
      column,
      getActivePlayer().token
    );
    const winPositions = board.checkWin(getActivePlayer());

    if (winPositions) {
      return { winner: getActivePlayer().name, winPositions };
    }

    switchPlayerTurn();
    printNewRound();
    return { droppedTokenPosition };
  };

  printNewRound();

  return { playRound, getActivePlayer, getBoard: board.getBoard };
}

function ScreenController() {
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");
  const waitingScreen = document.querySelector(".waiting-screen");
  const startButton = document.querySelector("#startButton");

  let game;

  const updateScreen = (highlightPosition, winPositions) => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = colIndex;

        const cellValue = cell.getValue();
        if (cellValue === 1) {
          cellButton.classList.add("final-1");
        } else if (cellValue === 2) {
          cellButton.classList.add("final-2");
        }

        if (
          highlightPosition &&
          rowIndex === highlightPosition.row &&
          colIndex === highlightPosition.column
        ) {
          requestAnimationFrame(() => {
            cellButton.classList.add("highlight");
          });
          setTimeout(() => {
            cellButton.classList.remove("highlight");
          }, 1000);
        }

        if (winPositions) {
          winPositions.forEach((pos) => {
            if (pos.row === rowIndex && pos.col === colIndex) {
              cellButton.classList.add("win-highlight");
            }
          });
        }

        boardDiv.appendChild(cellButton);
      });
    });
  };

  const animateDrop = (column, callback) => {
    let cells = Array.from(
      boardDiv.querySelectorAll(`.cell[data-column="${column}"]`)
    );

    cells = cells.filter(
      (cell) =>
        !cell.classList.contains("final-1") &&
        !cell.classList.contains("final-2")
    );

    let row = 0;
    const playerToken = game.getActivePlayer().token;
    const activeClass = `active-${playerToken}`;

    const dropAnimation = setInterval(() => {
      if (row > 0) {
        cells[row - 1].classList.remove(activeClass);
      }

      if (row < cells.length) {
        cells[row].classList.add(activeClass);
      } else {
        clearInterval(dropAnimation);
        const finalCell = cells[row - 1];
        finalCell.classList.remove(activeClass);
        finalCell.classList.add(`final-${playerToken}`);
        requestAnimationFrame(() => {
          finalCell.classList.add("highlight"); // Add highlight class
        });
        setTimeout(() => {
          finalCell.classList.remove("highlight"); // Remove highlight class after animation
        }, 1000); // Adjust duration as needed
        callback();
      }

      row++;
    }, 100);
  };

  const endGame = (winnerMessage) => {
    playerTurnDiv.textContent = winnerMessage;

    const restartButton = document.createElement("button");
    restartButton.textContent = "다시 하기";
    restartButton.addEventListener("click", () => {
      game = GameController();
      updateScreen();
      playerTurnDiv.textContent = `${game.getActivePlayer().name}'s turn...`;
      boardDiv.addEventListener("click", clickHandlerBoard);
      restartButton.remove();
    });

    playerTurnDiv.appendChild(restartButton);
    boardDiv.removeEventListener("click", clickHandlerBoard);
  };

  function clickHandlerBoard(e) {
    const selectedColumn = e.target.dataset.column;

    if (!selectedColumn) return;

    let animationInProgress = true;

    animateDrop(selectedColumn, () => {
      const result = game.playRound(selectedColumn);
      animationInProgress = false;
      if (!animationInProgress) {
        updateScreen(result.droppedTokenPosition, result.winPositions);
      }
      if (result.winner) {
        endGame(`${result.winner}이 승리했습니다!`);
      }
    });
  }

  startButton.addEventListener("click", () => {
    const playerOneName =
      document.querySelector("#playerOneName").value || "Player 1";
    const playerTwoName =
      document.querySelector("#playerTwoName").value || "Player 2";

    game = GameController(playerOneName, playerTwoName);

    waitingScreen.style.display = "none";
    playerTurnDiv.style.display = "block";
    boardDiv.style.display = "grid";

    updateScreen();
    boardDiv.addEventListener("click", clickHandlerBoard);
  });

  updateScreen();
}

ScreenController();
