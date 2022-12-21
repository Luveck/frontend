import { Component, OnInit, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
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
    private _dialog:MatDialog,
    public usuariosServ:UsuariosService
  ){}

  ngOnInit(): void {
    this.isLoadingResults = false;
  }

  on(name:string){
    this.name = name
  }

  dialog(index:number) {
    let msg = '¿Seguro de querer eliminar este rol?'

    this._dialog.open(DialogConfComponent, {
      data: `${msg}`
    })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.usuariosServ.localRoles.slice(index, 1)
          this.usuariosServ.notify('Registro actualizado', 'success')
        }
      })
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
