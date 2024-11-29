import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, OnInit } from '@angular/core'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';
import { ClientProfileComponent } from './sec/client-profile/client-profile.component';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss']
})

export class InicioPage implements OnInit{
  localTheme:boolean = true
  darkClassName:string = 'theme-dark';
  SectionSelect:string = 'inicio'
  showMenu:boolean = false

  @HostBinding('class') className = '';

  constructor(
    private _overlay: OverlayContainer,
    private _dialog: MatDialog,
    public dataServ: DataService,
    public authServ:AuthService,
    private info: SharedService
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
  ngOnInit(): void {
    this.info.getUserIP()
    this.info.getUserDevice()
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
      data: this.authServ.dataUser().UserId
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
        this.authServ.logOut(this.authServ.dataUser().Role)
      }
    })
  }

  onLogin(){
    this.dataServ.goTo('/authentication/login')
  }
}
