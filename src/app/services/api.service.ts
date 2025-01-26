import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionService } from './session.service';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private headers: { [key: string]: string } = {};
  private readonly url = environment.urlApi;
  private token: string = '';

  constructor(
    private readonly http: HttpClient,
    private readonly sessionService: SessionService
  ) {}

  private setHeaders() {
    this.sessionService.setUserDevice();
    this.sessionService.setUserIP();
    this.headers['Content-Type'] = 'application/json';
    this.headers['X-Client-IP'] = this.sessionService.getUserIP();
    this.headers['X-Client-Device'] = this.sessionService.getUserDevice();
    this.token = this.sessionService.getToken() ?? '';
    if (this.token !== '') {
      this.headers['Authorization'] = `Bearer ${this.token}`;
    }
  }

  public setCustomHeader(customHeaders: { [key: string]: string } = {}): void {
    this.headers = { ...this.headers, ...customHeaders };
  }

  private createHeaders(): HttpHeaders {
    this.setHeaders();
    return new HttpHeaders({ ...this.headers });
  }

  public async get<T>(path: string, params?: HttpParams): Promise<T> {
    return await lastValueFrom(
      this.http.get<T>(`${this.url}/${path}`, {
        params,
        headers: this.createHeaders(),
      })
    ).catch(this.handleError);
  }

  public async post<T>(path: string, data: any): Promise<T> {
    return await lastValueFrom(
      this.http.post<T>(`${this.url}/${path}`, data, {
        headers: this.createHeaders(),
      })
    ).catch(this.handleError);
  }

  public async put<T>(path: string, data: any): Promise<T> {
    return await lastValueFrom(
      this.http.put<T>(`${this.url}/${path}`, data, {
        headers: this.createHeaders(),
      })
    ).catch(this.handleError);
  }

  public async patch<T>(path: string, data: any): Promise<T> {
    return await lastValueFrom(
      this.http.patch<T>(`${this.url}/${path}`, data, {
        headers: this.createHeaders(),
      })
    ).catch(this.handleError);
  }

  public async delete<T>(path: string, data?: any): Promise<T> {
    const options = {
      headers: this.createHeaders(),
      body: data,
    };

    return await lastValueFrom(
      this.http.delete<T>(`${this.url}/${path}`, options)
    ).catch(this.handleError);
  }

  private handleError(error: HttpErrorResponse): Promise<never> {
    return Promise.reject(error);
  }
}
