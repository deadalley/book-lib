import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { CoreModule } from '../core/core.module'

import { DashboardHomeComponent } from './dashboard-home.component'
import { LastAddedBooksComponent } from './last-added-books/last-added-books.component'

@NgModule({
  declarations: [
    DashboardHomeComponent,
    LastAddedBooksComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [ DashboardHomeComponent ]
})
export class DashboardHomeModule { }
