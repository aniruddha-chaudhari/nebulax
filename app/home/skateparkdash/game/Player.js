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
      
      // Calculate scale based on screen height to make player proportional on larger screens
      // but not too small on smaller screens
      const minScale = 0.3;
      const maxScale = 0.6;
      const screenScale = Math.max(1, scene.scale.height / 600); 
      const playerScale = Math.min(maxScale, Math.max(minScale, minScale * screenScale));
      
      // Set appropriate scale for the image sprites based on screen size
      this.sprite.setScale(playerScale);
      
      // Set up physics body with better collision box for image sprites
      this.sprite.body.setSize(this.sprite.width * 0.7, this.sprite.height * 0.9); 
      this.sprite.body.setOffset(this.sprite.width * 0.15, this.sprite.height * 0.1);
      
      // Set up animations
      this.createAnimations();
      
      // Start idle animation
      this.sprite.anims.play("idle", true);
      
      // Player state
      this.isDucking = false;
      this.isJumping = false;
      this.jumpStarted = false;
      this.landingCounter = 0; // Counter to ensure stable ground detection
      this.groundContactFrames = 5; // Need this many frames of ground contact to confirm landing
      
      console.log("Player created successfully at", x, y, "with scale", playerScale);
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
        this.jumpStarted = true; // Flag to track that we've initiated a jump
        
        // Play jump animation
        this.sprite.setTexture("player-jump");
        console.log("Jump started!");
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
        
        // Update hitbox for duck position - make it shorter but wider for the duck image
        const spriteWidth = this.sprite.width;
        const spriteHeight = this.sprite.height;
        
        this.sprite.body.setSize(spriteWidth * 0.8, spriteHeight * 0.6);
        this.sprite.body.setOffset(spriteWidth * 0.1, spriteHeight * 0.4);
        
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
        
        // Reset hitbox to standing size for the normal image
        const spriteWidth = this.sprite.width;
        const spriteHeight = this.sprite.height;
        
        this.sprite.body.setSize(spriteWidth * 0.7, spriteHeight * 0.9);
        this.sprite.body.setOffset(spriteWidth * 0.15, spriteHeight * 0.1);
      }
    } catch (err) {
      console.error("Error during stand up:", err);
    }
  }
  
  update() {
    try {
      // Move player with ground (keep x position constant)
      this.sprite.setX(100);
      
      // Debug Y velocity
      if (this.isJumping) {
        console.log(`Y velocity: ${this.sprite.body.velocity.y}`);
      }
      
      // Check if player is on the ground
      const onGround = this.sprite.body.touching.down;
      
      // Jumping state management with more stable landing detection
      if (this.isJumping) {
        // Always show jump texture while jumping is true
        this.sprite.setTexture("player-jump");
        
        // Check for landing with a counter to avoid flickering
        if (onGround) {
          this.landingCounter++;
          if (this.landingCounter >= this.groundContactFrames) {
            console.log(`Landing confirmed after ${this.landingCounter} frames`);
            this.isJumping = false;
            this.jumpStarted = false;
            this.landingCounter = 0;
            
            // If not ducking, update to standing sprite and hitbox
            if (!this.isDucking) {
              this.sprite.setTexture("player");
              
              // Reset hitbox to standing size
              const spriteWidth = this.sprite.width;
              const spriteHeight = this.sprite.height;
              this.sprite.body.setSize(spriteWidth * 0.7, spriteHeight * 0.9);
              this.sprite.body.setOffset(spriteWidth * 0.15, spriteHeight * 0.1);
            }
          }
        } else {
          // Reset counter if player is not touching ground
          this.landingCounter = 0;
        }
      } else if (this.isDucking) {
        // Player is ducking
        this.sprite.setTexture("player-duck");
      } else if (!onGround) {
        // If we're not on ground and not explicitly jumping (like falling off a platform)
        // Also show jump texture
        this.sprite.setTexture("player-jump");
      } else {
        // Player is in normal state
        this.sprite.setTexture("player");
      }
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