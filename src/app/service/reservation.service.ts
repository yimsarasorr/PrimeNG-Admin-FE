import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Reservation {
  user: string;
  id: string;
  date: string;
  time: string;
  room: string;
  type: string;
  invitee: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = environment.apiUrl + '/reservations';

  constructor(private http: HttpClient) {}

  // ✅ เปลี่ยน URL ให้ตรงกับ Backend: /api/reservations/getallreservations
  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/getallreservations`);
  }

  // ✅ เปลี่ยน URL ให้ตรงกับ Backend: /api/reservations/createreservation
  createReservation(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createreservation`, data);
  }

  // ✅ (เพิ่มให้) ดึงข้อมูลเฉพาะของ User ที่รับค่าทาง Body ตามที่เพิ่งแก้ไป
  getReservationByUser(userName: string): Observable<Reservation[]> {
    return this.http.post<Reservation[]>(`${this.apiUrl}/getreservationbyuser`, { user: userName });
  }
}