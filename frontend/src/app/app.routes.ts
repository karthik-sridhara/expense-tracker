import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
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
	},
	{
		path: '**',
		redirectTo: '',
	},
];
