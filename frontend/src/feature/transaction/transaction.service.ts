import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../common/const/api-enpoint.const';
import { ApiResponse } from '../../common/interface/api-model/api-response';
import { Page } from '../../common/interface/api-model/page';
import { Transaction } from '../../common/interface/transaction/transaction';
import { TransactionUpsertRequest } from '../../common/interface/transaction/transaction-upsert-request';

@Injectable({
    providedIn: 'root',
})
export class TransactionService {
    constructor(private http: HttpClient) { }

    getTransactions(params?: HttpParams): Observable<ApiResponse<Page<Transaction>>> {
        return this.http.get<ApiResponse<Page<Transaction>>>(API_ENDPOINTS.MANAGE_TRANSACTIONS, { params });
    }

    getTransactionById(id: number): Observable<ApiResponse<Transaction>> {
        return this.http.get<ApiResponse<Transaction>>(`${API_ENDPOINTS.MANAGE_TRANSACTIONS}/${id}`);
    }

    addTransaction(request: TransactionUpsertRequest): Observable<ApiResponse<string>> {
        return this.http.post<ApiResponse<string>>(API_ENDPOINTS.MANAGE_TRANSACTIONS, request);
    }

    editTransaction(id: number, request: TransactionUpsertRequest): Observable<ApiResponse<string>> {
        return this.http.put<ApiResponse<string>>(`${API_ENDPOINTS.MANAGE_TRANSACTIONS}/${id}`, request);
    }

    deleteTransaction(id: number): Observable<ApiResponse<string>> {
        return this.http.delete<ApiResponse<string>>(`${API_ENDPOINTS.MANAGE_TRANSACTIONS}/${id}`);
    }
}
