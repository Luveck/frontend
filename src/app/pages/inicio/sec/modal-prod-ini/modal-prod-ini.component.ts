import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-prod-ini',
  templateUrl: './modal-prod-ini.component.html',
  styleUrls: ['./modal-prod-ini.component.scss']
})
export class ModalProdIniComponent implements OnInit {

  constructor(
    public dialogo: MatDialogRef<ModalProdIniComponent>,
    @Inject(MAT_DIALOG_DATA) public prodData: any
  ) { }

  ngOnInit(): void {

  }

}
