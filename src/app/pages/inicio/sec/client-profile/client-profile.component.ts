import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms'

import { AuthService } from 'src/app/services/auth.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';


@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.scss']
})
export class ClientProfileComponent implements OnInit {
  userData! :any
  isLoadingResults?:boolean
  enabledEdit:boolean = false

  public perfilForm = new FormGroup({
    name: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    bornDate: new FormControl('', Validators.required),
    sex: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required)
  })

  constructor(
    private _usersServ:UsuariosService,
    private _authServ:AuthService,
    private _dialogo:MatDialog,
    public dialogo: MatDialogRef<ClientProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public email: string) { }

  ngOnInit(): void {
    this.isLoadingResults = true
    this._usersServ.getUserInfo(this.email)
      .subscribe((res:any) => {
        console.log(res)
        this.userData = res.result
        this.isLoadingResults = false
        this.initValues()
      }, (error:any) => {
        this.isLoadingResults = false
        console.log(error)
        let msgError = error.error.messages
        this._usersServ.notify(`${msgError}`, 'error')
      })
  }

  onLogout(){
    this._dialogo.open(DialogConfComponent, {
      data: `¿Seguro de querer Cerrar la sesión?`
    })
    .afterClosed()
    .subscribe((confirmado: Boolean) => {
      if (confirmado) {
        this.dialogo.close(true)
        this._authServ.logOut(this._authServ.userData.Role)
      }
    })
  }

  initValues(){
    this.perfilForm.patchValue({
      name: this.userData.userEntity.name,
      lastName: this.userData.userEntity.lastName,
      email: this.userData.userEntity.email,
      bornDate: this.userData.userEntity.bornDate,
      sex: this.userData.userEntity.sex,
      phoneNumber: this.userData.userEntity.phoneNumber
    })
    this.perfilForm.disable()
  }

  onEdit(){
    this.enabledEdit = true
    this.perfilForm.enable()
  }

  cancelEdit(){
    this.enabledEdit = false
    this.perfilForm.disable()
  }

  save(){
    console.log(this.perfilForm.value)
  }
}
