import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ActivityLog, Metric } from '../models/dashboard.model';
import { environment } from '../../environments/environment';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = environment.apiUrl + '/dashboard';

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

  getMetrics(): Observable<Metric[]> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.get<Metric[]>(`${this.apiUrl}/metrics`, { headers })),
      catchError(err => throwError(() => err))
    );
  }

  getActivities(): Observable<ActivityLog[]> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.get<ActivityLog[]>(`${this.apiUrl}/activities`, { headers })),
      catchError(err => throwError(() => err))
    );
  }
}