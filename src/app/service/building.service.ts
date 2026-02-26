import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BuildingService {
  private apiUrl = 'http://localhost:3000/api/buildings';

  constructor(private http: HttpClient) {}

  getBuildings(): Observable<any[]> { 
    return this.http.get<any[]>(this.apiUrl); 
  }
  
  createBuilding(data: any): Observable<any> { 
    return this.http.post(this.apiUrl, data); 
  }
  
  updateBuilding(id: string, data: any): Observable<any> { 
    return this.http.put(`${this.apiUrl}/${id}`, data); 
  }
  
  deleteBuilding(id: string, name: string): Observable<any> { 
    return this.http.delete(`${this.apiUrl}/${id}`, { body: { name } }); 
  }
}