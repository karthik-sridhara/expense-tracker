import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../common/const/api-enpoint.const';
import { ApiResponse } from '../../common/interface/api-model/api-response';
import { Page } from '../../common/interface/api-model/page';
import { RecurringPayment } from '../../common/interface/recurring-payment/recurring-payment';
import { RecurringPaymentUpsertRequest } from '../../common/interface/recurring-payment/recurring-payment-upsert-request';

@Injectable({
    providedIn: 'root',
})
export class RecurringPaymentService {
    constructor(private http: HttpClient) { }

    getRecurringPayments(params?: HttpParams): Observable<ApiResponse<Page<RecurringPayment>>> {
        return this.http.get<ApiResponse<Page<RecurringPayment>>>(API_ENDPOINTS.MANAGE_RECURRING_PAYMENTS, { params });
    }

    addRecurringPayment(request: RecurringPaymentUpsertRequest): Observable<ApiResponse<string>> {
        return this.http.post<ApiResponse<string>>(API_ENDPOINTS.MANAGE_RECURRING_PAYMENTS, request);
    }

    editRecurringPayment(id: number, request: RecurringPaymentUpsertRequest): Observable<ApiResponse<string>> {
        return this.http.put<ApiResponse<string>>(`${API_ENDPOINTS.MANAGE_RECURRING_PAYMENTS}/${id}`, request);
    }

    deleteRecurringPayment(id: number): Observable<ApiResponse<string>> {
        return this.http.delete<ApiResponse<string>>(`${API_ENDPOINTS.MANAGE_RECURRING_PAYMENTS}/${id}`);
    }
}
