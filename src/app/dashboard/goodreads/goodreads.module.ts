import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { CoreModule } from '../core/core.module'

import { GoodreadsComponent } from './goodreads.component'
import { GoodreadsImportComponent } from './goodreads-import/goodreads-import.component'
import { GoodreadsSearchBookComponent } from './goodreads-search-book/goodreads-search-book.component'
import { GoodreadsSearchAuthorComponent } from './goodreads-search-author/goodreads-search-author.component'

@NgModule({
  declarations: [
    GoodreadsComponent,
    GoodreadsImportComponent,
    GoodreadsSearchBookComponent,
    GoodreadsSearchAuthorComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
  ],
  exports: [GoodreadsComponent],
})
export class GoodreadsModule {}
