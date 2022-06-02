import _ from 'lodash'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { GameContext } from '../context/GameProvider'

export default function Cell({ value, coord }) {

    const { setActiveIndex, activeIndex, setPuzzle, puzzle } = useContext(GameContext)

    const [val, setVal] = useState("")
    const [readOnly, setReadOnly] = useState(false)

    const inputRef = useRef(null)

    const onChange = (event) => {
        var val = event.target.value.toLowerCase()
        setVal(val)

        const newPuzz = Array.from(puzzle)
        newPuzz[coord.y][coord.x] = val
        setPuzzle(newPuzz)
    }

    const onKeyUpL = (e) => {
        if (e.key === "Backspace") {
            setVal("")
            
            const newPuzz = Array.from(puzzle)
            newPuzz[coord.y][coord.x] = ""
            setPuzzle(newPuzz)
        }
    }

    useEffect(() => {
        if (value === 0) {
            setVal("")
            setReadOnly(false)
        } else if (value === value.toUpperCase() && value !== "") {
            setVal(value)
            setReadOnly(true)
        }
    }, [value])

    useEffect(() => {
        if (_.isEqual(coord, activeIndex)) {
            inputRef.current.focus()
        }
    }, [activeIndex])

    let styles = {
        cell: {
            width: "2rem",
            height: "2rem",
            textAlign: "center",
        }
    }

    return (
        <>
            <input
                type="text"
                readOnly={readOnly}
                maxLength={1}
                style={styles.cell}
                value={val}
                onChange={onChange}
                onFocus={() => setActiveIndex(coord)}
                ref={inputRef}
                autoCapitalize={"none"}
                onKeyUp={onKeyUpL}
            />
        </>
    )

}
