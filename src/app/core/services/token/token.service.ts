import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt'
@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private jwtHelper: JwtHelperService = new JwtHelperService();
  constructor() { }
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    const token = localStorage.getItem('access_token')
    return token
  }

  isAuthenticated(): boolean {
    const token = this.getToken();

    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  decodeToken() {
    const helper = new JwtHelperService();

    if (!this.getToken()) return null;

    if (this.getToken() != '' && this.getToken() != null) {
      const token = this.getToken()?.toString();
      if (token) {
        return helper.decodeToken(token);
      }
      return null;
    }
  }
}
