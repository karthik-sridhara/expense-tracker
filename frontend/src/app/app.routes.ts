import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		loadChildren: () =>
			import('../feature/product-landing/product-landing.routes').then(
				(m) => m.PRODUCT_LANDING_ROUTES
			),
	},
	{
		path: '**',
		redirectTo: '',
	},
];
