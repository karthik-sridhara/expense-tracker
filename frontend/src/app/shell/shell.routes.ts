import { Routes } from '@angular/router';

export const SHELL_ROUTES: Routes = [
    { 
        path: '', 
        loadComponent: () => import(
            '../../feature/dashboard/dashboard'
        ).then(m => m.Dashboard) 
    },
    { 
        path: 'settings', 
        loadComponent: () => import(
            '../../feature/setting/setting'
        ).then(m => m.Setting) 
    },
    { path: '**', redirectTo: '' },
];