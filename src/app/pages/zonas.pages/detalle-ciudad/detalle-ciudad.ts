import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms'

import { Ciudad, Departamento } from 'src/app/interfaces/models'
import { ZonasService } from 'src/app/services/zonas.service'
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-detalle-ciudad',
  templateUrl: './detalle-ciudad.html',
  styleUrls: ['./detalle-ciudad.scss'],
})

export class DetalleCiudad implements OnInit {
  currentCiudad!: Ciudad | any
  departamentos!: Departamento[]
  isLoadingResults!:boolean

  public ciudadForm = new FormGroup({
    departymentId: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required)
  })

  constructor(
    private readonly sharedService: SharedService,
    private readonly apiService: ApiService,
    public dialogo: MatDialogRef<DetalleCiudad>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit(): void {
    if(this.data.ciudadId){
      this.isLoadingResults = true
      this.getCity()
    }
    this.comboDepartment();
  }

  public async getCity() {
    try {
      this.currentCiudad = await this.apiService.get(`City/${this.data.ciudadId}`);
      this.initValores();
    } catch (error) {
      this.sharedService.notify('Ocurrio un error con la petición', 'error');
    } finally {
      this.isLoadingResults = false;
    }
  }


  public async comboDepartment(){
    if (this.sharedService.getDepartmentList().length == 0){
      await this.sharedService.setDepartments();
    }
    this.departamentos = this.sharedService.getDepartmentList();
  }

  initValores(){
    this.ciudadForm.patchValue({
      departymentId: this.currentCiudad.departmentId,
      name: this.currentCiudad.name,
    })
  }

  resetForm(){
    this.ciudadForm.reset()
  }

  save(){
    let city: any = {
      name: this.ciudadForm.value.name,
      DepartmentId: this.ciudadForm.value.departymentId,
    }
    if(this.data.ciudadId){
      city = {
        ...city,
        id: this.currentCiudad.id,
        isActive: this.currentCiudad.isActive,
      }
      this.updatedCity(city);
    }else{
      city = {
        ...city,
        isActive: true,
      }
      this.addCity(city);
    }
    this.dialogo.close(true);
  }
  public async addCity (city: any) {
    try {
      await this.apiService.post('City', city);
      this.sharedService.notify('Ciudad registrada', 'success');
    } catch (error) {
      this.sharedService.notify('Ocurrio un error con el proceso', 'error')
    } finally {
      this.isLoadingResults = false;
    }
  }

  public async updatedCity (city: any) {
    try {
      await this.apiService.put('City', city);
      this.sharedService.notify('Ciudad actualizada', 'success');
    } catch (error) {
      this.sharedService.notify('Ocurrio un error con el proceso', 'error')
    } finally {
      this.isLoadingResults = false;
    }
  }
}
