import {MediaMatcher} from '@angular/cdk/layout';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ChangeDetectorRef, Component, HostBinding, OnInit, ViewEncapsulation} from '@angular/core'
import { FormControl } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { fadeAnimation } from './animatios';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  animations: [fadeAnimation]
})

export class AdminPage implements OnInit {
  mobileQuery: MediaQueryList;
  nombre: String = 'Elvin';
  rol: string = 'Administrador'
  img:String = 'https://phantom-marca.unidadeditorial.es/8e53ec302fd064f14da87c7c1ed7503f/resize/1320/f/jpg/assets/multimedia/imagenes/2022/02/28/16460366222901.jpg'

  private _mobileQueryListener: () => void;

  @HostBinding('class') className = '';
  toggleControl = new FormControl(false);

  constructor(
    private changeDetectorRef:ChangeDetectorRef,
    private media: MediaMatcher,
    public authServ:AuthService,
    private overlay: OverlayContainer
  ){
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener)
  }

  fadeIn(outlet:RouterOutlet) {
    return outlet &&
    outlet.activatedRouteData &&
    outlet.activatedRouteData['animation'];
  }

  ngOnInit(): void {
    this.authServ.getCurrentUser()
    this.toggleControl.valueChanges.subscribe((darkMode) => {
      const darkClassName = 'theme-dark';
      this.className = darkMode ? darkClassName : '';
      if (darkMode) {
        this.overlay.getContainerElement().classList.add(darkClassName);
      } else {
        this.overlay.getContainerElement().classList.remove(darkClassName);
      }
    });
  }

  onLogout(){
    this.authServ.logout()
  }
}
