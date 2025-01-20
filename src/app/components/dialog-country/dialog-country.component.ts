import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-country',
  templateUrl: './dialog-country.component.html',
  styleUrls: ['./dialog-country.component.scss']
})
export class DialogcountryComponent {
  constructor( public dialogo: MatDialogRef<DialogcountryComponent>,
    @Inject(MAT_DIALOG_DATA) public mensaje: string) { }

  cerrarDialogo(): void {
    this.dialogo.close(false);
  }
  confirmado(): void {
    this.dialogo.close(true);
  }
}
