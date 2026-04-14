import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { LoginResponse } from "../../data/auth.types";
import { HttpManager } from "../../core/http/http_manager";
import { Net } from "../../shared/constants/net";

@Injectable({
    providedIn: 'root'
})
export class LoginService extends HttpManager {
    constructor(http: HttpClient) {
        super(http);
    }

    login(email: string, password: string): Observable<LoginResponse> {
        const url = `${Net.apiAddress}${Net.login}`;
        
        return this.post<LoginResponse>(
            url, { 
                email, 
                password });
    }
}