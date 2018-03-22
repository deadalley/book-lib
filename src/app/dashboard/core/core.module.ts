import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { TooltipModule } from 'ngx-tooltip'
import { RatingModule } from 'ngx-rating'

import { BookCardComponent } from './book-card/book-card.component'
import { BookTagsComponent } from './book-tags/book-tags.component'

@NgModule({
  declarations: [
    BookCardComponent,
    BookTagsComponent
  ],
  imports: [
    CommonModule,
    TooltipModule,
    RatingModule
  ],
  exports: [
    BookCardComponent,
    BookTagsComponent
  ]
})
export class CoreModule { }
