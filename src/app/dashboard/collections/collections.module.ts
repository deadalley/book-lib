import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Route } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RatingModule } from 'ngx-bootstrap/rating'
import { TooltipModule } from 'ngx-bootstrap/tooltip'

import { CoreModule } from '../core/core.module'

import { CollectionsComponent } from './collections.component'
import { AddCollectionComponent } from './edit-collection/add-collection.component'
import { EditCollectionComponent } from './edit-collection/edit-collection.component'

import { CollectionGroupingPipe } from 'pipes/collection-grouping.pipe'
import { CollectionsHomeComponent } from './collections-home/collections-home.component'

const routes: Route[] = [
  {
    path: '',
    component: CollectionsComponent,
    children: [
      { path: '', component: CollectionsHomeComponent },
      {
        path: ':id/edit',
        component: EditCollectionComponent,
        pathMatch: 'full',
      },
      {
        path: 'new',
        component: AddCollectionComponent,
        pathMatch: 'full',
      },
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
    CollectionsComponent,
    CollectionsHomeComponent,
    AddCollectionComponent,
    EditCollectionComponent,
    CollectionGroupingPipe,
  ],
  exports: [CollectionsComponent],
})
export class CollectionsModule {}
