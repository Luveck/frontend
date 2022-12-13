import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, OnInit } from '@angular/core'
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})

export class InicioPage implements OnInit {
  localTheme:boolean = true
  darkClassName:string = 'theme-dark';
  SectionSelect:string = ''

  @HostBinding('class') className = '';

  constructor(
    private _overlay: OverlayContainer,
    private _dataServ: DataService
  ){
    let theme = this._dataServ.getTheme()
    if(theme === 'dark'){
      this.localTheme = false
      this.className = this.darkClassName
      this._dataServ.setTheme('dark')
      this._overlay.getContainerElement().classList.add(this.darkClassName);
    }else{
      this.localTheme = true
      this.className = ''
      this._dataServ.setTheme('light')
      this._overlay.getContainerElement().classList.remove(this.darkClassName);
    }
  }

  ngOnInit(): void {

  }

  setTheme(){
    this.localTheme = !this.localTheme
    if(!this.localTheme){
      this.localTheme = false
      this.className = this.darkClassName
      this._dataServ.setTheme('dark')
      this._overlay.getContainerElement().classList.add(this.darkClassName);
    }else{
      this.localTheme = true
      this.className = ''
      this._dataServ.setTheme('light')
      this._overlay.getContainerElement().classList.remove(this.darkClassName);
    }
  }

  ingresar(){
    this._dataServ.goTo('authentication/login')
  }

  onSectionSelect(){

  }
}
