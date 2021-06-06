const START_NUMBER_OF_CELL = 1000
const CELL_SIZE = 10
const LIFE_TIMEOUT = 50

const LIFE_WIDTH = document.documentElement.offsetWidth
const LIFE_HEIGHT = document.documentElement.offsetHeight

class Life {
    constructor(canvas, options) {
        this.canvas = canvas

        this.option = {
            autoRun: true,
            autoFill: true,
            ...options,
        };

        this.canvasWidth = LIFE_WIDTH / CELL_SIZE
        this.canvasHeight = LIFE_HEIGHT / CELL_SIZE

        this.canvas.width = LIFE_WIDTH
        this.canvas.height = LIFE_HEIGHT

        this.ctx = this.canvas.getContext("2d")

        this.ctx.fillStyle = "#000000"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        this.cells = []

        for (let i = 0; i < this.canvasWidth; i++) {
            this.cells[i] = []

            for (let j = 0; j < this.canvasHeight; j++) {
                this.cells[i][j] = undefined
            }
        }

        if (this.option.autoFill) {
            for (let i = 0; i < START_NUMBER_OF_CELL; i++) {
                const cellXPosition = Math.floor(Math.random() * this.canvasWidth)
                const cellYPosition = Math.floor(Math.random() * this.canvasHeight)

                const cellX = Math.floor(cellXPosition)
                const cellY = Math.floor(cellYPosition)

                if (!this.cells[cellX][cellY]) {
                    this.cells[cellX][cellY] = new Cell(this.ctx, cellXPosition, cellYPosition, false)
                }
            }
        }

        if (this.option.autoRun) {
            requestAnimationFrame(this.deadWave)
        }
    }

    deadWave() {
        for (let i = 0; i < this.canvasWidth; i++) {
            for (let j = 0; j < this.canvasHeight; j++) {
                if (this.cells[i][j]) {
                    this.cells[i][j].neighbors = 0
                }

                let countAroundCells = 0

                if (i !== 0 && j !== 0 && this.cells[i - 1][j - 1] && !this.cells[i - 1][j - 1].newCell) {
                    countAroundCells += 1
                }

                if (i !== 0 && this.cells[i - 1][j] && !this.cells[i - 1][j].newCell) {
                    countAroundCells += 1
                }

                if (i !== 0 && j < this.canvasHeight - 1 && this.cells[i - 1][j + 1] && !this.cells[i - 1][j + 1].newCell) {
                    countAroundCells += 1
                }

                if (j < this.canvasHeight - 1 && this.cells[i][j + 1] && !this.cells[i][j + 1].newCell) {
                    countAroundCells += 1
                }

                if (i < this.canvasWidth - 1 && j < this.canvasHeight - 1 && this.cells[i + 1][j + 1] && !this.cells[i + 1][j + 1].newCell) {
                    countAroundCells += 1
                }

                if (i < this.canvasWidth - 1 && this.cells[i + 1][j] && !this.cells[i + 1][j].newCell) {
                    countAroundCells += 1
                }

                if (i < this.canvasWidth - 1 && j !== 0 && this.cells[i + 1][j - 1] && !this.cells[i + 1][j - 1].newCell) {
                    countAroundCells += 1
                }

                if (j !== 0 && this.cells[i][j - 1] && !this.cells[i][j - 1].newCell) {
                    countAroundCells += 1
                }

                if (this.cells[i][j]) {
                    this.cells[i][j].neighbors = countAroundCells
                } else if (countAroundCells === 3) {
                    this.cells[i][j] = new Cell(this.ctx, i, j)

                    this.cells[i][j].neighbors = 2

                    const r = Math.floor(Math.random() * (255 - 100) + 100)
                    const g = Math.floor(Math.random() * (255 - 100) + 100)
                    const b = Math.floor(Math.random() * (255 - 100) + 100)
                    this.cells[i][j].draw(`rgb(${r}, ${g}, ${b})`)
                }
            }
        }

        for (let i = 0; i < this.canvasWidth; i++) {
            for (let j = 0; j < this.canvasHeight; j++) {
                if (this.cells[i][j]) {
                    this.cells[i][j].newCell = false;

                    if (this.cells[i][j].neighbors !== 2 && this.cells[i][j].neighbors !== 3) {
                        this.cells[i][j].dead()

                        this.cells[i][j] = undefined
                    }
                }
            }
        }

        requestAnimationFrame(this.deadWave)
    }
}

class Cell {
    constructor(ctx, x, y, newCell = true) {
        this.ctx = ctx

        this.x = x
        this.y = y

        this.newCell = newCell
        this.neighbors = null

        this.draw()
    }

    draw(color = "#ffffff") {
        this.ctx.fillStyle = color
        this.ctx.fillRect(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
    }

    dead() {
        this.ctx.fillStyle = "#000000"
        this.ctx.fillRect(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
    }
}
