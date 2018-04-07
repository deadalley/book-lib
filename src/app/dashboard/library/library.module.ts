import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Routes, Route } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TooltipModule } from 'ngx-tooltip'
import { RatingModule } from 'ngx-rating'

import { CoreModule } from '../core/core.module'

import { LibraryComponent } from './library.component'
import { LibraryHomeComponent } from './library-home/library-home.component'
import { LibraryAddBookComponent } from './library-add-book/library-add-book.component'
import { LibraryAddCollectionComponent } from './library-add-collection/library-add-collection.component'
import { LibraryBookComponent } from './library-book/library-book.component'
import { LibraryNavbarComponent } from './library-navbar/library-navbar.component'
import { LibrarySectionComponent } from './library-section/library-section.component'
import { LibraryTableComponent } from './library-table/library-table.component'

const libraryRoutes: Routes = [
  { path: '', component: LibraryComponent, children: [
    { path: '', component: LibraryHomeComponent },
    { path: 'new', component: LibraryAddBookComponent },
    { path: ':id', component: LibraryBookComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(libraryRoutes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule,
    RatingModule,
    CoreModule
  ],
  declarations: [
    LibraryComponent,
    LibraryHomeComponent,
    LibraryAddBookComponent,
    LibraryAddCollectionComponent,
    LibraryBookComponent,
    LibraryNavbarComponent,
    LibrarySectionComponent,
    LibraryTableComponent
  ],
  exports: [LibraryComponent],
})

export class LibraryModule { }
