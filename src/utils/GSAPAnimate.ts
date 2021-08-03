import { gsap } from 'gsap'

export class GSAPAnimate {
  private element = null

  private stagger = 0.3

  constructor(element: string | HTMLElement) {
    this.element = element
  }

  fadeOut(params?: gsap.TweenVars) {
    gsap.to(this.element, {
      // opacity: 0,
      y: 240,
      ease: 'power4.ease',
      stagger: this.stagger,
      ...params,
    })
  }

  fadeIn(params?: gsap.TweenVars) {
    gsap.to(this.element, {
      // opacity: 1,
      y: 0,
      ease: 'power4.ease',
      stagger: this.stagger,
      ...params,
    })
  }
}

export default GSAPAnimate
