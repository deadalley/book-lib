import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Routes } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RatingModule } from 'ngx-bootstrap/rating'
import { TooltipModule } from 'ngx-bootstrap/tooltip'

import { CoreModule } from '../core/core.module'

import { AuthorsComponent } from './authors.component'
import { FindAuthorComponent } from './find-author/find-author.component'
import { AuthorComponent } from './author/author.component'
import { AuthorsHomeComponent } from './authors-home/authors-home.component'
import { TruncatePipe } from 'pipes/truncate.pipe'

const routes: Routes = [
  {
    path: '',
    component: AuthorsComponent,
    children: [
      { path: '', component: AuthorsHomeComponent },
      { path: 'find/:name', component: FindAuthorComponent, pathMatch: 'full' },
      { path: ':id', component: AuthorComponent },
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
    AuthorsComponent,
    AuthorsHomeComponent,
    AuthorComponent,
    FindAuthorComponent,
    TruncatePipe,
  ],
  exports: [AuthorsComponent],
})
export class AuthorsModule {}
