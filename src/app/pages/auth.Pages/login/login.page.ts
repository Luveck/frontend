import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
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
      Validators.pattern('^[a-zA-Z0-9]+$'),
      Validators.minLength(2),
    ]),
    password: new FormControl('', [Validators.required]),
    remember: new FormControl(false, [Validators.required]),
  });
  hidePassword: boolean = true;

  constructor(
    public dataServ: DataService,
    private _authServ: AuthService,
    private info: SharedService,
    private readonly apiService: ApiService,
    private sharedService: SharedService

  ) {}

  ngOnInit(): void {
    this.info.getUserIP()
    this.info.getUserDevice()
    this.sharedService.getUserDevice();
    this.sharedService.getUserIP();
  }

  public async onLogin(formData: any) {
    if (!this.dataServ.progress) {
      this.dataServ.progress = true;
      try {
      const dataLogin = {
        "username": formData.dni ,
        "password": formData.password,
        "ip": this.sharedService.userIP,
        "device": this.sharedService.userDevice
      }
      const login = await this.apiService.post('user/login', dataLogin) as any;
      this._authServ.userToken = login['token'].token;
      localStorage.setItem('LuveckUserToken', login['token'].token);
      this._authServ.setPermissions(login['moduleRoleResponse']);
      this._authServ.decodeToken(
               this._authServ.userToken,
               login['changePass']
             );
      } catch (error) {
        console.log(error)
      } finally {
        this.dataServ.progress = false;
      }
    }
  }
}
