import { Component, OnInit  } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})

export class ForgotPasswordPage implements OnInit {
  resetEmailSendMsg:string = ''

  public forgotPassForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(
      '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,63}$',
    ),]),
  })

  constructor(public dataServ: DataService, private _authServ:AuthService){}

  ngOnInit(): void {

  }

  onForgot(formData:any){
    console.log(formData)
    if(!this.dataServ.progress){
      this.dataServ.progress = true
      this._authServ.forgotPass(formData)
        .then((res:any) => {
          console.log(res)
          this.dataServ.progress = false
          this.dataServ.fir(`${res.messages}`, 'success')
          this.resetEmailSendMsg = res.messages
        })
        .catch ((error:any)=>{
          this.dataServ.progress = false
          console.log(error)
          let msgError = error.error.messages
          this.dataServ.fir(`${msgError}`, 'error')
        })
    }
  }
}
