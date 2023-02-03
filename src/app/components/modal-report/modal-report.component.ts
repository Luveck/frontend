import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-modal-report',
  templateUrl: './modal-report.component.html',
  styleUrls: ['./modal-report.component.scss']
})
export class ModalReportComponent implements OnInit {
  fecha:any
  doneCreate:boolean = false
  colums:string[] = []
  columsExcluded: string[] = [
    'id', 'status', 'state', 'isDeleted', 'createBy', 'creationDate', 'updateBy', 'updateDate', 'countryId', 'departymentId', 'cityId', 'idCategory', 'productId', 'patologyId', 'idCityPharmacy', 'idPharmacy', 'reviewed', 'urlOficial'
  ]

  constructor(public dataServ:DataService, public dialogo: MatDialogRef<ModalReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.fecha = new Date()
    console.log(this.data)
    this.defineSquema()
  }

  cerrarDialogo(): void {
    this.dialogo.close();
  }

  defineSquema(){
    const headeres = Object.keys(this.data.body[0])
    headeres.map(header => !this.columsExcluded.includes(header) ?this.colums.push(header) :null)
    console.info(this.colums)
  }

  saveReport(){
    if(!this.dataServ.progress && !this.doneCreate){
      this.dataServ.progress = true
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
        this.dialogo.close()
      });
    }
  }
}
