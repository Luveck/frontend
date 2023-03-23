import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding } from '@angular/core'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';
import { ClientProfileComponent } from './sec/client-profile/client-profile.component';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss']
})

export class InicioPage {
  localTheme:boolean = true
  darkClassName:string = 'theme-dark';
  SectionSelect:string = 'inicio'
  showMenu:boolean = false

  @HostBinding('class') className = '';

  displayedColumns = [
    'fecha',
    'numProds',
    'nomProds',
    'farmacia'
  ];

  dataSource = [
    {fecha: '20/12/2022', numProds: 1, nomProds: 'Loratadina 10 mg', farmacia: 'Farmacity, tegucigalpa. 1era Ave.'},
    {fecha: '20/12/2022', numProds: 1, nomProds: 'Loratadina 10 mg', farmacia: 'Farmacity, tegucigalpa. 1era Ave.'},
    {fecha: '20/12/2022', numProds: 1, nomProds: 'Loratadina 10 mg', farmacia: 'Farmacity, tegucigalpa. 1era Ave.'},
    {fecha: '20/12/2022', numProds: 1, nomProds: 'Loratadina 10 mg', farmacia: 'Farmacity, tegucigalpa. 1era Ave.'},
    {fecha: '20/12/2022', numProds: 1, nomProds: 'Loratadina 10 mg', farmacia: 'Farmacity, tegucigalpa. 1era Ave.'},
    {fecha: '20/12/2022', numProds: 1, nomProds: 'Loratadina 10 mg', farmacia: 'Farmacity, tegucigalpa. 1era Ave.'},
    {fecha: '20/12/2022', numProds: 1, nomProds: 'Loratadina 10 mg', farmacia: 'Farmacity, tegucigalpa. 1era Ave.'},
    {fecha: '20/12/2022', numProds: 1, nomProds: 'Loratadina 10 mg', farmacia: 'Farmacity, tegucigalpa. 1era Ave.'},
    {fecha: '20/12/2022', numProds: 1, nomProds: 'Loratadina 10 mg', farmacia: 'Farmacity, tegucigalpa. 1era Ave.'},
    {fecha: '20/12/2022', numProds: 1, nomProds: 'Loratadina 10 mg', farmacia: 'Farmacity, tegucigalpa. 1era Ave.'},
  ];


  constructor(
    private _overlay: OverlayContainer,
    private _dialog: MatDialog,
    public dataServ: DataService,
    public authServ:AuthService
  ){
    let theme = this.dataServ.getTheme()
    if(theme === 'dark'){
      this.localTheme = false
      this.className = this.darkClassName
      this.dataServ.setTheme('dark')
      this._overlay.getContainerElement().classList.add(this.darkClassName);
    }else{
      this.localTheme = true
      this.className = ''
      this.dataServ.setTheme('light')
      this._overlay.getContainerElement().classList.remove(this.darkClassName);
    }
  }

  setTheme(){
    this.localTheme = !this.localTheme
    if(!this.localTheme){
      this.localTheme = false
      this.className = this.darkClassName
      this.dataServ.setTheme('dark')
      this._overlay.getContainerElement().classList.add(this.darkClassName);
    }else{
      this.localTheme = true
      this.className = ''
      this.dataServ.setTheme('light')
      this._overlay.getContainerElement().classList.remove(this.darkClassName);
    }
  }

  selectSection(sec:string){
    this.SectionSelect = sec
    this.showMenu = false
  }

  showProfile(){
    const config:MatDialogConfig = {
      data: this.authServ.userData.UserId
    }
    this._dialog.open(ClientProfileComponent, config)
  }

  onLogout(){
    this._dialog.open(DialogConfComponent, {
      data: `¿Seguro de querer Cerrar la sesión?`
    })
    .afterClosed()
    .subscribe((confirmado: Boolean) => {
      if (confirmado) {
        this.SectionSelect = 'inicio'
        this.authServ.logOut(this.authServ.userData.Role)
      }
    })
  }
}
