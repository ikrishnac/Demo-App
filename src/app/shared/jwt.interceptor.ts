import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpClientService } from '../services/http-client-service.service';
import { ENDPOINTS } from '../constants/constants';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private httpClientService: HttpClientService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const user = this.httpClientService.userValue;
        const tokens = this.httpClientService.tokensValue;
        const isLoggedIn = user && user.data;
        if (isLoggedIn && request.url === ENDPOINTS.USER) {
            request = request.clone({
                setHeaders: { Authorization: `Bearer ${tokens.token}` }
            });
        }

        return next.handle(request);
    }
}