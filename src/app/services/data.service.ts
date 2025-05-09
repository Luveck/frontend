import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common'
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  baseURL:string = environment.urlAdminSevice;
  baseURLSec:string = environment.urlSecuritySevice;
  progress:boolean = false

  constructor(
    private _router:Router,
    private _location:Location,
  ) { }

  goTo(path:string, parametro?:string){
    if(parametro){
      this._router.navigate([`${path}/${parametro}`])
    }else{
      this._router.navigate([`${path}`])
    }
  }

  goBack(){
    this._location.back()
  }

  setTheme(themeState:string){
    localStorage.setItem('LuveckTheme', themeState)
  }

  getTheme(){
    let themeState = localStorage.getItem('LuveckTheme');
    return themeState
  }

  setCountry(country?: any) {
    if (country) {
      localStorage.setItem('countryLuveckIso', country.iso3);
      localStorage.setItem('countryLuveckId', country.id);
    } else {
      localStorage.setItem('countryLuveckIso', 'HN');
      localStorage.setItem('countryLuveckId', '1');
    }
  }

  getCountry(){
    let country = localStorage.getItem('countryLuveckIso');
    if(!country){
      return 'HN';
    }
    return country
  }

  getCountryId(){
    let country = localStorage.getItem('countryLuveckId');
    if(!country){
      return '1';
    }
    return country
  }

  public fir(title:string, icono:any, timeOut?:number){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: timeOut || 4000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: icono,
      title: title
    })
  }
}
