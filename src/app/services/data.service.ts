import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common'
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  baseURL:string = 'https://luveckapi.azurewebsites.net/api'

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

  public fir(title:string, icono:any){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
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
