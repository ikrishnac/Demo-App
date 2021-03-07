import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { HttpClientService } from './../services/http-client-service.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private httpClientService: HttpClientService
    ) { }

    canActivate() {
        const user = this.httpClientService.userValue;
        if (user) {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}