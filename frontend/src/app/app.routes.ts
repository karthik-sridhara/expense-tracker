import { Routes } from '@angular/router';
import { authGuard } from './route-guard';

export const routes: Routes = [
	{
		path: 'landing',
		loadComponent: () =>
			import('../feature/product-landing/product-landing').then(
				(m) => m.ProductLanding
			),
	},
	{
		path:'login',
		loadComponent: () =>
			import('../feature/login/login').then(
				(m) => m.Login
			),
		loadChildren: () =>
			import('../feature/login/login.routes').then(
				(m) => m.LOGIN_ROUTER
			),
	},
	{
		path: '',
		canActivate: [authGuard],
		loadComponent: () => import('./shell/shell').then(m => m.Shell),
		loadChildren: () => import('./shell/shell.routes').then(m => m.SHELL_ROUTES),
	},
	{
		path: '**',
		redirectTo: '',
	},
];
