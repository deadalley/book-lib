import { Routes } from '@angular/router'
import { AuthGuardService } from '../services/auth.guard'

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: 'app/home/home.module#HomeModule',
  },
  {
    path: 'library',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadChildren: 'app/dashboard/dashboard.module#DashboardModule',
    canActivate: [AuthGuardService],
  },
  // {
  //     path: '**',
  //     redirectTo: 'home',
  //     pathMatch: 'full',
  // }
]
