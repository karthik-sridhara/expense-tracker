import { Routes } from '@angular/router';

export const SHELL_ROUTES: Routes = [
    { 
        path: '', 
        loadComponent: () => import(
            '../../feature/dashboard/dashboard'
        ).then(m => m.Dashboard) 
    },
    { 
        path: 'categories', 
        loadComponent: () => import(
            '../../feature/category/category'
        ).then(m => m.Category) 
    },
    { 
        path: 'budgets', 
        loadComponent: () => import(
            '../../feature/budget/budget'
        ).then(m => m.Budget) 
    },
    { 
        path: 'recurring-payments', 
        loadComponent: () => import(
            '../../feature/recurring-payment/recurring-payment'
        ).then(m => m.RecurringPayment) 
    },
     { 
        path: 'users', 
        loadComponent: () => import(
            '../../feature/user-management/user-management'
        ).then(m => m.UserManagement) 
    },
    { 
        path: 'settings', 
        loadComponent: () => import(
            '../../feature/setting/setting'
        ).then(m => m.Setting) 
    },
    { path: '**', redirectTo: '' },
];