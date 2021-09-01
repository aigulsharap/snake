const game = {
    snake: {
        x: 1,
        y: 1,
        tail: [],
        speed: 1,
        direction: 'right',
        grow() {
            game.snake.tail.push({ x: game.snake.x, y: game.snake.y })
        },
        refreshTail() {
            game.snake.tail.splice(0, 1)
            game.snake.grow()
        }
    },
    food: {
        x: 5,
        y: 5,
    },
    score: 0,
    rows: 10,
    cols: 10,
    field: document.querySelector('.field'),
    scoreEl: document.querySelector('.score'),
    placeFood() {
        game.food.x = game.randomInteger(1, game.cols)
        game.food.y = game.randomInteger(1, game.rows)
        if (game.food.x === game.snake.x && game.food.y === game.snake.y) {
            game.placeFood()
        }
    },
    randomInteger(min, max) {
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        return Math.round(rand);
    },
    drawSnake() {
        game.snake.tail.forEach((tailPart) => {
            game.paintCell(tailPart, 'tail')
        })
        game.paintCell(game.snake, 'snake-head')
    },
    drawFood() {
        game.paintCell(game.food, 'food')
    },
    render() {
        let field = ''
        for (let i = 1; i <= game.rows; i++) {
            let cells = ''
            for (let j = 1; j <= game.cols; j++) {
                cells += `<div class="cell" data-col="${j}" data-row="${i}"></div>`
            }
            field += `<div class="row">${cells}</div>`
        }
        game.field.innerHTML = field
        game.drawSnake()
        game.drawFood()
    },
    paintCell(coords, className) {
        const cell = document.querySelector(`[data-col="${coords.x}"][data-row="${coords.y}"]`)
        cell.classList.add(className)
    },
    intervalId: null,
    listenEvents() {
        document.addEventListener('keydown', e => {
            switch (e.key) {
                case 'ArrowUp':
                    game.snake.direction = 'up'
                    break
                case 'ArrowDown':
                    game.snake.direction = 'down'
                    break
                case 'ArrowRight':
                    game.snake.direction = 'right'
                    break
                case 'ArrowLeft':
                    game.snake.direction = 'left'
                    break
            }
        })
    },
    makeStep() {
        switch (game.snake.direction) {
            case 'up':
                game.snake.y--
                break
            case 'down':
                game.snake.y++
                break
            case 'right':
                game.snake.x++
                break
            case 'left':
                game.snake.x--
                break
        }
        game.check()
        game.render()
    },
    start() {
        game.placeFood()
        game.render()
        game.listenEvents()
        game.intervalId = setInterval(game.makeStep, 1000 / game.snake.speed)
    },
    check() {
        if (game.snake.x > game.cols || game.snake.x <= 0 || game.snake.y > game.rows || game.snake.y <= 0) {
            clearInterval(game.intervalId)
            game.scoreEl.innerHTML = 'Game over'
        } else if (game.snake.x === game.food.x && game.snake.y === game.food.y) {
            game.placeFood()
            game.score++
            game.scoreEl.innerHTML = `Счёт: ${game.score}`
            game.snake.grow()
        } else {
            game.snake.refreshTail()
        }
    },
};

game.start()
