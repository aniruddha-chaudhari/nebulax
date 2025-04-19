let Phaser;
if (typeof window !== 'undefined') {
  Phaser = require('phaser');
}

import { MainScene } from "./MainScene";

/**
 * @typedef {Object} Window
 * @property {Phaser.Game} game - Global game instance
 */

/**
 * @returns {boolean} Whether the browser has required capabilities
 */
function checkBrowserSupport() {
  if (typeof window === 'undefined') return false;
  
  try {
    const canvas = document.createElement('canvas');
    const hasCanvas = !!(canvas.getContext && canvas.getContext('2d'));
    
    let hasWebGL = false;
    try {
      hasWebGL = !!(
        window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      hasWebGL = false;
    }
    
    return hasCanvas && (hasWebGL || Phaser.CANVAS);
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
  if (typeof window === 'undefined') return null;
  
  try {
    if (!checkBrowserSupport()) {
      throw new Error("Browser does not support required features");
    }
    
    if (!parent || parent.offsetWidth === 0 || parent.offsetHeight === 0) {
      throw new Error("Invalid game container");
    }
    
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
      pixelArt: true,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      scene: [MainScene]
    };
    
    window.game = new Phaser.Game(config);
    
    window.game.registry.set("isMobile", isMobile);
    window.game.registry.set("soundEnabled", soundEnabled);
    
    window.game.events.once('destroy', () => {
      console.log("Phaser game destroyed");
    });
    
    return window.game;
  } catch (err) {
    console.error("Failed to initialize game:", err);
    throw err;
  }
};