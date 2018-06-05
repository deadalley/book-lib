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
import { LibraryTableComponent } from './library-table/library-table.component'
import { LibraryNoBooksComponent } from './library-no-books/library-no-books.component'
import { LibraryImportFileComponent } from './library-import-file/library-import-file.component'

import { BookOrderPipe } from 'pipes/book-order.pipe'
import { CollectionOrderPipe } from 'pipes/collection-order.pipe'
import { IterableObject } from 'pipes/iterable-object.pipe'
import { PushToBottomPipe } from 'pipes/push-to-bottom.pipe'

const libraryHomeRoutes: Routes = [
  { path: '', component: LibraryHomeComponent, children: [
     { path: '', redirectTo: 'books', pathMatch: 'full' },
     { path: 'books', component: LibraryBooksComponent, pathMatch: 'full' },
     { path: 'collections', component: LibraryCollectionsComponent, pathMatch: 'full' },
     { path: 'books/import', component: LibraryImportFileComponent, pathMatch: 'full' }
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
    LibraryTableComponent,
    LibraryNoBooksComponent,
    LibraryImportFileComponent,
    BookOrderPipe,
    CollectionOrderPipe,
    IterableObject,
    PushToBottomPipe
  ],
  exports: [ LibraryHomeComponent ],
})

export class LibraryHomeModule { }
