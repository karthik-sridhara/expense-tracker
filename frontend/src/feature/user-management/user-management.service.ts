import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "../../common/interface/api-model/api-response";
import { API_ENDPOINTS } from "../../common/const/api-enpoint.const";
import { User } from "../../common/interface/user-management/user-management";

@Injectable({ providedIn: 'root' })
export class UserManagementService {
    constructor(private http: HttpClient) {}

    getUsers(params?: HttpParams): Observable<ApiResponse<User[]>> {
        return this.http.get<ApiResponse<User[]>>(API_ENDPOINTS.MANAGE_ADMIN_USERS, { params });
    }
}