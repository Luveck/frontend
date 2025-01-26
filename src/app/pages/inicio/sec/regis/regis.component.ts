import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgPasswordValidatorOptions } from 'ng-password-validator';
import { DialogcountryComponent } from 'src/app/components/dialog-country/dialog-country.component';
import { ApiService } from 'src/app/services/api.service';

import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-regis',
  templateUrl: './regis.component.html',
  styleUrls: ['./regis.component.scss'],
})
export class RegisComponent {
  @Output() sectionEvent = new EventEmitter<string>();
  typeForm: string = 'register';
  resetEmailSendMsg: string = '';

  public loginForm = new FormGroup({
    dni: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9]+$'),
      Validators.minLength(2),
    ]),
    password: new FormControl('', [Validators.required]),
    remember: new FormControl(false, [Validators.required]),
  });

  public registerForm = new FormGroup({
    dni: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9]+$'),
      Validators.minLength(2),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,63}$'),
    ]),
    name: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$'),
      Validators.minLength(8),
    ]),
    bornDate: new FormControl('', [Validators.required]),
    sex: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$'
      ),
    ]),
  });

  public forgotPassForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,63}$'),
    ]),
  });

  hidePassword: boolean = true;

  options: NgPasswordValidatorOptions = {
    heading: 'Requisitos',
    successMessage: 'Contraseña segura',
    rules: {
      password: {
        type: 'range',
        min: 8,
        max: 12,
      },
      'include-symbol': true,
      'include-number': true,
      'include-lowercase-characters': true,
      'include-uppercase-characters': true,
    },
  };

  constructor(
    public dataServ: DataService,
    public authServ: AuthService,
    private readonly dialogo: MatDialog,
    private readonly apiService: ApiService,
    private readonly sharedService: SharedService
  ) {}

  onLogin(formData: any) {
    // if (!this.dataServ.progress) {
    //   this.dataServ.progress = true;
    //   this.authServ
    //     .login(formData)
    //     .then((res: any) => {
    //       this.dataServ.progress = false;
    //       this.authServ.userToken = res.result.token;
    //       this.authServ.setPermissions(res.result.moduleRoleResponse);
    //       localStorage.setItem('LuveckUserToken', this.authServ.userToken);
    //       this.authServ.decodeToken(
    //         this.authServ.userToken,
    //         res.result.changePass
    //       );
    //       this.sectionEvent.emit('inicio');
    //     })
    //     .catch((error: any) => {
    //       this.dataServ.progress = false;
    //       let msgError = error.error.messages;
    //       msgError ===
    //         'Usuario bloqueado por intentos no validos. Por favor restablecer la contraseña.' ||
    //       'El usuario se encuentra inactivo. Por favor contactarse con soporte'
    //         ? this.dataServ.fir(`${msgError}`, 'error')
    //         : this.dataServ.fir(
    //             `DNI o contraseña del usuario no válidos.`,
    //             'error'
    //           );
    //     });
    // }
  }

  onRegister() {
    if (!this.dataServ.progress) {
      this.consultCountry();
    }
  }

  public consultCountry() {
    this.dialogo
      .open(DialogcountryComponent, {
        data: `Verifique el país seleccionado. Si se registra, deberá contactar a soporte para cambiarlo.`,
      })
      .afterClosed()
      .subscribe((confirm: Boolean) => {
        if (confirm) {
          this.dataServ.progress = true;
          this.Register();
        }
      });
  }

  private async Register() {
    // try {
    //   var user = {
    //     Password: this.registerForm.value.password,
    //     Role: '',
    //     DNI: this.registerForm.value.dni,
    //     Name: this.registerForm.value.name,
    //     LastName: this.registerForm.value.lastName,
    //     Email: this.registerForm.value.email,
    //     Phone: this.registerForm.value.phone,
    //     BornDate: this.registerForm.value.bornDate,
    //     Sex: this.registerForm.value.sex,
    //     ChangePass: false,
    //     IsActive: true,
    //     Address: this.registerForm.value.address,
    //     CountryId: this.dataServ.getCountryId(),
    //     pharmacyId: 0,
    //   };
    //   user = this.sharedService.addIpDevice(user);
    //   var dataUser: any = await this.apiService.post('User/RegisterUser', user);
    //   var token = dataUser.token;
    //   localStorage.setItem('LuveckUserToken', token);
    //   this.authServ.decodeToken(token, false);
    //   this.sectionEvent.emit('inicio');
    // } catch (error: any) {
    //   if (error.error && error.error.includes('is already taken')) {
    //     this.sharedService.notify(
    //       `El DNI ${this.registerForm.value.dni} ya esta siendo usado.`,
    //       'error'
    //     );
    //   } else {
    //     this.sharedService.notify(
    //       `Se presento un error, por favor contactar a soporte.`,
    //       'error'
    //     );
    //   }
    // } finally {
    //   this.dataServ.progress = false;
    // }
  }

  onForgot(formData: any) {
    if (!this.dataServ.progress) {
      this.dataServ.progress = true;
      this.authServ
        .forgotPass(formData.email)
        .then((res: any) => {
          this.dataServ.progress = false;
          this.dataServ.fir(`${res.messages}`, 'success');
          this.resetEmailSendMsg = res.messages;
        })
        .catch((error: any) => {
          this.dataServ.progress = false;
          let msgError = error.error.messages;
          this.dataServ.fir(`${msgError}`, 'error');
        });
    }
  }
}
