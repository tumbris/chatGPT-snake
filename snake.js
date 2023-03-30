// Get the canvas and context
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Set the canvas dimensions and border width
canvas.width = 400;
canvas.height = 400;
var borderWidth = 20;

// Define the Snake object
function Snake() {
  this.size = 20;
  this.x = canvas.width / 2;
  this.y = canvas.height / 2;
  this.direction = "none";
  this.nextDirection = "none";
  this.segments = [{ x: this.x, y: this.y }];

  // Define the move method
  this.move = function () {
    this.direction = this.nextDirection;

    // Move the head of the snake
    switch (this.direction) {
      case "up":
        this.y -= this.size;
        break;
      case "down":
        this.y += this.size;
        break;
      case "left":
        this.x -= this.size;
        break;
      case "right":
        this.x += this.size;
        break;
      default:
        break;
    }

    // Add the new head segment to the segments array
    this.segments.unshift({ x: this.x, y: this.y });

    // Remove the tail segment if the snake hasn't eaten an apple
    if (this.segments.length > 1 && !this.ateApple) {
      this.segments.pop();
    } else {
      this.ateApple = false;
    }
  };

  // Define the draw method
  this.draw = function () {
    for (var i = 0; i < this.segments.length; i++) {
      ctx.fillStyle = "#000";
      ctx.fillRect(
        this.segments[i].x,
        this.segments[i].y,
        this.size,
        this.size
      );
    }
  };

  // Define the checkCollision method
  this.checkCollision = function () {
    // Check for collision with the border
    if (
      this.x < borderWidth ||
      this.x + this.size > canvas.width - borderWidth ||
      this.y < borderWidth ||
      this.y + this.size > canvas.height - borderWidth
    ) {
      return true;
    }

    // Check for collision with the snake's own body
    for (var i = 1; i < this.segments.length; i++) {
      if (this.x === this.segments[i].x && this.y === this.segments[i].y) {
        return true;
      }
    }

    return false;
  };
}

// Define the Apple object
function Apple() {
  this.size = 20;
  this.x = Math.floor(Math.random() * (canvas.width - this.size));
  this.y = Math.floor(Math.random() * (canvas.height - this.size));

  // Define the draw method
  this.draw = function () {
    ctx.fillStyle = "#f00";
    ctx.fillRect(this.x, this.y, this.size, this.size);
  };

  // Define the move method
  this.move = function () {
    this.x = Math.floor(Math.random() * (canvas.width - this.size));
    this.y = Math.floor(Math.random() * (canvas.height - this.size));
  };
}

// Add event listeners for keyboard and touch controls
var isPaused = true;
document.addEventListener("keydown", function (event) {
  if (isPaused) {
    isPaused = false;
    gameLoop();
  }
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

var touchStartX, touchStartY;
var touchEndX, touchEndY;

document.addEventListener(
  "touchstart",
  function (event) {
    if (isPaused) {
      isPaused = false;
      gameLoop();
    }
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  },
  false
);

document.addEventListener(
  "touchend",
  function (event) {
    touchEndX = event.changedTouches[0].clientX;
    touchEndY = event.changedTouches[0].clientY;

    var xDiff = touchEndX - touchStartX;
    var yDiff = touchEndY - touchStartY;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0 && snake.direction !== "left") {
        snake.nextDirection = "right";
      } else if (snake.direction !== "right") {
        snake.nextDirection = "left";
      }
    } else {
      if (yDiff > 0 && snake.direction !== "up") {
        snake.nextDirection = "down";
      } else if (snake.direction !== "down") {
        snake.nextDirection = "up";
      }
    }
  },
  false
);

// Initialize the Snake and Apple objects
var snake = new Snake();
var apple = new Apple();

// Define the game loop
function gameLoop() {
  // Move the snake
  snake.move();

  // Check for collision with the border or the snake's own body
  if (snake.checkCollision()) {
    alert("Game Over!");
    location.reload();
  }

  // Check for collision with the apple
  if (snake.x === apple.x && snake.y === apple.y) {
    snake.ateApple = true;
    apple.move();
  }

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the snake and the apple
  snake.draw();
  apple.draw();

  // Set the game speed and call the game loop recursively
  setTimeout(gameLoop, 100);
}
