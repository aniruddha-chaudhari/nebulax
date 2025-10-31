import * as Phaser from 'phaser';

export class Player {
  constructor(scene, x, y) {
    try {
      this.scene = scene;
      this.groundY = y;
      
      this.sprite = scene.physics.add.sprite(x, y, "player");
      this.sprite.setOrigin(0.5, 1);
      this.sprite.setCollideWorldBounds(true);
      
      const minScale = 0.3;
      const maxScale = 0.6;
      const screenScale = Math.max(1, scene.scale.height / 600); 
      const playerScale = Math.min(maxScale, Math.max(minScale, minScale * screenScale));
      
      this.sprite.setScale(playerScale);
      this.sprite.body.setSize(this.sprite.width * 0.7, this.sprite.height * 0.9); 
      this.sprite.body.setOffset(this.sprite.width * 0.15, this.sprite.height * 0.1);
      
      this.createAnimations();
      this.sprite.anims.play("idle", true);
      
      this.isDucking = false;
      this.isJumping = false;
      this.jumpStarted = false;
      this.landingCounter = 0;
      this.groundContactFrames = 5;
      
    } catch (err) {
      console.error("Error creating player:", err);
      throw err;
    }
  }
  
  jump() {
    try {
      if (this.sprite.body.touching.down && !this.isJumping) {
        this.sprite.setVelocityY(-500);
        this.isJumping = true;
        this.jumpStarted = true;
        this.sprite.setTexture("player-jump");
      }
    } catch (err) {
      console.error("Error during jump:", err);
    }
  }
  
  duck() {
    try {
      if (!this.isDucking && this.sprite.body.touching.down) {
        this.isDucking = true;
        this.sprite.setTexture("player-duck");
        
        const spriteWidth = this.sprite.width;
        const spriteHeight = this.sprite.height;
        
        this.sprite.body.setSize(spriteWidth * 0.8, spriteHeight * 0.4);
        this.sprite.body.setOffset(spriteWidth * 0.1, spriteHeight * 0.6);
      }
    } catch (err) {
      console.error("Error during duck:", err);
    }
  }
  
  standUp() {
    try {
      if (this.isDucking) {
        this.isDucking = false;
        this.sprite.setTexture("player");
        
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
      this.sprite.setX(100);
      
      if (this.isJumping) {
        console.log(`Y velocity: ${this.sprite.body.velocity.y}`);
      }
      
      const onGround = this.sprite.body.touching.down;
      
      if (this.isJumping) {
        this.sprite.setTexture("player-jump");
        
        if (onGround) {
          this.landingCounter++;
          if (this.landingCounter >= this.groundContactFrames) {
            this.isJumping = false;
            this.jumpStarted = false;
            this.landingCounter = 0;
            
            if (!this.isDucking) {
              this.sprite.setTexture("player");
              
              const spriteWidth = this.sprite.width;
              const spriteHeight = this.sprite.height;
              this.sprite.body.setSize(spriteWidth * 0.7, spriteHeight * 0.9);
              this.sprite.body.setOffset(spriteWidth * 0.15, spriteHeight * 0.1);
            }
          }
        } else {
          this.landingCounter = 0;
        }
      } else if (this.isDucking) {
        this.sprite.setTexture("player-duck");
      } else if (!onGround) {
        this.sprite.setTexture("player-jump");
      } else {
        this.sprite.setTexture("player");
      }
    } catch (err) {
      console.error("Error in player update:", err);
    }
  }
  
  updateGroundY(newY) {
    try {
      this.groundY = newY;
      
      if (this.sprite.body.touching.down) {
        this.sprite.setY(this.groundY);
      }
    } catch (err) {
      console.error("Error updating ground Y:", err);
    }
  }
  
  createAnimations() {
    try {
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