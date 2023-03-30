// Set up the canvas and context
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Set the block size and number of blocks
var blockSize = 10;
var widthInBlocks = canvas.width / blockSize;
var heightInBlocks = canvas.height / blockSize;

// Define the Block constructor
function Block(col, row) {
	this.col = col;
	this.row = row;
}

// Draw a square on the canvas
Block.prototype.drawSquare = function(color) {
	var x = this.col * blockSize;
	var y = this.row * blockSize;
	ctx.fillStyle = color;
	ctx.fillRect(x, y, blockSize, blockSize);
};

// Draw a circle on the canvas
Block.prototype.drawCircle = function(color) {
	var centerX = this.col * blockSize + blockSize / 2;
	var centerY = this.row * blockSize + blockSize / 2;
	ctx.fillStyle = color;
	circle(centerX, centerY, blockSize / 2, true);
};

// Check if two blocks are equal
Block.prototype.equal = function(otherBlock) {
	return this.col === otherBlock.col && this.row === otherBlock.row;
};

// Define the Snake constructor
function Snake() {
	this.segments = [new Block(7, 5), new Block(6, 5), new Block(5, 5)];
	this.direction = "right";
	this.nextDirection = "right";
}

// Draw the snake on the canvas
Snake.prototype.draw = function() {
	for (var i = 0; i < this.segments.length; i++) {
		this.segments[i].drawSquare("blue");
	}
};

// Move the snake on the canvas
Snake.prototype.move = function() {
	var head = this.segments[0];
	var newHead;

	this.direction = this.nextDirection;

	if (this.direction === "right") {
		newHead = new Block(head.col + 1, head.row);
	} else if (this.direction === "down") {
		newHead = new Block(head.col, head.row + 1);
	} else if (this.direction === "left") {
		newHead = new Block(head.col - 1, head.row);
	} else if (this.direction === "up") {
		newHead = new Block(head.col, head.row - 1);
	}

	if (this.checkCollision(newHead)) {
		gameOver();
		return;
	}

	this.segments.unshift(newHead);

	if (newHead.equal(apple.position)) {
		score++;
		apple.move();
	} else {
		this.segments.pop();
	}
};

// Check if the snake collides with a wall or itself
Snake.prototype.checkCollision = function(head) {
	var leftCollision = (head.col === 0);
	var topCollision = (head.row === 0);
	var rightCollision = (head.col === widthInBlocks - 1);
	var bottomCollision = (head.row === heightInBlocks - 1);

	var wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;

	var selfCollision = false;

	for (var i = 0; i < this.segments.length; i++) {
		if (head.equal(this.segments[i])) {
			selfCollision = true;
		}
	}

	return wallCollision || selfCollision;
};

// Define the Apple constructor
function Apple() {
	this.position = new Block(10, 10);
}

// Draw the apple on the canvas
Apple.prototype.draw = function() {
	this.position.drawCircle("limegreen");
};

// Move the apple to a random position
Apple.prototype.move = function() {
    this.x = Math.floor(Math.random() * (canvas.width - this.size));
    this.y = Math.floor(Math.random() * (canvas.height - this.size));
  };

// Add event listeners for keyboard and touch controls
document.addEventListener("keydown", function(event) {
	switch (event.code) {
		case "ArrowLeft":
			if (snake.direction !== "right") {
				snake.nextDirection = "left";
			}
			break;
		case "ArrowUp":
			if (snake.direction !== "down") {
				snake.nextDirection = "up";
			}
			break;
		case "ArrowRight":
			if (snake.direction !== "left") {
				snake.nextDirection = "right";
			}
			break;
		case "ArrowDown":
			if (snake.direction !== "up") {
				snake.nextDirection = "down";
			}
			break;
		default:
			break;
	}
});

var startX, startY, endX, endY;

document.addEventListener("touchstart", function(event) {
	startX = event.touches[0].pageX;
	startY = event.touches[0].pageY;
});

document.addEventListener("touchmove", function(event) {
	endX = event.touches[0].pageX;
	endY = event.touches[0].pageY;

	if (Math.abs(startX - endX) > Math.abs(startY - endY)) {
		if (startX > endX && snake.direction !== "right") {
			snake.nextDirection = "left";
		} else if (startX < endX && snake.direction !== "left") {
			snake.nextDirection = "right";
		}
	} else {
		if (startY > endY && snake.direction !== "down") {
			snake.nextDirection = "up";
		} else if (startY < endY && snake.direction !== "up") {
			snake.nextDirection = "down";
		}
	}
});

// Set up the game variables
var snake = new Snake();
var apple = new Apple();
var score = 0;

// Define the game loop function
function gameLoop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawScore();
	snake.move();
	snake.draw();
	apple.draw();
	drawBorder();

	setTimeout(function() {
		requestAnimationFrame(gameLoop);
	}, 1000 / 10);
}

// Start the game loop
gameLoop();