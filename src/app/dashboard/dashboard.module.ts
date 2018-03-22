import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { SidebarModule } from './sidebar/sidebar.module'
import { FooterModule } from './shared/footer/footer.module'
import { NavbarModule} from './shared/navbar/navbar.module'
import { DashboardHomeModule } from './dashboard-home/dashboard-home.module'
import { LibraryModule } from './library/library.module'

import { DashboardComponent } from './dashboard.component'
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component'

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
    DashboardComponent
  ],
  imports: [
    RouterModule.forChild(dashboardRoutes),
    CommonModule,
    SidebarModule,
    NavbarModule,
    FooterModule,
    DashboardHomeModule
  ],
  exports: [ DashboardComponent ],
})
export class DashboardModule { }
