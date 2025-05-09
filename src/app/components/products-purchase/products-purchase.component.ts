import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-products-purchase',
  templateUrl: './products-purchase.component.html',
  styleUrls: ['./products-purchase.component.scss']
})
export class ProductsPurchaseComponent implements OnInit {
  @Input()  ELEMENT_DATA!:any[];
  public isLoadingResults = true;
  public displayedColumns:string[] = ['product', 'buyed', 'state', 'dateBuy'];
  public dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
  constructor() { }

  ngOnInit(): void {
    this.isLoadingResults = false;
    this.dataSource.sort = this.dataSource.sort;
    this.dataSource.paginator = this.dataSource.paginator;
  }

}
