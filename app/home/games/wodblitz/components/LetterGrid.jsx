"use client";

import React, { useState, useEffect } from 'react';
import LetterGridCell from './LetterGridCell';
import { getRandomWordSet, findWordsInGrid } from '@/app/utils/game-helpers/dictionary';

const getRandomLetter = () => {
  const vowels = 'AEIOU';
  const common = 'RSTLNM';
  const others = 'BCDFGHJKPQVWXYZ';
  
  const random = Math.random();
  if (random < 0.4) {
    return vowels.charAt(Math.floor(Math.random() * vowels.length));
  } else if (random < 0.75) {
    return common.charAt(Math.floor(Math.random() * common.length));
  } else {
    return others.charAt(Math.floor(Math.random() * others.length));
  }
};

const generateEmptyGrid = (size) => {
  return Array(size).fill().map(() => Array(size).fill(''));
};

const tryPlaceWord = (grid, word) => {
  const size = grid.length;
  const wordUppercase = word.toUpperCase();
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0]
  ];
  
  for (let attempt = 0; attempt < 20; attempt++) {
    const startRow = Math.floor(Math.random() * size);
    const startCol = Math.floor(Math.random() * size);
    
    const dirIndex = Math.floor(Math.random() * directions.length);
    const [dr, dc] = directions[dirIndex];
    
    let fits = true;
    for (let i = 0; i < word.length; i++) {
      const row = startRow + i * dr;
      const col = startCol + i * dc;
      
      if (row < 0 || row >= size || col < 0 || col >= size) {
        fits = false;
        break;
      }
      
      if (grid[row][col] !== '' && grid[row][col] !== wordUppercase[i]) {
        fits = false;
        break;
      }
    }
    
    if (fits) {
      const newGrid = [...grid.map(row => [...row])];
      for (let i = 0; i < word.length; i++) {
        const row = startRow + i * dr;
        const col = startCol + i * dc;
        newGrid[row][col] = wordUppercase[i];
      }
      return { success: true, grid: newGrid };
    }
  }
  
  return { success: false, grid };
};

const generateWordGrid = (size, minWordCount = 10) => {
  const seedWords = getRandomWordSet(15, 3, Math.min(7, size));
  let grid = generateEmptyGrid(size);
  
  for (const word of seedWords) {
    const result = tryPlaceWord(grid, word);
    if (result.success) {
      grid = result.grid;
    }
  }
  
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] === '') {
        grid[row][col] = getRandomLetter();
      }
    }
  }
  
  const wordsInGrid = findWordsInGrid(grid);
  if (wordsInGrid.length < minWordCount) {
    return generateWordGrid(size, minWordCount);
  }
  
  console.log(`Grid contains ${wordsInGrid.length} words`);
  return grid;
};

const findWordPositions = (grid, word) => {
  if (!word) return [];
  
  const wordUppercase = word.toUpperCase();
  const size = grid.length;
  const positions = [];
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0]
  ];
  
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] !== wordUppercase[0]) continue;
      
      for (const [dr, dc] of directions) {
        let found = true;
        const cellPositions = [];
        
        for (let i = 0; i < wordUppercase.length; i++) {
          const r = row + i * dr;
          const c = col + i * dc;
          
          if (r < 0 || r >= size || c < 0 || c >= size || 
              grid[r][c] !== wordUppercase[i]) {
            found = false;
            break;
          }
          
          cellPositions.push({ row: r, col: c });
        }
        
        if (found) {
          positions.push(...cellPositions);
          return positions;
        }
      }
    }
  }
  
  return positions;
};

const LetterGrid = React.forwardRef(({ size, onWordSelected, hintWord }, ref) => {
  const [grid, setGrid] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedWord, setSelectedWord] = useState('');
  const [hintCells, setHintCells] = useState([]);
  const [wordsInGrid, setWordsInGrid] = useState([]);
  const gridInitializedRef = React.useRef(false);
  const isTouchSelectionRef = React.useRef(false);

  React.useImperativeHandle(ref, () => ({
    getWordsInGrid: () => wordsInGrid,
    resetGrid: () => {
      const newGrid = generateWordGrid(size);
      setGrid(newGrid);
      
      const foundWords = findWordsInGrid(newGrid);
      setWordsInGrid(foundWords);
    }
  }));

  useEffect(() => {
    if (!gridInitializedRef.current) {
      const newGrid = generateWordGrid(size);
      setGrid(newGrid);
      
      const foundWords = findWordsInGrid(newGrid);
      setWordsInGrid(foundWords);
      
      gridInitializedRef.current = true;
    }
  }, [size]);
  
  useEffect(() => {
    if (hintWord && grid.length > 0) {
      const positions = findWordPositions(grid, hintWord);
      setHintCells(positions);
    } else {
      setHintCells([]);
    }
  }, [hintWord, grid]);

  const resetGrid = () => {
    const newGrid = generateWordGrid(size);
    setGrid(newGrid);
    
    const foundWords = findWordsInGrid(newGrid);
    setWordsInGrid(foundWords);
  };

  const handleMouseDown = (rowIndex, colIndex) => {
    setIsSelecting(true);
    const newSelectedCells = [{ row: rowIndex, col: colIndex }];
    setSelectedCells(newSelectedCells);
    setSelectedWord(grid[rowIndex][colIndex]);
  };

  const handleTouchStart = (rowIndex, colIndex) => {
    isTouchSelectionRef.current = true;
    handleMouseDown(rowIndex, colIndex);
  };

  const handleMouseEnter = (rowIndex, colIndex) => {
    if (!isSelecting) return;

    const isCellSelected = selectedCells.some(
      cell => cell.row === rowIndex && cell.col === colIndex
    );
    if (isCellSelected) return;

    const lastCell = selectedCells[selectedCells.length - 1];
    const isAdjacent =
      Math.abs(rowIndex - lastCell.row) <= 1 && Math.abs(colIndex - lastCell.col) <= 1;
    
    if (isAdjacent) {
      const newSelectedCells = [...selectedCells, { row: rowIndex, col: colIndex }];
      setSelectedCells(newSelectedCells);
      setSelectedWord(prevWord => prevWord + grid[rowIndex][colIndex]);
    }
  };

  const handleTouchMove = (rowIndex, colIndex) => {
    if (!isTouchSelectionRef.current) return;
    
    handleMouseEnter(rowIndex, colIndex);
  };

  const handleMouseUp = () => {
    if (isSelecting) {
      setIsSelecting(false);
      
      if (selectedWord.length >= 3) {
        onWordSelected(selectedWord);
      }
      
      setTimeout(() => {
        setSelectedCells([]);
        setSelectedWord('');
      }, 300);
    }
  };

  const handleTouchEnd = () => {
    isTouchSelectionRef.current = false;
    handleMouseUp();
  };

  return (
    <div 
      className="select-none" 
      onMouseLeave={() => {
        if (isSelecting) {
          setIsSelecting(false);
          setSelectedCells([]);
          setSelectedWord('');
        }
      }}
      onDragStart={(e) => e.preventDefault()}
      draggable="false"
    >
      <div className="letter-grid-container p-1 md:p-2 transform-none md:transform-none lg:transform-none" draggable="false">
        <div className="grid grid-cols-10 gap-1 md:gap-1.5" draggable="false">
          {grid.map((row, rowIndex) =>
            row.map((letter, colIndex) => (
              <LetterGridCell
                key={`${rowIndex}-${colIndex}`}
                letter={letter}
                rowIndex={rowIndex}
                colIndex={colIndex}
                isSelected={selectedCells.some(
                  cell => cell.row === rowIndex && cell.col === colIndex
                )}
                isHint={hintCells.some(
                  cell => cell.row === rowIndex && cell.col === colIndex
                )}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
                onMouseUp={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
});

LetterGrid.displayName = 'LetterGrid';

export default LetterGrid;