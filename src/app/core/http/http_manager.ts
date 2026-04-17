import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export class HttpManager {
  constructor(private http: HttpClient) {}

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }

  post<T>(url: string, data: unknown): Observable<T> {
    return this.http.post<T>(url, data);
  }

  put<T>(url: string, data: any): Observable<T> {
    return this.http.put<T>(url, data);
  }
}