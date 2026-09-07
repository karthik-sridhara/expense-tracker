import { HttpClient } from "@angular/common/http";
import { LoginRequest } from "../../common/interface/login/login-request";
import { LoginResponse } from "../../common/interface/login/login-response";
import { AppSessionService } from "../../common/service/app-session";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { ApiResponse } from "../../common/interface/api-model/api-response";
import { Router } from "@angular/router";
import { RegisterRequest } from "../../common/interface/register/register-request";

@Injectable()
export class LoginService {

    constructor(
        private http: HttpClient,
        private appSessionService:AppSessionService,
        private router: Router
    ) {}

    login(body: LoginRequest) : Observable<ApiResponse<LoginResponse>> {
        return this.http.post<ApiResponse<LoginResponse>>('http://localhost:9090/api/auth/login', body);
    }

    onLoginSuccess(response: LoginResponse,redirectUrl:string) {
        this.appSessionService.setToken(response.token);
        this.appSessionService.setUser({
            userId: response.userId,
            email: response.email,
            name: response.name,
            role: response.role
        });
        this.router.navigateByUrl(redirectUrl);
    }

    register(body: RegisterRequest): Observable<ApiResponse<unknown>> {
        return this.http.post<ApiResponse<unknown>>('http://localhost:9090/api/auth/registration', body);
    }

    onRegisterSuccess() {
        this.router.navigateByUrl('/login');
    }
}