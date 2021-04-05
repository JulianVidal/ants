import { SCALE, WIDTH, HEIGHT, POPULATION, FOODF, HOMEF, GROUND, GROUND_FERMONE_DECAY, ANT_FERMONE_STRENGTH } from './Consts.js'
import Ant from './Ant.js'

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
const app = new PIXI.Application({width: WIDTH * SCALE, height: HEIGHT * SCALE, antialias: false});
document.body.appendChild(app.view);

let background

PIXI.Loader.shared.add([
  'fragShader.glsl',
  '500x300.png'
]).load(setUp)


const ants = []
let renderPaths = true
let mouseIsDown = false

for(let i = 0; i < POPULATION; i++) {
  ants.push(new Ant(WIDTH / 2, HEIGHT / 2) )
}

function setUp() {

  var canvas = document.getElementsByTagName("canvas")[0]
  canvas.addEventListener("webglcontextlost", function(event) {
      event.preventDefault();
  }, false);

  canvas.onmousedown = () => mouseIsDown = true
  canvas.onmouseup = () => mouseIsDown = false

  canvas.onmousemove  = e => {
    if (!mouseIsDown) return
    const mx = Math.ceil(e.offsetX / SCALE)
    const my = Math.ceil(e.offsetY / SCALE)
    const r = 8

    for(let y = my - r; y < my + r; y++) {
      for(let x = mx - r; x < mx + r; x++) {
        if (GROUND[y] === undefined) continue
        if (GROUND[y][x] === undefined || GROUND[y][x] === 1) continue
        GROUND[y][x] = 2
      }
    }
  }
    
  const textureArr = createTextureArray()
  console.log(textureArr)

  const baseTexture = new PIXI.BaseTexture(new PIXI.resources.BufferResource(textureArr, {width: WIDTH, height:HEIGHT}));
  const texture = new PIXI.Texture(baseTexture);
  background = new PIXI.Sprite(texture)
  background.width = WIDTH * SCALE
  background.height = HEIGHT * SCALE
  app.stage.addChild(background)

  document.body.onkeyup = e => {
    if(e.key == ' '){
      renderPaths = !renderPaths
    }
  }
  // draw()
  app.ticker.add(draw)
}

function draw() {
  for(const ant of ants) {
    ant.do()
    ant.draw()
  }

  updateFermones()
  
  drawGround()
  // requestAnimationFrame(draw)
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

function createTextureArray() {
  const textureArr = new Uint8ClampedArray(HEIGHT * WIDTH * 4);

  for(var i = 0; i < HEIGHT; i++){
    let constant1 = i * WIDTH

    for(var j = 0; j < WIDTH; j++){
      let r = 0, g = 0, b = 0, a = 0
      if (GROUND[i][j] === 2) {
        r = 0
        g = 255
        b = 0
        a = 255
      }
      if (GROUND[i][j] === 1 || GROUND[i][j] === 3) {
        r = 255
        g = 255
        b = 255
        a = 255
      }
      

      if (GROUND[i][j] !== 3) {
        if (FOODF[i][j] > 0 && renderPaths) {
          r = 255
          g = 0
          b = 255
          a = (FOODF[i][j] / ANT_FERMONE_STRENGTH) * 255
        }
  
        if (HOMEF[i][j] > 0 && renderPaths && (HOMEF[i][j] / ANT_FERMONE_STRENGTH) * 255 > a) {
          r = 255
          g = 255
          b = 0
          a = (HOMEF[i][j] / ANT_FERMONE_STRENGTH) * 255
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