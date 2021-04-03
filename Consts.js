import { Canvas } from './lib/lib.js'

export const SCALE = 10
export const WIDTH = SCALE * (Math.floor(600 / SCALE))
export const HEIHGT = SCALE * (Math.floor(550 / SCALE))
export const CANVAS = new Canvas(WIDTH, HEIHGT)
export const POPULATION = 50

export const FOODF = []
export const HOMEF = []
export const FOOD = []

export const FERMONES = []
for(let y = 0; y < CANVAS.height / SCALE; y++) {
  if (!FERMONES[y]) FERMONES[y] = []
  if (!FOODF[y]) FOODF[y] = []
  if (!HOMEF[y]) HOMEF[y] = []
  if (!FOOD[y]) FOOD[y] = []

  for(let x = 0; x < CANVAS.width / SCALE; x++) {
    FERMONES[y][x] = 0
    FOODF[y] = 0
    HOMEF[y] = 0
    FOOD[y]  = 0
  }
}
    // if (x > 5 && x < 15 && y > 10 && y < 75) FERMONES[y][x] = 3
    // if (x > Math.floor(WIDTH / SCALE / 2) - 5 
    // && x < Math.floor(WIDTH / SCALE / 2)  + 5
    // && y > Math.floor(HEIHGT / SCALE / 2) - 5 
    // && y < Math.floor(HEIHGT / SCALE/ 2)  + 5) FERMONES[y][x] = 4