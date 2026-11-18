import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "../../common/interface/api-model/api-response";
import { API_ENDPOINTS } from "../../common/const/api-enpoint.const";
import { User } from "../../common/interface/user-management/user-management";
import { UserUpsertRequest } from "../../common/interface/user-management/user-upsert";
import { Page } from "../../common/interface/api-model/page";
import { ChangePasswordRequest } from "../../common/interface/login/change-password-request";
    
@Injectable({ providedIn: 'root' })
export class UserManagementService {
    constructor(private http: HttpClient) {}

    getUsers(params?: HttpParams): Observable<ApiResponse<Page<User>>> {
        return this.http.get<ApiResponse<Page<User>>>(API_ENDPOINTS.MANAGE_ADMIN_USERS, { params });
    }
    
    editUser(userId: number, user: UserUpsertRequest): Observable<ApiResponse<string>> {
        return this.http.put<ApiResponse<string>>(`${API_ENDPOINTS.MANAGE_ADMIN_USERS}/${userId}`, user);
    }
    
    deleteUser(userId: number): Observable<ApiResponse<string>> {
        return this.http.delete<ApiResponse<string>>(`${API_ENDPOINTS.MANAGE_ADMIN_USERS}/${userId}`);
    }

    getUser(userId: number): Observable<ApiResponse<User>> {
        return this.http.get<ApiResponse<User>>(`${API_ENDPOINTS.MANAGE_ADMIN_USERS}/${userId}`);
    }

    resetPassword(userId: number, body: ChangePasswordRequest): Observable<ApiResponse<void>> {
        return this.http.put<ApiResponse<void>>(`${API_ENDPOINTS.MANAGE_ADMIN_USERS}/${userId}/password`, body);
    }
}