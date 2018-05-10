import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Routes, Route } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TooltipModule } from 'ngx-tooltip'
import { RatingModule } from 'ngx-rating'

import { CoreModule } from '../../core/core.module'

import { LibraryHomeComponent } from './library-home.component'
import { LibraryBooksComponent } from './library-books/library-books.component'
import { LibraryCollectionsComponent } from './library-collections/library-collections.component'
import { LibraryNavbarComponent } from './library-navbar/library-navbar.component'
import { LibrarySectionComponent } from './library-section/library-section.component'
import { LibraryTableComponent } from './library-table/library-table.component'
import { LibraryNoBooksComponent } from './library-no-books/library-no-books.component'

import { BookOrderPipe } from '../../../../pipes/book-order.pipe'
import { IterableObject } from '../../../../pipes/iterable-object.pipe'

const libraryHomeRoutes: Routes = [
  { path: '', component: LibraryHomeComponent, children: [
     { path: '', redirectTo: 'books', pathMatch: 'full' },
     { path: 'books', component: LibraryBooksComponent, pathMatch: 'full' },
     { path: 'collections', component: LibraryCollectionsComponent, pathMatch: 'full' }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(libraryHomeRoutes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule,
    RatingModule,
    CoreModule
  ],
  declarations: [
    LibraryHomeComponent,
    LibraryBooksComponent,
    LibraryCollectionsComponent,
    LibraryNavbarComponent,
    LibrarySectionComponent,
    LibraryTableComponent,
    LibraryNoBooksComponent,
    BookOrderPipe,
    IterableObject
  ],
  exports: [ LibraryHomeComponent ],
})

export class LibraryHomeModule { }
