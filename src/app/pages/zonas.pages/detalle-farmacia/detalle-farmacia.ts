import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms'

import { Farmacia, Ciudad, Pais, Departamento, Cadena } from 'src/app/interfaces/models'
import { ZonasService } from 'src/app/services/zonas.service'
import { FarmaciasService } from 'src/app/services/farmacias.service';
import { CadenaService } from 'src/app/services/cadenas.service';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-detalle-farmacia',
  templateUrl: './detalle-farmacia.html',
  styleUrls: ['./detalle-farmacia.scss'],
})

export class DetalleFarmacia implements OnInit {
  currentFarmacia!: Farmacia | any
  ciudades!: Ciudad[]
  paises!: Pais[]
  cadenas!: Cadena[]
  departamentos!: Departamento[]
  isLoadingResults!:boolean
  filteredDepartments: Departamento[] = [];
  filteredCities: Ciudad[] = [];

  public farmaForm = new FormGroup({
    name: new FormControl('', Validators.required),
    adress: new FormControl('', Validators.required),
    cityId: new FormControl('', Validators.required),
    countryId: new FormControl('', Validators.required),
    departmentId: new FormControl('', Validators.required),
    cadenaId: new FormControl('', Validators.required)
  })

  constructor(
    private readonly _zonasServ:ZonasService,
    private readonly farmaServ:FarmaciasService,
    private readonly apiService: ApiService,
    private readonly sharedService: SharedService,
    public dialogo: MatDialogRef<DetalleFarmacia>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit(): void {
    if(this.data.farmaId){
      this.getPharmacy();
    }
    this.getConfigurations();
  }

  private async getPharmacy() {
    try {
      this.isLoadingResults = true;
      this.currentFarmacia = await this.apiService.get(`Pharmacy/${this.data.farmaId}`);
      this.initValores();
    } catch (error) {
      this.sharedService.notify('Ocurrio un error consultando la información', 'error')
    } finally {
      this.isLoadingResults = false;
    }
  }

  private async getConfigurations(){
    try {
      this.isLoadingResults = true;
      if (this.farmaServ.getChainList().length == 0) {
        await this.farmaServ.setChain();
      }
      if (this.sharedService.getCityList().length == 0) {
        await this.sharedService.setCities();
      }
      if (this.sharedService.getDepartmentList().length == 0) {
        await this.sharedService.setDepartments();
      }
      if (this.sharedService.getCountryList().length == 0) {
        await this.sharedService.setCountry();
      }
      this.ciudades = this.sharedService.getCityList();
      this.paises = this.sharedService.getCountryList();
      this.departamentos = this.sharedService.getDepartmentList();
      this.cadenas = this.farmaServ.getChainList();
    } catch (error) {
      this.sharedService.notify('Ocurrio un error consultando las configuraciones', 'error')
   } finally {
    this.isLoadingResults = false;
   }
  }

  initValores(){
    const ciudad = this.ciudades.find(d => d.id === this.currentFarmacia.cityId);
    const departamento = this.departamentos.find(d => d.id === ciudad!.departmentId);
    const country = this.paises.find(x => x.id === departamento!.countryId);
    this.onCountryChange(country!.id);
    this.onDepartmentChange(departamento!.id);
    this.farmaForm.patchValue({
      name: this.currentFarmacia.name,
      adress: this.currentFarmacia.adress,
      countryId: country!.id as any,
      departmentId: departamento!.id as any,
      cityId: this.currentFarmacia.cityId,
      cadenaId: this.currentFarmacia.chainId,
    })
  }

  resetForm(){
    this.farmaForm.reset()
  }

  onCountryChange(countryId: number) {
    this.filteredDepartments = this.departamentos.filter(dept => dept.countryId === countryId);
    this.farmaForm.get('departmentId')?.enable();
    this.farmaForm.get('departmentId')?.reset();
    this.filteredCities = [];
    this.farmaForm.get('cityId')?.reset();
    this.farmaForm.get('cityId')?.disable();
  }

  onDepartmentChange(departmentId: number) {
    this.filteredCities = this.ciudades.filter(city => city.departmentId === departmentId);
    this.farmaForm.get('cityId')?.enable();
    this.farmaForm.get('cityId')?.reset();
  }

  save(){
    this.isLoadingResults = true;
    let pharmacy: any = {
      name: this.farmaForm.value.name,
      adress: this.farmaForm.value.adress,
      cityId: this.farmaForm.value.cityId,
      chainId: this.farmaForm.value.cadenaId
    }
    pharmacy = this.sharedService.addIpDevice(pharmacy);
    if(this.data.farmaId){
      pharmacy = {
        ...pharmacy,
        id: this.data.farmaId,
        isActive: this.currentFarmacia.isActive,
      }
      this.updatePharmacy(pharmacy);
    }else{
      pharmacy = {
        ...pharmacy,
        isActive: true,
      }
      this.addPharmacy(pharmacy);
    }
    this.dialogo.close(true);
  }

  private async addPharmacy (pharmacy : any) {
    try {
      await this.apiService.post(`Pharmacy`, pharmacy);
      this.sharedService.notify('Farmacia registrada', 'success');
    } catch (error) {
      this.sharedService.notify('Ocurrio un error registrando la farmacia', 'error');
    } finally {
      this.isLoadingResults = false;
    }
  }

  private async updatePharmacy( pharmacy: any ) {
    try {
      await this.apiService.put('Pharmacy', pharmacy);
      this.sharedService.notify('Farmacia actualizada', 'success');
    } catch (error) {
      this.sharedService.notify('Ocurrio un error con el proceso.', 'error');
    } finally {
      this.isLoadingResults = false;
    }
  }
}
