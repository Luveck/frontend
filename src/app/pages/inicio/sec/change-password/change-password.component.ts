import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms'

import { UsuariosService } from 'src/app/services/usuarios.service';
import { DataService } from 'src/app/services/data.service';
import { NgPasswordValidatorOptions } from 'ng-password-validator';
import { ClientProfileComponent } from '../client-profile/client-profile.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  userData! :any
  isLoadingResults?:boolean
  enabledEdit:boolean = false

  public changePassForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required, Validators.pattern(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$'
    )]),
    confirmPassword: new FormControl('', [Validators.required])
  })

  hidePassword:boolean = true;
  hidePasswordConfirmation:boolean = true;
  hideOldPassword:boolean = true;
  options:NgPasswordValidatorOptions = {
    'heading': 'Requisitos',
    'successMessage': 'Contraseña segura',
    'rules': {
      'password': {
        'type': "range",
        'min': 8,
        'max': 12
      },
      'include-symbol': true,
      'include-number': true,
      'include-lowercase-characters': true,
      'include-uppercase-characters': true,
    }
  }


  constructor(
    private _usersServ:UsuariosService,
    public dialogo: MatDialogRef<ChangePasswordComponent>,
    public dataServ: DataService, 
    private _dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: string) {
    }


    chagePass(formData:any){
      if(this.changePassForm.get('newPassword')?.value != this.changePassForm.get('confirmPassword')?.value){
        this.dataServ.fir('Los campos <b>Nueva contraseña</b> y <b>Confirmar contraseña</b> deben coincidir entre si.', 'info')
        return
      }
  
      if(!this.dataServ.progress){
        this.dataServ.progress = true
        let dataUser:any
        dataUser = {
          ...formData,
          "idUser" : this.data,
        }
        const peticion = this._usersServ.changePassword(dataUser)
        peticion?.subscribe((res:any)=>{
          this.dataServ.progress = false
          this.dataServ.fir(`${res.messages}`, 'success', 5000)
          this.cancel();
        }, err => {
          this.dataServ.progress = false
          let msgError = err.error.messages
          this._usersServ.notify(`${msgError}`, 'error')
        })
      }
    }

  cancel(){
    this._dialog.closeAll();
    const config:MatDialogConfig = {
      data: this.data
    }
    this._dialog.open(ClientProfileComponent, config);
  }
}
