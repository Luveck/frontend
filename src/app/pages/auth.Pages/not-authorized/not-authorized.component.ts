import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-not-authorized',
  templateUrl: './not-authorized.component.html',
  styleUrls: ['./not-authorized.component.scss']
})
export class NotAuthorizedComponent {
  localTheme:boolean = true

  constructor(public dataServ:DataService) {
    let theme = this.dataServ.getTheme()
    theme === 'dark'
      ?this.localTheme = false
      :this.localTheme = true
  }
}
