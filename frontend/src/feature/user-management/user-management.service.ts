import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "../../common/interface/api-model/api-response";
import { API_ENDPOINTS } from "../../common/const/api-enpoint.const";
import { User } from "../../common/interface/user-management/user-management";
import { UserUpsertRequest } from "../../common/interface/user-management/user-upsert";
    
@Injectable({ providedIn: 'root' })
export class UserManagementService {
    constructor(private http: HttpClient) {}

    getUsers(params?: HttpParams): Observable<ApiResponse<User[]>> {
        return this.http.get<ApiResponse<User[]>>(API_ENDPOINTS.MANAGE_ADMIN_USERS, { params });
    }

    
    addUser(user: UserUpsertRequest): Observable<ApiResponse<string>> {
        return this.http.post<ApiResponse<string>>(API_ENDPOINTS.MANAGE_ADMIN_USERS, user);
    }
    
    editUser(userId: number, user: UserUpsertRequest): Observable<ApiResponse<string>> {
        return this.http.put<ApiResponse<string>>(`${API_ENDPOINTS.MANAGE_ADMIN_USERS}/${userId}`, user);
    }
    
    deleteUser(userId: number): Observable<ApiResponse<string>> {
        return this.http.delete<ApiResponse<string>>(`${API_ENDPOINTS.MANAGE_ADMIN_USERS}/${userId}`);
    }
}