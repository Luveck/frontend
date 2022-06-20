import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-conf',
  templateUrl: './dialog-conf.component.html',
  styleUrls: ['./dialog-conf.component.scss']
})
export class DialogConfComponent {
  constructor( public dialogo: MatDialogRef<DialogConfComponent>,
    @Inject(MAT_DIALOG_DATA) public mensaje: string) { }

  cerrarDialogo(): void {
    this.dialogo.close(false);
  }
  confirmado(): void {
    this.dialogo.close(true);
  }
}
