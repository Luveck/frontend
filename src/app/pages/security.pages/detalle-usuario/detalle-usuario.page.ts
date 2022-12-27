import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms'

import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-detalle-usuario',
  templateUrl: './detalle-usuario.page.html',
  styleUrls: ['./detalle-usuario.page.scss'],
})

export class DetalleUsuarioPage implements OnInit {
  currentUser!: any | undefined
  isLoadingResults?:boolean

  public newUserForm = new FormGroup({
    dni: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
  })

  constructor(
    public _usersServ:UsuariosService,
    public dialogo: MatDialogRef<DetalleUsuarioPage>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit(): void {
    if(this.data.userId){
      this.currentUser = this._usersServ.getUserInfo(this.data.Email)
      this.initValores()
    }
  }

  initValores(){
    this.newUserForm.patchValue({
      dni: this.currentUser!.dni,
      name: this.currentUser!.name,
      lastName: this.currentUser!.lastName,
      role: this.currentUser!.role,
      email: this.currentUser!.email,
      phone: this.currentUser!.phone,
    })
  }

  resetForm(){
    this.newUserForm.reset()
  }

  addEditUser(){
    if(!this.data.paisId){
      let peticion = this._usersServ.addUsuario(this.newUserForm.value)
      this._usersServ.notify('País registrado', 'success')
      this.dialogo.close(true);
    }else{
      let peticion = this._usersServ.UpdateUsuario(this.newUserForm.value, this.data.paisId, this.currentUser!.ctaStatus)
      this._usersServ.notify('Registro actualizado', 'success')
      this.dialogo.close(true);
    }
  }
}
