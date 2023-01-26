import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sesion-end',
  templateUrl: './sesion-end.component.html',
  styleUrls: ['./sesion-end.component.scss']
})
export class SesionEndComponent {

  constructor(public dialogo: MatDialogRef<SesionEndComponent>) { }

  refreshSession(){
    this.dialogo.close(true)
  }

}
