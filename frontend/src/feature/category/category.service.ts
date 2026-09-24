import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppSessionService } from "../../common/service/app-session";
import { API_ENDPOINTS } from "../../common/const/api-enpoint.const";
import { Observable } from "rxjs";
import { ApiResponse } from "../../common/interface/api-model/api-response";
import { Category } from "../../common/interface/category/category";
import { CategoryUpsertRequest } from "../../common/interface/category/category-upsert";
import { Role } from "../../common/enum/role";


@Injectable({
    providedIn: 'root'
})
export class CategoryService {


    constructor(
        private http: HttpClient,
        private appSessionService: AppSessionService,
    ) {}

    getCategories(params?: HttpParams): Observable<ApiResponse<Category[]>> {
        return this.http.get<ApiResponse<Category[]>>(API_ENDPOINTS.MANAGE_CATEGORIES, { params });
    }

    private getEndpointForCategory(isUniversal: boolean): string {
        const currentUser = this.appSessionService.getUser();
        let endpoint = API_ENDPOINTS.MANAGE_CATEGORIES;
        if( currentUser!.role === Role.ADMIN) {
            endpoint = API_ENDPOINTS.MANAGE_ADMIN_CATEGORIES;
        }else if( currentUser!.role === Role.EMPLOYEE && isUniversal){
            endpoint = API_ENDPOINTS.MANAGE_ADMIN_CATEGORIES;
        }
        return endpoint;
    }

    addCategory(category: CategoryUpsertRequest): Observable<ApiResponse<string>> {
        return this.http.post<ApiResponse<string>>(
            this.getEndpointForCategory(category.isUniversal), category
        );
    }

    editCategory(categoryId: number, category: CategoryUpsertRequest): Observable<ApiResponse<string>> {
        const endpoint = this.getEndpointForCategory(category.isUniversal) + `/${categoryId}`;
        return this.http.put<ApiResponse<string>>(
            endpoint, category
        );
    }

    deleteCategory(categoryId: number, isUniversal: boolean): Observable<ApiResponse<string>> {
        const endpoint = this.getEndpointForCategory(isUniversal) + `/${categoryId}`;
        return this.http.delete<ApiResponse<string>>(
            endpoint
        );
    }

}