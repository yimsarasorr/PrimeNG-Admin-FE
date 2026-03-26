import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs'; 
import { catchError, map, switchMap } from 'rxjs/operators'; 
import { environment } from '../../environments/environment';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private apiUrl = environment.apiUrl || 'https://fastpassadminapi.vercel.app/api';

  constructor(private http: HttpClient, private supabaseService: SupabaseService) {}

  private getHeaders(): Observable<HttpHeaders> {
    return from(this.supabaseService.getAuthToken()).pipe(
      map(token => {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        if (token) headers = headers.set('Authorization', `Bearer ${token}`);
        return headers;
      })
    );
  }

  getAllReservations(): Observable<any> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.get<any>(`${this.apiUrl}/reservations/getallreservations`, { headers })),
      catchError(err => throwError(() => err))
    );
  }

  getReservationByUser(userName: string): Observable<any> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.post<any>(`${this.apiUrl}/reservations/getreservationbyuser`, { user: userName }, { headers })),
      catchError(err => throwError(() => err))
    );
  }

  createReservation(data: any): Observable<any> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.post<any>(`${this.apiUrl}/reservations/createreservation`, data, { headers })),
      catchError(err => throwError(() => err))
    );
  }

  updateReservation(id: string, data: any): Observable<any> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.put<any>(`${this.apiUrl}/reservations/${id}`, data, { headers })),
      catchError(err => throwError(() => err))
    );
  }
  getDoorAccess(): Observable<any> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.get<any>(`${this.apiUrl}/reservations/dooraccess`, { headers })),
      catchError(err => throwError(() => err))
    );
  }

}