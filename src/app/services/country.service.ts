import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private countrySource = new BehaviorSubject<string>(this.getCountry());
  public country$ = this.countrySource.asObservable();

  private countryIdSource = new BehaviorSubject<string>(this.getCountryId());
  public countryId$ = this.countryIdSource.asObservable();

  constructor() {}

  setCountry(country?: any) {
    if (country) {
      localStorage.setItem('countryLuveckIso', country.iso3);
      localStorage.setItem('countryLuveckId', country.id);
      this.countrySource.next(country.iso3);
      this.countryIdSource.next(country.id);
    } else {
      localStorage.setItem('countryLuveckIso', 'HN');
      localStorage.setItem('countryLuveckId', '1');
      this.countrySource.next('HN');
      this.countryIdSource.next('1');
    }
  }

  getCountry(): string {
    return localStorage.getItem('countryLuveckIso') || 'HN';
  }

  getCountryId(): string {
    return localStorage.getItem('countryLuveckId') || '1';
  }
}
