import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'

import { TooltipModule } from 'ngx-tooltip'
import { RatingModule } from 'ngx-rating'

import { BookCardComponent } from './book-card/book-card.component'
import { BookTagsComponent } from './book-tags/book-tags.component'
import { BookButtonsComponent } from './book-buttons/book-buttons.component'
import { ModalComponent } from './modal/modal.component'

@NgModule({
  declarations: [
    BookCardComponent,
    BookTagsComponent,
    BookButtonsComponent,
    ModalComponent
  ],
  imports: [
    CommonModule,
    TooltipModule,
    RatingModule,
    RouterModule
  ],
  exports: [
    BookCardComponent,
    BookTagsComponent,
    BookButtonsComponent,
    ModalComponent
  ]
})
export class CoreModule { }
