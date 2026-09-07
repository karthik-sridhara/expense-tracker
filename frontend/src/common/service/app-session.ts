import { Injectable } from "@angular/core";
import { LocalStorageService } from "./local-storage";
import { LocalStorageKey } from "../enum/local-storage-key";
import { LoggedUser } from "../interface/login/logged-user";

@Injectable({ providedIn: 'root' })
export class AppSessionService {

    private token: string | null = null;
    private user: LoggedUser | null = null;
    
    isAuthenticated(): boolean {
        return !!this.getToken() && !!this.getUser();
    }

    setToken(token: string): void {
        this.token = token;
        LocalStorageService.setValue(LocalStorageKey.AUTH_TOKEN, token);
    }

    getToken(): string | null {
        if (!this.token) {
            this.token = LocalStorageService.getValue(LocalStorageKey.AUTH_TOKEN);
        }
        return this.token;
    }

    setUser(user: LoggedUser): void {
        this.user = user;
        LocalStorageService.setItem(LocalStorageKey.USER, user);
    }

    getUser(): LoggedUser | null {
        if (!this.user) {
            const userData = LocalStorageService.getItem(LocalStorageKey.USER);
            if (userData) {
                this.user = userData as LoggedUser;
            }
        }
        return this.user;
    }

}