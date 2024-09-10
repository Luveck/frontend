import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit{
  public loginForm = new FormGroup({
    dni: new FormControl('', [
      Validators.required,
      Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$'),
      Validators.minLength(13),
    ]),
    password: new FormControl('', [Validators.required]),
    remember: new FormControl(false, [Validators.required]),
  });
  hidePassword: boolean = true;

  constructor(
    public dataServ: DataService,
    private _authServ: AuthService,
    private info: SharedService
  ) {}

  ngOnInit(): void {
    this.info.getUserIP()
    this.info.getUserDevice()
  }

  onLogin(formData: any) {
    if (!this.dataServ.progress) {
      this.dataServ.progress = true;
      this._authServ
        .login(formData)
        .then((res: any) => {
          console.log(res);
          this.dataServ.progress = false;
          this._authServ.userToken = res.result.token;
          if (formData.remember) {
            localStorage.setItem('LuveckUserToken', this._authServ.userToken);
          }
          this._authServ.decodeToken(
            this._authServ.userToken,
            res.result.changePass
          );
        })
        .catch((error: any) => {
          this.dataServ.progress = false;
          console.log(error);
          let msgError = error.error.messages;
          msgError === 'Usuario bloqueado por intentos no validos.' ||
          'El usuario se encuentra inactivo.'
            ? this.dataServ.fir(`${msgError}`, 'error')
            : this.dataServ.fir(
                `DNI o contraseña del usuario no válidos.`,
                'error'
              );
        });
    }
  }
}
