import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms'

import { UsuariosService } from 'src/app/services/usuarios.service';
import { AuthService } from 'src/app/services/auth.service';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';

@Component({
  selector: 'app-detalle-usuario',
  templateUrl: './detalle-usuario.html',
  styleUrls: ['./detalle-usuario.scss'],
})

export class DetalleUsuario implements OnInit {
  currentUser!: any
  isLoadingResults?:boolean

  public newUserForm = new FormGroup({
    dni : new FormControl('', [Validators.required, Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$'), Validators.minLength(13)]),
    password: new FormControl(''),
    name: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    bornDate: new FormControl('', Validators.required),
    sex: new FormControl('', Validators.required),
    phone: new FormControl('', [Validators.required, Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$'), Validators.minLength(8)]),
    address: new FormControl('', Validators.required)
  })

  constructor(
    public usersServ:UsuariosService,
    public authServ:AuthService,
    private _dialog:MatDialog,
    public dialogo: MatDialogRef<DetalleUsuario>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    if(this.usersServ.localRoles.length === 0){
      this.usersServ.getAllRoles().subscribe((res:any) => {
        console.log(res)
        this.usersServ.localRoles = res.result
      })
    }
  }

  ngOnInit(): void {
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

  selectRole(nameRole:string){
    const tempRole = this.usersServ.localRoles.filter(role => role.name === nameRole)
    return tempRole[0]
  }

  save(chageState?:boolean){
    console.log(chageState)
    let tempData:any = this.newUserForm.value
    let {id, name} = this.selectRole(tempData.role)
    tempData.idRole = id
    tempData.role = name
    if(this.data.userDni){
      const peticion = this.usersServ.UpdateUsuario(tempData, (chageState != undefined) ?chageState :this.currentUser.userEntity.state)
      peticion.subscribe(()=>{
        this.usersServ.notify('Registro actualizado', 'success')
        this.dialogo.close(true);
      },err => {
        console.log(err)
        this.usersServ.notify('Ocurrio un error', 'error')
      })
    }else{
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

  changeUserState(state:boolean){
    let msg = state ? '¿Seguro de querer inhabilitar esta cuenta?' : '¿Seguro de querer habilitar esta cuenta?'
    this._dialog.open(DialogConfComponent, {
      data: `${msg}`
    })
    .afterClosed()
    .subscribe((confirmado:boolean)=>{
      if(confirmado){
        this.save(!state)
      }
    })
  }
}
