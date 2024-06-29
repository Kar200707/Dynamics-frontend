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

  post<T>(url: string, data: any): Observable<T> {
    return this.http.post<T>(url, data);
  }
}
