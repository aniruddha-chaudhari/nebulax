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
  onMouseUp,
  onTouchStart,
  onTouchMove,
  onTouchEnd
}) => {
  let cellClass = 'grid-cell font-pixel font-bold text-lg md:text-2xl lg:text-xl flex items-center justify-center';
  
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
      onTouchStart={(e) => {
        e.preventDefault();
        onTouchStart(rowIndex, colIndex);
      }}
      onTouchMove={(e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        if (element && element.dataset && element.dataset.row !== undefined) {
          const touchRow = parseInt(element.dataset.row);
          const touchCol = parseInt(element.dataset.col);
          onTouchMove(touchRow, touchCol);
        }
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        onTouchEnd();
      }}
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