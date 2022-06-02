import React, { useCallback, useEffect, useRef, useState } from 'react'

export default function GameBoard({ puzzle }) {
    const [numRows, numCols] = [6, 6]; // No magic numbers

    const [activeIndex, setActiveIndex] = useState(-1); // Track which cell to highlight
    const [isNavigating, setIsNavigating] = useState(false); // Track navigation
    const [isEditing, setIsEditing] = useState(false); // Track editing
    const [values, setValues] = useState([]); // Track input values
    const boardRef = useRef(); // For setting/ unsetting navigation
    const inputRefs = useRef([]); // For setting / unsetting input focus

    useEffect(() => {
        setValues(puzzle)
    }, [])

    // Handle input changes to store the new value
  const handleChange = (e) => {
    const { value } = e;
    const newValues = Array.from(values);
    newValues[activeIndex] = value;
    setValues(newValues);
  };

  // Handle mouse down inside or outside the board
  const handleMouseDown = useCallback(
    (e) => {
      if (boardRef.current && boardRef.current.contains(e.target)) {
        if (e.target.className === "cell-input") {
            setIsNavigating(true);
            setIsEditing(true);
        }
      } else {
            setIsNavigating(false);
      }
    },
    [boardRef, setIsNavigating]
  );

  // Handle key presses: 
  // arrows to navigate, escape to back out, enter to start / end editing
  const handleKeyDown = useCallback(
    (e) => {
      if (isNavigating) {
        const { key } = e;
        switch (key) {
            case "ArrowUp":
                // Move up a row, subtract num cols from index
                if ( activeIndex >= numRows)
                    setActiveIndex(activeIndex - numCols);
                break;
            case "ArrowDown":
                // Move down a row, add num cols to index
                if (activeIndex < numRows * numCols - numCols)
                    setActiveIndex(activeIndex + numCols);
                break;
            case "ArrowRight":
                // Move one col right, add one
                if (activeIndex < numRows * numCols - 1)
                    setActiveIndex(activeIndex + 1);
                break;
            case "ArrowLeft":
                // Move one col left, subtract one
                if ( activeIndex > 0) setActiveIndex(activeIndex - 1);
                break;
            case "Enter":
                if (isEditing) setIsEditing(false);
                else if (isNavigating) setIsEditing(true);
                else if (!isEditing) setIsNavigating(true);
                break;
            case "Escape":
                // Stop navigating
                if (isEditing) setIsEditing(false);
                else if (isNavigating) setIsNavigating(false);
                break;
            default:
                break;
        }
      }
    },
    [activeIndex, isNavigating, isEditing, numRows, numCols]
  );

  // Add listeners on mount, remove on unmount
  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
        window.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleMouseDown, handleKeyDown]);

  // When the index changes, determine if we should focus or blur the current input
  const onIndexChange = useCallback(() => {
    if (activeIndex >= 0 && activeIndex < numRows * numCols) {
        const inputRef = inputRefs.current[activeIndex];
        if (inputRef) {
            if (isEditing) {
                inputRef.focus();
            } else {
                inputRef.blur();
            }
        }
    }
  }, [activeIndex, isEditing, inputRefs, numRows, numCols]);
  useEffect(onIndexChange, [activeIndex, onIndexChange]);

  // When isEditing changes focus or blur the current input
  const onIsEditingChange = useCallback(() => {
    const inputRef = inputRefs.current[activeIndex];
    if (!inputRef) return;

    if (isNavigating && isEditing) {
        inputRef.focus();
    } else if (!isEditing) {
        inputRef.blur();
    }
  }, [inputRefs, isEditing, activeIndex, isNavigating]);
  useEffect(onIsEditingChange, [isEditing, onIsEditingChange]);

  // When isNavigating changes, set the index to 0 or -1 (if not navigating)      
  const onIsNavigatingChange = useCallback(() => {
    if (!isNavigating) {
        setActiveIndex(-1);
    } else if (activeIndex < 0) {
        setActiveIndex(0);
    }
  }, [isNavigating, setActiveIndex, activeIndex]);
  useEffect(onIsNavigatingChange, [isNavigating, onIsNavigatingChange]);
  
  let rows = [];
  for (var i = 0; i < numRows; i++) {
    let rowID = `row${i}`;
    let cell = [];
    for (var idx = 0; idx < numCols; idx++) {
        
        let cellID = `cell${i}-${idx}`;
        const index = i * numCols + idx;

        cell.push(
            <td key={cellID} id={cellID}>
            <div className={`tile ${activeIndex === index ? "active" : ""}`}>
                <input
                value={values[activeIndex]}
                onChange={handleChange}
                className="cell-input"
                onFocus={() => setActiveIndex(index)}
                ref={(el) => (inputRefs.current[index] = el)}
                />
            </div>
            </td>
        );
    }
    rows.push(
        <tr key={i} id={rowID}>
            {cell}
        </tr>
    );
  }

    return (
        <div className="board" ref={boardRef}>
            <table>
                <tbody>{rows}</tbody>
            </table>
        </div>
    )
}