import { GameConfig } from './config.js';

export class LevelManager {
    constructor(matrix) {
        this.matrix = matrix;
        this.height = matrix.length;
        this.width = matrix[0].length;
    }

    getTile(c, r) {
        if (r < 0 || r >= this.height || c < 0 || c >= this.width) {
            return GameConfig.TILES.WALL; 
        }
        return this.matrix[r][c];
    }

    hasSolidBlockAbove(c, r) {
        return r > 0 && this.getTile(c, r - 1) !== GameConfig.TILES.AIR;
    }

    hasSolidBlockRight(c, r) {
        return c < this.width - 1 && this.getTile(c + 1, r) !== GameConfig.TILES.AIR;
    }
}
