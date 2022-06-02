import React from 'react'
import Cell from './Cell'

export default function Row({ row, rowNo }) {
  return (
    <>
    {row.map((cell, i) => {
        return(<Cell key={i} value={cell} coord={{y:rowNo,x:i}}/>)
    })}
    </>
  )
}
