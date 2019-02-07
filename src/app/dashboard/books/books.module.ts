import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Routes } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RatingModule } from 'ngx-bootstrap/rating'
import { TooltipModule } from 'ngx-bootstrap/tooltip'

import { CoreModule } from '../core/core.module'

import { BooksComponent } from './books.component'
import { BooksHomeComponent } from './books-home/books-home.component'
import { AddBookComponent } from './edit-book/add-book.component'
import { EditBookComponent } from './edit-book/edit-book.component'
import { NoBooksComponent } from './no-books/no-books.component'
import { BookComponent } from './book/book.component'
import { FindBookComponent } from './find-book/find-book.component'

import { PushToBottomPipe } from 'pipes/push-to-bottom.pipe'
import { IterableObjectPipe } from 'pipes//iterable-object.pipe'
import { BookGroupingPipe } from 'pipes/book-grouping.pipe'

const routes: Routes = [
  {
    path: '',
    component: BooksComponent,
    children: [
      { path: '', component: BooksHomeComponent },
      { path: 'new', component: AddBookComponent, pathMatch: 'full' },
      { path: 'find', component: FindBookComponent },
      { path: ':id', component: BookComponent },
      { path: ':id/edit', component: EditBookComponent },
    ],
  },
]

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RatingModule.forRoot(),
    TooltipModule.forRoot(),
    CoreModule,
  ],
  declarations: [
    BooksHomeComponent,
    BooksComponent,
    AddBookComponent,
    EditBookComponent,
    BookComponent,
    NoBooksComponent,
    FindBookComponent,
    PushToBottomPipe,
    IterableObjectPipe,
    BookGroupingPipe,
  ],
  exports: [BooksComponent],
})
export class BooksModule {}
