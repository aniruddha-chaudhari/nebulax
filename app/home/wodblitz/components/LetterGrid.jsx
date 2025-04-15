"use client";

import React, { useState, useEffect } from 'react';
import LetterGridCell from './LetterGridCell';

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
const generateRandomGrid = (size) => {
  const grid = [];
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      row.push(getRandomLetter());
    }
    grid.push(row);
  }
  return grid;
};

const LetterGrid = ({ size, onWordSelected }) => {
  const [grid, setGrid] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedWord, setSelectedWord] = useState('');

  // Initial grid generation
  useEffect(() => {
    setGrid(generateRandomGrid(size));
  }, [size]);

  // Reset the grid with new random letters
  const resetGrid = () => {
    setGrid(generateRandomGrid(size));
  };

  // Start word selection
  const handleMouseDown = (rowIndex, colIndex) => {
    // Play selection sound
    const selectSound = new Audio('/wodblitz/sounds/select.mp3');
    selectSound.volume = 0.3;
    selectSound.play().catch(error => console.error('Error playing sound:', error));
    
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
      
      // Play selection sound
      const selectSound = new Audio('/wodblitz/sounds/select.mp3');
      selectSound.volume = 0.2;
      selectSound.play().catch(error => console.error('Error playing sound:', error));
    }
  };

  // End word selection
  const handleMouseUp = () => {
    if (isSelecting) {
      setIsSelecting(false);
      
      if (selectedWord.length >= 3) {
        onWordSelected(selectedWord);
      } else {
        // Play error sound for words shorter than 3 letters
        const errorSound = new Audio('/wodblitz/sounds/error.mp3');
        errorSound.volume = 0.3;
        errorSound.play().catch(error => console.error('Error playing sound:', error));
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
    >
      <div className="letter-grid-container">
        <div className="grid grid-cols-10 gap-0.5">
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
};

export default LetterGrid;