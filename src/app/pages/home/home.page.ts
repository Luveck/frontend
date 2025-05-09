import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  public name: string = '';

  constructor(private readonly sessionService: SessionService) {
    this.name =
      sessionService.getUserData().UserName +
      ' ' +
      sessionService.getUserData().LastName;
  }
}
