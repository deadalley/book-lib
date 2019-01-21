import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Routes } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RatingModule } from 'ngx-bootstrap/rating'

import { CoreModule } from '../../core/core.module'

import { LibraryHomeComponent } from './library-home.component'
// import { LibraryBooksComponent } from './library-books/library-books.component'
// import { LibraryCollectionsComponent } from './library-collections/library-collections.component'
// import { LibraryNavbarComponent } from './library-navbar/library-navbar.component'
// import { LibraryNoBooksComponent } from './library-no-books/library-no-books.component'
import { LibraryImportFileComponent } from './library-import-file/library-import-file.component'

// import { BookOrderPipe } from 'pipes/book-grouping.pipe'
// import { CollectionOrderPipe } from 'pipes/collection-grouping.pipe'
import { IterableObjectPipe } from 'pipes/iterable-object.pipe'
import { PushToBottomPipe } from 'pipes/push-to-bottom.pipe'

const libraryHomeRoutes: Routes = [
  {
    path: '',
    component: LibraryHomeComponent,
    children: [
      { path: '', redirectTo: 'books', pathMatch: 'full' },
      //  { path: 'books', component: LibraryBooksComponent, pathMatch: 'full' },
      //  { path: 'collections', component: LibraryCollectionsComponent, pathMatch: 'full' },
      {
        path: 'books/import',
        component: LibraryImportFileComponent,
        pathMatch: 'full',
      },
    ],
  },
]

@NgModule({
  imports: [
    RouterModule.forChild(libraryHomeRoutes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RatingModule.forRoot(),
    CoreModule,
  ],
  declarations: [
    LibraryHomeComponent,
    // LibraryBooksComponent,
    // LibraryCollectionsComponent,
    // LibraryNavbarComponent,
    // LibraryNoBooksComponent,
    LibraryImportFileComponent,
    // BookOrderPipe,
    // CollectionOrderPipe,
    IterableObjectPipe,
    PushToBottomPipe,
  ],
  exports: [LibraryHomeComponent],
})
export class LibraryHomeModule {}
