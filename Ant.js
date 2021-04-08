import { Vector } from './lib/lib.js'
import { WIDTH, HEIGHT, FOODF, HOMEF, GROUND, ANT_SPEED, ANT_FERMONE_STRENGTH_DECAY, ANT_BONUS_STRENGTH_FERMONE, ANT_FERMONE_STRENGTH } from './Consts.js'

export default class Ant {
  constructor(x, y) {
    this.pos = new Vector(x, y)
    this.angle = Math.random() * 2 * Math.PI

    this.width = 0
    this.height = 0

    this.velocity = new Vector(ANT_SPEED, 0)
    this.velocity.setAngleMagnitude(this.angle, ANT_SPEED)

    this.find = 'food'
    this.fermoneD = HOMEF
    this.fermoneF = FOODF

    this.fermoneIntensity = ANT_FERMONE_STRENGTH * Math.random()
  }

  draw() {
    const x = Math.trunc(this.pos.x)
    const y = Math.trunc(this.pos.y)
  }

  do() {
    const ground = GROUND[Math.trunc(this.pos.y)][Math.trunc(this.pos.x)]
    GROUND[Math.trunc(this.pos.y)][Math.trunc(this.pos.x)] = ground === 3 ? 0 : ground
    this.dropFermone()
    this.move()
  }

  move() {
    this.findAngle()
    this.velocity.setAngleMagnitude(this.angle, ANT_SPEED)
    this.pos.add(this.velocity)
    this.checkCollision()

    const fpx = Math.trunc(this.pos.x)
    const fpy = Math.trunc(this.pos.y)

    const ground = GROUND[fpy][fpx]
    GROUND[fpy][fpx] = ground === 0 ? 3 : ground
    if (ground === 2 && this.find === 'food') {
      this.find = 'home'
      GROUND[fpy][fpx] = 0
      this.fermoneD = FOODF
      this.fermoneF = HOMEF
      this.fermoneIntensity += ANT_BONUS_STRENGTH_FERMONE
      this.angle += Math.PI
    }
    if (ground === 1 && this.find === 'home') {
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
        this.velocity.setAngleMagnitude(this.angle, ANT_SPEED)
        this.pos.add(this.velocity)
        this.checkCollision()
      }
  }

  dropFermone() {
    const x = Math.trunc(this.pos.x)
    const y = Math.trunc(this.pos.y)

    if (GROUND[y][x] !== 0) return
    this.fermoneD[y][x] = this.fermoneD[y][x] > this.fermoneIntensity ? this.fermoneD[y][x] : this.fermoneIntensity
  }
  
  findAngle() {
    const x = this.pos.x - 1
    const y = this.pos.y - 1

    const vel = new Vector(1, 0)
    const sensors = []

    for (let v = 1; v < 7; v += 1) {
      for (let a = -Math.PI / 4; a < Math.PI / 4; a += 0.1) {
        this.velocity.setAngleMagnitude(this.angle + a, v)

        const fx = Math.trunc(x + vel.x)
        const fy = Math.trunc(y + vel.y)

        if (fy >= HEIGHT || fy < 0) {
          sensors.push({angle: -a, intensity: null})
          break
        }
        if (fx >= WIDTH || fx < 0) {
          sensors.push({angle: -a, intensity: null})
          break
        }

        const ground = GROUND[fy][fx]

        if (this.find === 'home' ) {
          if (ground === 1){ 
            sensors.push({angle: a, intensity: null});    
            break
          }
          if (ground === 2) {
            sensors.push({angle: -a, intensity: ANT_BONUS_STRENGTH_FERMONE})
            continue
          }

        }

        if (this.find === 'food' && ground === 2) {
          sensors.push({angle: a, intensity: null})
          break
        }

        const fermone = this.fermoneF[fy][fx]
        // if (fermone === 0) {
        //   continue
        // }

        sensors.push({angle: a, intensity: fermone})
      }
    }
    const sensorLength = sensors.length
    const randomAngle = (Math.random() * (Math.PI / 6) - Math.PI / 12) //0
    let dAngle = 0

    for(const {intensity, angle} of sensors) {
      if (intensity === null) {
        dAngle = angle * sensors.length
        break
      }

      dAngle += angle * intensity
    }

    this.angle += randomAngle + (dAngle / (sensorLength | 0))
  }
}
