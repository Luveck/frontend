import { Component, OnInit, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-sbu',
  templateUrl: './sbu.page.html',
  styleUrls: ['./sbu.page.scss'],
})

export class SbuPage implements OnInit {

  constructor(
    private _dialogo:MatDialog
  ){}

  ngOnInit(): void {

  }
}
