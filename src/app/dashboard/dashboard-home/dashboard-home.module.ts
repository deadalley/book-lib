import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TooltipModule } from 'ngx-tooltip'
import { RatingModule } from 'ngx-rating'

import { CoreModule } from '../core/core.module'

import { DashboardHomeComponent } from './dashboard-home.component'
import { FirstLoginComponent } from './first-login/first-login.component'
import { LastAddedBooksComponent } from './last-added-books/last-added-books.component'

@NgModule({
  declarations: [
    DashboardHomeComponent,
    FirstLoginComponent,
    LastAddedBooksComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    TooltipModule,
    FormsModule,
    ReactiveFormsModule,
    RatingModule
  ],
  exports: [ DashboardHomeComponent ]
})
export class DashboardHomeModule { }
