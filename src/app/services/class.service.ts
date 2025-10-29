
// src/app/services/class.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Class } from '../models/class.model';

const API_URL = 'http://localhost:3000/api/classes';

@Injectable({ providedIn: 'root' })
export class ClassService {

  constructor(private http: HttpClient) { }

  getAllClasses(): Observable<{ count: number, data: Class[] }> {
    return this.http.get<{ count: number, data: Class[] }>(API_URL);
  }

  deleteClass(id: string): Observable<any> {
    return this.http.delete<any>(`${API_URL}/${id}`);
  }
}
