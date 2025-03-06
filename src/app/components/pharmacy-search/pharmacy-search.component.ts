import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  Ciudad,
  Departamento,
  Farmacia,
  Pais,
} from 'src/app/interfaces/models';
import { CountryService } from 'src/app/services/country.service';
import { FarmaciasService } from 'src/app/services/farmacias.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-pharmacy-search',
  templateUrl: './pharmacy-search.component.html',
  styleUrls: ['./pharmacy-search.component.scss'],
})
export class PharmacySearchComponent implements OnInit {
  ciudades!: Ciudad[];
  departamentos!: Departamento[];
  farmacias!: Farmacia[];
  filteredDepartments: Departamento[] = [];
  filteredCities: Ciudad[] = [];
  filteredPharmacy: Farmacia[] = [];
  farmacia: Farmacia | null = null;
  chains!: any[];
  filteredChains: any[] = [];

  private countryId = '';

  public farmaForm = new FormGroup({
    cityId: new FormControl('', Validators.required),
    chainId: new FormControl('', Validators.required),
    departmentId: new FormControl('', Validators.required),
  });

  constructor(
    public dialogo: MatDialogRef<PharmacySearchComponent>,
    private readonly sharedService: SharedService,
    private readonly pharmaService: FarmaciasService,
    @Inject(MAT_DIALOG_DATA) public prodData: any,
    private readonly countryService: CountryService
  ) {}

  ngOnInit(): void {
    this.countryService.countryId$.subscribe((country) => {
      this.countryId = country;
    });
    this.getConfiguration();
  }

  private async getConfiguration() {
    try {
      await this.sharedService.setDepartments();
      await this.sharedService.setCities();
      await this.pharmaService.setPharmacies();
      const chains = await this.pharmaService.setChainByCountry(this.countryId);
      this.chains = chains as any[];
    } catch (err) {
      this.sharedService.notify(
        'Ocurrio un error consultando las configuraciones',
        'error'
      );
    } finally {
      this.ciudades = this.sharedService.getCityList();
      this.departamentos = this.sharedService.getDepartmentList();
      this.farmacias = this.pharmaService.getPharmacies();
      this.onCountryChange();
    }
  }

  onCountryChange() {
    this.filteredDepartments = this.departamentos.filter(
      (dept) => dept.countryId === Number(this.countryId)
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

  public onChainChange(chainId: number) {
    this.filteredPharmacy = this.farmacias.filter(
      (pharmacy) => pharmacy.chainId === chainId
    );
    this.farmacia = null;
  }
}
