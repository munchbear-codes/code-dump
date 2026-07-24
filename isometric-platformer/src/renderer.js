import { GameConfig } from './config.js';

export class RenderEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawIsoCube(c, r, tileType, camera, level) {
        const x = (c * GameConfig.TILE_SIZE) - camera.x;
        const y = (r * GameConfig.TILE_SIZE) - camera.y;
        const frontX = x;
        const frontY = y - GameConfig.ISO_DEPTH;
        const size = GameConfig.TILE_SIZE;
        const depth = GameConfig.ISO_DEPTH;

        this.ctx.strokeStyle = '#3e2723';

        // 1. Top Face
        if (!level.hasSolidBlockAbove(c, r)) {
            this.ctx.fillStyle = tileType === GameConfig.TILES.GOAL ? '#27ae60' : '#8d6e63';
            this.ctx.beginPath();
            this.ctx.moveTo(frontX, frontY);
            this.ctx.lineTo(frontX + size, frontY);
            this.ctx.lineTo(frontX + size + depth, frontY - depth);
            this.ctx.lineTo(frontX + depth, frontY - depth);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        }

        // 2. Right Face
        if (!level.hasSolidBlockRight(c, r)) {
            this.ctx.fillStyle = tileType === GameConfig.TILES.GOAL ? '#1e8449' : '#5d4037';
            this.ctx.beginPath();
            this.ctx.moveTo(frontX + size, frontY);
            this.ctx.lineTo(frontX + size + depth, frontY - depth);
            this.ctx.lineTo(frontX + size + depth, frontY + size - depth);
            this.ctx.lineTo(frontX + size, frontY + size);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        }

        // 3. Front Face
        this.ctx.fillStyle = tileType === GameConfig.TILES.GOAL ? '#2ecc71' : '#d7ccc8';
        this.ctx.fillRect(frontX, frontY, size, size);
        this.ctx.strokeRect(frontX, frontY, size, size);

        if (tileType === GameConfig.TILES.GOAL) {
            this.ctx.fillStyle = '#f1c40f';
            this.ctx.fillRect(frontX + 30, frontY + 10, 4, 20);
            this.ctx.beginPath();
            this.ctx.moveTo(frontX + 34, frontY + 10);
            this.ctx.lineTo(frontX + 50, frontY + 20);
            this.ctx.lineTo(frontX + 34, frontY + 30);
            this.ctx.fill();
        }
    }

    drawPlayer(player, camera) {
        const px = (player.x * GameConfig.TILE_SIZE) - camera.x;
        const py = (player.y * GameConfig.TILE_SIZE) - camera.y;
        const drawPy = py - GameConfig.ISO_DEPTH;
        const size = GameConfig.TILE_SIZE;

        const pW = size * player.w;
        const pH = size * player.h;
        const pX = px + (size - pW) / 2;
        const pY = drawPy + (size - pH);

        const shouldDrawPlayer = player.invincibilityFrames <= 0 || Math.floor(player.invincibilityFrames / 6) % 2 !== 0;
        if (!shouldDrawPlayer) {
            return;
        }

        const bob = player.grounded && !player.crouching ? Math.sin(Date.now() / 260) * 3 : 0;
        const squatOffset = player.crouching ? 8 : 0;
        const squatScale = player.crouching ? 0.8 : 1;

        this.ctx.fillStyle = 'rgba(0,0,0,0.3)';
        this.ctx.beginPath();
        this.ctx.ellipse(px + size / 2, drawPy + size - 2, 16 + (player.crouching ? 2 : 0), 7, 0, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.save();
        this.ctx.translate(pX + pW / 2, pY + pH / 2 + bob + squatOffset);
        if (player.facing < 0) {
            this.ctx.scale(-1, 1);
        }
        if (player.crouching) {
            this.ctx.scale(1, squatScale);
        }

        this.ctx.fillStyle = '#ff7f50';
        this.ctx.strokeStyle = '#2b1b12';
        this.ctx.lineWidth = 3;

        this.ctx.beginPath();
        this.ctx.roundRect(-18, -18, 36, 42, 10);
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = '#d4a373';
        this.ctx.beginPath();
        this.ctx.arc(0, -42, 18, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = '#7b3f00';
        this.ctx.beginPath();
        this.ctx.arc(0, -42, 11, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(6, -42, 4, 0, Math.PI * 2);
        this.ctx.arc(-6, -42, 4, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#1f1f1f';
        this.ctx.beginPath();
        this.ctx.arc(6, -42, 2, 0, Math.PI * 2);
        this.ctx.arc(-6, -42, 2, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#ff7f50';
        this.ctx.fillRect(-22, -6, 10, 6);
        this.ctx.fillRect(12, -6, 10, 6);

        this.ctx.fillStyle = '#5d4037';
        this.ctx.fillRect(-10, 12, 8, 20);
        this.ctx.fillRect(2, 12, 8, 20);

        this.ctx.fillRect(-10, 30, 8, 6);
        this.ctx.fillRect(2, 30, 8, 6);

        this.ctx.restore();
    }
}
