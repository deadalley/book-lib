import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule} from './shared/navbar/navbar.module';
import { LibraryModule } from './library/library.module';
import { TooltipModule } from 'ngx-tooltip';
import { RatingModule } from 'ngx-rating';

import { DashboardComponent } from './dashboard.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { LibraryComponent } from './library/library.component';

import { GoodreadsService } from '../services/goodreads.service';

const dashboardRoutes: Routes = [
  { path: '', component: DashboardComponent, children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: DashboardHomeComponent },
    { path: 'library', loadChildren: './library/library.module#LibraryModule' }
  ]}
];

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardHomeComponent
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
  exports: [ DashboardComponent ],
  providers: [ GoodreadsService ]
})
export class DashboardModule { }
