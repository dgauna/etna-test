import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Login } from '../../interfaces/login';
import { TokenService } from '../token/token.service';
import { JwtHelperService } from '@auth0/angular-jwt';

const jwtHelper = new JwtHelperService()

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl: string = `${environment.apiUrl}/Users`;
  user!: any;
  token: any;
  constructor(private _http: HttpClient, private _tokenSvc: TokenService) { }

  login(value: Login) {
    return this._http.post<any>(`${this.apiUrl}/login`, value, {observe: 'response'})
  }

  public isLoggedIn() {
    const token = this._tokenSvc.getToken()?.toString()
    if (token) {
      return jwtHelper.isTokenExpired(token)
    }
    return null
  }

  logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('email')
    localStorage.clear()
  }
}
