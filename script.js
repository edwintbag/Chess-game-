const chessboard = document.getElementById("chessboard");

// Initialize board with pieces
const initialBoard = [
  ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
  ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
  ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
];

// Render board
function renderBoard() {
  chessboard.innerHTML = "";
  initialBoard.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const div = document.createElement("div");
      div.classList.add("cell");
      if ((rowIndex + colIndex) % 2 === 0) {
        div.style.backgroundColor = "#f0d9b5";
      } else {
        div.style.backgroundColor = "#b58863";
      }
      if (cell) {
        const piece = document.createElement("div");
        piece.textContent = cell;
        piece.classList.add("piece");
        div.appendChild(piece);
      }
      chessboard.appendChild(div);
    });
  });
}

renderBoard();


let selectedPiece = null;
let selectedPosition = null;

// Handle cell click
function handleCellClick(row, col) {
  if (selectedPiece) {
    // Validate move
    if (isValidMove(selectedPiece, selectedPosition, [row, col])) {
      movePiece(selectedPosition, [row, col]);
      switchTurn();
    }
    selectedPiece = null;
    selectedPosition = null;
  } else {
    const piece = initialBoard[row][col];
    if (piece) {
      selectedPiece = piece;
      selectedPosition = [row, col];
    }
  }
  renderBoard();
}

// Validate pawn moves (simplified)
function isValidMove(piece, from, to) {
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;

  // White pawn logic
  if (piece === "♙") {
    if (fromCol === toCol && initialBoard[toRow][toCol] === "") {
      return fromRow - toRow === 1; // Single step forward
    }
  }

  // Black pawn logic
  if (piece === "♟") {
    if (fromCol === toCol && initialBoard[toRow][toCol] === "") {
      return toRow - fromRow === 1; // Single step forward
    }
  }

  return false; // Default: invalid move
}

// Move piece
function movePiece(from, to) {
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;
  initialBoard[toRow][toCol] = initialBoard[fromRow][fromCol];
  initialBoard[fromRow][fromCol] = "";
}

// Switch turn
let currentPlayer = "White"; // Alternate turns
function switchTurn() {
  currentPlayer = currentPlayer === "White" ? "Black" : "White";
}

// Update renderBoard to handle clicks
function renderBoard() {
  chessboard.innerHTML = "";
  initialBoard.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const div = document.createElement("div");
      div.classList.add("cell");
      div.onclick = () => handleCellClick(rowIndex, colIndex);

      if ((rowIndex + colIndex) % 2 === 0) {
        div.style.backgroundColor = "#f0d9b5";
      } else {
        div.style.backgroundColor = "#b58863";
      }

      if (cell) {
        const piece = document.createElement("div");
        piece.textContent = cell;
        piece.classList.add("piece");
        div.appendChild(piece);
      }

      chessboard.appendChild(div);
    });
  });
}

renderBoard();



function renderBoard() {
  chessboard.innerHTML = "";
  initialBoard.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const div = document.createElement("div");
      div.classList.add("cell");

      div.ondragover = (e) => e.preventDefault();
      div.ondrop = () => handleDrop(rowIndex, colIndex);

      if ((rowIndex + colIndex) % 2 === 0) {
        div.style.backgroundColor = "#f0d9b5";
      } else {
        div.style.backgroundColor = "#b58863";
      }

      if (cell) {
        const piece = document.createElement("div");
        piece.textContent = cell;
        piece.classList.add("piece");
        piece.draggable = true;
        piece.ondragstart = () => handleDragStart(rowIndex, colIndex);
        div.appendChild(piece);
      }

      chessboard.appendChild(div);
    });
  });
}

let draggedPosition = null;

function handleDragStart(row, col) {
  draggedPosition = [row, col];
}

function handleDrop(row, col) {
  if (draggedPosition && isValidMove(initialBoard[draggedPosition[0]][draggedPosition[1]], draggedPosition, [row, col])) {
    movePiece(draggedPosition, [row, col]);
    switchTurn();
    draggedPosition = null;
    renderBoard();
  }
}