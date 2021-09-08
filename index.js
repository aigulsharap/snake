class Snake {
    constructor(root, settings) {
        this.snake = {
            x: 1,
            y: 1,
            tail: [],
            speed: settings?.speed || 1,
            direction: 'right',
        }
        this.food = {
            x: 5,
            y: 5,
        }
        this.score = 0
        this.rows = settings?.rows || 10
        this.cols = settings?.cols || 10
        this.intervalId = null
        this.mount(root)
    }
    mount(root) {
        const rootEl = document.querySelector(root)
        rootEl.append(this.createButton())
        rootEl.append(this.renderScore())
        rootEl.append(this.createField())
        this.render()
    }
    createField() {
        const field = document.createElement('div')
        field.className = 'field'
        this.field = field
        return this.field
    }
    createButton() {
        const button = document.createElement('button')
        button.className = 'button'
        button.textContent = 'Старт'
        button.addEventListener('click', this.start.bind(this))
        this.button = button
        return button
    }
    renderScore() {
        if (!this.scoreEl) {
            const score = document.createElement('h1')
            score.className = 'score'
            this.scoreEl = score
        }
        this.scoreEl.innerHTML = `Счёт: ${this.score}`
        return this.scoreEl
    }
    grow() {
        this.snake.tail.push({ x: this.snake.x, y: this.snake.y })
    }
    refreshTail() {
        this.snake.tail.splice(0, 1)
        this.grow()
    }
    placeFood() {
        this.food.x = this.randomInteger(1, this.cols)
        this.food.y = this.randomInteger(1, this.rows)
        if (this.food.x === this.snake.x && this.food.y === this.snake.y) {
            this.placeFood()
        }
    }
    randomInteger(min, max) {
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        return Math.round(rand);
    }
    drawSnake() {
        this.snake.tail.forEach((tailPart) => {
            this.paintCell(tailPart, 'tail')
        })
        this.paintCell(this.snake, 'snake-head')
    }
    drawFood() {
        this.paintCell(this.food, 'food')
    }
    render() {
        let field = ''
        for (let i = 1; i <= this.rows; i++) {
            let cells = ''
            for (let j = 1; j <= this.cols; j++) {
                cells += `<div class="cell" data-col="${j}" data-row="${i}"></div>`
            }
            field += `<div class="row">${cells}</div>`
        }
        this.field.innerHTML = field
        this.drawSnake()
        this.drawFood()
    }
    paintCell(coords, className) {
        const cell = document.querySelector(`[data-col="${coords.x}"][data-row="${coords.y}"]`)
        cell.classList.add(className)
    }
    listenEvents() {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    this.snake.direction = 'up'
                    break
                case 'ArrowDown':
                    this.snake.direction = 'down'
                    break
                case 'ArrowRight':
                    this.snake.direction = 'right'
                    break
                case 'ArrowLeft':
                    this.snake.direction = 'left'
                    break
            }
        })
    }
    updateCoords() {
        switch (this.snake.direction) {
            case 'up':
                this.snake.y--
                break
            case 'down':
                this.snake.y++
                break
            case 'right':
                this.snake.x++
                break
            case 'left':
                this.snake.x--
                break
        }
        this.makeStep()
    }
    start() {
        this.snake.x = 1
        this.snake.y = 1
        this.snake.tail = []
        this.food = {
            x: 5,
            y: 5,
        }
        this.score = 0
        this.scoreEl.innerHTML = `Счёт: ${this.score}`
        this.placeFood()
        this.render()
        this.listenEvents()
        clearInterval(this.intervalId)
        this.intervalId = setInterval(this.updateCoords.bind(this), 1000 / this.snake.speed)
    }
    makeStep() {
        if (this.snake.x > this.cols || this.snake.x <= 0 || this.snake.y > this.rows || this.snake.y <= 0) {
            clearInterval(this.intervalId)
            this.scoreEl.innerHTML = 'Game over'
        } else if (this.snake.x === this.food.x && this.snake.y === this.food.y) {
            this.placeFood()
            this.score++
            this.scoreEl.innerHTML = `Счёт: ${this.score}`
            this.grow()
            this.render()
        } else {
            this.refreshTail()
            this.render()
        }
    }
}

const game = new Snake('#app', {})

