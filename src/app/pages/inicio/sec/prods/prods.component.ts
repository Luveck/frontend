import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { RulesService } from 'src/app/services/rules.service';
import { ModalProdIniComponent } from '../modal-prod-ini/modal-prod-ini.component';

@Component({
  selector: 'app-prods',
  templateUrl: './prods.component.html',
  styleUrls: ['./prods.component.scss']
})
export class ProdsComponent implements OnInit {
  @Input() color!:boolean
  selectedCategory:number = 0
  prodsCanje:any[] = []

  constructor(private _dialog: MatDialog, public rulesServ:RulesService) { }

  ngOnInit(): void {
    // const peticion = this.rulesServ.getProdConRules()
    // peticion.subscribe((res:any) => {
    //   console.log(res)
    //   this.prodsCanje = res.result
    // })
  }

  openModalProd(prod:any){
    const config:MatDialogConfig = {
      data: prod
    }
    this._dialog.open(ModalProdIniComponent, config)
  }
}
