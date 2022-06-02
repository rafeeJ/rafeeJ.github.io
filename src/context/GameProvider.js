import React, { createContext, useEffect, useState } from 'react'
import { PUZZLES } from '../data/template';

export const GameContext = createContext({})

export const GameProvider = ({ children }) => {
    
    const [isEditing, setIsEditing] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const [puzzle, setPuzzle] = useState(null)

    useEffect(() => {
     // console.log(`The active index is now: ${activeIndex.x},${activeIndex.y}`);
    }, [activeIndex])

    useEffect(() => {
        let puzz = PUZZLES[Math.floor(Math.random() * PUZZLES.length)]
        setPuzzle(puzz)
      }, [])
    
    return(
        <GameContext.Provider value={{isEditing, setIsEditing, setActiveIndex, activeIndex, setPuzzle, puzzle}}>
            {children}
        </GameContext.Provider>
    )
}