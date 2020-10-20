const { Engine, Render, Runner, Bodies, World, Body, Events, Composite } = Matter;

const cellsHorizontal = 13;
const cellsVertical = 13;
const width = window.innerWidth;
const height = window.innerHeight;

const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine;

const render = Render.create({
	element: document.body,
	engine: engine,
	options: { wireframes: false, width, height, background: 'black' }
});
Render.run(render);
Runner.run(Runner.create(), engine);

// WALLs
const wallThickness = 2;
const walls = [
	Bodies.rectangle(width / 2, 0, width, wallThickness, { isStatic: true }),
	Bodies.rectangle(width / 2, height, width, wallThickness, { isStatic: true }),
	Bodies.rectangle(0, height / 2, wallThickness, height, { isStatic: true }),
	Bodies.rectangle(width, height / 2, wallThickness, height, { isStatic: true })
];
World.add(world, walls);

// ensure randomness of the maze
const shuffle = (arr) => {
	let counter = arr.length;

	while (counter > 0) {
		const index = Math.floor(Math.random() * counter);
		counter--;
		const temp = arr[counter];
		arr[counter] = arr[index];
		arr[index] = temp;
	}

	return arr;
};

const grid = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal).fill(false));
const verticals = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal - 1).fill(false));
const horizontals = Array(cellsVertical - 1).fill(null).map(() => Array(cellsHorizontal).fill(false));
const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

/* Maze Generation */
const stepThroughCell = (row, column) => {
	// base case
	if (grid[row][column]) {
		return;
	}

	// Mark as visited
	grid[row][column] = true;

	// Assemble list of neighbors
	const neighbors = shuffle([
		[ row - 1, column, 'up' ],
		[ row, column + 1, 'right' ],
		[ row + 1, column, 'down' ],
		[ row, column - 1, 'left' ]
	]);

	// For each neighbor...
	for (let neighbor of neighbors) {
		const [ nextRow, nextColumn, direction ] = neighbor;
		// See if that neighbor is out of bounds
		if (nextRow < 0 || nextRow >= cellsVertical || nextColumn < 0 || nextColumn >= cellsHorizontal) {
			continue;
		}

		// Skip all neighbors that we visited
		if (grid[nextRow][nextColumn]) {
			continue;
		}

		// Remove the wall
		if (direction === 'left') {
			verticals[row][column - 1] = true;
		} else if (direction === 'right') {
			verticals[row][column] = true;
		} else if (direction == 'up') {
			horizontals[row - 1][column] = true;
		} else if (direction == 'down') {
			horizontals[row][column] = true;
		}

		// Visit the next neighbor
		stepThroughCell(nextRow, nextColumn);
	}
};

stepThroughCell(startRow, startColumn);

setTimeout(function(){
	horizontals.forEach((row, rowIndex) => {
		row.forEach((open, columnIndex) => {
			if(open) return;
				
			const wall = Bodies.rectangle(
				columnIndex * unitLengthX + unitLengthX / 2,
				rowIndex * unitLengthY + unitLengthY,
				unitLengthX,
				5,
				{
					label: 'wall',
					isStatic: true,
					render: {
						fillStyle: 'red'
					}
				}
			);
	
			World.add(world, wall);
		});
	});
	
	verticals.forEach((row, rowIndex) => {
		row.forEach((open, columnIndex) => {
			if (open) {
				return;
			}
	
			const wall = Bodies.rectangle(
				columnIndex * unitLengthX + unitLengthX,
				rowIndex * unitLengthY + unitLengthY / 2,
				5,
				unitLengthY,
				{
					label: 'wall',
					isStatic: true,
					render: {
						fillStyle: 'red'
					}
				}
			);
	
			World.add(world, wall);
		});
	});

	document.querySelector('.instruction').classList.add("hidden");

	// KEYPRESSES
	document.addEventListener('keydown', (event) => {
		const { x, y } = ball0.velocity;
		if (event.key === 'w') {
			Body.setVelocity(ball1, { x, y: y - 5 });
		} else if (event.key === 'd') {
			Body.setVelocity(ball1, { x: x + 5, y });
		} else if (event.key === 's') {
			Body.setVelocity(ball1, { x, y: y + 5 });
		} else if (event.key === 'a') {
			Body.setVelocity(ball1, { x: x - 5, y });
		}

		if (event.key === '8') {
			Body.setVelocity(ball2, { x, y: y - 5 });
		} else if (event.key === '6') {
			Body.setVelocity(ball2, { x: x + 5, y });
		} else if (event.key === '5') {
			Body.setVelocity(ball2, { x, y: y + 5 });
		} else if (event.key === '4') {
			Body.setVelocity(ball2, { x: x - 5, y });
		}
	});
}, 5000);


// GOAL
let a = 1;
let b = 1;
let goal = Bodies.rectangle(width - a * unitLengthX / 2, height - b * unitLengthY / 2, unitLengthX * 0.7, unitLengthY * 0.7, {
	label: 'goal',
	isStatic: true,
	render: {
		fillStyle: 'yellow',
		strokeStyle: 'white',
		lineWidth: 3,
	}
});

World.add(world, goal);

var count = 15;
var timer = setInterval(function(){
	count = count - 1;
	document.getElementById("target").innerHTML = count;	
	if(count == 0){
		count = 15;
	}
}, 1000)

var updateTargetLocation = setInterval(function(){
	World.remove(world, goal);

	while(true){
		let randomA = Math.floor(Math.random() * cellsVertical) + 1;
		if(randomA % 2 != 0){
			a = randomA;
			break;
		}
	}

	while(true){
		let randomB = Math.floor(Math.random() * cellsHorizontal) + 1;
		if(randomB % 2 != 0){
			b = randomB;
			break;
		}
	}	

	goal = Bodies.rectangle(width - a * unitLengthX / 2, height - b * unitLengthY / 2, unitLengthX * 0.7, unitLengthY * 0.7, {
		label: 'goal',
		isStatic: true,
		render: {
			fillStyle: 'green',
			strokeStyle: 'yellow',
			lineWidth: 3
		}
	});
	World.add(world, goal);
}, 15000);

// BALL
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball0 = Bodies.circle(unitLengthX / 2, unitLengthY / 2, ballRadius, {
	label: 'ball0',
	render: {
		fillStyle: 'white'
	}
});
const ball1 = Bodies.circle(unitLengthX / 1.5, unitLengthY / 2, ballRadius, {
	label: 'ball1',
	render: {
		fillStyle: 'blue'
	}
});
const ball2 = Bodies.circle(unitLengthX / 5, unitLengthY / 2, ballRadius, {
	label: 'ball2',
	render: {
		fillStyle: 'green'
	}
});
World.add(world, ball1);
World.add(world, ball2);


// WIN CONDITION
Events.on(engine, 'collisionStart', (event) => {
	
	event.pairs.forEach((collision) => {
		const labels1 = [ 'ball1', 'goal' ];
		const labels2 = [ 'ball2', 'goal' ];
		if (labels1.includes(collision.bodyA.label) && labels1.includes(collision.bodyB.label)) {
			document.querySelector('.winner1').classList.remove('hidden');
			World.remove(world, goal);
			clearInterval(updateTargetLocation);
			clearInterval(timer);
			world.gravity.y = 1;
			world.bodies.forEach((body) => {
				if (body.label === 'wall') {
					Body.setStatic(body, false);
				}
			});
		}
		if (labels2.includes(collision.bodyA.label) && labels2.includes(collision.bodyB.label)) {
			document.querySelector('.winner2').classList.remove('hidden');
			World.remove(world, goal);
			clearInterval(updateTargetLocation);
			clearInterval(timer);
			world.gravity.y = 1;
			world.bodies.forEach((body) => {
				if (body.label === 'wall') {
					Body.setStatic(body, false);
				}
			});
		}
	});
});

document.getElementById("restart1").addEventListener("click", function(){
	console.log("clicked");
	location.reload();
	return false;
});

document.getElementById("restart2").addEventListener("click", function(){
	console.log("clicked");
	location.reload();
	return false;
});


