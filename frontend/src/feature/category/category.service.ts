import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { AppSessionService } from "../../common/service/app-session";
import { API_ENDPOINTS } from "../../common/const/api-enpoint.const";
import { Observable } from "rxjs";
import { ApiResponse } from "../../common/interface/api-model/api-response";
import { Category } from "../../common/interface/category/category";


@Injectable()
export class CategoryService {

    private currentUserRole!: string;

    constructor(
        private http: HttpClient,
        private appSessionService: AppSessionService,
    ) {
        const currentUser = this.appSessionService.getUser();
        this.currentUserRole = currentUser?.role || '';
    }

    getCategories():Observable<ApiResponse<Category[]>> {
        const endpoint = this.currentUserRole === 'admin' ? API_ENDPOINTS.GET_ADMIN_CATEGORIES : API_ENDPOINTS.GET_CATEGORIES;
        return this.http.get<ApiResponse<Category[]>>(endpoint);
    }
}