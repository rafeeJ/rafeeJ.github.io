import _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import Table from './components/Table';
import { GameContext } from './context/GameProvider';
import { WORDS } from './data/words';

function App() {

  const { puzzle } = useContext(GameContext)

  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  const lookDown = (cell, puzzle) => {
    let word = []

    let pointer = cell.y
    while (puzzle[pointer][cell.x] !== 0) {
      word.push(puzzle[pointer][cell.x])
      pointer = pointer + 1
      if (pointer === 6) {
        break
      }
    }

    return (word.join(""))
  }

  const lookRight = (cell, puzzle) => {
    let word = [];

    let pointer = cell.x
    while (puzzle[cell.y][pointer] !== 0) {
      word.push(puzzle[cell.y][pointer])
      pointer = pointer + 1
      if (pointer === 6) {
        break
      }
    }
    return (word.join(""))
  }

  const sanitisePuzzle = (puzzle) => {
    var newPuzzle = []
    puzzle.forEach((row, y) => {
      let newRow = []
      row.forEach((cell, x) => {
        if (cell === "") {
          newRow.push(0)
        } else {
          newRow.push(cell)
        }
      })
      newPuzzle.push(newRow)
    })
    return newPuzzle
  }

  const isSafe = (i, j, puzzle) => {
    if (
      i >= 0 && i < puzzle.length
      && j >= 0
      && j < puzzle[0].length)
      return true;
    return false;
  }

  const checkPath = (puzzle, i, j, visited) => {
    // Checking the boundaries, walls and whether the cell is unvisited
    if (
      isSafe(i, j, puzzle)
      && puzzle[i][j] !== 0
      && !visited[i][j]) {
      // Make the cell visited
      visited[i][j] = true;

      // if the cell is the required
      // destination then return true
      if (puzzle[i][j] === puzzle[i][j].toUpperCase() && i !== 0 && j !== 0)
        return true;

      // traverse up
      let up = checkPath(
        puzzle, i - 1,
        j, visited);

      // if path is found in up
      // direction return true
      if (up)
        return true;

      // traverse left
      let left
        = checkPath(
          puzzle, i, j - 1, visited);

      // if path is found in left
      // direction return true
      if (left)
        return true;

      // traverse down
      let down = checkPath(
        puzzle, i + 1, j, visited);

      // if path is found in down
      // direction return true
      if (down)
        return true;

      // traverse right
      let right
        = checkPath(
          puzzle, i, j + 1,
          visited);

      // if path is found in right
      // direction return true
      if (right)
        return true;
    }
    // no path has been found
    return false;
  }

  const checkForPath = (puzzle) => {
    const n = 6

    let visited = new Array(n);
    for (let i = 0; i < n; i++) {
      visited[i] = new Array(n);
      for (let j = 0; j < n; j++) {
        visited[i][j] = false;
      }
    }

    let flag = null;

    if (checkPath(puzzle, 0, 0, visited)) {
      flag = visited
    }

    return flag

  }

  const checkAdj = (i, j, puzzle) => {

    let right = isSafe(i, j + 1, puzzle) ? puzzle[i][j + 1] : null
    let left = isSafe(i, j - 1, puzzle) ? puzzle[i][j - 1] : null

    let down = isSafe(i + 1, j, puzzle) ? puzzle[i + 1][j] : null
    let up = isSafe(i - 1, j, puzzle) ? puzzle[i - 1][j] : null

    return { down: down, up: up, left: left, right: right }
  }

  const checkForOverrun = (puzzle) => {
    const n = 6

    var overrun = false;

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (puzzle[i][j] === 0) {
          continue
        } else {
          let dirs = checkAdj(i, j, puzzle)

          var numOfAdjacentLetters = _.values(dirs).filter(x => typeof x === "string").length

          if (numOfAdjacentLetters < 2 && puzzle[i][j] !== puzzle[i][j].toUpperCase()) {
            overrun = true
          }

          //console.log(dirs);
        }
      }
    }
    return overrun
  }

  const checkPuzzle = (puzzle) => {
    // Sanitise puzzle by converting "" to 0
    var saniPuzzle = sanitisePuzzle(puzzle)

    // Check if its even valid
    var truthPath = checkForPath(saniPuzzle)
    var overrun = checkForOverrun(saniPuzzle)

    if (truthPath === null || overrun) {
      alert('Invalid')
    } else {
      var startCell = { x: 0, y: 0 }
      var words = []

      while (startCell.x <= saniPuzzle.length - 1 && saniPuzzle.length - 1) {

        if (startCell.x === saniPuzzle.length - 1 && startCell.y === saniPuzzle.length - 1) {
          break
        }

        let down = lookDown(startCell, saniPuzzle)
        let right = lookRight(startCell, saniPuzzle)


        if (down.length > right.length) {
          words.push(down)
          startCell.y = startCell.y + down.length - 1
        } else {
          words.push(right)
          startCell.x = startCell.x + right.length - 1
        }
      }
    }

    const valid = words.every((val) => {
      return WORDS.includes(val.toLowerCase())
    })
    return valid
  }

  const handleSubmit = () => {
    const valid = checkPuzzle(puzzle)
    if (valid) {
      alert("Looks good - well done")
    } else {
      alert("Something looks goofy")
    }
  }

  return (
    <div className="App">
      {loaded ?
        <>
          <Table puzzle={puzzle} />
          <button onClick={() => handleSubmit()}>Submit</button>
        </> :
        <h1>Loading</h1>}
    </div>
  );
}

export default App;
