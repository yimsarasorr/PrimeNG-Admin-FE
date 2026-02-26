import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:3000/api/reservations'; // NestJS API

  constructor(private http: HttpClient) {}

  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }

  createReservation(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}