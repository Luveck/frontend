import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DetalleReglas } from 'src/app/pages/inventario.pages/detalle-reglas/detalle-reglas';
import { RulesService } from 'src/app/services/rules.service';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { Rule } from 'src/app/interfaces/models';
import { ModalReportComponent } from 'src/app/components/modal-report/modal-report.component';
import { SharedService } from 'src/app/services/shared.service';
import { ApiService } from 'src/app/services/api.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

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
        link: '/admin/home',
      },
      {
        name: 'Gestión de reglas de canje',
        isLink: false,
      },
    ],
  };

  isLoadingResults: boolean = true;
  filterRules: Rule[] = [];
  public rules: any[] = [];

  constructor(
    private readonly dialog: MatDialog,
    private readonly rulesServ: RulesService,
    private readonly sharedService: SharedService,
    private readonly apiService: ApiService,
    private readonly errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.getRules();
  }

  private async getRules() {
    await this.rulesServ.setRules();
    this.filterRules = this.rulesServ.getRules();
    this.rules = this.rulesServ.getRules();
    this.isLoadingResults = false;
  }

  on(id?: number) {
    const config = {
      data: {
        title: id ? 'Editar regla de canje' : 'Agregar regla de canje',
        ruleId: id,
      },
    };
    this.dialog
      .open(DetalleReglas, config)
      .afterClosed()
      .subscribe((confirm: boolean) => {
        if (confirm) {
          this.isLoadingResults = true;
          this.getRules();
        }
      });
  }

  chageState(row: any) {
    let rule: any = {
      daysAround: row.daysAround,
      periodicity: row.periodicity,
      quantityBuy: row.quantityBuy,
      quantityGive: row.quantityGive,
      maxChangeYear: row.maxChangeYear,
      productId: row.productId,
      countryId: row.countryId,
      id: row.id,
      isActive: !row.isActive,
    };
    let msgDialog: string;
    if (row.isActive) {
      msgDialog = '¿Seguro de querer inhabilitar esta regla de canje?';
    } else {
      msgDialog = '¿Seguro de querer habilitar esta regla de canje?';
    }
    this.dialog
      .open(DialogConfComponent, {
        data: msgDialog,
      })
      .afterClosed()
      .subscribe((confirmado: boolean) => {
        if (confirmado) {
          this.chageStatus(rule);
        }
      });
  }

  private async chageStatus(rule: any) {
    try {
      this.isLoadingResults = true;
      await this.apiService.put('ProductChangeRule', rule);
      this.sharedService.notify('Regla actualizada', 'success');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Actualizando reglas:'),
        'error'
      );
    } finally {
      this.isLoadingResults = false;
      this.getRules();
    }
  }

  generateReport() {
    this.dialog.open(ModalReportComponent, {
      disableClose: true,
      data: {
        title: 'Reporte General de Reglas de Canje',
        body: this.rules,
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .toLowerCase()
      .trim();

    this.rules = this.filterRules.filter((a) =>
      a.productName.toLowerCase().includes(filterValue)
    );
  }
}
