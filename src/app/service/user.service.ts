import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  first_name?: string;
  lastName?: string;
  last_name?: string;
  role: string;
  category?: string;
  status?: string;
  phone?: string;
  company?: string;
  expiryDate?: string | null;
  registerDate?: string;
  authMethod?: string;
  lastActive?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public supabase: SupabaseClient; 
  private apiUrl = environment.apiUrl ; // URL ของ NestJS API สำหรับ User

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        lock: false
      }
    } as any);

    this.handleMagicLinkHash();
    this.initAuthListener();
  }

  private async handleMagicLinkHash() {
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      console.log('🔗 ตรวจพบ Magic Link Hash...');
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (accessToken) {
        const { error } = await this.supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || ''
        });

        if (!error) {
          console.log('✅ Set Session สำเร็จ');
          // ไม่ต้อง Navigate ตรงนี้ก็ได้ เพราะ onAuthStateChange จะทำงานต่อทันที
        }
      }
    }
  }

  private initAuthListener() {
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // 🔥 จุดที่เพิ่ม 1: สั่ง Sync ข้อมูลลง DB ทันทีที่มี User Session
        // ข้อมูล Firstname/Lastname ที่แนบมาจะอยู่ใน session.user.user_metadata
        this.syncUserToDatabase(session.user);

        // จากนั้นค่อยดึง Profile มาแสดงผล
        this.fetchUserProfile(session.user.email!).subscribe(profile => {
          this.currentUserSubject.next(profile);
        });

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
           // เช็ค Router URL ปัจจุบันก่อน Redirect เพื่อไม่ให้วนลูป
           if (this.router.url === '/login' || this.router.url === '/') {
               this.router.navigate(['/dashboard']);
           }
        }
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  // 🔥 จุดที่เพิ่ม 2: ฟังก์ชันยิงไปหา Backend
  private syncUserToDatabase(user: any) {
    // ส่งข้อมูล User ทั้งก้อน (รวม Metadata) ไปให้ Backend จัดการ
    this.http.post(`${this.apiUrl}/sync-profile`, { user }).subscribe({
      next: () => console.log('✅ Database Sync Success: ข้อมูลลงตาราง users แล้ว'),
      error: (err) => console.error('❌ Database Sync Failed:', err)
    });
  }

  // ... (ส่วนอื่นๆ เหมือนเดิม) ...
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  private fetchUserProfile(email: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/profile`, { email }).pipe(
      catchError(err => {
        // Return Mock Data ชั่วคราว (รอ Sync เสร็จ)
        return of({ 
          id: '0', 
          email, 
          role: 'User',
          firstName: 'Loading...', 
          lastName: '' 
        } as User);
      })
    );
  }

  checkSession(): Observable<any> {
    return from(this.supabase.auth.getSession());
  }

  logout(): Observable<any> {
    return from(this.supabase.auth.signOut()).pipe(
        tap(() => this.currentUserSubject.next(null)) 
    );
  }
  updateUserRole(userId: string, role: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${userId}/role`, { role });
  }
}