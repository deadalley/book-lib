import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule, Route } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { CoreModule } from './core/core.module'
import { SidebarModule } from './sidebar/sidebar.module'
import { FooterModule } from './shared/footer/footer.module'
import { NavbarModule } from './shared/navbar/navbar.module'
import { DashboardHomeModule } from './dashboard-home/dashboard-home.module'
import { GoodreadsModule } from './goodreads/goodreads.module'
import { BooksModule } from './books/books.module'
import { AuthorsModule } from './authors/authors.module'
import { CollectionsModule } from './collections/collections.module'
import { ProfileModule } from './profile/profile.module'

import { DashboardComponent } from './dashboard.component'
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component'
import { ImportComponent } from './import/import.component'
import { GoodreadsComponent } from './goodreads/goodreads.component'

const dashboardRoutes: Route[] = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: DashboardHomeComponent },
      { path: 'books', loadChildren: () => BooksModule },
      {
        path: 'collections',
        loadChildren: () => CollectionsModule,
      },
      {
        path: 'authors',
        loadChildren: () => AuthorsModule,
      },
      {
        path: 'goodreads',
        component: GoodreadsComponent,
        // loadChildren: () => GoodreadsModule,
      },
      {
        path: 'import',
        component: ImportComponent,
      },
      {
        path: 'profile',
        loadChildren: () => ProfileModule,
      },
    ],
  },
]

@NgModule({
  declarations: [DashboardComponent, ImportComponent],
  imports: [
    RouterModule.forChild(dashboardRoutes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    SidebarModule,
    NavbarModule,
    FooterModule,
    DashboardHomeModule,
    GoodreadsModule,
  ],
  exports: [DashboardComponent],
})
export class DashboardModule {}
