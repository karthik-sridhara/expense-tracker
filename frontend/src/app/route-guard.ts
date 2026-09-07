import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AppSessionService } from "../common/service/app-session";
import { inject } from "@angular/core";

export const authGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    const authService = inject(AppSessionService);
    if (authService.isAuthenticated()) {
        return true;
    }else{
        const router = inject(Router);
        return router.createUrlTree(['/login'],{ queryParams: { returnUrl: state.url } });
    }
};