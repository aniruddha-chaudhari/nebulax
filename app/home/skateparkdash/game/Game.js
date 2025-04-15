// Import Phaser only on the client side
let Phaser;
if (typeof window !== 'undefined') {
  Phaser = require('phaser');
}

import { MainScene } from "./MainScene";

// Add global game object type via JSDoc comment
/**
 * @typedef {Object} Window
 * @property {Phaser.Game} game - Global game instance
 */

/**
 * Check if browser supports WebGL or Canvas for Phaser
 * @returns {boolean} Whether the browser has required capabilities
 */
function checkBrowserSupport() {
  if (typeof window === 'undefined') return false;
  
  try {
    // Check for canvas support
    const canvas = document.createElement('canvas');
    const hasCanvas = !!(canvas.getContext && canvas.getContext('2d'));
    
    // Check for WebGL support
    let hasWebGL = false;
    try {
      hasWebGL = !!(
        window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      hasWebGL = false;
    }
    
    return hasCanvas && (hasWebGL || Phaser.CANVAS); // Can use either WebGL or Canvas renderer
  } catch (err) {
    console.error("Error checking browser support:", err);
    return false;
  }
}

/**
 * Initialize the Phaser game
 * @param {HTMLElement} parent - The parent DOM element to attach the game canvas to
 * @param {boolean} isMobile - Whether the game is running on a mobile device
 * @param {boolean} soundEnabled - Whether sound should be enabled
 * @returns {Phaser.Game|null} The created game instance or null if running on server
 */
export const initGame = (parent, isMobile, soundEnabled = true) => {
  // Check if window is defined (client-side only)
  if (typeof window === 'undefined') {
    console.warn("Attempted to initialize game on server-side");
    return null;
  }
  
  try {
    // Check browser compatibility
    if (!checkBrowserSupport()) {
      console.error("Browser does not support required features for game");
      throw new Error("Browser does not support required features");
    }
    
    // Check if parent element exists and has dimensions
    if (!parent || parent.offsetWidth === 0 || parent.offsetHeight === 0) {
      console.error("Invalid game container element", parent);
      throw new Error("Invalid game container");
    }
    
    // Game configuration
    const config = {
      type: Phaser.AUTO,
      width: parent.offsetWidth,
      height: parent.offsetHeight,
      parent: parent,
      backgroundColor: "#1f2560",
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 800, x: 0 },
          debug: false
        }
      },
      pixelArt: true, // Important for pixel art games
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      scene: [MainScene]
    };
    
    console.log("Creating Phaser game with config:", {
      width: config.width,
      height: config.height,
      renderer: Phaser.AUTO ? 'AUTO' : 'CANVAS'
    });
    
    // Create the game instance
    window.game = new Phaser.Game(config);
    
    // Pass device information to the game
    window.game.registry.set("isMobile", isMobile);
    window.game.registry.set("soundEnabled", soundEnabled);
    
    // Add error handling listener for Phaser
    window.game.events.once('destroy', () => {
      console.log("Phaser game destroyed");
    });
    
    // Return the game instance
    return window.game;
  } catch (err) {
    console.error("Failed to initialize game:", err);
    throw err; // Re-throw to be caught by GameContainer
  }
};