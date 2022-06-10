import { Component, OnInit } from '@angular/core';
//import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit{
  nombre: String = 'Esta';
  img:String = 'https://phantom-marca.unidadeditorial.es/8e53ec302fd064f14da87c7c1ed7503f/resize/1320/f/jpg/assets/multimedia/imagenes/2022/02/28/16460366222901.jpg'

  constructor() { }

  ngOnInit(){
    //this.nombre = this.authServ.currentUser.user.displayName
    //this.img = this.authServ.currentUser.user.photoURL
  }

  onLogout(){
    //this.authServ.logoutRefac()
  }
}
