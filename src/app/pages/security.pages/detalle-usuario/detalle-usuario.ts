import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms'

import { UsuariosService } from 'src/app/services/usuarios.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-detalle-usuario',
  templateUrl: './detalle-usuario.html',
  styleUrls: ['./detalle-usuario.scss'],
})

export class DetalleUsuario implements OnInit {
  currentUser!: any
  isLoadingResults?:boolean

  public newUserForm = new FormGroup({
    dni: new FormControl('', Validators.required),
    password: new FormControl(''),
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
    public usersServ:UsuariosService,
    public authServ:AuthService,
    public dialogo: MatDialogRef<DetalleUsuario>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit(): void {
    if(this.usersServ.localRoles.length === 0){
      this.usersServ.getAllRoles().subscribe((res:any) => {
        console.log(res)
        this.usersServ.localRoles = res.result
      })
    }
    if(this.data.userDni){
      this.isLoadingResults = true
      this.usersServ.getUserByDNI(this.data.userDni)
        .subscribe((res:any) => {
          console.log(res)
          this.currentUser = res.result
          this.isLoadingResults = false
          this.initValues()
        }, (error:any) => {
          this.isLoadingResults = false
          console.log(error)
          let msgError = error.error.messages
          this.usersServ.notify(`${msgError}`, 'error')
        })
    }
  }

  initValues(){
    this.newUserForm.patchValue({
      dni: this.currentUser.userEntity.userName,
      name: this.currentUser.userEntity.name,
      lastName: this.currentUser.userEntity.lastName,
      email: this.currentUser.userEntity.email,
      role: this.currentUser.role,
      bornDate: this.currentUser.userEntity.bornDate,
      sex: this.currentUser.userEntity.sex,
      phone: this.currentUser.userEntity.phoneNumber,
      address: this.currentUser.userEntity.address
    })
  }

  resetForm(){
    this.newUserForm.reset()
  }

  save(){
    /* {
      "dni": "string",
      "password": "string",
      "email": "string",
      "name": "string",
      "lastName": "string",
      "phone": "string",
      "idRole": "string",
      "role": "string",
      "bornDate": "2023-03-22T15:10:04.566Z",
      "sex": "string",
      "state": true,
      "address": "string"
    } */

    if(this.data.userDni){
      let peticion = this.usersServ.UpdateUsuario(this.newUserForm.value, this.data.paisId, this.currentUser!.ctaStatus)
      this.usersServ.notify('Registro actualizado', 'success')
      this.dialogo.close(true);
    }else{
      let tempData:any = this.newUserForm.value
      const tempRole = this.usersServ.localRoles.filter(role => role.id === tempData.role)
      tempData.idRol = tempRole[0].id
      tempData.role = tempRole[0].name
      const peticion = this.usersServ.addUsuario(tempData)
      peticion.subscribe(() => {
        this.usersServ.notify('Usuario registrado', 'success')
        this.dialogo.close(true);
      },err => {
        console.log(err)
        this.usersServ.notify('Ocurrio un error', 'error')
      })
    }
  }
}
