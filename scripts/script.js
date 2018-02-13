
/*Global variable---------------------------------------------------------------------------------------*/

var canvas;			/*Variable to store the canvas object*/
var ctx;			/*Variable to store the context object to draw on the canvas*/
var canvasWidth;	/*Variable to store the canvas width*/
var canvasHeight;	/*Variable to store the canvas height*/
var cw=15;			/*cw stand with the tile width of the canvas i.e the lendth and bredth of individual boxes of the snake or food*/
var direction;		/*Varibale to store the current snake direction*/
var food;			/*Object to store the x and y position of the food*/
var score;			/*Variable to store the current score*/
var color='blue';	/*Variable to store the color of the snake*/
var speed=120;		/*Variable to store the speed of the game, to be inserted in the set interval method*/
var snakeArray;		/*Snake array to store the snake*/

/*------------------------------------------------------------------------------------------------------*/








/*Main function the loops continuously-----------------------------------------------------------------*/

//Function to start the game triggered automatically when the body is loaded
function gameStart() {
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');	//Set the context element of the canvas as  2d
	canvasWidth = canvas.width;		//Get canvas width
	canvasHeight = canvas.height;	//Get canvas height

	direction='right';				//Set the direction as right for the snake
	createSnake();					//Call function to create snake
	createFood();					//Call function to create food
	score=0;						//Initialise the score to zero

	//Use a timer to call paint function by using set interval
	//The typeof operator returns a string indicating the type of the unevaluated operand.
	if(typeof game_loop != 'undefined')	//If somehow the setInterval becomes undefined then clear it
		clearInterval(game_loop);
	game_loop = setInterval(paint,speed);	//Repeatedly call paint function after 'speed' milliseconds
}

/*------------------------------------------------------------------------------------------------------*/







/*Other functions------------------------------------------------------------------------------------------------------------*/
/*Create snake---------------------------------------------------------------------------------------------------------------*/
/*Create food----------------------------------------------------------------------------------------------------------------*/
/*Main paint function--------------------------------------------------------------------------------------------------------*/
/*Paint the individual cells-------------------------------------------------------------------------------------------------*/

//Create snake width length 5
function createSnake() {
	var snakeLength=5;
	snakeArray=[];
	for(var i=snakeLength-1; i>=0; i--) {
		//The push() method adds new items to the end of an array, and returns the new length
		//Here the array serves as an objct to store the x and y position
		snakeArray.push({x:i, y:0});	
	}
}

//Create food
function createFood() {
	//Food is an object with random x and y
	food= {
		//Math.round rounds up the value so that there is no decimal
		//Math.random gives a random number between 0.0 to 1.0
		//We multiply that with the number of tiles available with the canvas
		//Find any random points on the canvas other than the last point (that is why cw is minused once) and draw a square of side cw
		x:Math.round(Math.random()*(canvasWidth-cw)/cw),
		y:Math.round(Math.random()*(canvasHeight-cw)/cw)
	};
}

//Paint snake
function paint() {
	//Paint the canvas with black color and white border. This is also removing earlier what was written on canvas
	ctx.fillStyle = 'black';
	ctx.fillRect(0,0,canvasWidth,canvasHeight);
	ctx.strokeStyle = 'white';
	ctx.strokeRect(0,0,canvasWidth,canvasHeight);

	//Getting the head of the snake and its x and y values
	var nx=snakeArray[0].x;
	var ny=snakeArray[0].y;


	//Code to move the snake to the next position
	//The nx and ny thus stores the probalbe new position of the snake and takes decision appropriately
	//Based on the direction increse and decrease the x and y axis values and repaint the canvas
	if(direction == 'right') nx++;	//For right direction increase x axis value by 1
	else if(direction == 'left') nx--;	//For left direction decrease x axis value by 1
	else if(direction == 'up') ny--;	//Same logic as for x axis
	else if(direction == 'down') ny++;

	//If collision has occured then return from this function
	if(collided(nx,ny)) {
		return;
	}
	
	if(nx == food.x && ny == food.y) {	//If food has been eaten by the snake
		var tail = {x:nx , y:ny};	//Location of food stored in object tail
		score++;	
		createFood();		//Create new food
	} else {							//If food not eaten by the snake
		var tail = snakeArray.pop();	//The pop() method removes the last element of an array, and returns that element
		tail.x = nx;
		tail.y = ny;
	}

	//To add items at the beginning of an array, use the unshift() method
	snakeArray.unshift(tail);

	//Paint the entire snake on the canvas
	for(var i=0; i<snakeArray.length;i++) {
		var c = snakeArray[i];
		paintCell(c.x,c.y);
	}

	//Paint the food
	paintCell(food.x, food.y);

	//Check score
	checkScore(score);

	//Display current score
	var showScore = document.getElementById('score');
	showScore.innerHTML = 'Your Score :'+score;
}


//Function to paint the snake and the food
function paintCell(x,y) {
	//Basically this function paints any cell with cw width and height i.e either for food or for snake
	ctx.fillStyle=color;	//Setting the color of the food and the snake
	ctx.fillRect(x*cw, y*cw, cw, cw);
	ctx.strokeStyle='white';
	ctx.strokeRect(x*cw, y*cw, cw, cw);
}

/*------------------------------------------------------------------------------------------------------------------*/






/*Set of functions to find whether collission has occured or not-----------------------------------------------------*/

//Function to check whether snake has collided or not. If collided exit the game and call overlay 
function collided(nx,ny) {
	//nx = -1 means left wall has been hit
	//nx = canvasWidth/cw means right wall hit
	//ny = -1 means top wall hit
	//ny = canvasHeight/cw means bottom wall hit
	//checkCollosion function checks whether snake has hit itself
	if((nx==-1) || (nx==canvasWidth/cw) || (ny==-1) || (ny==canvasHeight/cw) || (checkCollision(nx,ny,snakeArray))) {
		//gameStart();Game gets restarted by this command. But we want to show the score so we show the other details
		
		//Insert final score
		var scoreArea = document.getElementById('finalScore');
		scoreArea.innerHTML=score;

		//Show overlay for the score and the restart game button
		var overlayArea = document.getElementById('overlay');
		overlayArea.style.display='block';
		return true;
	} else
		return false;
}


//Function to check the collission fo the snake with itself
function checkCollision(x, y, array) {
	//x and y are the head of the snake
	//If head of the snake goes to any position stored in the snake array then snake has hit itself
	for(var i=0; i<array.length; i++) {
		if(array[i].x==x && array[i].y==y) {
			return true;
		}
	}
}

/*--------------------------------------------------------------------------------------------------------------------*/







/*Functions related to high score-------------------------------------------------------------------------------------*/

//Function to check and store high score
function checkScore() {
	if(localStorage.getItem('highscore')===null) {
		//If there is no high score
		localStorage.setItem('highscore',score)
	} else {
		//If there is a high score
		if(score>localStorage.getItem('highscore')) {
			localStorage.setItem('highscore',score);
		}
	}

	//Printing the high score on the screen
	var highScoreArea = document.getElementById('high_score');
	highScoreArea.innerHTML = 'High score :'+localStorage.highscore;
}

//Function to reset high score
function reserHighScore() {
	localStorage.highscore=0;

	//Printing the high score on the screen
	var highScoreArea = document.getElementById('high_score');
	highScoreArea.innerHTML = 'High score :'+localStorage.highscore;
}

/*--------------------------------------------------------------------------------------------------------------------*/








/*Event listener for keybord control--------------------------------------------------------------------------------*/

//Code to add event listener for keyboard
document.addEventListener("keydown",keyPush);	//Add key down event listener to the document object

//Function that accepts the key pressed and makes the snake move appropriately
function keyPush(event) {
	var key = event.which;	//Get the keyCode of the key pressed

	//Based on the key pressed change the direction and it appropriately increase the x and y value
	if(key=='37' && direction!='right') direction='left';
	else if(key=='38' && direction!='down') direction='up';
	else if(key=='39' && direction!='left') direction='right';
	else if(key=='40' && direction!='up') direction='down';
}

/*--------------------------------------------------------------------------------------------------------------------*/