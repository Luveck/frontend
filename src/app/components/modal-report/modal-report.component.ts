import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

import { DataService } from 'src/app/services/data.service';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8'

@Component({
  selector: 'app-modal-report',
  templateUrl: './modal-report.component.html',
  styleUrls: ['./modal-report.component.scss']
})

export class ModalReportComponent implements OnInit {
  typeSave:string = ''
  fecha:any
  doneCreate:boolean = false
  colums:string[] = []
  body:any[] = []
  row:any = {}
  columsExcluded: string[] = [
    'id', 'status', 'state', 'isDeleted', 'createBy', 'creationDate', 'updateBy', 'updateDate', 'countryId', 'departymentId', 'cityId', 'idCategory', 'productId', 'patologyId', 'idCityPharmacy', 'idPharmacy', 'reviewed', 'urlOficial','statusUploadImage','urlImgs'
  ]

  constructor(public dataServ:DataService, public dialogo: MatDialogRef<ModalReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    if(this.data.body.length != 0){
      this.fecha = new Date()
      this.defineSquema()
    }else{
      this.cerrarDialogo()
      this.dataServ.fir('No hay información para mostrar en el reporte.', 'info')
    }
  }

  cerrarDialogo(): void {
    this.dialogo.close();
  }

  defineSquema(){
    const headers = Object.keys(this.data.body[0])
    headers.map(header => !this.columsExcluded.includes(header) ?this.colums.push(header) :null)

    this.data.body.map((data:any) => {
      for (const keyData in data) {
        this.colums.includes(keyData) ? this.row = {...this.row, [keyData]: data[keyData]} :null
      }
      this.body.push(this.row)
    })
  }

  saveReportPDF(){
    if(!this.dataServ.progress && !this.doneCreate){
      this.dataServ.progress = true
      this.typeSave = 'pdf'
      const DATA:any = document.getElementById('htmlData');
      const doc = new jsPDF('p', 'pt', 'a4');
      const options = {
        background: 'white',
        scale: 3
      };
      html2canvas(DATA, options).then((canvas) => {

        const img = canvas.toDataURL('image/PNG');

        const bufferX = 15;
        const bufferY = 15;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
        return doc;
      }).then((docResult) => {
        docResult.save(`${this.fecha.toDateString()}_${this.data.title}.pdf`);
        this.dataServ.progress = false
        this.doneCreate = true
        this.typeSave = ''
        this.dialogo.close()
      });
    }
  }

  saveReportEXCEL(){
    if(!this.dataServ.progress && !this.doneCreate){
      this.dataServ.progress = true
      this.typeSave = 'excel'

      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.body)
      const workbook: XLSX.WorkBook = {
        Sheets: {'data': worksheet},
        SheetNames:['data']
      }
      const excelBuffer:any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'})
      this.saveAsExcel(excelBuffer)
    }
  }

  private saveAsExcel(buffer:any){
    const data:Blob = new Blob([buffer], {type: EXCEL_TYPE})
    FileSaver.saveAs(data, `${this.fecha.toDateString()}_${this.data.title}.xlsx`)
    this.dataServ.progress = false
    this.doneCreate = true
    this.typeSave = ''
    this.dialogo.close()
  }
}
