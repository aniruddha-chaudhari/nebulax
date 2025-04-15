"use client";

import React from 'react';

const LetterGridCell = ({
  letter,
  rowIndex,
  colIndex,
  isSelected,
  isHint,
  onMouseDown,
  onMouseEnter,
  onMouseUp
}) => {
  let cellClass = 'grid-cell font-pixel font-bold text-lg md:text-xl flex items-center justify-center';
  
  // Apply states in order of priority
  if (isSelected) {
    cellClass += ' grid-cell-selected text-white';
  } else if (isHint) {
    cellClass += ' grid-cell-hint text-white';
  } else {
    cellClass += ' text-retro-blue';
  }

  return (
    <div
      className={cellClass}
      onMouseDown={() => onMouseDown(rowIndex, colIndex)}
      onMouseEnter={() => onMouseEnter(rowIndex, colIndex)}
      onMouseUp={onMouseUp}
      data-row={rowIndex}
      data-col={colIndex}
      data-hint={isHint ? 'true' : 'false'}
      draggable="false"
    >
      {letter}
    </div>
  );
};

export default LetterGridCell;