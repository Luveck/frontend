import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms'

import { Producto, Rule } from 'src/app/interfaces/models';
import { InventarioService } from 'src/app/services/inventario.service';
import { RulesService } from 'src/app/services/rules.service';

@Component({
  selector: 'app-detalle-reglas',
  templateUrl: './detalle-reglas.html',
  styleUrls: ['./detalle-reglas.scss']
})
export class DetalleReglas implements OnInit {
  currentRegla!:Rule | any
  prods!: Producto[]
  isLoadingResults!:boolean

  public ruleForm = new FormGroup({
    daysAround: new FormControl('', Validators.required),
    periodicity: new FormControl('', Validators.required),
    quantityBuy: new FormControl('', Validators.required),
    quantityGive: new FormControl('', Validators.required),
    maxChangeYear: new FormControl('', Validators.required),
    productId: new FormControl('', Validators.required)
  })

  constructor(
    private _inveServ:InventarioService,
    private _rulesServ:RulesService,
    public dialogo: MatDialogRef<DetalleReglas>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    if(this.data.ruleId){
      this.isLoadingResults = true
      const farmacia = this._rulesServ.getRuleById(this.data.ruleId)
      farmacia?.subscribe(res => {
        console.log(res)
        this.currentRegla = res.result
        this.isLoadingResults = false
        this.initValores()
      }, (err => {
        console.log(err)
        this.isLoadingResults = false
        this._rulesServ.notify('Ocurrio un error con la petición', 'error')
      }))
    }
    this.prods = this._inveServ.listProducts
  }

  initValores(){
    this.ruleForm.patchValue({
      daysAround: this.currentRegla.daysAround,
      periodicity: this.currentRegla.periodicity,
      quantityBuy: this.currentRegla.quantityBuy,
      quantityGive: this.currentRegla.quantityGive,
      maxChangeYear: this.currentRegla.maxChangeYear,
      productId: this.currentRegla.productId
    })
  }

  resetForm(){
    this.ruleForm.reset()
  }

  save(){
    if(this.data.ruleId){
      const peticion = this._rulesServ.updateRule(this.ruleForm.value, this.data.ruleId, this.currentRegla.state)
       peticion?.subscribe(() => {
        this._rulesServ.notify('Regla actualizada', 'success')
        this.dialogo.close(true);
      }, (err => {
        console.log(err)
        this._rulesServ.notify('Ocurrio un error con el proceso', 'error')
      }))
    }else{
      const peticion = this._rulesServ.addRule(this.ruleForm.value)
      peticion?.subscribe(() => {
        this._rulesServ.notify('Regla registrada', 'success')
        this.dialogo.close(true);
      }, (err => {
        console.log(err)
        this._rulesServ.notify('Ocurrio un error con el proceso', 'error')
      }))
    }
  }
}
