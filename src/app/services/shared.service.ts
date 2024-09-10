import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SharedService {    
    userDevice: string = '';
    userIP: string = '';

    constructor(private http: HttpClient) { }

    getUserDevice() {
        const userAgent = window.navigator.userAgent;
        const device = /Mobile/.test(userAgent) ? 'Mobile' : 'Desktop';
        this.userDevice = device;
      }
    
      getUserIP() {
        this.http.get('https://api.ipify.org/?format=json').subscribe(
          (res: any) => {
            this.userIP = res.ip;
          },
          (err) => {
            this.userIP = "Error IP " + err;
          }
        );
      }
}