import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { AuthGuard } from './services/auth.guard';

export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'redirect',
        //canActivate: [AuthGuard],
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'library',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    {
        path: 'dashboard',
        canActivate: [AuthGuard],
        loadChildren: './dashboard/dashboard.module#DashboardModule'
    },
    {
        path: '**',
        redirectTo: 'home',
        pathMatch: 'full',
    }
]
