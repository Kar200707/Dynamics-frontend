import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class RequestService {

  constructor(private http: HttpClient) { }

  get<T>(url: string):Observable<T> {
    return this.http.get<T>(url);
  }

  put<T>(url: string, data: any): Observable<T> {
    return this.http.put<T>(url, data);
  }

  post<T>(url: string, data: any): Observable<T> {
    return this.http.post<T>(url, data);
  }

  delete<T>(url: string, data: any): Observable<any> {
    return this.http.delete<T>(url, data);
  }
}
