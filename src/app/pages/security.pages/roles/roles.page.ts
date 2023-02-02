import { Component, OnInit } from '@angular/core'
import { DataService } from 'src/app/services/data.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.page.html',
  styleUrls: ['./roles.page.scss'],
})

export class RolesPage implements OnInit {
  name: string = ''
  isLoadingResults:boolean = true;

  constructor(
    private _dataServ:DataService,
    public usuariosServ:UsuariosService
  ){}

  ngOnInit(): void {
    this.isLoadingResults = true
    this.usuariosServ.getAllRoles().subscribe((res:any) => {
      console.log(res)
      this.isLoadingResults = false
      this.usuariosServ.localRoles = res.result
    }, (error)=>{
      this.isLoadingResults = false
      console.log(error)
      let msgError = error.error.messages
      this._dataServ.fir(`${msgError}`, 'error')
    })
  }

  on(name:string){
    this.name = name
  }

  save(){
    let cant = this.usuariosServ.localRoles.length
    this.usuariosServ.localRoles.push({
      id: cant + 1,
      name: this.name
    })
    this.usuariosServ.notify('Registro actualizado', 'success')
  }
}
