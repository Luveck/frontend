import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms'

import { UsuariosService } from 'src/app/services/usuarios.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { ChangePasswordComponent } from '../change-password/change-password.component';

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
    dni: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    bornDate: new FormControl('', Validators.required),
    sex: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required)
  })

  constructor(
    private _authServ:AuthService,
    private _usersServ:UsuariosService,
    public dialogo: MatDialogRef<ClientProfileComponent>,
    private _dataServ:DataService,
    private _dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: string) {
      if(this._usersServ.localRoles.length === 0){
        this._usersServ.getAllRoles()?.subscribe((res:any) => {
          this._usersServ.localRoles = res.result
        })
      }
    }

  ngOnInit(): void {
    this.isLoadingResults = true
    this._usersServ.getUserInfo(this.data)
      ?.subscribe((res:any) => {        
        this.userData = res.result
        this.isLoadingResults = false
        this.initValues()
      }, (error:any) => {
        this.isLoadingResults = false
        let msgError = error.error.messages
        this._usersServ.notify(`${msgError}`, 'error')
      })
  }

  initValues(){
    this.perfilForm.patchValue({
      dni: this.userData.dni,
      name: this.userData.name,
      lastName: this.userData.lastName,
      email: this.userData.email,
      role: this.userData.role,
      bornDate: this.userData.bornDate,
      sex: this.userData.sex,
      phone: this.userData.phone,
      address: this.userData.address
    })
    this.perfilForm.disable()
  }

  onEdit(){
    this.enabledEdit = true
    this.perfilForm.enable()
  }

  onChangePwd() {
    this._dialog.closeAll();
    const config:MatDialogConfig = {
      data: this.data
    }
    this._dialog.open(ChangePasswordComponent, config);
  }

  cancelEdit(){
    this.enabledEdit = false
    this.perfilForm.disable()
  }

  selectRole(nameRole:string){
    const tempRole = this._usersServ.localRoles.filter(role => role.name === nameRole)
    return tempRole[0]
  }

  save(chageState?:boolean){
    let tempData:any = this.perfilForm.value
    let {id, name} = this.selectRole(tempData.role)
    tempData.idRole = id
    tempData.role = name
    const peticion = this._usersServ.UpdateUsuario(tempData, (chageState != undefined) ?chageState :this.userData.state)
    peticion?.subscribe(()=>{
      this._usersServ.notify('Perfil actualizado', 'success')
      this._authServ.userData.UserName = this.perfilForm.get('name')?.value
      this._authServ.userData.LastName = this.perfilForm.get('lastName')?.value
      this.dialogo.close(true);
    },err => {
      console.log(err)
      this._usersServ.notify('Ocurrio un error', 'error')
    })
  }
}
