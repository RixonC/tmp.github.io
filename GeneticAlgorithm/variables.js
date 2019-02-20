// colours
const squareColour = '#5AA370';
const squareColourR = 90;
const squareColourG = 163;
const squareColourB = 112;

const goalColour = '#B078EA';
const goalColourR = 176;
const goalColourG = 120;
const goalColourB = 234;

const projectileColour = '#EB7F00';
const projectileColourR = 235;
const projectileColourG = 127;
const projectileColourB = 0;

// player
var newDirectionEvery = 64;
var initialPathSize = 4;
var mutationRate = 0.01;
var initialSpawnSize = 64;
var spawnSize = initialSpawnSize;

// speed
var initialEvolutionSpeed = 4;
var initialPlayerStepSize = 0.5;
var initialProjectileSpeed = 2;
var evolutionSpeed = initialEvolutionSpeed;
var initialUniversalSpeedFactor = 0.2;
var universalSpeedFactor = initialUniversalSpeedFactor;