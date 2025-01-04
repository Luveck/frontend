import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { RulesService } from 'src/app/services/rules.service';
import { ModalProdIniComponent } from '../modal-prod-ini/modal-prod-ini.component';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-prods',
  templateUrl: './prods.component.html',
  styleUrls: ['./prods.component.scss']
})
export class ProdsComponent implements OnInit {
  @Input() color!:boolean
  selectedCategory:number = 0
  prodsCanje:any[] = []

  constructor(
    private _dialog: MatDialog,
    private readonly rulesServ:RulesService,
    private readonly dataServ: DataService,
  ) { }

  ngOnInit(): void {
    this.getProductsRules();
  }

  private async getProductsRules(){
    try {
      await this.rulesServ.setProductsRuleByCountry(this.dataServ.getCountryId());
    } catch (error) {

    } finally {
      this.prodsCanje = this.rulesServ.getProductsRuleByCountry();
    }
  }

  openModalProd(prod:any){
    const config:MatDialogConfig = {
      data: prod
    }
    this._dialog.open(ModalProdIniComponent, config)
  }
}
