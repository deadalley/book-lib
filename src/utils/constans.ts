import { trigger, transition, style, animate, state } from '@angular/core'

export const ANIMATIONS = {
  CARD: trigger('card', [
    state('*', style({
      '-ms-transform': 'translate3D(0px, 0px, 0px)',
      '-webkit-transform': 'translate3D(0px, 0px, 0px)',
      '-moz-transform': 'translate3D(0px, 0px, 0px)',
      '-o-transform': 'translate3D(0px, 0px, 0px)',
      transform: 'translate3D(0px, 0px, 0px)',
      opacity: 1})),
      transition('void => *', [
        style({opacity: 0,
          '-ms-transform': 'translate3D(0px, 150px, 0px)',
          '-webkit-transform': 'translate3D(0px, 150px, 0px)',
          '-moz-transform': 'translate3D(0px, 150px, 0px)',
          '-o-transform': 'translate3D(0px, 150px, 0px)',
          transform: 'translate3D(0px, 150px, 0px)',
        }),
        animate('0.3s 0s ease-out')
      ])
  ])
}
