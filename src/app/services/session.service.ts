import { Injectable } from '@angular/core';
import { DataUser } from '../entities/data-user.entity';
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private token: string | null = null;
  private userData: DataUser = {} as DataUser;
  private expToken: any = null;
  private userDevice: string = '';
  private userIP: string = '';

  constructor(private readonly http: HttpClient) {}
  public setUserDevice() {
    const userAgent = window.navigator.userAgent;
    const device = /Mobile/.test(userAgent) ? 'Mobile' : 'Desktop';
    this.userDevice = device;
  }

  public setUserIP() {
    this.http.get('https://api.ipify.org/?format=json').subscribe(
      (res: any) => {
        this.userIP = res.ip;
      },
      (err) => {
        this.userIP = 'Error IP ' + err;
      }
    );
  }

  public getUserDevice() {
    return this.userDevice;
  }
  public getUserIP() {
    return this.userIP;
  }
  public setExpToken(expToken: any) {
    this.expToken = expToken;
    localStorage.setItem('LuveckExpToken', JSON.stringify(expToken));
  }
  public getExpToken() {
    if (!this.expToken) {
      const storedExpToken = localStorage.getItem('LuveckExpToken');
      if (storedExpToken) {
        this.expToken = JSON.parse(storedExpToken);
      }
    }
    return this.expToken;
  }
  public setToken(token: string) {
    this.token = token;
    localStorage.setItem('LuveckUserToken', token);
  }

  public getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('LuveckUserToken');
    }
    return this.token;
  }

  public setUserData(pharmacyId: string) {
    try {
      const decoded: any = jwtDecode(this.token ?? '');
      this.userData = {
        UserId: decoded.UserId,
        UserName: decoded.UserName,
        LastName: decoded.LastName,
        Role: decoded.Role,
        Email: decoded.Email,
        countryId: decoded.CountryId,
        pharmacyId: pharmacyId,
      };
      localStorage.setItem('LuveckUserData', JSON.stringify(this.userData));
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  public getUserData() {
    if (this.userData.Role == undefined) {
      const storedUserData = localStorage.getItem('LuveckUserData');
      if (storedUserData) {
        this.userData = JSON.parse(storedUserData);
      }
    }
    return this.userData;
  }

  public clearSession() {
    this.token = null;
    this.expToken = null;
    localStorage.removeItem('LuveckUserToken');
    localStorage.removeItem('LuveckUserData');
    localStorage.removeItem('LuveckExpToken');
    this.userData = {} as DataUser;
  }
}
