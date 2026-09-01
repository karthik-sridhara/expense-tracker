import { LocalStorageKey } from "../enum/local-storage-key";

export class LocalStorageService {

    static getItem(key:LocalStorageKey): Object | null {
        const value = localStorage.getItem(key);    
        if (value) {
            return JSON.parse(value);
        }
        return null;
    }

    static setItem(key:LocalStorageKey, value:Object): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static setValue(key:LocalStorageKey, value:string): void {
        localStorage.setItem(key, value);
    }

    static getValue(key:LocalStorageKey): string | null {
        return localStorage.getItem(key);
    }

    static remove(key:LocalStorageKey): void {
        localStorage.removeItem(key);
    }
}