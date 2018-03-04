import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { SidebarModule } from './sidebar/sidebar.module'
import { FooterModule } from './shared/footer/footer.module'
import { NavbarModule} from './shared/navbar/navbar.module'
import { LibraryModule } from './library/library.module'
import { TooltipModule } from 'ngx-tooltip'
import { RatingModule } from 'ngx-rating'

import { DashboardComponent } from './dashboard.component'
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component'
import { FirstLoginComponent } from './dashboard-home/first-login/first-login.component'
import { BookCardComponent } from './common/book-card/book-card.component'
import { BookTagsComponent } from './common/book-tags/book-tags.component'
import { LibraryComponent } from './library/library.component'

const dashboardRoutes: Routes = [
  { path: '', component: DashboardComponent, children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: DashboardHomeComponent },
    { path: 'author_watch', redirectTo: 'library', pathMatch: 'full' },
    { path: 'wishlist', redirectTo: 'library', pathMatch: 'full' },
    { path: 'profile', redirectTo: 'library', pathMatch: 'full' },
    { path: 'library', loadChildren: './library/library.module#LibraryModule' }
  ]}
]

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardHomeComponent,
    FirstLoginComponent,
    BookCardComponent,
    BookTagsComponent
  ],
  imports: [
    RouterModule.forChild(dashboardRoutes),
    CommonModule,
    SidebarModule,
    NavbarModule,
    FooterModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule,
    RatingModule
  ],
  exports: [DashboardComponent],
})
export class DashboardModule { }
