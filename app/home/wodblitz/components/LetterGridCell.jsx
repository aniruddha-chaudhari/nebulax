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
      className={`grid-cell font-pixel font-bold text-lg md:text-xl text-retro-blue flex items-center justify-center ${
        isSelected ? 'grid-cell-selected text-white' : ''
      }`}
      onMouseDown={() => onMouseDown(rowIndex, colIndex)}
      onMouseEnter={() => onMouseEnter(rowIndex, colIndex)}
      onMouseUp={onMouseUp}
      data-row={rowIndex}
      data-col={colIndex}
    >
      {letter}
    </div>
  );
};

export default LetterGridCell;