const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static("public"));

// 8-puzzle moves
const MOVES = {
  0: [1, 3],
  1: [0, 2, 4],
  2: [1, 5],
  3: [0, 4, 6],
  4: [1, 3, 5, 7],
  5: [2, 4, 8],
  6: [3, 7],
  7: [4, 6, 8],
  8: [5, 7],
};

function misplaced(state, goal) {
  return state.reduce((a, v, i) => a + (v && v !== goal[i] ? 1 : 0), 0);
}

function reconstruct(came, current) {
  const path = [current];
  while (came[JSON.stringify(current)]) {
    current = came[JSON.stringify(current)];
    path.unshift(current);
  }
  return path;
}

function aStar(start, goal) {
  const open = [];
  open.push({ state: start, f: 0 });

  const cameFrom = {};
  const gScore = {};
  gScore[JSON.stringify(start)] = 0;

  while (open.length > 0) {
    open.sort((a, b) => a.f - b.f);
    const current = open.shift().state;
    if (current.toString() === goal.toString()) {
      return reconstruct(cameFrom, current);
    }

    const blank = current.indexOf(0);
    for (const m of MOVES[blank]) {
      const next = [...current];
      [next[blank], next[m]] = [next[m], next[blank]];

      const key = JSON.stringify(next);
      const tentative = gScore[JSON.stringify(current)] + 1;

      if (!(key in gScore) || tentative < gScore[key]) {
        gScore[key] = tentative;
        const h = misplaced(next, goal);
        open.push({ state: next, f: tentative + h });
        cameFrom[key] = current;
      }
    }
  }
  return [];
}

app.post("/solve", (req, res) => {
  const { start, goal, algorithm } = req.body;
  let steps = [];

  if (algorithm === "astar") steps = aStar(start, goal);

  res.json({ steps });
});

app.listen(3000, () => console.log("Server running on port 3000"));
