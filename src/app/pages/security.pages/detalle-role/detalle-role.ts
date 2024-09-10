import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Role } from 'src/app/interfaces/models';
import { MedicosService } from 'src/app/services/medicos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-detalle-role',
  templateUrl: './detalle-role.html',
  styleUrls: ['./detalle-role.scss']
})

export class DetalleRole implements OnInit {
  role!: Role | any;
  name!: string
  isLoadingResults!:boolean

  constructor(
    public usuariosServ:UsuariosService,
    public dialogo: MatDialogRef<DetalleRole>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    if(this.data.roleId){
      this.isLoadingResults = true
      const especial = this.usuariosServ.getRole(this.data.roleId)
      especial?.subscribe(res => {
        this.role = res.result
        this.isLoadingResults = false
        this.name = this.role.name
        console.log(this.role)
      },(err => {
        this.isLoadingResults = false
        this.usuariosServ.notify('Ocurrio un error', 'error')
      }))
    }
  }

  save(){
    if(this.data.roleId){
      const peticion = this.usuariosServ.updateRole(this.name, this.data.roleId, this.role.state)
      peticion?.subscribe(res => {
        if(res){
          this.usuariosServ.notify('Role actualizado', 'success')
          this.dialogo.close(true)
        }
      }, (err => {
        console.log(err)
        this.usuariosServ.notify('Ocurrio un error', 'error')
      }))
    }else{
      const peticion = this.usuariosServ.createRole(this.name)
      peticion?.subscribe(res => {
        if(res){
          this.usuariosServ.notify('Role registrado', 'success')
          this.dialogo.close(true)
        }
      }, (err => {
        console.log(err)
        this.usuariosServ.notify('Ocurrio un error', 'error')
      }))
    }
  }
}
