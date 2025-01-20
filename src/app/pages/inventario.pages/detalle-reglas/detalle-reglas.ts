import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Producto, Rule } from 'src/app/interfaces/models';
import { InventarioService } from 'src/app/services/inventario.service';
import { RulesService } from 'src/app/services/rules.service';
import { SharedService } from 'src/app/services/shared.service';
import { ApiService } from 'src/app/services/api.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

@Component({
  selector: 'app-detalle-reglas',
  templateUrl: './detalle-reglas.html',
  styleUrls: ['./detalle-reglas.scss'],
})
export class DetalleReglas implements OnInit {
  currentRegla!: Rule | any;
  prods!: Producto[];
  isLoadingResults!: boolean;

  public countries: any[] = [];

  public ruleForm = new FormGroup({
    daysAround: new FormControl('', Validators.required),
    periodicity: new FormControl('', Validators.required),
    quantityBuy: new FormControl('', Validators.required),
    quantityGive: new FormControl('', Validators.required),
    maxChangeYear: new FormControl('', Validators.required),
    productId: new FormControl('', Validators.required),
    countryId: new FormControl('', Validators.required),
  });

  constructor(
    private readonly prodService: InventarioService,
    public dialogo: MatDialogRef<DetalleReglas>,
    private readonly apiService: ApiService,
    private readonly sharedService: SharedService,
    private readonly rulesServ: RulesService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    if (this.data.ruleId) {
      this.getRule();
    }
    this.loadData();
  }

  private async loadData() {
    this.isLoadingResults = true;
    await this.sharedService.setCountry();
    await this.prodService.setProducts();
    this.prods = this.prodService.getProducts();
    this.countries = this.sharedService.getCountryList();
    this.isLoadingResults = false;
  }
  private async getRule() {
    try {
      this.isLoadingResults = true;
      this.currentRegla = await this.apiService.get(
        `ProductChangeRule/${this.data.ruleId}`
      );
      this.initValores();
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Consultando reglas:'),
        'error'
      );
    } finally {
      this.isLoadingResults = false;
    }
  }

  initValores() {
    this.ruleForm.patchValue({
      daysAround: this.currentRegla.daysAround,
      periodicity: this.currentRegla.periodicity,
      quantityBuy: this.currentRegla.quantityBuy,
      quantityGive: this.currentRegla.quantityGive,
      maxChangeYear: this.currentRegla.maxChangeYear,
      productId: this.currentRegla.productId,
      countryId: this.currentRegla.countryId,
    });
  }

  resetForm() {
    this.ruleForm.reset();
  }

  save() {
    let rule: any = {
      daysAround: this.ruleForm.value.daysAround,
      periodicity: this.ruleForm.value.periodicity,
      quantityBuy: this.ruleForm.value.quantityBuy,
      quantityGive: this.ruleForm.value.quantityGive,
      maxChangeYear: this.ruleForm.value.maxChangeYear,
      productId: this.ruleForm.value.productId,
      countryId: this.ruleForm.value.countryId,
    };

    rule = this.sharedService.addIpDevice(rule);
    if (this.data.ruleId) {
      rule = {
        id: this.data.ruleId,
        isActive: this.currentRegla.isActive,
        ...rule,
      };
      this.updateRule(rule);
    } else {
      rule = {
        isActive: true,
        ...rule,
      };
      this.addRule(rule);
    }
    this.dialogo.close(true);
  }

  private async addRule(rule: any) {
    try {
      await this.apiService.post('ProductChangeRule', rule);
      this.sharedService.notify('Regla registrada', 'success');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Creando reglas:'),
        'error'
      );
    } finally {
      this.isLoadingResults = false;
    }
  }

  private async updateRule(rule: any) {
    try {
      await this.apiService.put('ProductChangeRule', rule);
      this.sharedService.notify('Regla actualizada', 'success');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Actualizando reglas:'),
        'error'
      );
    } finally {
      this.isLoadingResults = false;
    }
  }
}
