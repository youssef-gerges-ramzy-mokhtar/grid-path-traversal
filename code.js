/*
DONE:
	1. Create a Boolean Grid Randomly {0, 1}
	2. Choose a random free spot from the Grid and mark it 'S'
		- Store all the free positions in an array and randomly select a position from these array
	3. Choose a random free spot from the Grid and mark it 'E'
		- Store all the free positions in an array and randomly select a position from these array
		- Also make sure that this position is not the position of 'S'
	4. Print the Grid to the browser
	5. For now we are solving a Reachability problem
		a. Use DFS/BFS version to check if 'E' is reachable from 'S'
			[.] Run the algorithm locally without any GUI, and after it ends display the changes it made
			[.] Update the grid with marked cells inside the DFS Function
*/

const EMPTY = 0;
const BLOCK = 1;
const di = [1, -1, 0, 0, 1, -1, 1, -1];
const dj = [0, 0, 1, -1, 1, -1, -1, 1];

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

function randomGenerator(num) {
	// generates random number from 0 -> num-1
	return Math.floor(num * Math.random());
}

function generateGrid() {
	// In the future this function should handle a more complex logic to generate a grid where the graph is fully reachable from any empty cell
	const grid = [];
	for (let i = 0; i < 30; i++) {
		const row = [];
		for (let j = 0; j < 45; j++)
			row.push(randomGenerator(2));

		grid.push(row);
	}

	return grid;
}

function chooseStart(grid) {
	const freeCells = [];
	for (let i = 0; i < grid.length; i++)
		for (let j = 0; j < grid[0].length; j++)
			if (grid[i][j] === EMPTY)
				freeCells.push([i, j]);

	return freeCells[randomGenerator(freeCells.length)];
}

function chooseEnd(grid, i_start, j_start) {
	const freeCells = [];
	for (let i = 0; i < grid.length; i++)
		for (let j = 0; j < grid[0].length; j++)
			if (grid[i][j] === EMPTY && i !== i_start && j !== j_start)
				freeCells.push([i, j]);

	return freeCells[randomGenerator(freeCells.length)];
}

function displayGrid(grid, start, end) {
	const canvas = document.getElementById("canvas");
	let gridHTML = "";

	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[0].length; j++) {
			if (i === start[0] && j === start[1])
				gridHTML += "<div class='block start'></div>";
			else if (i === end[0] && j === end[1])
				gridHTML += "<div class='block end'></div>";
			else if (grid[i][j] === EMPTY)
				gridHTML += "<div class='block white'></div>"
			else if (grid[i][j] === BLOCK)
				gridHTML += "<div class='block black'></div>"
			else if (grid[i][j] === -2)
				gridHTML += "<div class='block yellow'></div>"
			else
				gridHTML += "<div class='block mauve'></div>"
		
		}

		gridHTML += "<br/>";
	}

	canvas.innerHTML = gridHTML;
}

function valid(i, j, n, m) {
	if (i < 0 || j < 0)
		return false;
	if (i >= n || j >= m)
		return false;

	return true;
}

let reached = false;
function dfs(grid, start, end) {
	const [i, j] = start;
	grid[i][j] = -1;

	if (i === end[0] && j === end[1])
		reached = true;

	for (let d = 0; d < 8; d++) {
		if (reached)
			return;

		const ni = i + di[d];
		const nj = j + dj[d];

		if (valid(ni, nj, grid.length, grid[0].length) && grid[ni][nj] === EMPTY)
			dfs(grid, [ni, nj], end);
	}
}

const parentMap = new Map();
async function bfs(grid, start, end) {
	const q = [start];
	grid[start[0]][start[1]] = -1;

	for (let sz = q.length; q.length; sz = q.length) {
		while (sz--) {
			const cur = q.shift(); // that is a very slow operation
			for (let d = 0; d < 8; d++) {
				const ni = cur[0] + di[d];
				const nj = cur[1] + dj[d];

				if (valid(ni, nj, grid.length, grid[0].length) && grid[ni][nj] === EMPTY) {
					parentMap.set(JSON.stringify([ni, nj]), JSON.stringify(cur));
					if (ni === end[0] && nj === end[1])
						{reached = true; break;}

					q.push([ni, nj]), grid[ni][nj] = -1;
					await sleep(30);
					displayGrid(grid, start, end);
				}
			}

			if (reached)
				break;
		}

		if (reached)
			break;
	}

	if (!reached)
		return;

	let cur = JSON.stringify(end);
	while (parentMap.has(cur)) {
		const [i, j] = JSON.parse(cur);
		grid[i][j] = -2;
		await sleep(50);
		displayGrid(grid, start, end);
		cur = parentMap.get(cur);	
	}
}

async function main() {
	const grid = generateGrid();
	const start = chooseStart(grid);
	const end = chooseEnd(grid, start[0], start[1]);
	displayGrid(grid, start, end);

	// dfs(grid, start, end);
	// console.log(reached)
	// displayGrid(grid, start, end);

	await bfs(grid, start, end);
	console.log(reached);
	// displayGrid(grid, start, end);
}

main();