import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../common/const/api-enpoint.const';
import { ApiResponse } from '../../common/interface/api-model/api-response';
import { Page } from '../../common/interface/api-model/page';
import { Payment } from '../../common/interface/payment/payment';
import { PaymentUpsertRequest } from '../../common/interface/payment/payment-upsert-request';

@Injectable({
    providedIn: 'root',
})
export class PaymentService {
    constructor(private http: HttpClient) { }

    getPayments(params?: HttpParams): Observable<ApiResponse<Page<Payment>>> {
        return this.http.get<ApiResponse<Page<Payment>>>(API_ENDPOINTS.MANAGE_PAYMENTS, { params });
    }

    getPaymentById(id: number): Observable<ApiResponse<Payment>> {
        return this.http.get<ApiResponse<Payment>>(`${API_ENDPOINTS.MANAGE_PAYMENTS}/${id}`);
    }

    addPayment(request: PaymentUpsertRequest): Observable<ApiResponse<string>> {
        return this.http.post<ApiResponse<string>>(API_ENDPOINTS.MANAGE_PAYMENTS, request);
    }

    editPayment(id: number, request: PaymentUpsertRequest): Observable<ApiResponse<string>> {
        return this.http.put<ApiResponse<string>>(`${API_ENDPOINTS.MANAGE_PAYMENTS}/${id}`, request);
    }

    deletePayment(id: number): Observable<ApiResponse<string>> {
        return this.http.delete<ApiResponse<string>>(`${API_ENDPOINTS.MANAGE_PAYMENTS}/${id}`);
    }
}
