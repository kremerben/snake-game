$(document).ready(function () {

    var canvas = $("#canvas")[0];
    var canvasContext = canvas.getContext("2d");
canvasContext.font="20px Georgia";
    canvasContext.fillStyle="black";
    var width = $("#canvas").width();
    var height = $("#canvas").height();
    var food;
    var score;
    var highScore = 0;

    var cellWidth = 50;
    var snakeBody;
    var currentDirection;
    var gameSpeed;

    var gameLoopInterval;

function startGame() {
    gameSpeed = 200;
    score = 0;
    // Let's set the game loop to run every 60 milliseconds
    gameLoopInterval = setInterval(gameLoop, gameSpeed);
    createFood();
    createSnake();
    currentDirection = "right";

}

function gameLoop() {
    var nextPosition = getNextPosition();

    if (checkGameOver(nextPosition, snakeBody)) {
        gameOver();
        return;
    }
    if (!checkEatFood(nextPosition)) {
        // Remove the tail of the snake
        snakeBody.pop();
    }

    // Add the next position
    // to the front of our snakeBody
    snakeBody.unshift(nextPosition);

    paintCanvas();
}

function gameOver() {
    clearInterval(gameLoopInterval);
    canvasContext.fillStyle = '#000000';
    canvasContext.fillRect(0, 0, width, height);
    canvasContext.fillStyle = '#FFF';

    canvasContext.fillText("Game Over", 305, height - 350);

}
// Let's set up the arrow keys for our game
$(document).keydown(function (e) {
    var key = e.which;

    // This will change the direction of the snake
    // Make sure we check that the user isn't trying to have the snake go backwards
    if (key == "37" && currentDirection != "right") currentDirection = "left";
    else if (key == "38" && currentDirection != "down") currentDirection = "up";
    else if (key == "39" && currentDirection != "left") currentDirection = "right";
    else if (key == "40" && currentDirection != "up") currentDirection = "down";
});

function createFood() {
    food = {
        x: Math.round(Math.random() * (width - cellWidth) / cellWidth),
        y: Math.round(Math.random() * (height - cellWidth) / cellWidth)
    };
}



// Get the next position of the snake
function getNextPosition() {
    // First let's grab the snake's head's x and y
    var currentPosition = snakeBody[0];
    var nextPosition = {
        x: currentPosition.x,
        y: currentPosition.y
    };

    // Increment the x or y value depending on what
    // direction the snake is going
    if (currentDirection == "right") nextPosition.x++;
    else if (currentDirection == "left") nextPosition.x--;
    else if (currentDirection == "up") nextPosition.y--;
    else if (currentDirection == "down") nextPosition.y++;

return nextPosition;

}


// Check if snake is on the same space as food
function checkEatFood(position) {
    if (position.x == food.x && position.y == food.y) {
        createFood();
        score++;
        return true;
        clearInterval(gameLoopInterval);
        gameSpeed -= 10;
        if (gameSpeed < 100) {
            gameSpeed = 100;
        }
        gameLoopInterval = setInterval(gameLoop, gameSpeed);

    } else {
        return false;
    }
}

// Paint the snake and food
function paintCanvas() {
    // Lets fill in the canvas colors
    canvasContext.fillStyle = "white";
    canvasContext.fillRect(0, 0, width, height);
    canvasContext.strokeStyle = "black";
    canvasContext.strokeRect(0, 0, width, height);
    // Paint the snake body
    for (var i = 0; i < snakeBody.length; i++) {
        var cell = snakeBody[i];
        if (i == 0) {
            paintCell(cell.x, cell.y, "green", i);
        } else {
            paintCell(cell.x, cell.y, "red", i);
        }
    }
    var randInt = Math.floor((Math.random() * 3) + 1);

    paintCell(food.x, food.y, "orange", 1);

}


function createSnake() {
    // Starting length of the snake will be 5 cells
    var length = 5;
    // Let's set the snake body back to an empty array
    snakeBody = [];
    // Add cells to the snake body starting from the top left hand corner of the screen
    for (var i = length - 1; i >= 0; i--) {
        snakeBody.push({x: i, y: 0});
    }
}

    //Lets first create a generic function to paint cells
function paintCell(x, y, color, index) {

    canvasContext.fillStyle = color;
    if (index > 15) {
        index = 15;
    }
    canvasContext.fillRect(x * cellWidth + 1.5 * index, y * cellWidth + 1.5 * index, cellWidth - 3 * index, cellWidth - 3 * index);
    canvasContext.strokeStyle = "white";
    canvasContext.strokeRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);



    canvasContext.fillStyle="black";
    canvasContext.strokeStyle = "white";
    var scoreText = "Score: " + score;
    canvasContext.fillText(scoreText, 5, height - 5);
    highScore = Math.max(score, highScore);
    var highScoreText = "High Score: " + highScore;
    canvasContext.fillText(highScoreText, 5, height - 35);
}

    // Check if snake has collided with walls or itself
function checkGameOver(position, snakeBody) {
    if(position.x <= -1 || position.x >= width / cellWidth) {
        // If the snake has gone off the left or right boundaries, game over!
        return true;
    } else if(position.y <= -1 || position.y >= height / cellWidth) {
        // If the snake has gone off the top or bottom boundaries, game over!
        return true;
    } else {
        // If the snake's next position collides with another cell in it's body, game over!
        for (var i = 0; i < snakeBody.length - 1; i++) {
            if (snakeBody[i].x == position.x && snakeBody[i].y == position.y) {
                return true;
            }
        }
        return false;
    }
}

    $('#start').on("click", function() {
//        gameOver();
        startGame();
    });


});