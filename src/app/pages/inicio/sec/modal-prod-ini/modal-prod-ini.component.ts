import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-prod-ini',
  templateUrl: './modal-prod-ini.component.html',
  styleUrls: ['./modal-prod-ini.component.scss']
})
export class ModalProdIniComponent {

  constructor(
    public dialogo: MatDialogRef<ModalProdIniComponent>,
    @Inject(MAT_DIALOG_DATA) public prodData: any
  ) { }
}
