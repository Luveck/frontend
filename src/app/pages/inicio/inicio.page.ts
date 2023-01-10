import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, ViewEncapsulation } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgPasswordValidatorOptions } from 'ng-password-validator';
import SwiperCore, { Autoplay, SwiperOptions, Navigation } from 'swiper';
SwiperCore.use([ Autoplay, Navigation])

import { ModalProdIniComponent } from 'src/app/components/modal-prod-ini/modal-prod-ini.component';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';
import { ClientProfileComponent } from 'src/app/components/client-profile/client-profile.component';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class InicioPage {
  swipperConfig: SwiperOptions = {
    effect: 'fade',
    loop: true,
    slidesPerView: 1,
    navigation: true,
    autoplay: {
      delay: 8000,
      pauseOnMouseEnter: true,
      disableOnInteraction: false
    }
  };

  localTheme:boolean = true
  darkClassName:string = 'theme-dark';
  SectionSelect:string = 'inicio'
  showMenu:boolean = false
  typeForm:string = 'register'

  @HostBinding('class') className = '';

  public loginForm = new FormGroup({
    dni : new FormControl('', [Validators.required]),
    password : new FormControl('', [Validators.required]),
    remember: new FormControl(false, [Validators.required])
  })

  public registerForm = new FormGroup({
    dni : new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(
      '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,63}$',
    ),]),
    name : new FormControl('', [Validators.required]),
    lastName : new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$'), Validators.minLength(8)]),
    password: new FormControl('', [Validators.required, Validators.pattern(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$'
    )]),
    bornDate: new FormControl('', [Validators.required]),
    sex: new FormControl('', [Validators.required])
  })
  hidePassword:boolean = true;

  options:NgPasswordValidatorOptions = {
    'heading': 'Requisitos',
    'successMessage': 'Contraseña segura',
    'rules': {
      'password': {
        'type': "range",
        'min': 8,
        'max': 12
      },
      'include-symbol': true,
      'include-number': true,
      'include-lowercase-characters': true,
      'include-uppercase-characters': true,
    }
  }

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

  prodsCanje:any[] = [
    {nombreProd: 'Olcarveck® 20mg', img: 'https://luveck.com/wp-content/uploads/2022/02/Olcarveck-20.png', regla: '2+1', maximoAnual: 4, categoria: 'Antihipertensivo' ,principioAc: 'Olmersartán Medoxomil y S (-) Amlodipina 20/2.5 mg, 40/2.5 mg, 40/5'},
    {nombreProd: 'Olcarveck® 40mg', img: 'https://luveck.com/wp-content/uploads/2021/12/caja-olcarveck-40mg.png', regla: '2+1', maximoAnual: 4, categoria: 'Antihipertensivo' ,principioAc: 'Olmersartán Medoxomil y S (-) Amlodipina 20/2.5 mg, 40/2.5 mg, 40/5'},
    {nombreProd: 'Olcarveck® A 40/5mg', img: 'https://luveck.com/wp-content/uploads/2021/12/caja-olcarveck-40mg.png', regla: '2+1', maximoAnual: 4, categoria: 'Antihipertensivo' ,principioAc: 'Olmersartán Medoxomil y S (-) Amlodipina 20/2.5 mg, 40/2.5 mg, 40/5'},
    {nombreProd: 'Olcarveck® D 40/25mg', img: 'https://luveck.com/wp-content/uploads/2022/02/Olcarveck-20.png', regla: '2+1', maximoAnual: 4, categoria: 'Antihipertensivo' ,principioAc: 'Olmersartán Medoxomil y S (-) Amlodipina 20/2.5 mg, 40/2.5 mg, 40/5'},
    {nombreProd: 'Olcarveck® A 40/2.5mg', img: 'https://luveck.com/wp-content/uploads/2022/02/Olcarveck-20.png', regla: '2+1', maximoAnual: 4, categoria: 'Antihipertensivo' ,principioAc: 'Olmersartán Medoxomil y S (-) Amlodipina 20/2.5 mg, 40/2.5 mg, 40/5'},
    {nombreProd: 'Olcarveck® A 20/2.5mg', img: 'https://luveck.com/wp-content/uploads/2022/02/Olcarveck-20.png', regla: '2+1', maximoAnual: 4, categoria: 'Antihipertensivo' ,principioAc: 'Olmersartán Medoxomil y S (-) Amlodipina 20/2.5 mg, 40/2.5 mg, 40/5'},
    {nombreProd: 'Olcarveck® A 40/12.5mg', img: 'https://luveck.com/wp-content/uploads/2022/02/Olcarveck-20.png', regla: '2+1', maximoAnual: 4, categoria: 'Antihipertensivo' ,principioAc: 'Olmersartán Medoxomil y S (-) Amlodipina 20/2.5 mg, 40/2.5 mg, 40/5'},
    {nombreProd: 'Olcarveck® D 20/12.5mg', img: 'https://luveck.com/wp-content/uploads/2022/02/Olcarveck-20.png', regla: '2+1', maximoAnual: 4, categoria: 'Antihipertensivo' ,principioAc: 'Olmersartán Medoxomil y S (-) Amlodipina 20/2.5 mg, 40/2.5 mg, 40/5'},
  ]

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

  openModalProd(prod:any){
    const config:MatDialogConfig = {
      data: prod
    }
    this._dialog.open(ModalProdIniComponent, config)
  }

  onLogin(formData:any){
    if(!this.dataServ.progress){
      this.dataServ.progress = true
      this.authServ.login(formData)
        .then((res:any) => {
          console.log(res)
          this.dataServ.progress = false
          this.authServ.userToken = res.result.token
          if(formData.remember){
            localStorage.setItem('LuveckUserToken', this.authServ.userToken)
          }
          this.authServ.decodeToken(this.authServ.userToken)
          this.SectionSelect = 'inicio'
        })
        .catch ((error:any)=>{
          this.dataServ.progress = false
          console.log(error)
          let msgError = error.error.messages
          this.dataServ.fir(`${msgError}`, 'error')
        })
    }
  }

  onRegister(formData:any){
    if(!this.dataServ.progress){
      this.dataServ.progress = true
      this.authServ.register(formData)
        .then((res:any) => {
          console.log(res)
          this.dataServ.progress = false
          this.authServ.userToken = res.result.token
          localStorage.setItem('LuveckUserToken', this.authServ.userToken)
          this.authServ.decodeToken(this.authServ.userToken)
          this.SectionSelect = 'inicio'
        })
        .catch ((error:any)=>{
          this.dataServ.progress = false
          console.log(error)
          let msgError = error.error.messages
          this.dataServ.fir(`${msgError}`, 'error')
        })
    }
  }

  showProfile(){
    const config:MatDialogConfig = {
      data: this.authServ.userData.Email
    }
    this._dialog.open(ClientProfileComponent, config)
  }
}
