import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { TooltipModule } from 'ngx-bootstrap/tooltip'
import { ModalModule } from 'ngx-bootstrap/modal'
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading'

import { AuthorCardComponent } from './author-card/author-card.component'
import { BookCardComponent } from './book-card/book-card.component'
import { BookTagsComponent } from './book-tags/book-tags.component'
import { BookButtonsComponent } from './book-buttons/book-buttons.component'
import { ModalComponent } from './modal/modal.component'
import { PageNavigatorComponent } from './page-navigator/page-navigator.component'
import { LoadingComponent } from './loading/loading.component'
import { BooksSectionComponent } from './books-section/books-section.component'
import { BooksTableComponent } from './books-table/books-table.component'
import { BooksDisplayComponent } from './books-display/books-display.component'
import { AuthorsSectionComponent } from './authors-section/authors-section.component'
import { AuthorsTableComponent } from './authors-table/authors-table.component'
import { AuthorsDisplayComponent } from './authors-display/authors-display.component'
import { TagsListComponent } from './tags-list/tags-list.component'
import { GridComponent } from './grid/grid.component'
import { LanguageSelectorComponent } from './language-selector/language-selector.component'
import { LibraryNavbarComponent } from './library-navbar/library-navbar.component'
import { TableItemsComponent } from './table-items/table-items.component'
import { PagesComponent } from './pages/pages.component'
import { SearchBoxComponent } from './search-box/search-box.component'
import { LoadingOverlayComponent } from './loading-overlay/loading-overlay.component'

import { BookFilterPipe } from 'pipes/book-filter.pipe'
import { PagePipe } from 'pipes/page.pipe'
import { SearchFilterPipe } from 'pipes/search-filter.pipe'

@NgModule({
  declarations: [
    AuthorCardComponent,
    BookCardComponent,
    BookTagsComponent,
    BookButtonsComponent,
    ModalComponent,
    PageNavigatorComponent,
    LoadingComponent,
    BooksSectionComponent,
    BooksTableComponent,
    BooksDisplayComponent,
    AuthorsSectionComponent,
    AuthorsTableComponent,
    AuthorsDisplayComponent,
    TagsListComponent,
    GridComponent,
    LanguageSelectorComponent,
    LibraryNavbarComponent,
    TableItemsComponent,
    PagesComponent,
    SearchBoxComponent,
    LoadingOverlayComponent,
    BookFilterPipe,
    PagePipe,
    SearchFilterPipe,
  ],
  imports: [
    CommonModule,
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.circleSwish,
      backdropBackgroundColour: 'rgba(100,0,0,0)',
      primaryColour: 'rgb(120, 216, 236)',
      secondaryColour: '#ffffff',
      tertiaryColour: '#ffffff',
    }),
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    AuthorCardComponent,
    BookCardComponent,
    BookTagsComponent,
    BookButtonsComponent,
    ModalComponent,
    PageNavigatorComponent,
    LoadingComponent,
    BooksSectionComponent,
    BooksTableComponent,
    BooksDisplayComponent,
    AuthorsSectionComponent,
    AuthorsTableComponent,
    AuthorsDisplayComponent,
    TagsListComponent,
    GridComponent,
    LanguageSelectorComponent,
    LibraryNavbarComponent,
    TableItemsComponent,
    PagesComponent,
    SearchBoxComponent,
    LoadingOverlayComponent,
    BookFilterPipe,
    PagePipe,
    SearchFilterPipe,
  ],
})
export class CoreModule {}
