import { SCALE, CANVAS, FERMONES, POPULATION, FOODF, HOMEF, Food } from './Consts.js'
import Ant from './Ant.js'

// const ant = new Ant(CANVAS.width / 2, CANVAS.height / 2) 
const ants = []

for(let i = 0; i < POPULATION; i++) {
  ants.push(new Ant(CANVAS.width / 2, CANVAS.height / 2) )
}

function setUp() {
  CANVAS.loop(draw)
}

function draw() {
  CANVAS.setColor('#000')
  CANVAS.drawBackground()

  
  // for (let i = 0; i < 10; i++) {
  updateFermones()
  // drawGrid()
  

  for(const ant of ants) {
    ant.draw()
    ant.do()
  // }
  }



  // CANVAS.setColor('#0F0')
  // CANVAS.drawCircle(CANVAS.width / 2, CANVAS.height / 2, SCALE) 
}

function updateFermones() {
  for(let y = 0; y < CANVAS.height / SCALE; y++) {
    for(let x = 0; x < CANVAS.width / SCALE; x++) {

      

    //   if (FERMONES[y][x] > 0 && FERMONES[y][x] <= 1) {
    //     CANVAS.setColor(`rgba(255, 255, 0, ${FERMONES[y][x]})`)
    //     CANVAS.drawRectangle(x * SCALE, y * SCALE, SCALE, SCALE)
    //   }

    //   if (FERMONES[y][x] > 1 && FERMONES[y][x] <= 2) {
    //     CANVAS.setColor(`rgba(255, 0, 255, ${FERMONES[y][x] - 1})`)
    //     CANVAS.drawRectangle(x * SCALE, y * SCALE, SCALE, SCALE)
    //   }
      
    //   if (FERMONES[y][x] === 3) {
    //     CANVAS.setColor(`rgba(0, 255, 0, ${FERMONES[y][x]})`)
    //     CANVAS.drawRectangle(x * SCALE, y * SCALE, SCALE, SCALE)
    //   }

    //   if (FERMONES[y][x] === 4) {
    //     CANVAS.setColor(`rgba(255, 255, 255, ${FERMONES[y][x]})`)
    //     CANVAS.drawRectangle(x * SCALE, y * SCALE, SCALE, SCALE)
    //   }

    //   if (FERMONES[y][x] === 3 || FERMONES[y][x] === 4) continue
    //   if (FERMONES[y][x] > 1) {
    //     FERMONES[y][x] -= 0.001
    //     FERMONES[y][x] = FERMONES[y][x] <= 1 ? 0 : FERMONES[y][x]
    //     continue
    //   }

    //   FERMONES[y][x] = FERMONES[y][x] > 0 ? FERMONES[y][x] - 0.003 : 0
    // }
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
