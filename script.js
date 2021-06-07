const START_NUMBERS_OF_CELL = 2000
const CELL_SIZE = 10

const LIFE_WIDTH = document.documentElement.offsetWidth
const LIFE_HEIGHT = document.documentElement.offsetHeight

const GAME_BOARD_BACKGROUND_COLOR = "#000000";

class Life {
    constructor(canvas) {
        this.canvas = canvas

        this.canvasWidth = LIFE_WIDTH / CELL_SIZE
        this.canvasHeight = LIFE_HEIGHT / CELL_SIZE

        this.canvas.width = LIFE_WIDTH
        this.canvas.height = LIFE_HEIGHT

        this.ctx = this.canvas.getContext("2d")

        this.ctx.fillStyle = GAME_BOARD_BACKGROUND_COLOR
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        this.cells = []

        for (let i = 0; i < this.canvasWidth; i++) {
            this.cells[i] = []

            for (let j = 0; j < this.canvasHeight; j++) {
                this.cells[i][j] = undefined
            }
        }

        for (let i = 0; i < START_NUMBERS_OF_CELL; i++) {
            const cellXPosition = Math.floor(Math.random() * this.canvasWidth)
            const cellYPosition = Math.floor(Math.random() * this.canvasHeight)

            if (!this.cells[cellXPosition][cellYPosition]) {
                this.cells[cellXPosition][cellYPosition] = new Cell(this.ctx, cellXPosition, cellYPosition, false)

                this.cells[cellXPosition][cellYPosition].draw()
            }
        }

        this.deadWave = this.deadWave.bind(this)

        requestAnimationFrame(this.deadWave)
    }

    deadWave() {
        for (let i = 0; i < this.canvasWidth; i++) {
            for (let j = 0; j < this.canvasHeight; j++) {
                if (this.cells[i][j]) {
                    this.cells[i][j].neighbors = 0
                }

                let countAroundCells = 0

                if (i !== 0 && j !== 0 && this.cells[i - 1][j - 1] && !this.cells[i - 1][j - 1].newborn) {
                    countAroundCells += 1
                }

                if (i !== 0 && this.cells[i - 1][j] && !this.cells[i - 1][j].newborn) {
                    countAroundCells += 1
                }

                if (i !== 0 && j < this.canvasHeight - 1 && this.cells[i - 1][j + 1] && !this.cells[i - 1][j + 1].newborn) {
                    countAroundCells += 1
                }

                if (j < this.canvasHeight - 1 && this.cells[i][j + 1] && !this.cells[i][j + 1].newborn) {
                    countAroundCells += 1
                }

                if (i < this.canvasWidth - 1 && j < this.canvasHeight - 1 && this.cells[i + 1][j + 1] && !this.cells[i + 1][j + 1].newborn) {
                    countAroundCells += 1
                }

                if (i < this.canvasWidth - 1 && this.cells[i + 1][j] && !this.cells[i + 1][j].newborn) {
                    countAroundCells += 1
                }

                if (i < this.canvasWidth - 1 && j !== 0 && this.cells[i + 1][j - 1] && !this.cells[i + 1][j - 1].newborn) {
                    countAroundCells += 1
                }

                if (j !== 0 && this.cells[i][j - 1] && !this.cells[i][j - 1].newborn) {
                    countAroundCells += 1
                }

                if (this.cells[i][j]) {
                    this.cells[i][j].neighbors = countAroundCells
                } else if (countAroundCells === 3) {
                    this.cells[i][j] = new Cell(this.ctx, i, j)

                    this.cells[i][j].draw(this.randomColor)
                }
            }
        }

        for (let i = 0; i < this.canvasWidth; i++) {
            for (let j = 0; j < this.canvasHeight; j++) {
                if (this.cells[i][j]) {
                    if (this.cells[i][j].newborn) {
                        this.cells[i][j].newborn = false;
                    } else if (this.cells[i][j].neighbors !== 2 && this.cells[i][j].neighbors !== 3) {
                        this.cells[i][j].dead()

                        this.cells[i][j] = undefined
                    }
                }
            }
        }

        requestAnimationFrame(this.deadWave)
    }

    get randomColor() {
        const r = Math.floor(Math.random() * (255 - 100) + 100)
        const g = Math.floor(Math.random() * (255 - 100) + 100)
        const b = Math.floor(Math.random() * (255 - 100) + 100)

        return `rgb(${r}, ${g}, ${b})`
    }
}

class Cell {
    #neighbors = 0

    constructor(ctx, x, y, newborn = true) {
        this.ctx = ctx

        this.x = x
        this.y = y

        this.newborn = newborn
    }

    get position() {
        return [
            this.x * CELL_SIZE,
            this.y * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE,
        ]
    }

    draw(color = "#ffffff") {
        this.ctx.fillStyle = color
        this.ctx.fillRect(...this.position)
    }

    dead() {
        this.ctx.fillStyle = GAME_BOARD_BACKGROUND_COLOR
        this.ctx.fillRect(...this.position)
    }

    set neighbors(neighbors) {
        this.#neighbors = neighbors
    }

    get neighbors() {
        return this.#neighbors
    }
}
