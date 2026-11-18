import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable, of, throwError } from "rxjs";
import { ApiResponse } from "../../common/interface/api-model/api-response";
import { API_ENDPOINTS } from "../../common/const/api-enpoint.const";
import { Profile, ProfileUpdateRequest } from "../../common/interface/profile/profile";

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    constructor(private http: HttpClient) {}

    getProfile(): Observable<ApiResponse<Profile>> {
        return this.http.get<ApiResponse<Profile>>(API_ENDPOINTS.PROFILE);
    }

    updateProfile(body: ProfileUpdateRequest): Observable<ApiResponse<void>> {
        return this.http.put<ApiResponse<void>>(API_ENDPOINTS.PROFILE, body);
    }

    /**
     * Fetches the profile image as a blob, or null when the user has none (404).
     * `no-cache` makes the browser revalidate with If-None-Match on every call, so the
     * server's ETag / 304 handling applies and a changed image is never served stale.
     */
    getImage(): Observable<Blob | null> {
        const headers = new HttpHeaders({
            // Keep JSON acceptable so the backend can still render its error body (e.g. 404 no image).
            Accept: 'image/*, application/json',
            'Cache-Control': 'no-cache'
        });
        return this.http.get(API_ENDPOINTS.PROFILE_IMAGE, { headers, responseType: 'blob' }).pipe(
            map((blob) => blob as Blob | null),
            catchError((error: HttpErrorResponse) =>
                error.status === 404 ? of(null) : throwError(() => error)
            )
        );
    }

    uploadImage(file: File): Observable<ApiResponse<void>> {
        const form = new FormData();
        form.append('file', file);
        return this.http.post<ApiResponse<void>>(API_ENDPOINTS.PROFILE_IMAGE, form);
    }

    deleteImage(): Observable<void> {
        return this.http.delete<void>(API_ENDPOINTS.PROFILE_IMAGE);
    }
}
