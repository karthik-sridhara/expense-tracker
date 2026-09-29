import { Routes } from "@angular/router";

export const LOGIN_ROUTER:Routes = [
    {
        path:'',
        loadComponent: () =>
            import('./components/login-form/login-form').then(
                (m) => m.LoginForm
            ),
    },
    {
        path:'register',
        loadComponent: () =>
            import('./components/register-form/register-form').then(
                (m) => m.RegisterForm
            ),
    },
    {
        path:'change-password',
        loadComponent: () =>
            import('./components/change-password/change-password').then(
                (m) => m.ChangePasswordForm
            ),
    },
    {
        path:'**',
        redirectTo: '',
    }

];