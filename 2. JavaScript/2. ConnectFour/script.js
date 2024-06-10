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

  // 이 메서드는 보드를 콘솔에 출력하는 데 사용됩니다.
  // 플레이할 때 각 턴 후에 보드가 어떻게 생겼는지 보는 것이 도움이 되지만,
  // UI를 구축한 후에는 필요하지 않습니다.
  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );

    console.log(boardWithCellValues);
  };
  return { getBoard, dropToken, printBoard };
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

    switchPlayerTurn();
    printNewRound();
  };

  // 초기 게임 시작 메시지
  printNewRound();

  return { playRound, getActivePlayer };
}

const game = GameController();

game.playRound(0); // Player One이 1열에 마커를 놓습니다.
game.playRound(0); // Player Two가 1열에 마커를 놓습니다.
