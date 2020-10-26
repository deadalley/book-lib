import { Route } from '@angular/router'
import { AuthGuardService } from '../services/auth.guard'
import { DashboardModule } from './dashboard/dashboard.module'
import { HomeModule } from './home/home.module'

export const AppRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () => HomeModule,
  },
  {
    path: 'library',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadChildren: () => DashboardModule,
    canActivate: [AuthGuardService],
  },
]
