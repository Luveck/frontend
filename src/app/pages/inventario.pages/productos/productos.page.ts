import { Component, OnInit, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})

export class productosPage implements OnInit {

  constructor(
    private _dialogo:MatDialog
  ){}

  ngOnInit(): void {

  }
}
