const CONSTRUCTION_TYPES = require('../constants/ConstructionTypes');

module.exports = class TurretModel {
    constructor(type = CONSTRUCTION_TYPES.BASIC_TURRET, health = 10, firingRate = 10) {
        this.type = type;
        this.health = health;
        this.firingRate = firingRate;
    }
};
