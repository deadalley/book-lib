import { trigger, transition, style, animate, state } from '@angular/animations'

export const ANIMATIONS = {
  CARD: trigger('card', [
    state('*', style({
      '-webkit-transform': 'translate3D(0px, 0px, 0px)',
      transform: 'translate3D(0px, 0px, 0px)',
      opacity: 1})),
      transition('void => *', [
        style({opacity: 0,
          '-webkit-transform': 'translate3D(0px, 150px, 0px)',
          transform: 'translate3D(0px, 150px, 0px)',
        }),
        animate('0.3s 0s ease-out')
      ])
  ])
}
