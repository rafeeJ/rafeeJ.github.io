import React, { useCallback, useContext, useEffect } from 'react'
import { GameContext } from '../context/GameProvider'
import Row from './Row'

export default function Table({ puzzle }) {

  const { setActiveIndex, activeIndex } = useContext(GameContext)

  const handleKeyDown = useCallback(
    (e) => {
      const { key } = e;
      switch (key) {
        case "ArrowUp":
          // Move up a row, subtract num cols from index
          if (0 < activeIndex.y)
            setActiveIndex({ y: activeIndex.y - 1, x: activeIndex.x });
          break;
        case "ArrowDown":
          // Move down a row, add num cols to index
          if (activeIndex.y < 5)
            setActiveIndex({ y: activeIndex.y + 1, x: activeIndex.x });
          break;
        case "ArrowRight":
          // Move one col right, add one
          if (activeIndex.x < 5)
            setActiveIndex({ y: activeIndex.y, x: activeIndex.x + 1 });
          break;
        case "ArrowLeft":
          // Move one col left, subtract one
          if (0 < activeIndex.x)
            setActiveIndex({y:activeIndex.y, x:activeIndex.x - 1});
          break;
        default:
          break;
      }
    },
    [activeIndex]
  );

  // Add listeners on mount, remove on unmount
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <>
      {puzzle.map((row, i) => {
        return (
          <>
            <Row row={row} key={i} rowNo={i} />
            <br />
          </>)
      })}
    </>
  )
}