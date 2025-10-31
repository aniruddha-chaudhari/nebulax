import * as Phaser from 'phaser';
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
  console.log('[Game.js] initGame called with:', { parent, isMobile, soundEnabled });
  
  if (typeof window === 'undefined') {
    console.log('[Game.js] Window is undefined, returning null');
    return null;
  }
  
  try {
    console.log('[Game.js] Checking browser support...');
    if (!checkBrowserSupport()) {
      console.error('[Game.js] Browser does not support required features');
      throw new Error("Browser does not support required features");
    }
    console.log('[Game.js] Browser support OK');
    
    if (!parent || parent.offsetWidth === 0 || parent.offsetHeight === 0) {
      console.error('[Game.js] Invalid game container:', { 
        parent, 
        width: parent?.offsetWidth, 
        height: parent?.offsetHeight 
      });
      throw new Error("Invalid game container");
    }
    console.log('[Game.js] Container validation OK');
    
    console.log('[Game.js] Creating Phaser config...');
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
    console.log('[Game.js] Config created:', config);
    
    console.log('[Game.js] Creating new Phaser.Game instance...');
    window.game = new Phaser.Game(config);
    console.log('[Game.js] Phaser.Game instance created');
    
    window.game.registry.set("isMobile", isMobile);
    window.game.registry.set("soundEnabled", soundEnabled);
    console.log('[Game.js] Registry values set');
    
    window.game.events.once('destroy', () => {
      console.log("[Game.js] Phaser game destroyed");
    });
    
    console.log('[Game.js] Returning game instance');
    return window.game;
  } catch (err) {
    console.error("[Game.js] Failed to initialize game:", err);
    console.error("[Game.js] Error stack:", err.stack);
    throw err;
  }
};