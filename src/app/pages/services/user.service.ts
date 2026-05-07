import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpManager } from '../../core/http/http_manager';
import type { CreateUserDto, UpdateUserDto, User } from '../../data/user.types';
import { Net, userByIdPath, userUpdateByIdPath } from '../../shared/constants/net';

@Injectable({ providedIn: 'root' })
export class UserService extends HttpManager {
  constructor(http: HttpClient) {
    super(http);
  }

  /** GET `/api/auth/all` */
  list(): Observable<User[]> {
    const url = `${Net.apiAddress}${Net.authUsers}`;
    return this.get<User[]>(url);
  }

  /** POST `/api/auth/create` */
  create(dto: CreateUserDto): Observable<User> {
    const url = `${Net.apiAddress}${Net.authCreateUser}`;
    return this.post<User>(url, dto);
  }

  /** PATCH `/api/auth/update/:id` */
  update(userId: string, dto: UpdateUserDto): Observable<User> {
    const url = `${Net.apiAddress}${userUpdateByIdPath(userId)}`;
    return this.patch<User>(url, dto);
  }

  /** DELETE `/api/auth/:id` */
  remove(userId: string): Observable<void> {
    const url = `${Net.apiAddress}${userByIdPath(userId)}`;
    return super.delete<void>(url);
  }
}
