import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export class HttpManager {
  constructor(private http: HttpClient) {}

  get(url: string) {
    return this.http.get(url);
  }

  post<T>(url: string, data: unknown): Observable<T> {
    return this.http.post<T>(url, data);
  }

  put(url: string, data: any) {
    return this.http.put(url, data);
  }
}