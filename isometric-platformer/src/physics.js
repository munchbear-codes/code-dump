import { GameConfig } from './config.js';

export class PhysicsEngine {
    constructor(levelManager, onGoalReached) {
        this.level = levelManager;
        this.onGoalReached = onGoalReached;
    }

    updateObject(object, input) {
        this.level.updateMovingBlocks();

        if (input.isMovingRight()) object.vx += GameConfig.MOVE_SPEED;
        if (input.isMovingLeft()) object.vx -= GameConfig.MOVE_SPEED;

        if (input.isJumping() && object.grounded) {
            object.vy = GameConfig.JUMP_FORCE;
            object.grounded = false;
        }

        object.vx *= GameConfig.FRICTION;
        object.x += object.vx * 0.1;
        this.checkCollisions(object, true);

        object.vy += GameConfig.GRAVITY;
        object.y += object.vy * 0.1;
        object.grounded = false;
        this.checkCollisions(object, false);
        this.handleMovingBlockSupport(object);
    }

    checkCollisions(object, isXAxis) {
        const r1 = Math.floor(object.y);
        const r2 = Math.floor(object.y + object.h - 0.01);
        const c1 = Math.floor(object.x);
        const c2 = Math.floor(object.x + object.w - 0.01);

        for (let r = r1; r <= r2; r++) {
            for (let c = c1; c <= c2; c++) {
                const tile = this.level.getTile(c, r);
                const isSolid = this.level.isSolidAt(c, r);

                if (tile === GameConfig.TILES.GOAL) {
                    if (object.x < c + 1 && object.x + object.w > c && object.y < r + 1 && object.y + object.h > r) {
                        this.onGoalReached();
                    }
                }

                if (!isSolid) {
                    continue;
                }

                if (isXAxis) {
                    if (object.vx > 0) {
                        object.x = c - object.w - 0.001;
                    } else if (object.vx < 0) {
                        object.x = c + 1.001;
                    }
                    object.vx = 0;
                } else {
                    if (object.vy > 0) {
                        object.y = r - object.h - 0.001;
                        object.grounded = true;
                        object.vy = 0;
                    } else if (object.vy < 0) {
                        object.y = r + 1.001;
                        object.vy = 0;
                    }
                }
            }
        }
    }

    handleMovingBlockSupport(object) {
        for (const block of this.level.movingBlocks) {
            const playerLeft = object.x;
            const playerRight = object.x + object.w;
            const blockLeft = block.c;
            const blockRight = block.c + 1;
            const playerBottom = object.y + object.h;
            const blockTop = block.r;

            const onBlock = playerRight > blockLeft && playerLeft < blockRight && playerBottom >= blockTop && playerBottom <= blockTop + 0.2 && object.vy >= 0;
            if (!onBlock) {
                continue;
            }

            object.y = block.r - object.h;
            object.grounded = true;
            object.vy = 0;

            const dx = block.c - block.lastC;
            const dy = block.r - block.lastR;
            object.x += dx;
            object.y += dy;
            break;
        }
    }
}
