import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Route } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-tooltip';
import { RatingModule } from 'ngx-rating';

import { GoodreadsService } from '../../services/goodreads.service';

import { LibraryComponent } from './library.component';
//import { LibraryEmptyComponent } from './library-empty/library-empty.component';
import { LibraryHomeComponent } from './library-home/library-home.component';
import { LibraryAddBookComponent } from './library-add-book/library-add-book.component';
import { LibraryBookComponent } from './library-book/library-book.component';

const libraryRoutes: Routes = [
  { path: '', component: LibraryComponent, children: [
    //{ path: '', redirectTo: 'library_home', pathMatch: 'full' },
    //{ path: 'empty', component: LibraryEmptyComponent },
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
      RatingModule
    ],
    declarations: [
      LibraryComponent,
      //LibraryEmptyComponent,
      LibraryHomeComponent,
      LibraryAddBookComponent,
      LibraryBookComponent
    ],
    exports: [ LibraryComponent ],
    providers: [ GoodreadsService ]
})

export class LibraryModule {}
