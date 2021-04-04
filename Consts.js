import { Canvas } from './lib/lib.js'

export const SCALE = 5
export const WIDTH = (Math.floor(900 / SCALE))
export const HEIGHT = (Math.floor(500 / SCALE))
// export const CANVAS = new Canvas(WIDTH, HEIGHT)
<<<<<<< Updated upstream
export const POPULATION = 200

export const ANT_SPEED = 1
export const GROUND_FERMONE_DECAY = 1 / 60
export const ANT_FERMONE_STRENGTH_DECAY = 1 / 60
export const ANT_FERMONE_STRENGTH = (WIDTH / ANT_SPEED) * ANT_FERMONE_STRENGTH_DECAY
=======
export const POPULATION = 500

export const ANT_SPEED = 1
export const GROUND_FERMONE_DECAY = 1 / WIDTH
export const ANT_FERMONE_STRENGTH_DECAY = 1 / WIDTH 
export const ANT_FERMONE_STRENGTH = 1
>>>>>>> Stashed changes
export const ANT_BONUS_STRENGTH_FERMONE = ANT_FERMONE_STRENGTH

export const FOODF = []
export const HOMEF = []
export const GROUND = []

for(let y = 0; y < HEIGHT; y++) {
  if (!FOODF[y]) FOODF[y] = []
  if (!HOMEF[y]) HOMEF[y] = []
  if (!GROUND[y]) GROUND[y] = []

  for(let x = 0; x < WIDTH; x++) {
    FOODF[y][x] = 0
    HOMEF[y][x] = 0
    GROUND[y][x]  = 0

<<<<<<< Updated upstream
    if (x >= 0 && x < 15 && y >= 0 && y < HEIGHT) GROUND[y][x] = 2
    if (x >= (WIDTH - 20) && x <= WIDTH  - 1 && y >= 0 && y < HEIGHT) GROUND[y][x] = 2
=======
    if (x >= 0 && x < 15 && y > 10 && y < 300) GROUND[y][x] = 2
    if (x > (WIDTH - 20) && x <= WIDTH  - 1 && y > (20) && y < 300) GROUND[y][x] = 2
>>>>>>> Stashed changes
    if (x > Math.floor(WIDTH / 2) - 5 
    && x < Math.floor(WIDTH / 2)  + 5
    && y > Math.floor(HEIGHT / 2) - 5 
    && y < Math.floor(HEIGHT / 2)  + 5) GROUND[y][x] = 1
    
  }
}
