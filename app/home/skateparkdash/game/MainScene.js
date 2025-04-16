let Phaser;
if (typeof window !== 'undefined') {
  Phaser = require('phaser');
} else {
  // Create a mock Phaser object for SSR
  Phaser = {
    Scene: class Scene {
      constructor() {}
    },
    Math: {
      Between: () => 0,
    },
  };
}

import { Player } from "./Player";

export class MainScene extends Phaser.Scene {
  // Game elements
  player;
  ground;
  obstacles;
  
  // Game state
  speed = 300;
  score = 0;
  scoreText;
  gameActive = false;
  startMessage;
  
  // Add a cooldown flag to prevent immediate restart
  canRestart = true;
  
  // Background layers
  backgroundLayers = [];
  
  // Timers
  obstacleTimer = null;
  
  // Track texture creation success
  texturesCreated = false;
  
  // Track the most recently spawned obstacle
  lastObstacle = null;
  
  // Minimum distance between obstacles (in pixels)
  minObstacleDistance = 300;
  
  constructor() {
    super({ key: "MainScene" });
  }
  
  preload() {
    try {
      // Instead of pixel font loading which isn't working correctly,
      // we'll use the Press Start 2P font we already loaded via CSS
      
      console.log("Loading game textures...");
      
      // Load player images from public folder
      this.load.image('player', '/skatedash/normal.png');
      this.load.image('player-duck', '/skatedash/duck.png');
      this.load.image('player-jump', '/skatedash/jump.png');
      
      // Load obstacle images from public folder
      this.load.image('bench', '/skatedash/obs.png');
      this.load.image('sign', '/skatedash/obs2.png');
      this.load.image('duckobstacle', '/skatedash/duckobstacle.png');
      
      // Create background sprites
      this.createBackgroundSprites();
      
      // Mark that textures were loaded successfully
      this.texturesCreated = true;
      console.log("Game textures loaded successfully");
    } catch (err) {
      console.error("Error in preload:", err);
      this.texturesCreated = false;
    }
  }
  
  create() {
    try {
      // Check if textures were created successfully
      if (!this.texturesCreated) {
        this.addTextureErrorMessage();
        return;
      }
      
      console.log("Creating game scene...");
      // Create parallax background layers
      this.createBackground();
      
      // Create ground platform
      this.createGround();
      
      // Create player
      this.player = new Player(this, 100, this.scale.height - 80);
      
      // Create obstacle group
      this.obstacles = this.physics.add.group();
      
      // Add collision detection
      this.physics.add.collider(this.player.sprite, this.ground);
      this.physics.add.overlap(
        this.player.sprite, 
        this.obstacles, 
        this.handleCollision, 
        undefined, 
        this
      );
      
      // Create score text using regular text instead of bitmap text
      this.scoreText = this.add.text(
        16, 16, "SCORE: 0", { 
          fontFamily: '"Press Start 2P", cursive',
          fontSize: '16px',
          color: '#f5f5fa' 
        }
      ).setScrollFactor(0);
      
      // Create start message using regular text
      this.startMessage = this.add.text(
        this.scale.width / 2, 
        this.scale.height / 2 - 30,
        "TAP OR PRESS SPACE\nTO START", { 
          fontFamily: '"Press Start 2P", cursive',
          fontSize: '16px',
          color: '#f5f5fa',
          align: 'center' 
        }
      ).setOrigin(0.5);
      
      // Set up input handlers
      this.setupInputHandlers();
      
      // Listen for resize events
      this.scale.on("resize", this.handleResize, this);
      console.log("Game scene created successfully");
    } catch (err) {
      console.error("Error in create:", err);
      // Display error message
      this.addErrorMessage(err.message);
    }
  }
  
  // Add error message to the scene
  addErrorMessage(message) {
    try {
      const errorText = this.add.text(
        this.scale.width / 2, 
        this.scale.height / 2,
        `ERROR: ${message}\nRefresh to try again`, { 
          fontFamily: 'Arial',
          fontSize: '16px',
          color: '#ff0000',
          align: 'center' 
        }
      ).setOrigin(0.5);
      
      // Add a background to make text more readable
      const bounds = errorText.getBounds();
      const background = this.add.rectangle(
        bounds.centerX,
        bounds.centerY,
        bounds.width + 20,
        bounds.height + 20,
        0x000000,
        0.7
      ).setOrigin(0.5);
      
      // Ensure text is above background
      background.setDepth(90);
      errorText.setDepth(100);
    } catch (e) {
      console.error("Failed to show error message:", e);
    }
  }
  
  // Add texture error message
  addTextureErrorMessage() {
    try {
      // Create a plain background
      this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x1f2560).setOrigin(0);
      
      const errorText = this.add.text(
        this.scale.width / 2, 
        this.scale.height / 2,
        "ERROR: Could not create game textures.\nPlease try again or use a different browser.", { 
          fontFamily: 'Arial',
          fontSize: '16px',
          color: '#ff0000',
          align: 'center' 
        }
      ).setOrigin(0.5);
    } catch (e) {
      console.error("Failed to show texture error message:", e);
    }
  }
  
  update() {
    // Skip update if textures weren't created successfully
    if (!this.texturesCreated || !this.gameActive) return;
    
    try {
      // Update player
      this.player.update();
      
      // Move background layers (parallax effect)
      this.updateBackground();
      
      // Move and remove offscreen obstacles
      this.updateObstacles();
      
      // Update score
      this.score += 1;
      this.scoreText.setText(`SCORE: ${Math.floor(this.score / 10)}`);
    } catch (err) {
      console.error("Error in update:", err);
    }
  }
  
  setupInputHandlers() {
    // Keyboard controls - bind methods properly
    this.input.keyboard.on("keydown-SPACE", () => this.handleJump(), this);
    this.input.keyboard.on("keydown-UP", () => this.handleJump(), this);
    
    // Track duck button state
    this.input.keyboard.on("keydown-DOWN", () => this.handleDuckDown(), this);
    this.input.keyboard.on("keyup-DOWN", () => this.handleDuckUp(), this);
    
    // Touch controls - using a single pointer down handler with swipe detection
    let startY = 0;
    
    this.input.on("pointerdown", (pointer) => {
      // Store start position for potential swipe detection
      startY = pointer.y;
      
      // Handle the tap for jumping or game start
      if (!this.gameActive) {
        this.resetGame();
      } else {
        this.handleJump();
      }
    });
    
    // Track touch/swipe for ducking
    this.input.on("pointermove", (pointer) => {
      const swipeDistance = pointer.y - startY;
      if (swipeDistance > 50 && this.gameActive) {  // Swipe down threshold
        this.handleDuckDown();
        // Store this as the new start so we don't trigger multiple times
        startY = pointer.y;
      }
    });

    this.input.on("pointerup", (pointer) => {
      // End ducking when touch is released
      if (this.gameActive && this.player.isDucking) {
        this.handleDuckUp();
      }
    });
    
    console.log("Input handlers set up successfully");
  }
  
  handleJump() {
    // Only restart if cooldown has passed
    if (!this.gameActive && this.canRestart) {
      this.resetGame();
    } else if (this.gameActive) {
      this.player.jump();
    }
  }
  
  // Split the duck handling into press and release actions
  handleDuckDown() {
    if (this.gameActive) {
      this.player.duck();
    }
  }
  
  handleDuckUp() {
    if (this.gameActive && this.player.isDucking) {
      this.player.standUp();
    }
  }
  
  // New method to properly reset and restart the game
  resetGame() {
    console.log("Resetting game...");
    
    // First, remove all collision listeners
    this.physics.world.colliders.destroy();
    
    // Clear any existing obstacles by destroying each one individually
    // to ensure proper cleanup of graphics and physics bodies
    this.obstacles.getChildren().forEach((obstacle) => {
      if (obstacle.debugGraphics) {
        obstacle.debugGraphics.destroy();
      }
      obstacle.destroy();
    });
    
    // Clear the entire group after destroying each obstacle
    this.obstacles.clear(true, true);
    
    // Reset player position
    if (this.player && this.player.sprite) {
      this.player.sprite.setVelocity(0, 0);
      this.player.sprite.setY(this.scale.height - 80);
      this.player.isJumping = false;
      this.player.isDucking = false;
      this.player.standUp();
    }
    
    // Re-add collision detection
    this.physics.add.collider(this.player.sprite, this.ground);
    this.physics.add.overlap(
      this.player.sprite, 
      this.obstacles, 
      this.handleCollision, 
      undefined, 
      this
    );
    
    // Reset obstacle tracking
    this.lastObstacle = null;
    
    // Start the game again
    this.startGame();
    
    console.log("Game reset and restarted");
  }
  
  startGame() {
    this.gameActive = true;
    this.score = 0;
    this.speed = 300;
    
    // Hide start message
    this.startMessage.setVisible(false);
    
    // Spawn first obstacle immediately
    this.spawnObstacle();
    
    // Start spawning obstacles with proper callback binding
    this.obstacleTimer = this.time.addEvent({
      delay: Phaser.Math.Between(1500, 3000),
      callback: () => this.spawnObstacle(),  // Use arrow function to preserve context
      loop: false
    });
    
    console.log("Game started, obstacles should spawn");
  }
  
  handleCollision() {
    if (!this.gameActive) return;
    
    // Get the colliding obstacle (the last argument from the overlap callback)
    const obstacle = arguments[1];
    
    // Don't trigger collision if player is ducking and this is a duck obstacle
    if (obstacle.isDuckObstacle && this.player.isDucking) {
      console.log("Successfully ducked under obstacle!");
      return; // Skip collision handling - player successfully ducked
    }
    
    // Show specific message if this is a duck obstacle and player is jumping
    if (obstacle.isDuckObstacle && this.player.isJumping) {
      this.startMessage.setText("YOU SHOULD DUCK!\nTAP TO RESTART");
    } else {
      this.startMessage.setText("GAME OVER!\nTAP TO RESTART");
    }
    
    // Stop the game
    this.gameActive = false;
    
    // Set cooldown to prevent immediate restart
    this.canRestart = false;
    
    // Allow restart after a delay (1200ms = 1.2 seconds)
    this.time.delayedCall(1200, () => {
      this.canRestart = true;
    });
    
    // Stop spawning obstacles
    if (this.obstacleTimer) {
      this.obstacleTimer.remove();
      this.obstacleTimer = null;
    }
    
    // Display game over message
    this.startMessage.setVisible(true);
    
    // Stop obstacles
    this.obstacles.getChildren().forEach((obstacle) => {
      obstacle.setVelocityX(0);
    });
    
    // Reset obstacle tracking
    this.lastObstacle = null;
  }
  
  spawnObstacle() {
    if (!this.gameActive) {
      console.log("Not spawning obstacle - game not active");
      return;
    }
    
    // Check if the last obstacle is still too close
    if (this.lastObstacle && 
        this.lastObstacle.active && 
        this.lastObstacle.x > this.scale.width - this.minObstacleDistance) {
      console.log("Previous obstacle still too close, delaying spawn");
      
      // Schedule another attempt after a short delay
      this.obstacleTimer = this.time.addEvent({
        delay: 500, // Try again in 0.5 seconds
        callback: () => this.spawnObstacle(),
        loop: false
      });
      return;
    }
    
    console.log("Spawning obstacle - game active:", this.gameActive);
    
    // Make bench obstacle (obs1) much rarer and sign (obs2) much more common
    // Weighted obstacle type selection (0 = bench/obs - very rare, 1 = sign/obs2 - common, 2 = duckobstacle - moderate)
    let obstacleType;
    const randomValue = Math.random();
    if (randomValue < 0.1) { // Only 10% chance for bench obstacle (obs1) - very rare
      obstacleType = 0; // bench/obs
    } else if (randomValue < 0.7) { // 60% chance for sign (obs2) - very common
      obstacleType = 1; // sign/obs2
    } else {
      obstacleType = 2; // duckobstacle - 30% chance
    }
    
    let obstacle;
    // Calculate scale based on screen height - decreased size for obs and obs2
    const minScale = 0.25;
    const maxScale = 0.45;
    const screenScale = Math.max(1, this.scale.height / 600);
    const finalScale = Math.min(maxScale, Math.max(minScale, minScale * screenScale));
    
    // Smaller scale specifically for obs and obs2
    const obsMinScale = 0.15;  // Smaller min scale for obs obstacles
    const obsMaxScale = 0.25;  // Smaller max scale for obs obstacles
    const obsScale = Math.min(obsMaxScale, Math.max(obsMinScale, obsMinScale * screenScale));
    
    if (obstacleType === 0) {
      // Ground obstacle (bench/obs) - player needs to jump over it
      // Position it exactly on the ground
      obstacle = this.obstacles.create(
        this.scale.width + 100,
        this.scale.height - 20, // Align to the ground (which is at height - 20)
        "bench" // obs.png sprite
      );
      obstacle.setOrigin(0.5, 1); // Set origin to bottom center to align with ground
      obstacle.setScale(obsScale); // Use smaller scale for obs
      
      // Set collision box according to the sprite's actual size
      const width = obstacle.width * 0.7;
      const height = obstacle.height * 0.7;
      obstacle.body.setSize(width, height);
      obstacle.body.setOffset(obstacle.width * 0.15, obstacle.height * 0.3);
      console.log("Created bench obstacle (obs.png) at", obstacle.x, obstacle.y);
    } else if (obstacleType === 1) {
      // Sign obstacle (obs2) - now also on the ground like the bench
      obstacle = this.obstacles.create(
        this.scale.width + 100,
        this.scale.height - 20, // Align to the ground (same as bench)
        "sign" // obs2.png sprite
      );
      obstacle.setOrigin(0.5, 1); // Set origin to bottom center to align with ground
      obstacle.setScale(obsScale); // Use smaller scale for obs2
      
      // Set collision box according to the sprite's actual size
      const width = obstacle.width * 0.7;
      const height = obstacle.height * 0.7;
      obstacle.body.setSize(width, height);
      obstacle.body.setOffset(obstacle.width * 0.15, obstacle.height * 0.15);
      console.log("Created sign obstacle (obs2.png) at", obstacle.x, obstacle.y);
    } else {
      // Duck-specific obstacle - using the duckobstacle.png
      // Position it just high enough for a ducking player to pass under
      const obstacleHeight = this.scale.height - 135;// Raised slightly to make ducking easier
      obstacle = this.obstacles.create(
        this.scale.width + 100,
        obstacleHeight,
        "duckobstacle"
      );
      obstacle.setOrigin(0.5, 0.5);
      obstacle.setScale(finalScale); // Keep normal scale for duck obstacle
      
      // Add a special property to identify this as a duck obstacle
      obstacle.isDuckObstacle = true;
      
      // Create a more specific collision box for duck obstacles
      // Make it narrower at the bottom to allow players to duck under more easily
      const width = obstacle.width * 0.6; // Narrower width
      const height = obstacle.height * 1.5; // Much taller (150% of sprite height)
      
      obstacle.body.setSize(width, height);
      obstacle.body.setOffset(
        obstacle.width * 0.2, // Center the collision box horizontally
        -obstacle.height * 0.5 // Position the collision box higher up
      );
      console.log("Created duck obstacle (duckobstacle.png) at", obstacle.x, obstacle.y);
    }
    
    // After creating the obstacle, store it as the last one
    this.lastObstacle = obstacle;
    
    // Ensure physics body is enabled
    obstacle.body.enable = true;
    
    // Set obstacle properties
    obstacle.setVelocityX(-this.speed);
    obstacle.body.velocity.x = -this.speed;
    
    // Ensure the obstacle is affected by physics but not by gravity
    obstacle.setImmovable(true);
    obstacle.body.allowGravity = false;
    
    // Make sure the obstacle is on top with appropriate depth
    obstacle.setDepth(100);
    
    // Schedule next obstacle with a new non-looping timer
    const delay = Phaser.Math.Between(2500, 4000); // Increased from 1500-3000
    if (this.obstacleTimer) {
      this.obstacleTimer.remove();
    }
    this.obstacleTimer = this.time.addEvent({
      delay: delay,
      callback: () => this.spawnObstacle(),
      loop: false
    });
    console.log(`Next obstacle in ${delay}ms, current speed: ${this.speed}`);
    
    // Slower speed increment
    this.speed += 1;
  }
  
  updateObstacles() {
    // Check if there are any obstacles
    const obstacles = this.obstacles.getChildren();
    if (obstacles.length > 0) {
      console.log(`Updating ${obstacles.length} obstacles`);
    }
    
    // Update obstacles positions manually in case physics is not handling it
    obstacles.forEach((obstacle) => {
      try {
        // Skip if obstacle is being destroyed or has no physics body
        if (!obstacle || !obstacle.active || !obstacle.body) {
          return;
        }
        
        // For extra safety, check if velocity exists before accessing it
        if (obstacle.body && typeof obstacle.body.velocity === 'undefined') {
          // Re-enable physics if needed
          obstacle.body.enable = true;
          obstacle.body.velocity = { x: -this.speed, y: 0 };
          console.warn("Fixed missing velocity object on obstacle");
        }
        
        // Log position of each obstacle for debugging
        console.log(`Obstacle at ${obstacle.x}, ${obstacle.y} with velocity ${obstacle.body.velocity?.x || 'undefined'}`);
        
        // Update the debug graphics position to follow the obstacle
        if (obstacle.debugGraphics) {
          obstacle.debugGraphics.clear();
          obstacle.debugGraphics.lineStyle(4, 0xff0000, 1);
          obstacle.debugGraphics.strokeRect(obstacle.x - 20, obstacle.y - 20, 40, 40);
        }
        
        // Remove obstacles that have gone off screen
        if (obstacle.x < -50) {
          console.log(`Destroying obstacle that went offscreen: ${obstacle.x}`);
          // Destroy the debug graphics first
          if (obstacle.debugGraphics) {
            obstacle.debugGraphics.destroy();
          }
          obstacle.destroy();
        }
        
        // Make sure velocity is correctly applied
        else if ((obstacle.body.velocity.x === 0 || Math.abs(obstacle.body.velocity.x) < 10) && this.gameActive) {
          console.log("Fixing stuck obstacle velocity");
          obstacle.body.velocity.x = -this.speed;
          obstacle.setVelocityX(-this.speed);
        }
      } catch (err) {
        console.error("Error processing obstacle:", err);
        // Try to safely destroy the obstacle if we hit an error
        try {
          if (obstacle.debugGraphics) obstacle.debugGraphics.destroy();
          obstacle.destroy();
        } catch (e) {
          // Silently fail if we can't destroy it
        }
      }
    });
  }
  
  handleResize(gameSize) {
    // Update ground position
    if (this.ground) {
      this.ground.setPosition(gameSize.width / 2, gameSize.height - 20);
      this.ground.setSize(gameSize.width, 40);
    }
    
    // Update background layers
    this.backgroundLayers.forEach((layer) => {
      layer.setSize(gameSize.width, gameSize.height);
    });
    
    // Update start message position
    if (this.startMessage) {
      this.startMessage.setX(gameSize.width / 2);
      this.startMessage.setY(gameSize.height / 2 - 30);
    }
    
    // Update player position if needed
    if (this.player && this.player.sprite) {
      this.player.updateGroundY(gameSize.height - 80);
    }
  }
  
  createBackground() {
    // Create a single bottom position for all buildings
    const groundLevel = this.scale.height - 20; // Position right above the ground
    
    // Use a larger building height for better scaling on big screens
    const buildingHeight = Math.max(240, this.scale.height * 0.6); // Taller buildings that scale with screen height
    
    // Static sky background with moon and stars that doesn't scroll
    const sky = this.add.image(0, 0, "sky-background")
      .setOrigin(0, 0)
      .setDisplaySize(this.scale.width, this.scale.height);
    
    // Far buildings (slowest) - set proper position at bottom of screen
    const backBuildings = this.add.tileSprite(
      0, groundLevel - 200, 
      this.scale.width, 200, 
      "back-buildings" 
    ).setOrigin(0, 0);
    
    // Mid buildings - positioned relative to bottom of screen
    const midBuildings = this.add.tileSprite(
      0, groundLevel - 240,
      this.scale.width, 240, 
      "mid-buildings"
    ).setOrigin(0, 0);
    
    // Front buildings (fastest) - positioned relative to bottom of screen
    const frontBuildings = this.add.tileSprite(
      0, groundLevel - 280,
      this.scale.width, 280, 
      "front-buildings"
    ).setOrigin(0, 0);
    
    // Store only the buildings in backgroundLayers for parallax scrolling
    // (sky is not included as it doesn't scroll)
    this.backgroundLayers = [backBuildings, midBuildings, frontBuildings];
  }
  
  updateBackground() {
    // Move background layers at different speeds for parallax effect
    // Increased differences between layers for more pronounced depth
    this.backgroundLayers[0].tilePositionX += 0.3;  // Far buildings (slowest)
    this.backgroundLayers[1].tilePositionX += 1.2;  // Mid buildings (medium)
    this.backgroundLayers[2].tilePositionX += 2.5;  // Front buildings (fastest)
  }
  
  createGround() {
    // Create ground platform
    this.ground = this.add.rectangle(
      this.scale.width / 2, 
      this.scale.height - 20, 
      this.scale.width, 
      40, 
      0x3955b8 
    );
    
    // Add physics to ground
    this.physics.add.existing(this.ground, true);
  }
  
  createPlayerSprite() {
    try {
      // Create pixel art data for player sprite
      const playerCanvas = this.textures.createCanvas("player", 32, 32);
      if (!playerCanvas) throw new Error("Failed to create player canvas");
      const ctx = playerCanvas.getContext();
      if (!ctx) throw new Error("Failed to get canvas context");
      
      // Draw skateboarder (standing)
      ctx.fillStyle = "#f5f5fa"; // White for body
      ctx.fillRect(12, 8, 8, 10);  // Head
      ctx.fillRect(14, 18, 4, 8);  // Body
      
      ctx.fillStyle = "#f87b4a";  // Orange for clothes
      ctx.fillRect(10, 18, 4, 4);  // Left arm
      ctx.fillRect(18, 18, 4, 4);  // Right arm
      ctx.fillRect(14, 26, 2, 4);  // Left leg
      ctx.fillRect(16, 26, 2, 4);  // Right leg
      
      ctx.fillStyle = "#8952e0";  // Purple for skateboard
      ctx.fillRect(8, 30, 16, 2);  // Skateboard deck
      
      ctx.fillStyle = "#1f2560";  // Dark blue for wheels
      ctx.fillRect(10, 28, 2, 2);  // Left wheel
      ctx.fillRect(20, 28, 2, 2);  // Right wheel
      
      // Create ducking frame with similar error handling
      const duckCanvas = this.textures.createCanvas("player-duck", 32, 32);
      if (!duckCanvas) throw new Error("Failed to create duck canvas");
      const duckCtx = duckCanvas.getContext();
      if (!duckCtx) throw new Error("Failed to get duck canvas context");
      
      // Draw skateboarder (ducking)
      duckCtx.fillStyle = "#f5f5fa"; // White for body
      duckCtx.fillRect(12, 16, 8, 6);  // Head (lower)
      duckCtx.fillRect(14, 22, 4, 4);  // Body (shorter)
      
      duckCtx.fillStyle = "#f87b4a";  // Orange for clothes
      duckCtx.fillRect(10, 22, 4, 2);  // Left arm
      duckCtx.fillRect(18, 22, 4, 2);  // Right arm
      duckCtx.fillRect(14, 26, 2, 4);  // Left leg
      duckCtx.fillRect(16, 26, 2, 4);  // Right leg
      
      duckCtx.fillStyle = "#8952e0";  // Purple for skateboard
      duckCtx.fillRect(8, 30, 16, 2);  // Skateboard deck
      
      duckCtx.fillStyle = "#1f2560";  // Dark blue for wheels
      duckCtx.fillRect(10, 28, 2, 2);  // Left wheel
      duckCtx.fillRect(20, 28, 2, 2);  // Right wheel
      
      // Create jumping frame with similar error handling
      const jumpCanvas = this.textures.createCanvas("player-jump", 32, 32);
      if (!jumpCanvas) throw new Error("Failed to create jump canvas");
      const jumpCtx = jumpCanvas.getContext();
      if (!jumpCtx) throw new Error("Failed to get jump canvas context");
      
      // Draw skateboarder (jumping)
      jumpCtx.fillStyle = "#f5f5fa"; // White for body
      jumpCtx.fillRect(12, 8, 8, 10);  // Head
      jumpCtx.fillRect(14, 18, 4, 8);  // Body
      
      jumpCtx.fillStyle = "#f87b4a";  // Orange for clothes
      jumpCtx.fillRect(8, 16, 4, 4);  // Left arm (raised)
      jumpCtx.fillRect(20, 16, 4, 4);  // Right arm (raised)
      jumpCtx.fillRect(12, 26, 4, 4);  // Left leg (bent)
      jumpCtx.fillRect(16, 26, 4, 4);  // Right leg (bent)
      
      jumpCtx.fillStyle = "#8952e0";  // Purple for skateboard
      jumpCtx.fillRect(8, 30, 16, 2);  // Skateboard deck
      
      jumpCtx.fillStyle = "#1f2560";  // Dark blue for wheels
      jumpCtx.fillRect(10, 28, 2, 2);  // Left wheel
      jumpCtx.fillRect(20, 28, 2, 2);  // Right wheel
      
      // Update the textures
      playerCanvas.refresh();
      duckCanvas.refresh();
      jumpCanvas.refresh();
      return true;
    } catch (err) {
      console.error("Error creating player sprites:", err);
      return false;
    }
  }
  
  createObstacleSprites() {
    // Create bench obstacle
    const benchCanvas = this.textures.createCanvas("bench", 32, 32);
    const benchCtx = benchCanvas.getContext();
    benchCtx.fillStyle = "#5b9ddb";  // Light blue
    benchCtx.fillRect(4, 20, 24, 4);  // Bench seat
    
    benchCtx.fillStyle = "#1f2560";  // Dark blue
    benchCtx.fillRect(6, 24, 4, 8);  // Left leg
    benchCtx.fillRect(22, 24, 4, 8);  // Right leg
    
    // Create overhead sign obstacle
    const signCanvas = this.textures.createCanvas("sign", 32, 32);
    const signCtx = signCanvas.getContext();
    signCtx.fillStyle = "#f87b4a";  // Orange
    signCtx.fillRect(8, 4, 16, 12);  // Sign
    
    signCtx.fillStyle = "#1f2560";  // Dark blue
    signCtx.fillRect(14, 16, 4, 16);  // Pole
    
    // Update the textures
    benchCanvas.refresh();
    signCanvas.refresh();
  }
  
  createBackgroundSprites() {
    try {
      // Create two separate textures:
      // 1. A static sky texture with moon and stars (non-tiling)
      // 2. Building textures that will tile horizontally
      
      // 1. Static sky background with moon and stars
      const skyCanvas = this.textures.createCanvas("sky-background", 640, 360);
      const skyCtx = skyCanvas.getContext();
      
      // Clear canvas and set background
      skyCtx.clearRect(0, 0, 640, 360);
      skyCtx.fillStyle = "#1f2560";  // Background color
      skyCtx.fillRect(0, 0, 640, 360);
      
      // Draw stars throughout the sky
      skyCtx.fillStyle = "#f5f5fa";  // White
      
      // Small stars
      for (let i = 0; i < 200; i++) {
        const x = Phaser.Math.Between(0, 640);
        const y = Phaser.Math.Between(0, 240);
        const size = Phaser.Math.Between(1, 2);
        skyCtx.fillRect(x, y, size, size);
      }
      
      // Medium stars
      for (let i = 0; i < 50; i++) {
        const x = Phaser.Math.Between(0, 640);
        const y = Phaser.Math.Between(0, 200);
        const size = 2;
        skyCtx.fillRect(x, y, size, size);
      }
      
      // Large stars
      for (let i = 0; i < 25; i++) {
        const x = Phaser.Math.Between(0, 640);
        const y = Phaser.Math.Between(0, 180);
        
        // Draw a 4-point star
        skyCtx.fillRect(x, y, 3, 3);
        skyCtx.fillRect(x-1, y, 5, 1);
        skyCtx.fillRect(x, y-1, 1, 5);
      }
      
      // Draw the moon in the sky
      skyCtx.fillStyle = "#f5f5fa";  // White
      skyCtx.beginPath();
      skyCtx.arc(320, 80, 45, 0, Math.PI * 2); // Large moon in the center
      skyCtx.fill();
      
      // Add lunar craters
      skyCtx.fillStyle = "#e1e1e6";  // Slightly darker white
      skyCtx.beginPath();
      skyCtx.arc(300, 65, 10, 0, Math.PI * 2);
      skyCtx.fill();
      skyCtx.beginPath();
      skyCtx.arc(335, 95, 12, 0, Math.PI * 2);
      skyCtx.fill();
      skyCtx.beginPath();
      skyCtx.arc(320, 70, 8, 0, Math.PI * 2);
      skyCtx.fill();
      
      // 2. Far buildings - with larger canvas size
      const backBuildingsCanvas = this.textures.createCanvas("back-buildings", 640, 200);
      const backCtx = backBuildingsCanvas.getContext();
      
      // Clear canvas (transparent background)
      backCtx.clearRect(0, 0, 640, 200);
      
      // Draw far buildings - only in bottom portion
      backCtx.fillStyle = "#3955b8";  // Blue
      for (let i = 0; i < 12; i++) {
        const width = Phaser.Math.Between(60, 120);
        const height = Phaser.Math.Between(60, 160);
        const x = i * 60;
        backCtx.fillRect(x, 200 - height, width, height);
        
        // Draw windows
        backCtx.fillStyle = "#5b9ddb";  // Light blue
        for (let wx = x + 10; wx < x + width - 10; wx += 20) {
          for (let wy = 200 - height + 20; wy < 190; wy += 30) {
            backCtx.fillRect(wx, wy, 10, 10);
          }
        }
        backCtx.fillStyle = "#3955b8";  // Back to blue for next building
      }
      
      // Mid buildings - transparent background
      const midBuildingsCanvas = this.textures.createCanvas("mid-buildings", 640, 240);
      const midCtx = midBuildingsCanvas.getContext();
      
      // Clear canvas completely
      midCtx.clearRect(0, 0, 640, 240);
      
      // Draw mid buildings
      midCtx.fillStyle = "#1f2560";  // Darker blue
      for (let i = 0; i < 8; i++) {
        const width = Phaser.Math.Between(80, 140);
        const height = Phaser.Math.Between(120, 240);
        const x = i * 80;
        midCtx.fillRect(x, 240 - height, width, height);
        
        // Draw windows
        midCtx.fillStyle = "#5b9ddb";  // Light blue
        for (let wx = x + 16; wx < x + width - 16; wx += 24) {
          for (let wy = 240 - height + 30; wy < 230; wy += 40) {
            midCtx.fillRect(wx, wy, 12, 16);
          }
        }
        midCtx.fillStyle = "#1f2560";  // Back to dark blue for next building
      }
      
      // Front buildings - transparent background
      const frontBuildingsCanvas = this.textures.createCanvas("front-buildings", 640, 280);
      const frontCtx = frontBuildingsCanvas.getContext();
      
      // Clear canvas completely
      frontCtx.clearRect(0, 0, 640, 280);
      
      // Draw front buildings
      frontCtx.fillStyle = "#131318";  // Nearly black
      for (let i = 0; i < 6; i++) {
        const width = Phaser.Math.Between(100, 180);
        const height = Phaser.Math.Between(180, 280);
        const x = i * 120;
        frontCtx.fillRect(x, 280 - height, width, height);
        
        // Draw windows
        frontCtx.fillStyle = "#8952e0";  // Purple
        for (let wx = x + 20; wx < x + width - 20; wx += 30) {
          for (let wy = 280 - height + 40; wy < 270; wy += 50) {
            frontCtx.fillRect(wx, wy, 16, 20);
          }
        }
        frontCtx.fillStyle = "#131318";  // Back to black for next building
      }
      
      // Update all textures
      skyCanvas.refresh();
      backBuildingsCanvas.refresh();
      midBuildingsCanvas.refresh();
      frontBuildingsCanvas.refresh();
      return true;
    } catch (err) {
      console.error("Error creating background sprites:", err);
      return false;
    }
  }
}