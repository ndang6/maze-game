const { Engine, Render, Runner, World, Bodies } = Matter;

const engine = Engine.create();
const { world } = engine;

const cells = 10;
const width = 600;
const height = 600;
const unitLength = width / cells;

const render = Render.create({
	element: document.body,
	engine: engine,
	//options: { wireframes: false, width, height }
	options: { width, height }
});
Render.run(render);
Runner.run(Runner.create(), engine);

// Walls
const wallThickness = 2;
const walls = [
	Bodies.rectangle(width / 2, 0, width, wallThickness, { isStatic: true }),
	Bodies.rectangle(width / 2, height, width, wallThickness, { isStatic: true }),
	Bodies.rectangle(0, height / 2, wallThickness, height, { isStatic: true }),
	Bodies.rectangle(width, height / 2, wallThickness, height, { isStatic: true })
];
World.add(world, walls);

// Maze Generation
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

const grid = Array(cells).fill(null).map(() => Array(cells).fill(false));
// const grid = [];
// for (let i = 0; i < 3; i++) {
// 	grid.push([]);
// 	for (let j = 0; j < 3; j++) {
// 		grid[i].push(false);
// 	}
// }

const verticals = Array(cells).fill(null).map(() => Array(cells - 1).fill(false));
const horizontals = Array(cells - 1).fill(null).map(() => Array(cells).fill(false));

const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

const stepThroughCell = (row, column) => {
	// If visited, return
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
		if (nextRow < 0 || nextRow >= cells || nextColumn < 0 || nextColumn >= cells) {
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

// stepThroughCell(1, 1);
stepThroughCell(startRow, startColumn);

horizontals.forEach((row, rowIndex) => {
	row.forEach((open, columnIndex) => {
		if (open) {
			return;
		}

		const wall = Bodies.rectangle(
			columnIndex * unitLength + unitLength / 2,
			rowIndex * unitLength + unitLength,
			unitLength,
			10,
			{
				isStatic: true
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
			columnIndex * unitLength + unitLength,
			rowIndex * unitLength + unitLength / 2,
			10,
			unitLength,
			{
				isStatic: true
			}
		);

		World.add(world, wall);
	});
});

// GOAL
const goal = Bodies.rectangle(width - unitLength / 2, height - unitLength / 2, unitLength * 0.7, unitLength * 0.7, {
	isStatic: true
});
World.add(world, goal);

// BALL
const ball = Bodies.circle(unitLength / 2, unitLength / 2, unitLength / 4);
World.add(world, ball);
