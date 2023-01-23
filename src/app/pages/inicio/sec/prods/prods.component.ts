import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalProdIniComponent } from '../modal-prod-ini/modal-prod-ini.component';

@Component({
  selector: 'app-prods',
  templateUrl: './prods.component.html',
  styleUrls: ['./prods.component.scss']
})
export class ProdsComponent implements OnInit {
  @Input() color!:boolean
  selectedCategory:number = 0
  prodsCanje:any[] = [
    {
      nameFamily:'Olcarveck',
      prods: [
        {nombreProd: 'Olcarveck® 20mg', img: 'https://luveck.com/wp-content/uploads/2022/02/Olcarveck-20.png', regla: '2+1', maximoAnual: 4, presentacion:'Caja por 30 tabletas Recubiertas.', urlDatos: 'https://luveck.com/producto/hormotirox-50mcg/'},
        {nombreProd: 'Olcarveck® 40mg', img: 'https://luveck.com/wp-content/uploads/2021/12/caja-olcarveck-40mg.png', regla: '2+1', maximoAnual: 4, presentacion:'Caja por 30 tabletas Recubiertas.', urlDatos: 'https://luveck.com/producto/hormotirox-50mcg/'},
        {nombreProd: 'Olcarveck® A 40/5mg', img: 'https://luveck.com/wp-content/uploads/2021/12/caja-olcarveck-40mg.png', regla: '2+1', maximoAnual: 4, presentacion:'Caja por 30 tabletas Recubiertas.', urlDatos: 'https://luveck.com/producto/hormotirox-50mcg/'},
        {nombreProd: 'Olcarveck® D 40/25mg', img: 'https://luveck.com/wp-content/uploads/2022/02/Olcarveck-20.png', regla: '2+1', maximoAnual: 4, presentacion:'Caja por 30 tabletas Recubiertas.', urlDatos: 'https://luveck.com/producto/hormotirox-50mcg/'},
        {nombreProd: 'Olcarveck® A 40/2.5mg', img: 'https://luveck.com/wp-content/uploads/2022/02/Olcarveck-20.png', regla: '2+1', maximoAnual: 4, presentacion:'Caja por 30 tabletas Recubiertas.', urlDatos: 'https://luveck.com/producto/hormotirox-50mcg/'},
        {nombreProd: 'Olcarveck® A 20/2.5mg', img: 'https://luveck.com/wp-content/uploads/2022/02/Olcarveck-20.png', regla: '2+1', maximoAnual: 4, presentacion:'Caja por 30 tabletas Recubiertas.', urlDatos: 'https://luveck.com/producto/hormotirox-50mcg/'},
        {nombreProd: 'Olcarveck® A 40/12.5mg', img: 'https://luveck.com/wp-content/uploads/2022/02/Olcarveck-20.png', regla: '2+1', maximoAnual: 4, presentacion:'Caja por 30 tabletas Recubiertas.', urlDatos: 'https://luveck.com/producto/hormotirox-50mcg/'},
        {nombreProd: 'Olcarveck® D 20/12.5mg', img: 'https://luveck.com/wp-content/uploads/2022/02/Olcarveck-20.png', regla: '2+1', maximoAnual: 4, presentacion:'Caja por 30 tabletas Recubiertas.', urlDatos: 'https://luveck.com/producto/hormotirox-50mcg/'}
      ]
    },
    {
      nameFamily:'Soprapen',
      prods: [
        {nombreProd: 'Soprapen® 20mg', img: 'https://luveck.com/wp-content/uploads/2022/02/Olcarveck-20.png', regla: '2+1', maximoAnual: 4, presentacion:'Caja por 30 tabletas Recubiertas.', urlDatos: 'https://luveck.com/producto/hormotirox-50mcg/'},
      ]
    },
    {
      nameFamily:'Glúglic',
      prods: [
        {nombreProd: 'Glúglic® Mr 60mg', img: 'https://luveck.com/wp-content/uploads/2022/02/Olcarveck-20.png', regla: '2+1', maximoAnual: 4, presentacion:'Caja por 30 tabletas Recubiertas.', urlDatos: 'https://luveck.com/producto/hormotirox-50mcg/'},
      ]
    },
    {
      nameFamily:'Hormotirox',
      prods: [
        {nombreProd: 'Hormotirox® 50mcg', img: 'https://luveck.com/wp-content/uploads/2022/02/Olcarveck-20.png', regla: '1+1', maximoAnual: 6, presentacion:'Caja por 30 tabletas Recubiertas.', urlDatos: 'https://luveck.com/producto/hormotirox-50mcg/'},
        {nombreProd: 'Hormotirox® 75mcg', img: 'https://luveck.com/wp-content/uploads/2022/02/Olcarveck-20.png', regla: '1+1', maximoAnual: 6, presentacion:'Caja por 30 tabletas Recubiertas.', urlDatos: 'https://luveck.com/producto/hormotirox-50mcg/'},
        {nombreProd: 'Hormotirox® 25mcg', img: 'https://luveck.com/wp-content/uploads/2022/02/Olcarveck-20.png', regla: '1+1', maximoAnual: 6, presentacion:'Caja por 30 tabletas Recubiertas.', urlDatos: 'https://luveck.com/producto/hormotirox-50mcg/'},
        {nombreProd: 'Hormotirox® 100mcg', img: 'https://luveck.com/wp-content/uploads/2022/02/Olcarveck-20.png', regla: '1+1', maximoAnual: 6, presentacion:'Caja por 30 tabletas Recubiertas.', urlDatos: 'https://luveck.com/producto/hormotirox-50mcg/'},
      ]
    },
  ]

  constructor(private _dialog: MatDialog,) { }

  ngOnInit(): void {

  }

  selectCategory(index:number){
    this.selectedCategory = index
  }

  openModalProd(prod:any){
    const config:MatDialogConfig = {
      data: prod
    }
    this._dialog.open(ModalProdIniComponent, config)
  }
}
