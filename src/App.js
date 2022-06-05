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

  const checkPuzzle = (puzzle) => {
    // Sanitise puzzle by converting "" to 0
    var saniPuzzle = sanitisePuzzle(puzzle)

    // Check if its even valid
    var truthPath = checkForPath(saniPuzzle)
    //var overrun = checkForOverrun(saniPuzzle)

    var words = []

    if (truthPath === null) {
      return [false, "Make sure to check your path!"]
    } else {
      // Start with rows
      saniPuzzle.forEach((row, rowIdx) => {
        var r = row.join('')
        var wordsThatExist = r.split("0")
        const wordsToPush = wordsThatExist.filter(word => word.length > 1)
        words.push(...wordsToPush)
      });

      // Then go to columns
      for (let i = 0; i < saniPuzzle[0].length; i++) {
        
        let colWord = []
        saniPuzzle.forEach((row, idx) => {
          colWord.push(saniPuzzle[idx][i])
        })

        var c = colWord.join('')
        var wordsThatExist = c.split("0")
        const wordsToPush = wordsThatExist.filter(word => word.length > 1)
        words.push(...wordsToPush)
      }
    
    }

    const x = []
    words.forEach((word) => {
      x.push(word.toLowerCase())
    })

    console.log(x);

    const repeatedWords = _.filter(x, (val, i, iteratee) => _.includes(iteratee, val, i + 1))

    console.log(repeatedWords);
    
    if (repeatedWords.length > 0) {
      return [false, `Repeated word on the board: ${repeatedWords}`]
    }

    const valid = words.every((val) => {
      return WORDS.includes(val.toLowerCase())
    })
    const message = valid ? "Perfect, congrats for completing it!" : "Invalid word somewhere."

    return [valid, message]
  }

  const handleSubmit = () => {
    const valid = checkPuzzle(puzzle)
    alert(valid[1])
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
