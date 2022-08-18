import { Component, OnInit  } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  public loginForm = new FormGroup({
    dni : new FormControl('', [Validators.required]),
    password : new FormControl('', [Validators.required]),
    remember: new FormControl(false, [Validators.required])
  })
  hidePassword:boolean = true;

  constructor(private _authServ:AuthService){}

  ngOnInit(): void {

  }

  onLogin(formData:any){
    this._authServ.login(formData)
  }
}
