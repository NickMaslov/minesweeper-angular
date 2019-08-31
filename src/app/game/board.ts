import { Cell } from "./cell";

export class Board {
  cells: Cell[][] = [];

  private remainingCells = 0;
  private remainingCount = 0;

  constructor(size: number, mines: number) {
    for (let y = 0; y < size; y++) {
      this.cells[y] = [];
      for (let x = 0; x < size; x++) {
        this.cells[y][x] = new Cell(y, x);
      }
    }
    //Assim mines
    for (let i = 0; i < mines; i++) {
      this.getRandomCell().mine = true;
    }
    //Count mines
    const peers = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1]
    ];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        let adjacentMines = 0;
        for (let peer of peers) {
          if (
            this.cells[y + peer[0]] &&
            this.cells[y + peer[0]][x + peer[1]] &&
            this.cells[y + peer[0]][x + peer[1]].mine
          ) {
            adjacentMines++;
          }
        }
        this.cells[y][x].proximityMines = adjacentMines;

        if (this.cells[y][x].mine) {
          this.remainingCount++;
        }
      }
    }
    this.remainingCells = size * size - this.remainingCount;
  }
  getRandomCell(): Cell {
    const y = Math.floor(Math.random() * this.cells.length);
    const x = Math.floor(Math.random() * this.cells[y].length);
    return this.cells[y][x];
  }

  checkCell(cell: Cell): "gameover" | "win" | null {
    // console.log("cheking cell", cell);
    if (cell.status !== "open") {
      return;
    } else if (cell.mine) {
      this.revealAll();
      return "gameover";
    } else {
      cell.status = "clear";
      
      if (this.remainingCells-- <= 1) {
        return "win";
      }
      return;
    }
  }

  revealAll() {
    for (let row of  this.cells) {
      for (let cell of row) {
        if (cell.status === "open") {
          cell.status = "clear";
        }
      }
    }
  }
}
