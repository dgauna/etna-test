import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserRegister } from '../../interfaces/user';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl: string = `${environment.apiUrl}/Users`;
  user!: any;
  constructor(private _http: HttpClient) { }

  register(value: UserRegister) {
    return this._http.post<any>(`${this.apiUrl}/Register`, value, {observe: 'response'})
  }
}
