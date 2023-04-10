import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';

import { DetalleReglas } from 'src/app/pages/inventario.pages/detalle-reglas/detalle-reglas';
import { RulesService } from 'src/app/services/rules.service';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { Rule } from 'src/app/interfaces/models';
import { ModalReportComponent } from 'src/app/components/modal-report/modal-report.component';

@Component({
  selector: 'app-reglas',
  templateUrl: './reglas.page.html',
  styleUrls: ['./reglas.page.scss'],
})

export class ReglasPage implements OnInit {
  public breadcrumb = {
    links: [
      {
        name: 'Inicio',
        isLink: true,
        link: '/admin/home'
      },
      {
        name: 'Gestión de reglas de canje',
        isLink: false,
      }
    ]
  }

  isLoadingResults:boolean = true;

  constructor(
    private _dialog:MatDialog,
    public rulesServ:RulesService
  ){}

  ngOnInit(): void {
    this.getAllRules()
  }

  getAllRules(){
    const rules = this.rulesServ.getRules()
    rules?.subscribe(res => {
      this.isLoadingResults = false
      this.rulesServ.reglas = res.result
      console.log(this.rulesServ.reglas)
    }, (err => {
      this.isLoadingResults = false
      console.log(err)
    }))
  }

  on(id?:number){
    const config = {
      data: {
        title: id ?'Editar regla de canje' :'Agregar regla de canje',
        ruleId: id
      }
    }
    this._dialog.open(DetalleReglas, config)
    .afterClosed()
    .subscribe((confirm:boolean) => {
      if(confirm){
        this.isLoadingResults = true
        this.getAllRules()
      }
    })
  }

  chageState(row:Rule){
    const formData = {
      "daysAround": row.daysAround,
      "periodicity": row.periodicity,
      "quantityBuy": row.quantityBuy,
      "quantityGive": row.quantityGive,
      "maxChangeYear": row.maxChangeYear,
      "productId": row.productId
    }
    let msgDialog:string
    if(row.state){
      msgDialog = '¿Seguro de querer inhabilitar esta regla de canje?'
    }else{
      msgDialog = '¿Seguro de querer habilitar esta regla de canje?'
    }
    this._dialog.open(DialogConfComponent, {
      data: msgDialog
    })
    .afterClosed()
    .subscribe((confirmado:boolean)=>{
      if(confirmado){
        row.state = !row.state
        const res = this.rulesServ.updateRule(formData, row.id, row.state)
          res?.subscribe(res => {
            if(res){
              this.rulesServ.notify('Regla actualizada', 'success')
              this.isLoadingResults = true
              this.getAllRules()
            }
          }, (err => {
            console.log(err)
            this.getAllRules()
            this.rulesServ.notify('Ocurrio un error con el proceso.', 'error')
          }))
      }
    })
  }

  generateReport(){
    this._dialog.open(ModalReportComponent, {
      disableClose: true,
      data: {
        'title': 'Reporte General de Reglas de Canje',
        'body': this.rulesServ.reglas
      }
    })
  }
}
