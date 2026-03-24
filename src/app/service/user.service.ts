import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { SupabaseService } from './supabase.service';

export interface UserMetric { title: string; value: string; subtext: string; }
export interface UserProfile { id: string; name: string; email: string; phone: string; avatar: string; role: string; created_at: string; joined_date: string; status?: string; }
export interface UserManagementResponse { metrics: UserMetric[]; profiles: UserProfile[]; }
export interface User { id: string; email?: string; category?: string; first_name?: string; firstName?: string; last_name?: string; lastName?: string; company?: string; role?: string; status?: string; [key: string]: any; }

@Injectable({ providedIn: 'root' })
export class UserService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private apiUrl = environment.apiUrl || 'https://fastpassadminapi.vercel.app/api';

  constructor(private http: HttpClient, private supabaseService: SupabaseService) {
    this.supabaseService.supabase.auth.getSession().then(({ data: { session } }) => {
      this.currentUserSubject.next(session?.user ?? null);
    });
  }

  private getHeaders(): Observable<HttpHeaders> {
    return from(this.supabaseService.getAuthToken()).pipe(
      map(token => {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        if (token) headers = headers.set('Authorization', `Bearer ${token}`);
        return headers;
      })
    );
  }

  getProfiles(): Observable<UserManagementResponse> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.get<any[]>(`${this.apiUrl}/users`, { headers })),
      map(users => this.transformToUserManagementResponse(users)),
      catchError(err => throwError(() => err))
    );
  }

  getUsers(): Observable<any[]> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.get<any[]>(`${this.apiUrl}/users`, { headers })),
      catchError(err => throwError(() => err))
    );
  }

  updateUserStatus(userId: string, status: string): Observable<any> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.put(`${this.apiUrl}/users/${userId}/status`, { status }, { headers })),
      catchError(err => throwError(() => err))
    );
  }

  updateUserRole(userId: string, role: string): Observable<any> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.put(`${this.apiUrl}/users/${userId}/role`, { role }, { headers })),
      catchError(err => throwError(() => err))
    );
  }

  checkSession(): Observable<any> {
    return from(this.supabaseService.supabase.auth.getSession());
  }

  logout(): Observable<any> {
    return from(this.supabaseService.supabase.auth.signOut().then(() => {
      this.currentUserSubject.next(null);
    }));
  }

  private transformToUserManagementResponse(users: any[]): UserManagementResponse {
    const total = users.length;
    const active = users.filter(u => u.status === 'Active').length;
    const blacklist = users.filter(u => u.status === 'Blacklist').length;
    const admins = users.filter(u => u.role?.toLowerCase().includes('admin')).length;

    const metrics: UserMetric[] = [
      { title: 'ผู้ใช้งานทั้งหมด', value: total.toString(), subtext: 'Total Users' },
      { title: 'ผู้ดูแลระบบ', value: admins.toString(), subtext: 'Admins' },
      { title: 'ใช้งานปกติ', value: active.toString(), subtext: 'Active Users' },
      { title: 'ระงับการใช้งาน', value: blacklist.toString(), subtext: 'Blacklisted' }
    ];

    const profiles: UserProfile[] = users.map(u => ({
      id: u.id,
      name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'Unknown',
      email: u.email,
      phone: u.phone,
      avatar: u.avatar_url,
      role: u.role,
      created_at: u.created_at,
      joined_date: u.register_date || u.created_at,
      status: u.status
    }));

    return { metrics, profiles };
  }
}