import { OverlayContainer } from '@angular/cdk/overlay';
import { HttpClient } from '@angular/common/http';
import { Component, HostBinding, OnInit} from '@angular/core'
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';

import { fadeAnimation } from '../animations';
import { DialogConfComponent } from '../components/dialog-conf/dialog-conf.component';
import { AuthService } from '../services/auth.service';
//import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  animations: [fadeAnimation]
})

export class AdminPage implements OnInit {
  img:String = 'assets/user.png'
  displayName:string = ''
  rol:string = ''
  menuList:Observable<any[]> | undefined

  @HostBinding('class') className = '';
  toggleControl = new FormControl();

  constructor(
    private _http: HttpClient,
    private _overlay: OverlayContainer,
    private _dialogo: MatDialog,
    private _dataServ: DataService,
    public authServ:AuthService,
  ){
    const darkClassName = 'theme-dark';
    this.toggleControl.valueChanges.subscribe(themeState => {
      this.className = themeState
        ?darkClassName
        : ''
      if(themeState){
        this._dataServ.setTheme('dark')
        this._overlay.getContainerElement().classList.add(darkClassName);
      }else{
        this._dataServ.setTheme('light')
        this._overlay.getContainerElement().classList.remove(darkClassName);
      }
    });
  }

  fadeIn(outlet:RouterOutlet) {
    return outlet &&
    outlet.activatedRouteData &&
    outlet.activatedRouteData['animation'];
  }

  ngOnInit(): void {
    this.menuList = this._http.get<[]>("/assets/menu.json")
    let theme = this._dataServ.getTheme()
    theme === 'dark'
      ?this.toggleControl.setValue(true)
      :this.toggleControl.setValue(false)
  }

  onLogout(){
    this._dialogo.open(DialogConfComponent, {
      data: `¿Seguro de querer Cerrar la sesión?`
    })
    .afterClosed()
    .subscribe((confirmado: Boolean) => {
      if (confirmado) {
        this.authServ.logOut()
      }
    })
  }
}
