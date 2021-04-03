import { SCALE, CANVAS, POPULATION, FOODF, HOMEF, GROUND, GROUND_FERMONE_DECAY, ANT_FERMONE_STRENGTH } from './Consts.js'
import Ant from './Ant.js'

// const ant = new Ant(CANVAS.width / 2, CANVAS.height / 2) 
const ants = []
let renderPaths = true

let mouseIsDown = false

for(let i = 0; i < POPULATION; i++) {
  ants.push(new Ant(CANVAS.width / 2, CANVAS.height / 2) )
}

function setUp() {
  CANVAS.loop(draw)
  CANVAS.canvasElement.onmousedown = () => mouseIsDown = true
  CANVAS.canvasElement.onmouseup = () => mouseIsDown = false

  CANVAS.canvasElement.onmousemove  = e => {
    if (!mouseIsDown) return
    const mx = Math.ceil(e.offsetX / SCALE)
    const my = Math.ceil(e.offsetY / SCALE)
    const r = 3

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

function draw() {
  CANVAS.setColor('#000')
  CANVAS.drawBackground()

  updateFermones()
  for(const ant of ants) {
    ant.draw()
    ant.do()
  }
}

function updateFermones() {
  for(let y = 0; y < CANVAS.height / SCALE; y++) {
    for(let x = 0; x < CANVAS.width / SCALE; x++) {
      if (GROUND[y][x] === 1) {
        CANVAS.setColor(`rgb(255, 255, 255`)
        CANVAS.drawRectangle(x * SCALE, y * SCALE, SCALE, SCALE)
        continue
      }
      
      if (GROUND[y][x] === 2) {
        CANVAS.setColor(`rgb(0, 255, 0)`)
        CANVAS.drawRectangle(x * SCALE, y * SCALE, SCALE, SCALE)
        continue
      }

      if (FOODF[y][x] > 0 && renderPaths) {
        // CANVAS.setColor(`hsl(${360 * (FOODF[y][x] / (ANT_FERMONE_STRENGTH))}, 100%, 50%, ${FOODF[y][x] / (ANT_FERMONE_STRENGTH)})`)
        CANVAS.setColor(`rgba(255, 0, 255, ${FOODF[y][x] / ANT_FERMONE_STRENGTH})`)
        CANVAS.drawRectangle(x * SCALE, y * SCALE, SCALE, SCALE)
      }

      if (HOMEF[y][x] > 0 && renderPaths) {
        // CANVAS.setColor(`hsla(${360 * (HOMEF[y][x] / (ANT_FERMONE_STRENGTH))}, 100%, 50%, ${HOMEF[y][x] / (ANT_FERMONE_STRENGTH)})`)
        CANVAS.setColor(`rgba(255, 255, 0, ${HOMEF[y][x] / ANT_FERMONE_STRENGTH})`)
        CANVAS.drawRectangle(x * SCALE, y * SCALE, SCALE, SCALE)
      }

      FOODF[y][x] = FOODF[y][x] > 0 ? FOODF[y][x] - GROUND_FERMONE_DECAY : 0
      HOMEF[y][x] = HOMEF[y][x] > 0 ? HOMEF[y][x] - GROUND_FERMONE_DECAY : 0
    }
  }
}

function drawGrid() {
  CANVAS.setStrokeColor('#FFF')
  CANVAS.setStrokeWeight(2)
  for(let y = 0; y < FERMONES.length; y++) {
      CANVAS.drawLine(0, y * SCALE, CANVAS.width, y * SCALE)
  }

  for(let x = 0; x < FERMONES[0].length; x++) {
    CANVAS.drawLine(x * SCALE, 0, x * SCALE, CANVAS.height)
  }
}

setUp()
