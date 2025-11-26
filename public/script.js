function drawPuzzle(state) {
  const puzzle = document.getElementById("puzzle");
  puzzle.innerHTML = "";

  state.forEach(n => {
    const tile = document.createElement("div");
    tile.className = "tile" + (n === 0 ? " blank" : "");
    tile.innerText = n === 0 ? "" : n;
    puzzle.appendChild(tile);
  });
}

async function solvePuzzle() {
  const start = document.getElementById("start").value.split(" ").map(Number);
  const goal  = document.getElementById("goal").value.split(" ").map(Number);
  const algorithm = document.getElementById("algorithm").value;

  const result = await fetch("https://ai-search-simulator.onrender.com/solve", {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify({ start, goal, algorithm })
  });

  const data = await result.json();
  const steps = data.steps;

  for (let i = 0; i < steps.length; i++) {
    drawPuzzle(steps[i]);
    await new Promise(r => setTimeout(r, 700));
  }
}
