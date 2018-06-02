import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { CoreModule } from '../core/core.module'

import { GoodreadsComponent } from './goodreads.component'
import { GoodreadsImportComponent } from './goodreads-import/goodreads-import.component'

const goodreadsRoutes: Routes = [
  { path: '', component: GoodreadsComponent, children: [
    { path: '', redirectTo: 'import', pathMatch: 'full' },
    { path: 'import', component: GoodreadsImportComponent }
  ]}
]

@NgModule({
  declarations: [
    GoodreadsComponent,
    GoodreadsImportComponent
  ],
  imports: [
    RouterModule.forChild(goodreadsRoutes),
    CommonModule,
    CoreModule,
  ],
  exports: [ GoodreadsComponent ],
})
export class GoodreadsModule { }
