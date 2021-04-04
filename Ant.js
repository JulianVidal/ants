import { Vector } from './lib/lib.js'
import { SCALE, WIDTH, HEIGHT, FOODF, HOMEF, GROUND, ANT_SPEED, ANT_FERMONE_STRENGTH_DECAY, ANT_BONUS_STRENGTH_FERMONE, ANT_FERMONE_STRENGTH } from './Consts.js'

export default class Ant {
  constructor(x, y) {
    this.pos = new Vector(x, y)
    this.angle = Math.random() * 2 * Math.PI

    this.width = 2 * SCALE
    this.height = SCALE

    this.velocity = new Vector(ANT_SPEED, 0)
    this.velocity.setAngle(this.angle)

    this.find = 'food'
    this.fermoneD = HOMEF
    this.fermoneF = FOODF

    this.fermoneIntensity = ANT_FERMONE_STRENGTH
  }

  draw() {
    const x = this.pos.x - (this.width / 2)
    const y = this.pos.y - (this.height / 2)

    // if (this.find == 'food') CANVAS.setColor('#F00')
    // if (this.find == 'home') CANVAS.setColor('#00F')
    // CANVAS.rotateCenter(x, y, this.width, this.height, this.angle)
    // CANVAS.drawRectangle(x, y, this.width, this.height)
    // CANVAS.resetTransform()
  }

  do() {
    this.move()
    this.dropFermone()
  }

  move() {
    this.findAngle()
    this.velocity.setAngle(this.angle)
    this.pos.add(this.velocity)
    this.checkCollision()

    const fpx = Math.floor(this.pos.x / SCALE)
    const fpy = Math.floor(this.pos.y / SCALE)
    if (GROUND[fpy][fpx] === 2 && this.find === 'food') {
      this.find = 'home'
      GROUND[fpy][fpx] = 0
      this.fermoneD = FOODF
      this.fermoneF = HOMEF
      this.fermoneIntensity += ANT_BONUS_STRENGTH_FERMONE
      this.angle += Math.PI
    }
    if (GROUND[fpy][fpx] === 1 && this.find === 'home') {
      this.find = 'food'
      this.fermoneD = HOMEF
      this.fermoneF = FOODF
      this.fermoneIntensity += ANT_BONUS_STRENGTH_FERMONE
      this.angle += Math.PI
    }

    this.fermoneIntensity -= ANT_FERMONE_STRENGTH_DECAY
    if (this.fermoneIntensity < 0) this.fermoneIntensity = 0
    // if (this.fermoneIntensity > 2 * ANT_FERMONE_STRENGTH) this.fermoneIntensity = 2 * ANT_FERMONE_STRENGTH 
  }

  checkCollision() {
    if (this.pos.x + this.width > WIDTH
      || this.pos.x < 0
      || this.pos.y + this.height > HEIGHT
      || this.pos.y - this.height < 0) {this.pos.x = 250; this.pos.y = 250} //this.angle += Math.PI
  }

  dropFermone() {
    const x = Math.floor(this.pos.x / SCALE)
    const y = Math.floor(this.pos.y / SCALE)

    if (GROUND[y][x] !== 0) return
    this.fermoneD[y][x] = this.fermoneD[y][x] > this.fermoneIntensity ? this.fermoneD[y][x] : this.fermoneIntensity
  }
  
  findAngle() {
    const x = this.pos.x - SCALE
    const y = this.pos.y - SCALE

    const vel = new Vector(1, 0)
    const sensors = []

    for (let v = 0; v < 7; v += 1) {
      for (let a = -Math.PI / 4; a < Math.PI / 4; a += 0.02) {
        vel.setMagnitude(this.width + v * SCALE)
        vel.setAngle(this.angle + a)

        const fx = Math.ceil((x + vel.x) / SCALE)
        const fy = Math.ceil((y + vel.y) / SCALE)

        if (GROUND[fy] === undefined ) {
          sensors.push({angle: -a, intensity: null})
          continue
        }
        if (GROUND[fy][fx] === undefined) {
          sensors.push({angle: -a, intensity: null})
          continue
        }

        if (this.find === 'home' ) {
          if (GROUND[fy][fx] === 1){ 
            sensors.push({angle: a, intensity: null,});    
            continue
          }
          if (GROUND[fy][fx] === 2) {
            sensors.push({angle: -a, intensity: null})
            continue
          }

        }

        if (this.find === 'food' && GROUND[fy][fx] === 2) {
          sensors.push({angle: a, intensity: null})
          continue
        }

        sensors.push({angle: a, intensity: this.fermoneF[fy][fx]})

        // CANVAS.setColor('#F00'); CANVAS.drawRectangle(fx * SCALE, fy * SCALE, SCALE, SCALE)
      }
    }
    
    const randomAngle = (Math.random() * (Math.PI / 6) - Math.PI / 12)
    let dAngle = 0

    for(const {intensity, angle, avoid} of sensors) {
      if (intensity === null) {
        dAngle = angle * sensors.length
        break
      }

      dAngle += angle * intensity
    }

    this.angle += randomAngle + (dAngle / sensors.length)
  }
}
