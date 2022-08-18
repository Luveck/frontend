import { Component, OnInit  } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})

export class ForgotPasswordPage implements OnInit {
  forgotPassForm: FormGroup | any

  constructor(private _formBuilder: FormBuilder){}

  ngOnInit(): void {
    this.forgotPassForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(
        '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,63}$')]],
    });
  }

  onForgot(){
    console.log(this.forgotPassForm.value)
  }
}
