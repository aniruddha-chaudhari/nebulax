"use client";

import React, { useState, useEffect } from 'react';
import LetterGridCell from './LetterGridCell';
import { getRandomWordSet, findWordsInGrid } from '@/app/utils/dictionary';

// Helper function to generate a random letter with weighted distribution
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

// Generate a grid of random letters
const generateEmptyGrid = (size) => {
  return Array(size).fill().map(() => Array(size).fill(''));
};

// Try to place a word in the grid
const tryPlaceWord = (grid, word) => {
  const size = grid.length;
  const wordUppercase = word.toUpperCase();
  const directions = [
    [0, 1],    // right
    [1, 0],    // down
    [0, -1],   // left
    [-1, 0]    // up
    // Diagonal directions removed
  ];
  
  // Try placing the word 20 times
  for (let attempt = 0; attempt < 20; attempt++) {
    // Pick a random starting position
    const startRow = Math.floor(Math.random() * size);
    const startCol = Math.floor(Math.random() * size);
    
    // Pick a random direction
    const dirIndex = Math.floor(Math.random() * directions.length);
    const [dr, dc] = directions[dirIndex];
    
    // Check if the word fits in this direction
    let fits = true;
    for (let i = 0; i < word.length; i++) {
      const row = startRow + i * dr;
      const col = startCol + i * dc;
      
      // Check boundaries
      if (row < 0 || row >= size || col < 0 || col >= size) {
        fits = false;
        break;
      }
      
      // Check if the cell is empty or has the same letter
      if (grid[row][col] !== '' && grid[row][col] !== wordUppercase[i]) {
        fits = false;
        break;
      }
    }
    
    // If the word fits, place it
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

// Generate a grid with seeded words from dictionary
const generateWordGrid = (size, minWordCount = 10) => {
  // Get words to seed
  const seedWords = getRandomWordSet(15, 3, Math.min(7, size));
  let grid = generateEmptyGrid(size);
  
  // Place words in the grid
  for (const word of seedWords) {
    const result = tryPlaceWord(grid, word);
    if (result.success) {
      grid = result.grid;
    }
  }
  
  // Fill empty cells with random letters
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] === '') {
        grid[row][col] = getRandomLetter();
      }
    }
  }
  
  // Verify we have enough words
  const wordsInGrid = findWordsInGrid(grid);
  if (wordsInGrid.length < minWordCount) {
    // If not enough words, try again
    return generateWordGrid(size, minWordCount);
  }
  
  console.log(`Grid contains ${wordsInGrid.length} words`);
  return grid;
};

// Find positions of a word in the grid
const findWordPositions = (grid, word) => {
  if (!word) return [];
  
  const wordUppercase = word.toUpperCase();
  const size = grid.length;
  const positions = [];
  const directions = [
    [0, 1],    // right
    [1, 0],    // down
    [0, -1],   // left
    [-1, 0]    // up
    // Diagonal directions removed
  ];
  
  // Try to find word starting from each cell
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] !== wordUppercase[0]) continue;
      
      // Check the 4 non-diagonal directions
      for (const [dr, dc] of directions) {
        let found = true;
        const cellPositions = [];
        
        for (let i = 0; i < wordUppercase.length; i++) {
          const r = row + i * dr;
          const c = col + i * dc;
          
          // Check if within bounds and matches letter
          if (r < 0 || r >= size || c < 0 || c >= size || 
              grid[r][c] !== wordUppercase[i]) {
            found = false;
            break;
          }
          
          cellPositions.push({ row: r, col: c });
        }
        
        if (found) {
          positions.push(...cellPositions);
          return positions; // Return the first occurrence found
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

  // Expose methods to the parent component through ref
  React.useImperativeHandle(ref, () => ({
    getWordsInGrid: () => wordsInGrid,
    resetGrid: () => {
      const newGrid = generateWordGrid(size);
      setGrid(newGrid);
      
      // Find words in the new grid
      const foundWords = findWordsInGrid(newGrid);
      setWordsInGrid(foundWords);
    }
  }));

  // Initial grid generation - only done once when component mounts
  useEffect(() => {
    if (!gridInitializedRef.current) {
      const newGrid = generateWordGrid(size);
      setGrid(newGrid);
      
      // Find words in the grid
      const foundWords = findWordsInGrid(newGrid);
      setWordsInGrid(foundWords);
      
      // Mark grid as initialized
      gridInitializedRef.current = true;
    }
  }, [size]);
  
  // Update hint cells when hintWord changes
  useEffect(() => {
    if (hintWord && grid.length > 0) {
      const positions = findWordPositions(grid, hintWord);
      setHintCells(positions);
    } else {
      setHintCells([]);
    }
  }, [hintWord, grid]);

  // Reset the grid with new random letters
  const resetGrid = () => {
    const newGrid = generateWordGrid(size);
    setGrid(newGrid);
    
    // Find words in the new grid
    const foundWords = findWordsInGrid(newGrid);
    setWordsInGrid(foundWords);
  };

  // Start word selection
  const handleMouseDown = (rowIndex, colIndex) => {
    setIsSelecting(true);
    const newSelectedCells = [{ row: rowIndex, col: colIndex }];
    setSelectedCells(newSelectedCells);
    setSelectedWord(grid[rowIndex][colIndex]);
  };

  // Continue word selection
  const handleMouseEnter = (rowIndex, colIndex) => {
    if (!isSelecting) return;

    // Check if the cell is already selected
    const isCellSelected = selectedCells.some(
      cell => cell.row === rowIndex && cell.col === colIndex
    );
    if (isCellSelected) return;

    // Check if the cell is adjacent to the last selected cell
    const lastCell = selectedCells[selectedCells.length - 1];
    const isAdjacent =
      Math.abs(rowIndex - lastCell.row) <= 1 && Math.abs(colIndex - lastCell.col) <= 1;
    
    if (isAdjacent) {
      const newSelectedCells = [...selectedCells, { row: rowIndex, col: colIndex }];
      setSelectedCells(newSelectedCells);
      setSelectedWord(prevWord => prevWord + grid[rowIndex][colIndex]);
    }
  };

  // End word selection
  const handleMouseUp = () => {
    if (isSelecting) {
      setIsSelecting(false);
      
      if (selectedWord.length >= 3) {
        onWordSelected(selectedWord);
      }
      
      // Reset selection
      setTimeout(() => {
        setSelectedCells([]);
        setSelectedWord('');
      }, 300);
    }
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
      <div className="letter-grid-container p-1" draggable="false">
        <div className="grid grid-cols-10 gap-1" draggable="false">
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