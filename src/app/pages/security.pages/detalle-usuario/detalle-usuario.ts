import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { UsuariosService } from 'src/app/services/usuarios.service';
import { AuthService } from 'src/app/services/auth.service';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';
import { Farmacia, Pais } from 'src/app/interfaces/models';
import { FarmaciasService } from 'src/app/services/farmacias.service';
import { MatSelectChange } from '@angular/material/select';
import { UserRoles } from 'src/app/shared/enums/roles.enum';
import { PharmacySearchComponent } from '../../ventas.pages/pharmacy-search/pharmacy-search.component';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

@Component({
  selector: 'app-detalle-usuario',
  templateUrl: './detalle-usuario.html',
  styleUrls: ['./detalle-usuario.scss'],
})
export class DetalleUsuario implements OnInit {
  currentUser!: any;
  isLoadingResults?: boolean;
  farmacias!: Farmacia[];
  public countries: Pais[] = [];

  public newUserForm = new FormGroup({
    dni: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9]+$'),
      Validators.minLength(2),
    ]),
    password: new FormControl(''),
    name: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    bornDate: new FormControl('', Validators.required),
    sex: new FormControl('', Validators.required),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$'),
      Validators.minLength(8),
    ]),
    address: new FormControl('', Validators.required),
    pharmacyId: new FormControl(''),
    countryId: new FormControl('', Validators.required),
  });

  public showPharmacy = false;
  public roles: any[] = [];

  constructor(
    private _dialog: MatDialog,
    public dialogo: MatDialogRef<DetalleUsuario>,
    private readonly apiService: ApiService,
    private readonly sharedService: SharedService,
    private readonly usersServ: UsuariosService,
    private readonly pharmaService: FarmaciasService,
    private readonly dialogPharmacy: MatDialog,
    private readonly authServ: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.configuration();
    if (this.data.userDni) {
      this.getUser();
    }
  }

  private async getUser() {
    try {
      this.isLoadingResults = true;
      this.currentUser = await this.apiService.get(
        `User/GetUserById/${this.data.userDni}`
      );
      this.initValues();
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Consultando usuarios:'),
        'error'
      );
    } finally {
      this.isLoadingResults = false;
    }
  }
  private async configuration() {
    this.isLoadingResults = true;
    await this.usersServ.setRoles();
    await this.sharedService.setCountry();
    this.roles = this.usersServ.getRoles();
    this.countries = this.sharedService.getCountryList();
    this.isLoadingResults = false;
  }
  initValues() {
    this.newUserForm.patchValue({
      dni: this.currentUser.dni,
      name: this.currentUser.name,
      lastName: this.currentUser.lastName,
      email: this.currentUser.email,
      role: this.currentUser.roles[0],
      bornDate: this.currentUser.bornDate,
      sex: this.currentUser.sex,
      phone: this.currentUser.phone,
      address: this.currentUser.address,
      countryId: this.currentUser.countryId,
    });
    if (this.currentUser.roles[0] === UserRoles.PharmacyUser) {
      this.newUserForm.patchValue({
        pharmacyId: this.currentUser.farmaciaId,
      });
      this.showPharmacy = true;
      const field = this.newUserForm.get('pharmacyId');
      field?.setValidators([Validators.required]);
      field?.updateValueAndValidity();
    }
  }

  resetForm() {
    this.newUserForm.reset();
  }

  selectRole(nameRole: string) {
    const tempRole = this.usersServ.localRoles.filter(
      (role) => role.name === nameRole
    );
    return tempRole[0];
  }

  save(chageState?: boolean) {
    let state =
      chageState != null
        ? !this.currentUser.isActive
        : this.currentUser.isActive;
    if (this.data.userDni) {
      this.updateUser(state);
    } else {
      this.addUser();
    }
    this.dialogo.close(true);
  }

  changeUserState(state: boolean, idUser: string) {
    if (this.authServ.dataUser().UserId === idUser) {
      this.usersServ.notify(
        'No es posible inhabilitar su propia cuenta.',
        'info'
      );
      return;
    }
    let msg = state
      ? '¿Seguro de querer inhabilitar esta cuenta?'
      : '¿Seguro de querer habilitar esta cuenta?';
    this._dialog
      .open(DialogConfComponent, {
        data: `${msg}`,
      })
      .afterClosed()
      .subscribe((confirmado: boolean) => {
        if (confirmado) {
          this.save(!state);
        }
      });
  }

  private async addUser() {
    try {
      let user: any = this.createModel();
      user = this.sharedService.addIpDevice(user);
      user = {
        ...user,
        isActive: true,
        changePass: true,
      };
      await this.apiService.post('User/CreateUser', user);
      this.sharedService.notify('Usuario registrado', 'success');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Creando usuarios:'),
        'error'
      );
    } finally {
      this.isLoadingResults = false;
    }
  }

  private async updateUser(chageState: boolean) {
    try {
      let user: any = this.createModel();
      user = this.sharedService.addIpDevice(user);
      user = {
        ...user,
        IsActive: chageState,
        id: this.data.userDni,
      };
      await this.apiService.put(`User`, user);
      this.sharedService.notify('Usuario actualizado', 'success');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Actualizando usuarios:'),
        'error'
      );
    } finally {
      this.isLoadingResults = false;
    }
  }

  private createModel() {
    let user: any = {
      DNI: this.newUserForm.value.dni,
      Name: this.newUserForm.value.name,
      Email: this.newUserForm.value.email,
      userName: this.newUserForm.value.dni,
      lastName: this.newUserForm.value.lastName,
      CountryId: this.newUserForm.value.countryId,
      Address: this.newUserForm.value.address,
      sex: this.newUserForm.value.sex,
      BornDate: this.newUserForm.value.bornDate,
      Phone: this.newUserForm.value.phone,
      Role: this.newUserForm.value.role,
      Password: '',
      ConfirmPassword: '',
      CreatedAt: Date.now(),
      UpdatedAt: Date.now(),
    };
    if (this.newUserForm.value.role === UserRoles.PharmacyUser) {
      user = {
        ...user,
        pharmacyId: this.newUserForm.value.pharmacyId,
      };
    } else {
      user = {
        ...user,
        pharmacyId: 0,
      };
    }
    return user;
  }

  public onRoleChange(event: MatSelectChange) {
    const field = this.newUserForm.get('pharmacyId');
    if (event.value === UserRoles.PharmacyUser) {
      this.getPharmacies();
      this.showPharmacy = true;
      field?.setValidators([Validators.required]);
    } else {
      field?.clearValidators();
      this.showPharmacy = false;
    }
    field?.updateValueAndValidity();
  }

  private async getPharmacies() {
    this.isLoadingResults = true;
    await this.pharmaService.setPharmacies();
    this.isLoadingResults = false;
    this.farmacias = this.pharmaService.getPharmacies();
  }

  filterFharmacy(event: MouseEvent) {
    event.stopPropagation();
    const dialogRef = this.dialogPharmacy.open(PharmacySearchComponent, {});
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.newUserForm.patchValue({
          pharmacyId: result.id,
        });
      }
    });
  }
}
