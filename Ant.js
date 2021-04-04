import { Vector } from './lib/lib.js'
import { WIDTH, HEIGHT, FOODF, HOMEF, GROUND, ANT_SPEED, ANT_FERMONE_STRENGTH_DECAY, ANT_BONUS_STRENGTH_FERMONE, ANT_FERMONE_STRENGTH } from './Consts.js'

export default class Ant {
  constructor(x, y) {
    this.pos = new Vector(x, y)
    this.angle = Math.random() * 2 * Math.PI

    this.width = 0
    this.height = 0

    this.velocity = new Vector(ANT_SPEED, 0)
    this.velocity.setAngle(this.angle)

    this.find = 'food'
    this.fermoneD = HOMEF
    this.fermoneF = FOODF

    this.fermoneIntensity = ANT_FERMONE_STRENGTH
  }

  draw() {
    const x = Math.floor(this.pos.x)
    const y = Math.floor(this.pos.y)
  }

  do() {
    GROUND[Math.floor(this.pos.y)][Math.floor(this.pos.x)] = GROUND[Math.floor(this.pos.y)][Math.floor(this.pos.x)] === 3 ? 0 : GROUND[Math.floor(this.pos.y)][Math.floor(this.pos.x)]
    this.dropFermone()
    this.move()
  }

  move() {
    this.findAngle()
    this.velocity.setAngle(this.angle)
    this.pos.add(this.velocity)
    this.checkCollision()

    const fpx = Math.floor(this.pos.x)
    const fpy = Math.floor(this.pos.y)

    GROUND[fpy][fpx] = GROUND[fpy][fpx] === 0 ? 3 : GROUND[fpy][fpx]
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
    if (this.pos.x + this.width >= WIDTH
      || this.pos.x - this.width <= 0
      || this.pos.y + this.height >= HEIGHT
      || this.pos.y - this.height <= 0) {
        this.angle += Math.PI //{this.pos.x = 250; this.pos.y = 250} 
        this.velocity.setAngle(this.angle)
        this.pos.add(this.velocity)
      }
  }

  dropFermone() {
    const x = Math.floor(this.pos.x)
    const y = Math.floor(this.pos.y)

    if (GROUND[y][x] !== 0) return
    this.fermoneD[y][x] = this.fermoneD[y][x] > this.fermoneIntensity ? this.fermoneD[y][x] : this.fermoneIntensity
  }
  
  findAngle() {
    const x = this.pos.x - 1
    const y = this.pos.y - 1

    const vel = new Vector(1, 0)
    const sensors = []

    for (let v = 1; v < 7; v += 1) {
      for (let a = -Math.PI / 4; a < Math.PI / 4; a += 0.02) {
        vel.setMagnitude(v)
        vel.setAngle(this.angle + a)

        const fx = Math.floor(x + vel.x)
        const fy = Math.floor(y + vel.y)

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
            sensors.push({angle: a, intensity: ANT_FERMONE_STRENGTH * 2,});    
            // continue
          }
          if (GROUND[fy][fx] === 2) {
            sensors.push({angle: -a, intensity: null})
            continue
          }

        }

        if (this.find === 'food' && GROUND[fy][fx] === 2) {
          sensors.push({angle: a, intensity: ANT_FERMONE_STRENGTH * 2})
          // continue
        }

        sensors.push({angle: a, intensity: this.fermoneF[fy][fx]})
      }
    }
    
    const randomAngle = (Math.random() * (Math.PI / 6) - Math.PI / 12)
    let dAngle = 0

    for(const {intensity, angle} of sensors) {
      if (intensity === null) {
        dAngle = angle * sensors.length
        break
      }

      dAngle += angle * intensity
    }

    this.angle += randomAngle + (dAngle / sensors.length)
  }
}
