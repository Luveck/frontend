import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor() {}

  handleError(error: unknown, where: string): string {
    let message = '';
    if (error instanceof HttpErrorResponse) {
      if (error.error) {
        message = error.error.includes('permisos')
          ? `${where} ${error.error}`
          : `${error.error}`;
      } else {
        console.log('Error HTTP:', error.statusText);
      }
    } else {
      console.log('Error desconocido:', error);
    }
    return message;
  }
}
