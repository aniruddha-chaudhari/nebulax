// Import Phaser only on the client side
let Phaser;
if (typeof window !== 'undefined') {
  Phaser = require('phaser');
}

export class Player {
  constructor(scene, x, y) {
    try {
      this.scene = scene;
      this.groundY = y;
      
      // Create player sprite
      this.sprite = scene.physics.add.sprite(x, y, "player");
      this.sprite.setOrigin(0.5, 1); // Set origin to bottom center for easy ground alignment
      this.sprite.setCollideWorldBounds(true);
      
      // Set up physics body with better collision box
      this.sprite.body.setSize(12, 28); // Slightly narrower hitbox for better collision detection
      this.sprite.body.setOffset(10, 4); // Center the hitbox on the sprite
      
      // Set up animations
      this.createAnimations();
      
      // Start idle animation
      this.sprite.anims.play("idle", true);
      
      // Player state
      this.isDucking = false;
      this.isJumping = false;
      
      console.log("Player created successfully at", x, y);
    } catch (err) {
      console.error("Error creating player:", err);
      throw err;
    }
  }
  
  jump() {
    try {
      // Only allow jump if player is on the ground
      if (this.sprite.body.touching.down && !this.isJumping) {
        // Apply upward velocity
        this.sprite.setVelocityY(-500);
        this.isJumping = true;
        
        // Play jump animation
        this.sprite.setTexture("player-jump");
        
        // Reset to standing position after jump
        this.scene.time.delayedCall(500, () => {
          if (this.isJumping) {
            this.sprite.setTexture("player");
          }
        });
      }
    } catch (err) {
      console.error("Error during jump:", err);
    }
  }
  
  duck() {
    try {
      // Only duck if not already ducking and on the ground
      if (!this.isDucking && this.sprite.body.touching.down) {
        this.isDucking = true;
        
        // Change to ducking sprite
        this.sprite.setTexture("player-duck");
        
        // Update hitbox for duck position - make it shorter but wider
        this.sprite.body.setSize(16, 16);
        this.sprite.body.setOffset(8, 16);
        
        // Stand up after a short time
        this.scene.time.delayedCall(500, () => {
          if (this.isDucking) {
            this.standUp();
          }
        });
      }
    } catch (err) {
      console.error("Error during duck:", err);
    }
  }
  
  standUp() {
    try {
      if (this.isDucking) {
        this.isDucking = false;
        
        // Change back to standing sprite
        this.sprite.setTexture("player");
        
        // Reset hitbox to standing size
        this.sprite.body.setSize(12, 28);
        this.sprite.body.setOffset(10, 4);
      }
    } catch (err) {
      console.error("Error during stand up:", err);
    }
  }
  
  update() {
    try {
      // Check if player has landed after jumping
      if (this.isJumping && this.sprite.body.touching.down) {
        this.isJumping = false;
        
        // Return to standing position if not ducking
        if (!this.isDucking) {
          this.sprite.setTexture("player");
        }
      }
      
      // Move player with ground (keep x position constant)
      this.sprite.setX(100);
    } catch (err) {
      console.error("Error in player update:", err);
    }
  }
  
  updateGroundY(newY) {
    try {
      this.groundY = newY;
      
      // Only update y position if on the ground
      if (this.sprite.body.touching.down) {
        this.sprite.setY(this.groundY);
      }
    } catch (err) {
      console.error("Error updating ground Y:", err);
    }
  }
  
  createAnimations() {
    try {
      // For now, we're using static sprites for different states instead of animations
      // We'll create placeholder animations to support future expansion
      
      this.scene.anims.create({
        key: "idle",
        frames: [{ key: "player", frame: 0 }],
        frameRate: 1,
        repeat: -1
      });
      
      this.scene.anims.create({
        key: "duck",
        frames: [{ key: "player-duck", frame: 0 }],
        frameRate: 1,
        repeat: 0
      });
      
      this.scene.anims.create({
        key: "jump",
        frames: [{ key: "player-jump", frame: 0 }],
        frameRate: 1,
        repeat: 0
      });
    } catch (err) {
      console.error("Error creating animations:", err);
    }
  }
}