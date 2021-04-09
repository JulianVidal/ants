// CANVAS
export const SCALE = 2
export const WIDTH = (Math.floor(window.innerWidth / SCALE)) + 1
export const HEIGHT = (Math.floor(window.innerHeight / SCALE)) + 1

// ENVIRONMENT
export const GROUND_FERMONE_DECAY = 2 / (WIDTH * 2)


// ANTS
export const POPULATION = 10000
export const ANT_FERMONE_STRENGTH_DECAY = 1.5 / (WIDTH * 2)
export const ANT_FERMONE_STRENGTH = 1

// Initializing Arrays
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

    if (x >= 1 && x < WIDTH / 10 && y >= 1 && y < HEIGHT - 1) GROUND[y][x] = 2
    if (x >= (WIDTH - WIDTH / 10) && x <= WIDTH  - 2 && y >= 1 && y < HEIGHT - 1) GROUND[y][x] = 2
    if (x > Math.floor(WIDTH / 2) - WIDTH / 30
    && x < Math.floor(WIDTH / 2)  + WIDTH / 30
    && y > Math.floor(HEIGHT / 2) - WIDTH / 30 
    && y < Math.floor(HEIGHT / 2)  + WIDTH / 30) GROUND[y][x] = 1
    
  }
}
