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

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
const app = new PIXI.Application({width: WIDTH * SCALE, height: HEIGHT * SCALE, antialias: false});
app.renderer.backgroundColor = 0x353A4A
document.body.appendChild(app.view);

const gpu = new GPU()

let ants = []

for(let i = 0; i < POPULATION; i++) {
  ants.push({
      x: WIDTH / 2,
      y: HEIGHT / 2,
      angle: Math.random() * 2 * Math.PI,
      find : 'food',
      fermoneD : HOMEF,
      fermoneF : FOODF,
      fermoneIntensity : 1//ANT_FERMONE_STRENGTH * Math.random(),
  })
}

function setUp() {
  initEventListeners()
  initPixiTexture()    


  draw()
}

function draw() {
  clearAnts()
  const a = updateAnts(
    ants.map( ({x, y, angle, find}) => {
      const f = find === 'food' ? 1 : 0
      return [x, y, angle, f]
    }), FOODF, HOMEF, GROUND)
  // console.log(ants, a)
  for (let i = 0; i < ants.length; i++) {
    const ant = ants[i];
    const [dx, dy, na] = a[i]
    ant.x += dx
    ant.y += dy
    ant.angle = na
  }

  drawAnts()
  updateFermones()
  drawGround(GROUND)

  requestAnimationFrame(draw)
}


function initEventListeners() {
  const canvas = document.getElementsByTagName("canvas")[0]

  canvas.onmousedown = () => mouseIsDown = true
  canvas.onmouseup = () => mouseIsDown = false
  canvas.onmousemove  = e => {
    if (!mouseIsDown) return
    const mx = Math.ceil(e.offsetX / SCALE)
    const my = Math.ceil(e.offsetY / SCALE)
    const r = 5

    for(let y = my - r; y < my + r; y++) {
      for(let x = mx - r; x < mx + r; x++) {
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

function initPixiTexture() {
  const textureArr = createTextureArray()
  const baseTexture = new PIXI.BaseTexture(new PIXI.resources.BufferResource(textureArr, {width: WIDTH, height:HEIGHT}));
  const texture = new PIXI.Texture(baseTexture);
  background = new PIXI.Sprite(texture)
  background.width = WIDTH * SCALE
  background.height = HEIGHT * SCALE
  app.stage.addChild(background)

}

function createTextureArray() {
  const textureArr = new Uint8ClampedArray(HEIGHT * WIDTH * 4);

  for(var i = 0; i < HEIGHT; i++){
    let constant1 = i * WIDTH

    for(var j = 0; j < WIDTH; j++){
      let r = 0, g = 0, b = 0, a = 0

      if (GROUND[i][j] === 1) {
        r = 231
        g = 227
        b = 224
        a = 255
      }

      if (GROUND[i][j] === 2) {
        r = 78
        g = 131
        b = 151
        a = 255
      }
      
      if (GROUND[i][j] === 3) {
        r = 0
        g = 194
        b = 168
        a = 255
      }

      if (GROUND[i][j] === 0) {
        if (FOODF[i][j] > 0 && renderPaths) {
          r = 132
          g = 94
          b = 194
          a = FOODF[i][j] * 255
        }
  
        if (HOMEF[i][j] > 0 && renderPaths && (HOMEF[i][j] / ANT_FERMONE_STRENGTH) * 255 > a) {
          r = 195
          g = 74
          b = 54
          a = HOMEF[i][j] * 255
        }
      }

      let constant2 = 4 * (constant1 + j)

      for (var k = 0; k < 4; k++) {
        const c = k === 0 ? r : (k === 1 ? g : (k === 2 ? b : a))
        textureArr[constant2 + k] = c
      }
    }
  }

  return textureArr
}

function drawGround() {
  const textureArr = createTextureArray(GROUND)
  const baseTexture = new PIXI.BaseTexture(new PIXI.resources.BufferResource(textureArr, {width: WIDTH, height:HEIGHT}));
  const texture = new PIXI.Texture(baseTexture);

  background.texture = texture
}

function updateFermones() {
  for(let y = 0; y < HEIGHT; y++) {
    for(let x = 0; x < WIDTH; x++) {
      FOODF[y][x] = FOODF[y][x] > 0 ? FOODF[y][x] - GROUND_FERMONE_DECAY : 0
      HOMEF[y][x] = HOMEF[y][x] > 0 ? HOMEF[y][x] - GROUND_FERMONE_DECAY : 0
    }
  }
}

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

function clearAnts() {
  for (const ant of ants) {
    const {fermoneD, fermoneIntensity} = ant
    const x = Math.trunc(ant.x)
    const y = Math.trunc(ant.y)

    if (GROUND[y] === undefined) continue
    if (GROUND[y][x] === undefined) continue
    const ground = GROUND[y][x]

    if (ground === 3) {
      GROUND[y][x] = 0
      fermoneD[y][x] = fermoneD[y][x] > fermoneIntensity ? fermoneD[y][x] : fermoneIntensity
    }

    if (ground === 2 && ant.find === 'food') {
      ant.find = 'home'
      GROUND[y][x] = 0
      ant.fermoneD = FOODF
      ant.fermoneF = HOMEF
      ant.fermoneIntensity += ANT_FERMONE_STRENGTH
      ant.angle += Math.PI
    }
    if (ground === 1 && ant.find === 'home') {
      ant.find = 'food'
      ant.fermoneD = HOMEF
      ant.fermoneF = FOODF
      ant.fermoneIntensity += ANT_FERMONE_STRENGTH
      ant.angle += Math.PI
    }

    ant.fermoneIntensity -= ANT_FERMONE_STRENGTH_DECAY
    if (ant.fermoneIntensity < 0) ant.fermoneIntensity = 0
  }
}

const updateAnts = gpu.createKernel(function (ants, FOODF, HOMEF, GROUND) {
  const {WIDTH, HEIGHT} = this.constants
  let [x, y, angle, find] = ants[this.thread.x]

  if (x + 1 >= WIDTH
    || x - 1 <= 0
    || y + 1 >= HEIGHT
    || y - 1 <= 0) {
      angle += Math.PI
      return [Math.cos(angle), Math.sin(angle), angle]
    }

    const pov = Math.PI / 2
    const distance = 8
    const detail = (pov / 20)
    let sensorLength = Math.trunc(distance * (pov / detail))

    let dAngle = 0.0
    let sensors = 0
    for (let v = 1; v < distance + 1; v += 1) {
      for (let a = -pov / 2; a <= pov / 2; a += detail) {
        const fx = Math.trunc(x + (v * Math.cos(angle + a)))
        const fy = Math.trunc(y + (v * Math.sin(angle + a)))

        const ground = GROUND[fy][fx]

        let fermone = find === 1 ? FOODF[fy][fx] : HOMEF[fy][fx]
        if (find === 1 && ground === 2) fermone = 1.25
        if (find === 0 && ground === 1 ) fermone = 1.25

        dAngle += a * fermone * 0.8
        sensors++
      }
    }
    const randomAngle = (Math.random() * (Math.PI / 6) - Math.PI / 12)

    angle += (dAngle / ((sensors | 1))) + randomAngle

  return [Math.cos(angle), Math.sin(angle), angle]
},{ 
constants: {WIDTH, HEIGHT},
output: [POPULATION],
})

setUp()