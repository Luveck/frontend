import {MediaMatcher} from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core'
import { RouterOutlet } from '@angular/router';
import { fadeIn } from './animatios';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [fadeIn]
})

export class AdminPage implements OnInit {
  mobileQuery: MediaQueryList;
  nombre: String = 'Elvin';
  rol: string = 'Administrador'
  img:String = 'https://phantom-marca.unidadeditorial.es/8e53ec302fd064f14da87c7c1ed7503f/resize/1320/f/jpg/assets/multimedia/imagenes/2022/02/28/16460366222901.jpg'

  private _mobileQueryListener: () => void;

  constructor(private changeDetectorRef:ChangeDetectorRef, private media: MediaMatcher){
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

  }

  onLogout(){
    console.log('pto')
  }
}
