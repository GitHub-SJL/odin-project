/*
 ** Gameboard는 보드의 상태를 나타냅니다
 ** 각 칸은 나중에 정의될 Cell을 보유합니다
 ** 그리고 우리는 dropToken 메서드를 노출하여 칸에 셀을 추가할 수 있게 합니다
 */

function GameBoard() {
  const rows = 6;
  const columns = 7;
  const board = [];

  //   게임 보드의 상태를 나타내는 2차원 배열을 생성합니다
  for (let i = 0; i < rows; i++) {
    board[i] = [];

    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  // 토큰을 떨어뜨리려면 선택한 열의 최하단 지점을 찾아야 합니다.
  // 그런 다음 해당 셀의 값을 플레이어 번호로 변경해야 합니다.
  const dropToken = (column, player) => {
    const availableCells = board
      .filter((row) => row[column].getValue() === 0)
      .map((row) => row[column]);

    if (!availableCells.length) return;

    const lowesRow = availableCells.length - 1;
    board[lowesRow][column].addToken(player);
  };

  const checkWin = (player) => {
    const token = player.token;

    // 승리 조건 수평 체크
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns - 4; col++) {
        if (
          board[row][col].getValue() === token &&
          board[row][col + 1].getValue() === token &&
          board[row][col + 2].getValue() === token &&
          board[row][col + 3].getValue() === token
        )
          return true;
      }
    }

    // 승리 조건 수직 체크
    for (let col = 0; col < columns; col++) {
      for (let row = 0; row <= rows - 4; row++) {
        if (
          board[row][col].getValue() === token &&
          board[row + 1][col].getValue() === token &&
          board[row + 2][col].getValue() === token &&
          board[row + 3][col].getValue() === token
        )
          return true;
      }
    }

    // 승리 조건 대각선 체크 (왼쪽 상단에서 오른쪽 하단)
    for (let row = 0; row <= rows - 4; row++) {
      for (let col = 0; col <= columns - 4; col++) {
        if (
          board[row][col].getValue() === token &&
          board[row + 1][col + 1].getValue() === token &&
          board[row + 2][col + 2].getValue() === token &&
          board[row + 3][col + 3].getValue() === token
        )
          return true;
      }
    }
    // 승리 조건 대각선 체크 (왼쪽 하단 에서 오른쪽 상단)
    for (let row = 3; row < rows; row++) {
      for (let col = 0; col <= columns - 4; col++) {
        if (
          board[row][col].getValue() === token &&
          board[row - 1][col + 1].getValue() === token &&
          board[row - 2][col + 2].getValue() === token &&
          board[row - 3][col + 3].getValue() === token
        )
          return true;
      }
    }

    return false;
  };

  // 이 메서드는 보드를 콘솔에 출력하는 데 사용됩니다.
  // 플레이할 때 각 턴 후에 보드가 어떻게 생겼는지 보는 것이 도움이 되지만,
  // UI를 구축한 후에는 필요하지 않습니다.
  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );

    console.log(boardWithCellValues);
  };
  return { getBoard, dropToken, checkWin, printBoard };
}

/*
 ** Cell은 보드의 한 "칸"을 나타내며 다음 중 하나를 가질 수 있습니다.
 ** 0: 칸에 토큰이 없음,
 ** 1: 플레이어 1의 토큰,
 ** 2: 플레이어 2의 토큰
 */
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

  const player = [
    {
      name: playerOneName,
      token: 1,
    },
    {
      name: playerTwoName,
      token: 2,
    },
  ];

  let activePlayer = player[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === player[0] ? player[1] : player[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name} 차례`);
  };

  const playRound = (column) => {
    console.log(
      `${getActivePlayer().name}의 토큰이 ${column}행에 떨어집니다...`
    );

    board.dropToken(column, getActivePlayer().token);

    if (board.checkWin(getActivePlayer())) {
      console.log(`${getActivePlayer().name}이 승리했습니다!`);

      return;
    }

    switchPlayerTurn();
    printNewRound();
  };

  // 초기 게임 시작 메시지
  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
  };
}

function ScreenController() {
  const game = GameController();
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");

  const updateScreen = () => {
    // board 초기화
    boardDiv.textContent = "";

    // 새로운 board와 player 턴을 가져오기
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    // player 턴 표시
    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

    // board 랜더
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = colIndex;

        // cell 값에 따라 ui 변경
        const cellValue = cell.getValue();
        if (cellValue === 1) {
          cellButton.classList.add("final-1");
        } else if (cellValue === 2) {
          cellButton.classList.add("final-2");
        }

        boardDiv.appendChild(cellButton);
      });
    });
  };

  const animateDrop = (column, callback) => {
    const cells = Array.from(
      boardDiv.querySelectorAll(`.cell[data-column="${column}"]`)
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
        cells[row - 1].classList.remove(activeClass);
        cells[row - 1].classList.add(`final-${playerToken}`);
        callback();
      }
      row++;
    }, 100); // 100ms 간격으로 애니메이션 실행
  };

  function clickHandlerBoard(e) {
    const selectedColumn = e.target.dataset.column;

    if (!selectedColumn) return;

    let animationInProgress = true;

    animateDrop(selectedColumn, () => {
      game.playRound(selectedColumn);
      animationInProgress = false;
      if (!animationInProgress) {
        updateScreen();
      }
    });
  }

  boardDiv.addEventListener("click", clickHandlerBoard);

  updateScreen();
}

ScreenController();
