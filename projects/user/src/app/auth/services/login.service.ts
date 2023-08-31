import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateAccount, Login } from './../constant/DTO';
import { environment } from 'projects/admin/src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  createUser(model: CreateAccount) {
    return this.http.post(
      environment.baseApi.replace('tasks', 'auth') + '/createAccount',
      model
    );
  }

  login(model: Login) {
    return this.http.post(
      environment.baseApi.replace('tasks', 'auth') + '/login',
      model
    );
  }
}
