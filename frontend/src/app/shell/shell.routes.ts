import { Routes } from '@angular/router';

export const SHELL_ROUTES: Routes = [
    { 
        path: '', 
        loadComponent: () => import(
            '../../feature/dashboard/dashboard'
        ).then(m => m.Dashboard) 
    },
    { path: '**', redirectTo: '' },
];