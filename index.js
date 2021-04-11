import { 
  SCALE, 
  WIDTH, 
  HEIGHT, 
  POPULATION, 
  FOODF, 
  HOMEF, 
  GROUND, 
  GROUND_FERMONE_DECAY, 
  ANT_FERMONE_STRENGTH, 
  ANT_FERMONE_STRENGTH_DECAY} from './Consts.js'

let background
let renderPaths = true
let mouseIsDown = false

// Initializes Canvas
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
const app = new PIXI.Application({width: WIDTH * SCALE, height: HEIGHT * SCALE, antialias: false});
app.renderer.backgroundColor = 0x353A4A
document.body.appendChild(app.view);

const gpu = new GPU()

// Initializes ants
let ants = []
for(let i = 0; i < POPULATION; i++) {
  ants.push({
      x: WIDTH / 2,
      y: HEIGHT / 2,
      angle: Math.random() * 2 * Math.PI,
      find : 'food',
      fermoneD : HOMEF,
      fermoneF : FOODF,
      fermoneIntensity : 1
  })
}

function setUp() {
  initEventListeners()
  initPixiTexture()    


  draw()
}

function draw() {
  // Clears ants from GROUND array and drops fermones
  clearAnts()

  // Gets the velocity of each ant
  const a = updateAnts(
    ants.map( ({x, y, angle, find}) => {
      const f = find === 'food' ? 1 : 0
      return [x, y, angle, f]
    }), FOODF, HOMEF, GROUND)
  
  // Adds velocity to the position
  for (let i = 0; i < ants.length; i++) {
    const ant = ants[i];
    const [dx, dy, na] = a[i]
    ant.x += dx
    ant.y += dy
    ant.angle = na
  }

  // Adds ants to Ground Array
  drawAnts()

// Reduces all fermones on the GROUND array
updateFermones()

  // Draws the Map
  drawGround(GROUND)

  requestAnimationFrame(draw)
}

// Adding food on click and space bar clear
function initEventListeners() {
  const canvas = document.getElementsByTagName("canvas")[0]
  const radius = 20

  canvas.onmousedown = e => {
    mouseIsDown = true
    const mx = Math.ceil(e.offsetX / SCALE)
    const my = Math.ceil(e.offsetY / SCALE)
    for(let r = 0; r < radius; r++) {
      for(let a = 0; a < Math.PI * 2; a += 0.01) {
        const x = Math.trunc(r * Math.cos(a) + mx)
        const y = Math.trunc(r * Math.sin(a) + my)

        if (GROUND[y] === undefined) continue
        if (GROUND[y][x] === undefined || GROUND[y][x] === 1 || GROUND[y][x] === 2) continue
        GROUND[y][x] = 2
      }
    }
  }
  canvas.onmouseup = () => mouseIsDown = false
  canvas.onmousemove  = e => {
    if (!mouseIsDown) return
    const mx = Math.ceil(e.offsetX / SCALE)
    const my = Math.ceil(e.offsetY / SCALE)

  // SQUARE
  //   for(let y = my - radius; y < my + radius; y++) {
  //     for(let x = mx - radius; x < mx + radius; x++) {
  //       if (GROUND[y] === undefined) continue
  //       if (GROUND[y][x] === undefined || GROUND[y][x] === 1) continue
  //       GROUND[y][x] = 2
  //     }
  //   }
  // }

  // CIRCLE
    for(let r = 0; r < radius; r++) {
      for(let a = 0; a < Math.PI * 2; a += Math.PI * 2 / 360) {
        const x = Math.trunc(r * Math.cos(a) + mx)
        const y = Math.trunc(r * Math.sin(a) + my)

        if (GROUND[y] === undefined) continue
        if (GROUND[y][x] === undefined || GROUND[y][x] === 1) continue
        GROUND[y][x] = 2
      }
    }
  }

  document.body.onkeyup = e => {
    if(e.key == ' '){
      renderPaths = !renderPaths
    }
  }
}

// Creates texture for the canvas
function initPixiTexture() {
  const textureArr = createTextureArray()
  const baseTexture = new PIXI.BaseTexture(new PIXI.resources.BufferResource(textureArr, {width: WIDTH, height:HEIGHT}));
  const texture = new PIXI.Texture(baseTexture);
  background = new PIXI.Sprite(texture)
  background.width = WIDTH * SCALE
  background.height = HEIGHT * SCALE
  app.stage.addChild(background)

}

// Creates the array that is turned to texture
function createTextureArray() {
  const textureArr = new Uint8ClampedArray(HEIGHT * WIDTH * 4);

  for(var i = 0; i < HEIGHT; i++){
    let constant1 = i * WIDTH

    for(var j = 0; j < WIDTH; j++){
      let r = 0, g = 0, b = 0, a = 0
      const ground = GROUND[i][j]

      if (ground === 1) {
        r = 231
        g = 227
        b = 224
        a = 255
      }

      if (ground === 2) {
        r = 78
        g = 131
        b = 151
        a = 255
      }
      
      if (ground === 3) {
        r = 0
        g = 194
        b = 168
        a = 255
      }

      if (ground === 0) {
        const food = FOODF[i][j]
        if (food > 0 && renderPaths) {
          r = 59
          g = 101
          b = 206
          a = food * 255
        }
  
        const home = HOMEF[i][j] 
        if (home > 0 && renderPaths && home * 255 > a) {
          r = 195
          g = 74
          b = 54
          a = home * 255
        }
      }

      let constant2 = 4 * (constant1 + j)

      textureArr[constant2] = r
      textureArr[constant2 + 1] = g
      textureArr[constant2 + 2] = b
      textureArr[constant2 + 3] = a
    }
  }

  return textureArr
}

// Sends texture to canvas and draws it
function drawGround() {
  const textureArr = createTextureArray(GROUND)
  const baseTexture = new PIXI.BaseTexture(new PIXI.resources.BufferResource(textureArr, {width: WIDTH, height:HEIGHT}));
  const texture = new PIXI.Texture(baseTexture);

  background.texture = texture
}

// Reduces all fermone strength
function updateFermones() {
  for(let y = 0; y < HEIGHT; y++) {
    for(let x = 0; x < WIDTH; x++) {
      FOODF[y][x] = FOODF[y][x] > 0 ? FOODF[y][x] - GROUND_FERMONE_DECAY : 0
      HOMEF[y][x] = HOMEF[y][x] > 0 ? HOMEF[y][x] - GROUND_FERMONE_DECAY : 0
    }
  }
}

// Draw the ants on the texture by setting to 3 in the array
function drawAnts() {
  for (const ant of ants) {
    const x = Math.trunc(ant.x)
    const y = Math.trunc(ant.y)
    if (GROUND[y] === undefined) continue
    if (GROUND[y][x] === undefined || y === 0 || x === 0) continue
    const ground = GROUND[y][x]

    if (ground === 0) {
      GROUND[y][x] = 3
    }
  }
}

// Clears ants, drops fermones, picks/drops food
function clearAnts() {
  for (const ant of ants) {
    const {fermoneD, fermoneIntensity} = ant
    const x = Math.trunc(ant.x)
    const y = Math.trunc(ant.y)

    if (GROUND[y] === undefined) continue
    if (GROUND[y][x] === undefined) continue
    const ground = GROUND[y][x]

    //  Clears the ants before moving them, drops fermone
    if (ground === 3) {
      GROUND[y][x] = 0
      fermoneD[y][x] = fermoneD[y][x] > fermoneIntensity ? fermoneD[y][x] : fermoneIntensity
    }

    // Picking up and dropping food, changing fermone it followd
    if (ground === 2 && ant.find === 'food') {
      ant.find = 'home'
      GROUND[y][x] = 0
      ant.fermoneD = FOODF
      ant.fermoneF = HOMEF
      ant.fermoneIntensity += ant.fermoneIntensity <= 3 ? ANT_FERMONE_STRENGTH : 0
      ant.angle += Math.PI
    }
    if (ground === 1 && ant.find === 'home') {
      ant.find = 'food'
      ant.fermoneD = HOMEF
      ant.fermoneF = FOODF
      ant.fermoneIntensity += ant.fermoneIntensity <= 3 ? ANT_FERMONE_STRENGTH : 0
      ant.angle += Math.PI
    }

    // Reduces the strength of the fermone of the ant
    ant.fermoneIntensity -= ANT_FERMONE_STRENGTH_DECAY
    if (ant.fermoneIntensity < 0) ant.fermoneIntensity = 0
  }
}

// Detects fermones in front of ants, chooses direction
// based on the strength of the fermones
const updateAnts = gpu.createKernel(function (ants, FOODF, HOMEF, GROUND) {
  const {WIDTH, HEIGHT} = this.constants
  let [x, y, angle, find] = ants[this.thread.x]

  // Checks for collisions
  if (x + 1 >= WIDTH
    || x - 1 <= 0
    || y + 1 >= HEIGHT
    || y - 1 <= 0) {
      angle += Math.PI / 2
      return [Math.cos(angle), Math.sin(angle), angle]
    }

    // Creates Sensors, how many, pov
    const pov = Math.PI / 2
    const distance = 8
    const detail = (pov / 20)

    let dAngle = 0.0
    let sensors = 0
    for (let v = 1; v < distance + 1; v += 1) {
      for (let a = -pov / 2; a <= pov / 2; a += detail) {
        const fx = Math.trunc(x + (v * Math.cos(angle + a)))
        const fy = Math.trunc(y + (v * Math.sin(angle + a)))

        const ground = GROUND[fy][fx]

        // If there is food or home, it acts as a fermone
        // of higher strength that the actual fermones
        let fermone = find === 1 ? FOODF[fy][fx] : HOMEF[fy][fx]
        if (find === 1 && ground === 2) fermone  =  fermone > 3 ? fermone : 5
        if (find === 0 && ground === 1 ) fermone = fermone > 3 ? fermone : 5

        dAngle += a * fermone
        sensors++
      }
    }
    // Random angle added to the ant
    const randomAngle = (Math.random() * (Math.PI / 6) - Math.PI / 12)

    // Addes the average of the sensors and the random angle
    angle += (dAngle / ((sensors | 1))) + randomAngle

  return [Math.cos(angle), Math.sin(angle), angle]
},{ 
constants: {WIDTH, HEIGHT},
output: [POPULATION],
})

setUp()