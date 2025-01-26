import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginForm = new FormGroup({
    dni: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9]+$'),
      Validators.minLength(2),
    ]),
    password: new FormControl('', [Validators.required]),
    remember: new FormControl(false, [Validators.required]),
  });
  hidePassword: boolean = true;

  constructor(
    public dataService: DataService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {}

  public async onLogin(formData: any) {
    if (!this.dataService.progress) {
      this.dataService.progress = true;
      const dataLogin = {
        username: formData.dni,
        password: formData.password,
      };
      await this.authService.login(dataLogin);
      this.dataService.progress = false;
    }
  }
}
