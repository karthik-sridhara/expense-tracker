import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../common/const/api-enpoint.const';
import { ApiResponse } from '../../common/interface/api-model/api-response';
import { Page } from '../../common/interface/api-model/page';
import { BudgetUpsertRequest } from '../../common/interface/budget/budget-upsert-request';
import { Budget } from '../../common/interface/budget/budget';


@Injectable({
    providedIn: 'root',
})
export class BudgetService {
    constructor(private http: HttpClient) { }

    getBudgets(params?:HttpParams): Observable<ApiResponse<Page<Budget>>> {
        return this.http.get<ApiResponse<Page<Budget>>>(API_ENDPOINTS.MANAGE_BUDGETS, { params });
    }

    getBudget(budgetId: number): Observable<ApiResponse<Budget>> {
        return this.http.get<ApiResponse<Budget>>(`${API_ENDPOINTS.MANAGE_BUDGETS}/${budgetId}`);
    }

    addBudget(budget: BudgetUpsertRequest): Observable<ApiResponse<string>> {
        return this.http.post<ApiResponse<string>>(API_ENDPOINTS.MANAGE_BUDGETS, budget);
    }

    editBudget(budgetId: number, budget: BudgetUpsertRequest): Observable<ApiResponse<string>> {
        return this.http.put<ApiResponse<string>>(`${API_ENDPOINTS.MANAGE_BUDGETS}/${budgetId}`, budget);
    }

    deleteBudget(budgetId: number): Observable<ApiResponse<string>> {
        return this.http.delete<ApiResponse<string>>(`${API_ENDPOINTS.MANAGE_BUDGETS}/${budgetId}`);
    }
}