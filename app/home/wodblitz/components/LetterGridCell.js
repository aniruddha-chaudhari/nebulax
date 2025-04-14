"use client";

import React from 'react';

const LetterGridCell = ({
  letter,
  rowIndex,
  colIndex,
  isSelected,
  onMouseDown,
  onMouseEnter,
  onMouseUp
}) => {
  return (
    <div
      className={`grid-cell ${isSelected ? 'grid-cell-selected' : ''}`}
      onMouseDown={() => onMouseDown(rowIndex, colIndex)}
      onMouseEnter={() => onMouseEnter(rowIndex, colIndex)}
      onMouseUp={onMouseUp}
      data-row={rowIndex}
      data-col={colIndex}
    >
      {letter.toUpperCase()}
    </div>
  );
};

export default LetterGridCell;