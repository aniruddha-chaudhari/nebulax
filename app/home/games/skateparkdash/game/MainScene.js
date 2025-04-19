let Phaser;
if (typeof window !== 'undefined') {
  Phaser = require('phaser');
} else {
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
  player;
  ground;
  obstacles;
  
  speed = 300;
  score = 0;
  scoreText;
  gameActive = false;
  startMessage;
  
  soundEnabled = true;
  canRestart = true;
  backgroundLayers = [];
  obstacleTimer = null;
  texturesCreated = false;
  lastObstacle = null;
  minObstacleDistance = 300;
  duckTimer = null;
  minDuckDuration = 800;
  isDuckLocked = false;
  
  constructor() {
    super({ key: "MainScene" });
  }
  
  preload() {
    try {
      console.log("Loading game textures...");
      this.load.image('player', '/skatedash/normal.png');
      this.load.image('player-duck', '/skatedash/duck.png');
      this.load.image('player-jump', '/skatedash/jump.png');
      this.load.image('bench', '/skatedash/obs.png');
      this.load.image('sign', '/skatedash/obs2.png');
      this.load.image('duckobstacle', '/skatedash/duckobstacle.png');
      this.createBackgroundSprites();
      this.texturesCreated = true;
      console.log("Game textures loaded successfully");
    } catch (err) {
      console.error("Error in preload:", err);
      this.texturesCreated = false;
    }
  }
  
  create() {
    try {
      if (!this.texturesCreated) {
        this.addTextureErrorMessage();
        return;
      }

      if (this.registry.has('soundEnabled')) {
        this.soundEnabled = this.registry.get('soundEnabled');
        console.log("Initial sound state:", this.soundEnabled);
      }
      
      this.registry.events.on('changedata', this.handleRegistryChange, this);
      
      console.log("Creating game scene...");
      this.createBackground();
      this.createGround();
      this.player = new Player(this, 100, this.scale.height - 80);
      this.obstacles = this.physics.add.group();
      this.physics.add.collider(this.player.sprite, this.ground);
      this.physics.add.overlap(
        this.player.sprite, 
        this.obstacles, 
        this.handleCollision, 
        undefined, 
        this
      );
      this.scoreText = this.add.text(
        16, 16, "SCORE: 0", { 
          fontFamily: '"Press Start 2P", cursive',
          fontSize: '16px',
          color: '#f5f5fa' 
        }
      ).setScrollFactor(0);
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
      this.setupInputHandlers();
      this.scale.on("resize", this.handleResize, this);
      console.log("Game scene created successfully");
    } catch (err) {
      console.error("Error in create:", err);
      this.addErrorMessage(err.message);
    }
  }
  
  handleRegistryChange(parent, key, data) {
    if (key === 'soundEnabled') {
      console.log("Sound setting changed to:", data);
      this.soundEnabled = data;
    }
  }
  
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
      const bounds = errorText.getBounds();
      const background = this.add.rectangle(
        bounds.centerX,
        bounds.centerY,
        bounds.width + 20,
        bounds.height + 20,
        0x000000,
        0.7
      ).setOrigin(0.5);
      background.setDepth(90);
      errorText.setDepth(100);
    } catch (e) {
      console.error("Failed to show error message:", e);
    }
  }
  
  addTextureErrorMessage() {
    try {
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
    if (!this.texturesCreated || !this.gameActive) return;
    
    try {
      this.player.update();
      this.updateBackground();
      this.updateObstacles();
      this.score += 1;
      this.scoreText.setText(`SCORE: ${Math.floor(this.score / 10)}`);
    } catch (err) {
      console.error("Error in update:", err);
    }
  }
  
  setupInputHandlers() {
    this.input.keyboard.on("keydown-SPACE", () => this.handleJump(), this);
    this.input.keyboard.on("keydown-UP", () => this.handleJump(), this);
    this.input.keyboard.on("keydown-DOWN", () => this.handleDuckDown(), this);
    this.input.keyboard.on("keyup-DOWN", () => this.handleDuckUp(), this);
    
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let hasMoved = false;
    const TAP_THRESHOLD = 200;
    const MOVE_THRESHOLD = 30;
    
    this.input.on("pointerdown", (pointer) => {
      startX = pointer.x;
      startY = pointer.y;
      startTime = Date.now();
      hasMoved = false;
      if (!this.gameActive && this.canRestart) {
        this.resetGame();
      }
    });
    
    this.input.on("pointermove", (pointer) => {
      const distX = Math.abs(pointer.x - startX);
      const distY = Math.abs(pointer.y - startY);
      const swipeDownDistance = pointer.y - startY;
      if (distX > MOVE_THRESHOLD || distY > MOVE_THRESHOLD) {
        hasMoved = true;
      }
      if (swipeDownDistance > 50 && this.gameActive && !this.player.isDucking && !this.isDuckLocked) {
        this.handleDuckDown();
        this.isDuckLocked = true;
        if (this.duckTimer) {
          this.duckTimer.remove();
        }
        this.duckTimer = this.time.delayedCall(this.minDuckDuration, () => {
          this.isDuckLocked = false;
          if (!this.input.activePointer.isDown || this.input.activePointer.y - startY < 20) {
            this.handleDuckUp();
          }
        });
        startY = pointer.y;
      }
    });
    
    this.input.on("pointerup", (pointer) => {
      const elapsedTime = Date.now() - startTime;
      if (!hasMoved && elapsedTime < TAP_THRESHOLD && this.gameActive) {
        this.handleJump();
      }
      if (this.gameActive && this.player.isDucking && !this.isDuckLocked) {
        this.handleDuckUp();
      }
    });
    
    console.log("Input handlers set up successfully");
  }
  
  handleJump() {
    if (!this.gameActive && this.canRestart) {
      this.resetGame();
    } else if (this.gameActive) {
      this.player.jump();
    }
  }
  
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
  
  resetGame() {
    console.log("Resetting game...");
    this.physics.world.colliders.destroy();
    this.obstacles.getChildren().forEach((obstacle) => {
      if (obstacle.debugGraphics) {
        obstacle.debugGraphics.destroy();
      }
      obstacle.destroy();
    });
    this.obstacles.clear(true, true);
    if (this.player && this.player.sprite) {
      this.player.sprite.setVelocity(0, 0);
      this.player.sprite.setY(this.scale.height - 80);
      this.player.isJumping = false;
      this.player.isDucking = false;
      this.player.standUp();
    }
    this.physics.add.collider(this.player.sprite, this.ground);
    this.physics.add.overlap(
      this.player.sprite, 
      this.obstacles, 
      this.handleCollision, 
      undefined, 
      this
    );
    this.lastObstacle = null;
    this.startGame();
    console.log("Game reset and restarted");
  }
  
  startGame() {
    this.gameActive = true;
    this.score = 0;
    this.speed = 300;
    this.startMessage.setVisible(false);
    this.spawnObstacle();
    this.obstacleTimer = this.time.addEvent({
      delay: Phaser.Math.Between(1500, 3000),
      callback: () => this.spawnObstacle(),
      loop: false
    });
    console.log("Game started, obstacles should spawn");
  }
  
  handleCollision() {
    if (!this.gameActive) return;
    const obstacle = arguments[1];
    if (obstacle.isDuckObstacle && this.player.isDucking) {
      console.log("Successfully ducked under obstacle!");
      return;
    }
    if (obstacle.isDuckObstacle && this.player.isJumping) {
      this.startMessage.setText("YOU SHOULD DUCK!\nTAP TO RESTART");
    } else {
      this.startMessage.setText("GAME OVER!\nTAP TO RESTART");
    }
    this.gameActive = false;
    this.canRestart = false;
    this.time.delayedCall(700, () => {
      this.canRestart = true;
    });
    if (this.obstacleTimer) {
      this.obstacleTimer.remove();
      this.obstacleTimer = null;
    }
    this.startMessage.setVisible(true);
    this.obstacles.getChildren().forEach((obstacle) => {
      obstacle.setVelocityX(0);
    });
    this.lastObstacle = null;
  }
  
  spawnObstacle() {
    if (!this.gameActive) {
      console.log("Not spawning obstacle - game not active");
      return;
    }
    if (this.lastObstacle && 
        this.lastObstacle.active && 
        this.lastObstacle.x > this.scale.width - this.minObstacleDistance) {
      console.log("Previous obstacle still too close, delaying spawn");
      this.obstacleTimer = this.time.addEvent({
        delay: 500,
        callback: () => this.spawnObstacle(),
        loop: false
      });
      return;
    }
    console.log("Spawning obstacle - game active:", this.gameActive);
    let obstacleType;
    const randomValue = Math.random();
    if (randomValue < 0.1) {
      obstacleType = 0;
    } else if (randomValue < 0.7) {
      obstacleType = 1;
    } else {
      obstacleType = 2;
    }
    let obstacle;
    const minScale = 0.25;
    const maxScale = 0.45;
    const screenScale = Math.max(1, this.scale.height / 600);
    const finalScale = Math.min(maxScale, Math.max(minScale, minScale * screenScale));
    const obsMinScale = 0.15;
    const obsMaxScale = 0.25;
    const obsScale = Math.min(obsMaxScale, Math.max(obsMinScale, obsMinScale * screenScale));
    if (obstacleType === 0) {
      obstacle = this.obstacles.create(
        this.scale.width + 100,
        this.scale.height - 20,
        "bench"
      );
      obstacle.setOrigin(0.5, 1);
      obstacle.setScale(obsScale);
      const width = obstacle.width * 0.7;
      const height = obstacle.height * 0.7;
      obstacle.body.setSize(width, height);
      obstacle.body.setOffset(obstacle.width * 0.15, obstacle.height * 0.3);
      console.log("Created bench obstacle (obs.png) at", obstacle.x, obstacle.y);
    } else if (obstacleType === 1) {
      obstacle = this.obstacles.create(
        this.scale.width + 100,
        this.scale.height - 20,
        "sign"
      );
      obstacle.setOrigin(0.5, 1);
      obstacle.setScale(obsScale);
      const width = obstacle.width * 0.7;
      const height = obstacle.height * 0.7;
      obstacle.body.setSize(width, height);
      obstacle.body.setOffset(obstacle.width * 0.15, obstacle.height * 0.15);
      console.log("Created sign obstacle (obs2.png) at", obstacle.x, obstacle.y);
    } else {
      const obstacleHeight = this.scale.height - 135;
      obstacle = this.obstacles.create(
        this.scale.width + 100,
        obstacleHeight,
        "duckobstacle"
      );
      obstacle.setOrigin(0.5, 0.5);
      obstacle.setScale(finalScale);
      obstacle.isDuckObstacle = true;
      const width = obstacle.width * 0.6;
      const height = obstacle.height * 1.5;
      obstacle.body.setSize(width, height);
      obstacle.body.setOffset(
        obstacle.width * 0.2,
        -obstacle.height * 0.5
      );
      console.log("Created duck obstacle (duckobstacle.png) at", obstacle.x, obstacle.y);
    }
    this.lastObstacle = obstacle;
    obstacle.body.enable = true;
    obstacle.setVelocityX(-this.speed);
    obstacle.body.velocity.x = -this.speed;
    obstacle.setImmovable(true);
    obstacle.body.allowGravity = false;
    obstacle.setDepth(100);
    const delay = Phaser.Math.Between(2500, 4000);
    if (this.obstacleTimer) {
      this.obstacleTimer.remove();
    }
    this.obstacleTimer = this.time.addEvent({
      delay: delay,
      callback: () => this.spawnObstacle(),
      loop: false
    });
    console.log(`Next obstacle in ${delay}ms, current speed: ${this.speed}`);
    this.speed += 1;
  }
  
  updateObstacles() {
    const obstacles = this.obstacles.getChildren();
    if (obstacles.length > 0) {
      console.log(`Updating ${obstacles.length} obstacles`);
    }
    obstacles.forEach((obstacle) => {
      try {
        if (!obstacle || !obstacle.active || !obstacle.body) {
          return;
        }
        if (obstacle.body && typeof obstacle.body.velocity === 'undefined') {
          obstacle.body.enable = true;
          obstacle.body.velocity = { x: -this.speed, y: 0 };
          console.warn("Fixed missing velocity object on obstacle");
        }
        console.log(`Obstacle at ${obstacle.x}, ${obstacle.y} with velocity ${obstacle.body.velocity?.x || 'undefined'}`);
        if (obstacle.debugGraphics) {
          obstacle.debugGraphics.clear();
          obstacle.debugGraphics.lineStyle(4, 0xff0000, 1);
          obstacle.debugGraphics.strokeRect(obstacle.x - 20, obstacle.y - 20, 40, 40);
        }
        if (obstacle.x < -50) {
          console.log(`Destroying obstacle that went offscreen: ${obstacle.x}`);
          if (obstacle.debugGraphics) {
            obstacle.debugGraphics.destroy();
          }
          obstacle.destroy();
        } else if ((obstacle.body.velocity.x === 0 || Math.abs(obstacle.body.velocity.x) < 10) && this.gameActive) {
          console.log("Fixing stuck obstacle velocity");
          obstacle.body.velocity.x = -this.speed;
          obstacle.setVelocityX(-this.speed);
        }
      } catch (err) {
        console.error("Error processing obstacle:", err);
        try {
          if (obstacle.debugGraphics) obstacle.debugGraphics.destroy();
          obstacle.destroy();
        } catch (e) {
        }
      }
    });
  }
  
  handleResize(gameSize) {
    if (this.ground) {
      this.ground.setPosition(gameSize.width / 2, gameSize.height - 20);
      this.ground.setSize(gameSize.width, 40);
    }
    this.backgroundLayers.forEach((layer) => {
      layer.setSize(gameSize.width, gameSize.height);
    });
    if (this.startMessage) {
      this.startMessage.setX(gameSize.width / 2);
      this.startMessage.setY(gameSize.height / 2 - 30);
    }
    if (this.player && this.player.sprite) {
      this.player.updateGroundY(gameSize.height - 80);
    }
  }
  
  createBackground() {
    const groundLevel = this.scale.height - 20;
    const buildingHeight = Math.max(240, this.scale.height * 0.6);
    const sky = this.add.image(0, 0, "sky-background")
      .setOrigin(0, 0)
      .setDisplaySize(this.scale.width, this.scale.height);
    const backBuildings = this.add.tileSprite(
      0, groundLevel - 200, 
      this.scale.width, 200, 
      "back-buildings" 
    ).setOrigin(0, 0);
    const midBuildings = this.add.tileSprite(
      0, groundLevel - 240,
      this.scale.width, 240, 
      "mid-buildings"
    ).setOrigin(0, 0);
    const frontBuildings = this.add.tileSprite(
      0, groundLevel - 280,
      this.scale.width, 280, 
      "front-buildings"
    ).setOrigin(0, 0);
    this.backgroundLayers = [backBuildings, midBuildings, frontBuildings];
  }
  
  updateBackground() {
    this.backgroundLayers[0].tilePositionX += 0.3;
    this.backgroundLayers[1].tilePositionX += 1.2;
    this.backgroundLayers[2].tilePositionX += 2.5;
  }
  
  createGround() {
    this.ground = this.add.rectangle(
      this.scale.width / 2, 
      this.scale.height - 20, 
      this.scale.width, 
      40, 
      0x3955b8 
    );
    this.physics.add.existing(this.ground, true);
  }
  
  createPlayerSprite() {
    try {
      const playerCanvas = this.textures.createCanvas("player", 32, 32);
      if (!playerCanvas) throw new Error("Failed to create player canvas");
      const ctx = playerCanvas.getContext();
      if (!ctx) throw new Error("Failed to get canvas context");
      ctx.fillStyle = "#f5f5fa";
      ctx.fillRect(12, 8, 8, 10);
      ctx.fillRect(14, 18, 4, 8);
      ctx.fillStyle = "#f87b4a";
      ctx.fillRect(10, 18, 4, 4);
      ctx.fillRect(18, 18, 4, 4);
      ctx.fillRect(14, 26, 2, 4);
      ctx.fillRect(16, 26, 2, 4);
      ctx.fillStyle = "#8952e0";
      ctx.fillRect(8, 30, 16, 2);
      ctx.fillStyle = "#1f2560";
      ctx.fillRect(10, 28, 2, 2);
      ctx.fillRect(20, 28, 2, 2);
      const duckCanvas = this.textures.createCanvas("player-duck", 32, 32);
      if (!duckCanvas) throw new Error("Failed to create duck canvas");
      const duckCtx = duckCanvas.getContext();
      if (!duckCtx) throw new Error("Failed to get duck canvas context");
      duckCtx.fillStyle = "#f5f5fa";
      duckCtx.fillRect(12, 16, 8, 6);
      duckCtx.fillRect(14, 22, 4, 4);
      duckCtx.fillStyle = "#f87b4a";
      duckCtx.fillRect(10, 22, 4, 2);
      duckCtx.fillRect(18, 22, 4, 2);
      duckCtx.fillRect(14, 26, 2, 4);
      duckCtx.fillRect(16, 26, 2, 4);
      duckCtx.fillStyle = "#8952e0";
      duckCtx.fillRect(8, 30, 16, 2);
      duckCtx.fillStyle = "#1f2560";
      duckCtx.fillRect(10, 28, 2, 2);
      duckCtx.fillRect(20, 28, 2, 2);
      const jumpCanvas = this.textures.createCanvas("player-jump", 32, 32);
      if (!jumpCanvas) throw new Error("Failed to create jump canvas");
      const jumpCtx = jumpCanvas.getContext();
      if (!jumpCtx) throw new Error("Failed to get jump canvas context");
      jumpCtx.fillStyle = "#f5f5fa";
      jumpCtx.fillRect(12, 8, 8, 10);
      jumpCtx.fillRect(14, 18, 4, 8);
      jumpCtx.fillStyle = "#f87b4a";
      jumpCtx.fillRect(8, 16, 4, 4);
      jumpCtx.fillRect(20, 16, 4, 4);
      jumpCtx.fillRect(12, 26, 4, 4);
      jumpCtx.fillRect(16, 26, 4, 4);
      jumpCtx.fillStyle = "#8952e0";
      jumpCtx.fillRect(8, 30, 16, 2);
      jumpCtx.fillStyle = "#1f2560";
      jumpCtx.fillRect(10, 28, 2, 2);
      jumpCtx.fillRect(20, 28, 2, 2);
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
    const benchCanvas = this.textures.createCanvas("bench", 32, 32);
    const benchCtx = benchCanvas.getContext();
    benchCtx.fillStyle = "#5b9ddb";
    benchCtx.fillRect(4, 20, 24, 4);
    benchCtx.fillStyle = "#1f2560";
    benchCtx.fillRect(6, 24, 4, 8);
    benchCtx.fillRect(22, 24, 4, 8);
    const signCanvas = this.textures.createCanvas("sign", 32, 32);
    const signCtx = signCanvas.getContext();
    signCtx.fillStyle = "#f87b4a";
    signCtx.fillRect(8, 4, 16, 12);
    signCtx.fillStyle = "#1f2560";
    signCtx.fillRect(14, 16, 4, 16);
    benchCanvas.refresh();
    signCanvas.refresh();
  }
  
  createBackgroundSprites() {
    try {
      const skyCanvas = this.textures.createCanvas("sky-background", 640, 360);
      const skyCtx = skyCanvas.getContext();
      skyCtx.clearRect(0, 0, 640, 360);
      skyCtx.fillStyle = "#1f2560";
      skyCtx.fillRect(0, 0, 640, 360);
      skyCtx.fillStyle = "#f5f5fa";
      for (let i = 0; i < 200; i++) {
        const x = Phaser.Math.Between(0, 640);
        const y = Phaser.Math.Between(0, 240);
        const size = Phaser.Math.Between(1, 2);
        skyCtx.fillRect(x, y, size, size);
      }
      for (let i = 0; i < 50; i++) {
        const x = Phaser.Math.Between(0, 640);
        const y = Phaser.Math.Between(0, 200);
        const size = 2;
        skyCtx.fillRect(x, y, size, size);
      }
      for (let i = 0; i < 25; i++) {
        const x = Phaser.Math.Between(0, 640);
        const y = Phaser.Math.Between(0, 180);
        skyCtx.fillRect(x, y, 3, 3);
        skyCtx.fillRect(x-1, y, 5, 1);
        skyCtx.fillRect(x, y-1, 1, 5);
      }
      skyCtx.fillStyle = "#f5f5fa";
      skyCtx.beginPath();
      skyCtx.arc(320, 80, 45, 0, Math.PI * 2);
      skyCtx.fill();
      skyCtx.fillStyle = "#e1e1e6";
      skyCtx.beginPath();
      skyCtx.arc(300, 65, 10, 0, Math.PI * 2);
      skyCtx.fill();
      skyCtx.beginPath();
      skyCtx.arc(335, 95, 12, 0, Math.PI * 2);
      skyCtx.fill();
      skyCtx.beginPath();
      skyCtx.arc(320, 70, 8, 0, Math.PI * 2);
      skyCtx.fill();
      const backBuildingsCanvas = this.textures.createCanvas("back-buildings", 640, 200);
      const backCtx = backBuildingsCanvas.getContext();
      backCtx.clearRect(0, 0, 640, 200);
      backCtx.fillStyle = "#3955b8";
      for (let i = 0; i < 12; i++) {
        const width = Phaser.Math.Between(60, 120);
        const height = Phaser.Math.Between(60, 160);
        const x = i * 60;
        backCtx.fillRect(x, 200 - height, width, height);
        backCtx.fillStyle = "#5b9ddb";
        for (let wx = x + 10; wx < x + width - 10; wx += 20) {
          for (let wy = 200 - height + 20; wy < 190; wy += 30) {
            backCtx.fillRect(wx, wy, 10, 10);
          }
        }
        backCtx.fillStyle = "#3955b8";
      }
      const midBuildingsCanvas = this.textures.createCanvas("mid-buildings", 640, 240);
      const midCtx = midBuildingsCanvas.getContext();
      midCtx.clearRect(0, 0, 640, 240);
      midCtx.fillStyle = "#1f2560";
      for (let i = 0; i < 8; i++) {
        const width = Phaser.Math.Between(80, 140);
        const height = Phaser.Math.Between(120, 240);
        const x = i * 80;
        midCtx.fillRect(x, 240 - height, width, height);
        midCtx.fillStyle = "#5b9ddb";
        for (let wx = x + 16; wx < x + width - 16; wx += 24) {
          for (let wy = 240 - height + 30; wy < 230; wy += 40) {
            midCtx.fillRect(wx, wy, 12, 16);
          }
        }
        midCtx.fillStyle = "#1f2560";
      }
      const frontBuildingsCanvas = this.textures.createCanvas("front-buildings", 640, 280);
      const frontCtx = frontBuildingsCanvas.getContext();
      frontCtx.clearRect(0, 0, 640, 280);
      frontCtx.fillStyle = "#131318";
      for (let i = 0; i < 6; i++) {
        const width = Phaser.Math.Between(100, 180);
        const height = Phaser.Math.Between(180, 280);
        const x = i * 120;
        frontCtx.fillRect(x, 280 - height, width, height);
        frontCtx.fillStyle = "#8952e0";
        for (let wx = x + 20; wx < x + width - 20; wx += 30) {
          for (let wy = 280 - height + 40; wy < 270; wy += 50) {
            frontCtx.fillRect(wx, wy, 16, 20);
          }
        }
        frontCtx.fillStyle = "#131318";
      }
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