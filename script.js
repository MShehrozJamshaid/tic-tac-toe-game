const gameBoard = (() => {
  class Space {
    constructor(grid, marker) {
      this.grid = grid;
      this.htmlElement = document.getElementById(`${grid}`)
      this.marker = marker;
    }
    assignMarker(marker) {
      this.marker = marker;
    }
  }

  var boardArray = []

  function buildBoard(num) {
    for (x = 0; x < num; x++) {
      boardArray.push(new Space(x, ""));
    }
    return boardArray;
  }

  let placement = function(ev) {
    boardArray[ev.target.id].assignMarker(flowController.whoseTurn());
    updateHTML(boardArray[ev.target.id].htmlElement, boardArray[ev.target.id].marker);
    this.removeEventListener('click', placement);
    flowController.nextTurn();
  }

  function boardListenersAdd(ary=boardArray) {
    ary.forEach(element => element.htmlElement.addEventListener('click', placement))
  }

  function boardListenersRemove(ary=boardArray) {
    ary.forEach(element => element.htmlElement.removeEventListener('click', placement))
  }
  
  function clearBoard() {
    boardArray.forEach (element => element.assignMarker(""));
    boardArray.forEach (element => updateHTML(element.htmlElement, ""));
    boardListenersRemove(boardArray);
  }

  function getBoard() {
    return boardArray
  }

  function updateHTML(grid, marker) {
    document.getElementById(`${grid.id}`).innerHTML = marker
  }

  return {
    buildBoard,
    getBoard,
    clearBoard,
    boardListenersAdd,
    boardListenersRemove
  };

})();

const displayController = (() => {
  var msg = "";

  function displayMessage(msg) {
    document.getElementById('message-board-message').innerHTML = msg
  }

  function toggleFieldsOff(xName, oName) {
    document.getElementById('playerX').disabled = true;
    document.getElementById('playerO').disabled = true;
    document.getElementById('xName').innerHTML = xName;
    document.getElementById('oName').innerHTML = oName;
    document.getElementById('save-names').disabled = true;
    document.getElementById('clear-names').disabled = true;
  }

  function toggleFieldsOn() {
    document.getElementById('playerX').disabled = false;
    document.getElementById('playerO').disabled = false;
    document.getElementById('xName').innerHTML = "";
    document.getElementById('oName').innerHTML = "";
    document.getElementById('save-names').disabled = false;
    document.getElementById('save-names').innerHTML = "Save Names";
  }
  
  function toggleClearNamesOn() {
    document.getElementById('clear-names').disabled = false;
  }

  function toggleSavePlay() {
    document.getElementById('save-names').disabled = false;
    document.getElementById('save-names').innerHTML = "Play";
  }

  return {
    displayMessage,
    toggleFieldsOff,
    toggleSavePlay,
    toggleFieldsOn,
    toggleClearNamesOn
  }

})();

const flowController = (() => {
  var currentTurnX = false;
  var currentTurn;
  
  const playerFactory = (name, marker) => {
    return {name, marker}
  }

  var playerX = playerFactory("X", "X")
  var playerO = playerFactory("O", "O")

  let saveNames = (function(ev) {
    var xName = document.getElementById('playerX').value;
    var oName = document.getElementById('playerO').value;
    xName.name !== "" ? playerX.name = xName : playerX.name = "X";
    oName.name !== "" ? playerO.name = oName : playerO.name = "O";
    gameBoard.boardListenersAdd()
    displayController.toggleFieldsOff(xName, oName)
    nextTurn()
    }
  );

  let clearNames = function(ev) {
    displayController.toggleFieldsOn();
    displayController.displayMessage("Enter Players' Names.")
  };

  let resetBoard = function() {
    gameBoard.clearBoard();
    currentTurnX = false;
    displayController.toggleSavePlay()
    displayController.toggleClearNamesOn()
    displayController.displayMessage("Press Play or Clear Names")
  };

  function addMessageBoardListners() {
    document.getElementById('save-names').addEventListener('click', saveNames)
    document.getElementById('reset-board').addEventListener('click', resetBoard)
    document.getElementById('clear-names').addEventListener('click', clearNames)
  }

  (function preGame() {
    displayController.displayMessage(`Enter Players' Names.`);
    addMessageBoardListners();
  })()
  
  function whoseTurn() {
    currentTurnX ? currentTurn = "X" : currentTurn = "O";
    return currentTurn;
  }
  
  function checkWin() {
    let checkingVar = whoseTurn();
    let bdArray = [];
    gameBoard.getBoard().forEach(element => bdArray.push(element.marker));
    if (bdArray[0] == checkingVar && bdArray[1] == checkingVar && bdArray[2] == checkingVar) {return true}
    else if (bdArray[3] == checkingVar && bdArray[4] == checkingVar && bdArray[5] == checkingVar) {return true}
    else if (bdArray[6] == checkingVar && bdArray[7] == checkingVar && bdArray[8] == checkingVar) {return true}
    else if (bdArray[0] == checkingVar && bdArray[3] == checkingVar && bdArray[6] == checkingVar) {return true}
    else if (bdArray[1] == checkingVar && bdArray[4] == checkingVar && bdArray[7] == checkingVar) {return true}
    else if (bdArray[2] == checkingVar && bdArray[5] == checkingVar && bdArray[8] == checkingVar) {return true}
    else if (bdArray[0] == checkingVar && bdArray[4] == checkingVar && bdArray[8] == checkingVar) {return true}
    else if (bdArray[2] == checkingVar && bdArray[4] == checkingVar && bdArray[6] == checkingVar) {return true}
    else {return false}
  }

  function checkTie() {
    let count = 0;
    let bdArray = []
    gameBoard.getBoard().forEach(element => bdArray.push(element.marker));
    if (bdArray.filter(element => element === "X" || element === "O").length == 9) {return true} 
    else {return false}
  };
  

  function nextTurn() {
    var currentName;
    if (checkWin()) {
      currentTurnX ? currentName = playerX.name : currentName = playerO.name
      displayController.displayMessage(`${currentName} WON!!! Press Reset.`)
      gameBoard.boardListenersRemove();
    } else if (checkTie()) {
      displayController.displayMessage(`It's a TIE!!! Press Reset.`)
    } else {
      currentTurnX = !currentTurnX
      currentTurnX ? currentName = playerX.name : currentName = playerO.name
      displayController.displayMessage(`Your turn, ${currentName}`)
    }
  }


  return {
    whoseTurn,
    nextTurn
  }
})();




board = gameBoard.buildBoard(9);