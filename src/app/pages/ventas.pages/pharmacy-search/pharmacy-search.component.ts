import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  Ciudad,
  Departamento,
  Farmacia,
  Pais,
} from 'src/app/interfaces/models';
import { FarmaciasService } from 'src/app/services/farmacias.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-pharmacy-search',
  templateUrl: './pharmacy-search.component.html',
  styleUrls: ['./pharmacy-search.component.scss'],
})
export class PharmacySearchComponent implements OnInit {
  ciudades!: Ciudad[];
  paises!: Pais[];
  departamentos!: Departamento[];
  farmacias!: Farmacia[];
  countrySelected: Pais = {} as Pais;
  filteredDepartments: Departamento[] = [];
  filteredCities: Ciudad[] = [];
  filteredPharmacy: Farmacia[] = [];
  farmacia: Farmacia | null = null;

  public farmaForm = new FormGroup({
    cityId: new FormControl('', Validators.required),
    countryId: new FormControl('', Validators.required),
    departmentId: new FormControl('', Validators.required),
  });

  constructor(
    private _farmaServ: FarmaciasService,
    public dialogo: MatDialogRef<PharmacySearchComponent>,

    private readonly sharedService: SharedService,
    private readonly pharmaService: FarmaciasService,
    @Inject(MAT_DIALOG_DATA) public prodData: any
  ) {}

  ngOnInit(): void {
    // this._zonasServ.getAll();
    // this.ciudades = this._zonasServ.listCiudades;
    // this.paises = this._zonasServ.listPaises;
    // this.departamentos = this._zonasServ.listDepartamentos;
    // this.farmacias = this._farmaServ.listFarmacias;
    // this.filteredDepartments = this.departamentos.filter(
    //   (dept) => dept.countryId === 1
    // );
    this.getConfiguration();
  }

  private async getConfiguration() {
    try {
      await this.sharedService.setCountry();
      await this.sharedService.setDepartments();
      await this.sharedService.setCities();
      await this.pharmaService.setPharmacies();
    } catch (err) {
      this.sharedService.notify(
        'Ocurrio un error consultando las configuraciones',
        'error'
      );
    } finally {
      this.ciudades = this.sharedService.getCityList();
      this.paises = this.sharedService.getCountryList();
      this.departamentos = this.sharedService.getDepartmentList();
      this.farmacias = this.pharmaService.getPharmacies();
    }
  }

  onCountryChange(countryId: number) {
    this.countrySelected = this.paises.filter((p) => p.id === countryId)[0];
    this.filteredDepartments = this.departamentos.filter(
      (dept) => dept.countryId === countryId
    );
    this.farmaForm.get('departmentId')?.enable();
    this.farmaForm.get('departmentId')?.reset();
    this.filteredCities = [];
    this.farmaForm.get('cityId')?.reset();
    this.farmaForm.get('cityId')?.disable();
    this.farmacia = null;
  }

  onDepartmentChange(departmentId: number) {
    this.filteredCities = this.ciudades.filter(
      (city) => city.departmentId === departmentId
    );
    this.farmaForm.get('cityId')?.enable();
    this.farmaForm.get('cityId')?.reset();
    this.farmacia = null;
  }

  onCityChange(cityId: number) {
    this.filteredPharmacy = this.farmacias.filter(
      (pharmacy) => pharmacy.cityId === cityId
    );
    this.farmaForm.get('pharmacyId')?.enable();
    this.farmaForm.get('pharmacyId')?.reset();
    this.farmacia = null;
  }

  onPharmacyChange(phamacyId: number) {
    this.farmacia = this.farmacias.filter(
      (pharmacy) => pharmacy.id === phamacyId
    )[0];
  }
  onClose() {
    this.dialogo.close();
  }

  onSelect() {
    this.dialogo.close(this.farmacia);
  }
}
