
// src/app/services/local-storage.service.ts

import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    getItem(key: string): string | null {
        if (this.isBrowser) {
            return localStorage.getItem(key);
        }
        return null;
    }

    setItem(key: string, value: string): void {
        if (this.isBrowser) {
            localStorage.setItem(key, value);
        }
        // Do nothing on the server
    }

    removeItem(key: string): void {
        if (this.isBrowser) {
            localStorage.removeItem(key);
        }
    }

    // Clear method is optional but helpful
    clear(): void {
        if (this.isBrowser) {
            localStorage.clear();
        }
    }
}
