import { Canvas } from './lib/lib.js'

export const SCALE = 2
export const WIDTH = SCALE * (Math.floor(900 / SCALE))
export const HEIHGT = SCALE * (Math.floor(550 / SCALE))
export const CANVAS = new Canvas(WIDTH, HEIHGT)
export const POPULATION = 400

export const ANT_SPEED = SCALE
export const GROUND_FERMONE_DECAY = 1 / CANVAS.fps
export const ANT_FERMONE_STRENGTH_DECAY = 1 / CANVAS.fps
export const ANT_FERMONE_STRENGTH = (CANVAS.width / ANT_SPEED) * ANT_FERMONE_STRENGTH_DECAY
export const ANT_BONUS_STRENGTH_FERMONE = ANT_FERMONE_STRENGTH

export const FOODF = []
export const HOMEF = []
export const GROUND = []

for(let y = 0; y < CANVAS.height / SCALE; y++) {
  if (!FOODF[y]) FOODF[y] = []
  if (!HOMEF[y]) HOMEF[y] = []
  if (!GROUND[y]) GROUND[y] = []

  for(let x = 0; x < CANVAS.width / SCALE; x++) {
    FOODF[y][x] = 0
    HOMEF[y][x] = 0
    GROUND[y][x]  = 0

    if (x > 0 && x < 15 && y > 10 && y < 70) GROUND[y][x] = 2
    if (x > (WIDTH / SCALE - 20) && x < WIDTH / SCALE - 1 && y > (20) && y < 90) GROUND[y][x] = 2
    if (x > Math.floor(WIDTH / SCALE / 2) - 5 
    && x < Math.floor(WIDTH / SCALE / 2)  + 5
    && y > Math.floor(HEIHGT / SCALE / 2) - 5 
    && y < Math.floor(HEIHGT / SCALE/ 2)  + 5) GROUND[y][x] = 1
    
  }
}
