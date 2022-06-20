import { Injectable } from '@angular/core';
import { Location } from '@angular/common'
import { MatDialog } from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private _router:Router,
    private _location:Location,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  goTo(path:string, parametro:string){
    if(parametro){
      this._router.navigate([`${path}/${parametro}`])
    }else{
      this._router.navigate([`${path}`])
    }
  }

  goBack(){
    this._location.back()
  }

  confirmDialog(msg:string) {
    return this._dialog.open(DialogConfComponent, {
      data: `${msg}`
    })
    .afterClosed()
  }

  openSnackBar(msg:string, context:boolean) {
    //La propiedad contexto definira si la operacion fue exitosa o no
    this._snackBar.open(`${msg}`, 'Ok' ,{
      duration: 3000,
      panelClass: context ?'snackBarSuccess' :'snackBarFail'
    });
  }
}
