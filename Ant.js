import { Vector } from './lib/lib.js'
import { SCALE, CANVAS, FERMONES } from './Consts.js'

export default class Ant {
  constructor(x, y) {
    this.pos = new Vector(x, y)
    this.angle = Math.random() * 2 * Math.PI

    this.width = 2 * SCALE
    this.height = SCALE

    this.speed = 5
    this.velocity = new Vector(this.speed, 0)
    this.velocity.setAngle(this.angle)

    this.find = 'food'
  }

  draw() {
    const x = this.pos.x - (this.width / 2)
    const y = this.pos.y - (this.height / 2)

    CANVAS.setColor('#FFF')
    CANVAS.rotateCenter(x, y, this.width, this.height, this.angle)
    CANVAS.drawRectangle(x, y, this.width, this.height)
    CANVAS.resetTransform()
  }

  do() {
    this.move()
    this.dropFermone()
    this.checkCollision()
  }

  move() {
    this.findAngle()
    this.velocity.setAngle(this.angle)
    this.pos.add(this.velocity)

    const fpx = Math.floor(this.pos.x / SCALE)
    const fpy = Math.floor(this.pos.y / SCALE)
    if (FERMONES[fpy][fpx] === 3) {
      this.find = 'home'
      FERMONES[fpy][fpx] = 0
      this.angle += Math.PI
    }
    if (FERMONES[fpy][fpx] === 4) {
      this.find = 'food'
      // this.angle += Math.PI
    }
  }

  checkCollision() {
    if (this.pos.x + this.width > CANVAS.width
      || this.pos.x < 0
      || this.pos.y + this.height > CANVAS.height
      || this.pos.y - this.height < 0) {this.pos.x = 250; this.pos.y = 250} //this.angle += Math.PI
  }

  dropFermone() {
    const x = Math.floor(this.pos.x / SCALE)
    const y = Math.floor(this.pos.y / SCALE)

    if (FERMONES[y][x] === 3 || FERMONES[y][x] === 4) return
    if (this.find === 'food') FERMONES[y][x] = 1
    if (this.find === 'home') FERMONES[y][x] = 2
  }
  
  findAngle() {
    const x = this.pos.x - SCALE
    const y = this.pos.y - SCALE

    const vel = new Vector(1, 0)
    const sensors = []

    for (let v = 0; v < 6; v += 1) {
      for (let a = -Math.PI / 4; a < Math.PI / 4; a += 0.02) {
        vel.setMagnitude(this.width + v * SCALE)
        vel.setAngle(this.angle + a)

        const fx = Math.ceil((x + vel.x) / SCALE)
        const fy = Math.ceil((y + vel.y) / SCALE)

        if (FERMONES[fy] === undefined ) {
          sensors.push({angle: a, intensity: null})
          continue
        }
        if (FERMONES[fy][fx] === undefined) {
          sensors.push({angle: a, intensity: null})
          continue
        }

        sensors.push({angle: a, intensity: FERMONES[fy][fx]})

        // CANVAS.setColor('#F00'); CANVAS.drawRectangle(fx * SCALE, fy * SCALE, SCALE, SCALE)
      }
    }
    
    const randomAngle = (Math.random() * (Math.PI / 6) - Math.PI / 12)
    let dAngle = 0

    for(const {intensity, angle} of sensors) {
      if (intensity === null) {
        dAngle = -angle * sensors.length
        break
      }

      if (this.find === 'food' && ((intensity > 0 && intensity <= 1) || intensity === 3)) {
        dAngle += angle * intensity
        continue
      }

      if (this.find === 'home' && ((intensity > 1 && intensity <= 2) || intensity >= 3)) {
        if (intensity === 3) {
          dAngle = -angle * sensors.length
          break
        }
        dAngle += angle * intensity
        continue
      }
    }

    this.angle += randomAngle + (dAngle / sensors.length)
  }
}
