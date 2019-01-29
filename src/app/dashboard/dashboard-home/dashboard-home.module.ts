import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { CoreModule } from '../core/core.module'

import { DashboardHomeComponent } from './dashboard-home.component'
import { LastAddedBooksComponent } from './last-added-books/last-added-books.component'
import { WelcomeComponent } from './welcome/welcome.component'
import { RouterModule } from '@angular/router'

@NgModule({
  declarations: [
    DashboardHomeComponent,
    LastAddedBooksComponent,
    WelcomeComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [DashboardHomeComponent],
})
export class DashboardHomeModule {}
