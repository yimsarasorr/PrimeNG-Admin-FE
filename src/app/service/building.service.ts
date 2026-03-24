import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, of } from 'rxjs'; // ✅ นำเข้า of, from
import { switchMap } from 'rxjs/operators'; // ✅ นำเข้า switchMap
import { environment } from '../../environments/environment';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class BuildingService {
  private apiUrl = environment.apiUrl + '/buildings';

  constructor(private http: HttpClient, private supabaseService: SupabaseService) {}

  // 🚀 รอให้ Supabase คืนค่า Token มาก่อน แล้วประกอบเป็น Header
  private getHeaders(): Observable<HttpHeaders> {
    return from(this.supabaseService.getAuthToken()).pipe(
      switchMap(token => {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        
        if (token) {
          // ถ้ามี Token ก็ยัดใส่ Header
          headers = headers.set('Authorization', `Bearer ${token}`);
        } else {
          console.warn('⚠️ ไม่พบ Token จาก Supabase (ผู้ใช้อาจจะยังไม่ได้ล็อกอิน)');
        }
        
        return of(headers); // ส่ง Header ออกไปใช้งานต่อ
      })
    );
  }

  // 🚀 ยิง API โดยการรอ Header ก่อนเสมอ!
  getBuildings(): Observable<any[]> { 
    return this.getHeaders().pipe(
      switchMap(headers => this.http.get<any[]>(this.apiUrl, { headers }))
    );
  }
  
  createBuilding(data: any): Observable<any> { 
    return this.getHeaders().pipe(
      switchMap(headers => this.http.post<any>(this.apiUrl, data, { headers }))
    );
  }
  
  updateBuilding(id: string, data: any): Observable<any> { 
    return this.getHeaders().pipe(
      switchMap(headers => this.http.put<any>(`${this.apiUrl}/${id}`, data, { headers }))
    );
  }
  
  deleteBuilding(id: string, name: string): Observable<any> { 
    return this.getHeaders().pipe(
      switchMap(headers => this.http.delete<any>(`${this.apiUrl}/${id}`, { headers, body: { name } }))
    );
  }
}