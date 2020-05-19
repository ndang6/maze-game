const { Engine, Render, Runner, World, Bodies } = Matter;

const engine = Engine.create();
const { world } = engine;

const cells = 3;
const width = 600;
const height = 600;

const render = Render.create({
	element: document.body,
	engine: engine,
	//options: { wireframes: false, width, height }
	options: { width, height }
});
Render.run(render);
Runner.run(Runner.create(), engine);

// Walls
const walls = [
	Bodies.rectangle(width / 2, 0, width, 40, { isStatic: true }),
	Bodies.rectangle(width / 2, height, width, 40, { isStatic: true }),
	Bodies.rectangle(0, height / 2, 40, height, { isStatic: true }),
	Bodies.rectangle(width, height / 2, 40, height, { isStatic: true })
];
World.add(world, walls);

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
	// Mark as visited
	// Assemble list of neighbors
	// For each neighbor...
	// See if that neighbor is out of bounds
	// Skip all neighbors that we visited
	// Remove the wall
	// Visit the next neighbor
};

stepThroughCell(startRow, startColumn);
