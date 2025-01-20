export interface User {
  email: string
  password: string
  name: string
  lastName: string
  role: string
  token: string
}

export interface Role {
  name: string
  state: boolean
  ip: string
  device: string
  id: string
}

export interface Module {
  name: string
  ip: string
  device: string
  id: string
}

export interface RoleModule{
  idRole: string,
  roleName: string,
  moduleId: number,
  moduleName: string
}
export interface ModuleRole {
  name: string
  id: string
  selected: boolean
}
/* modulo zonas */
export interface Pais{
  id: number
  name: string
  iso3: string
  phoneCode: string
  currency: string
  currencyName: string
  currencySymbol: string
  isActive: boolean
}

export interface Departamento{
  id: 0
  name: string
  countryId: number
  countryCode: string
  countryName: string
  isActive: boolean
}

export interface Ciudad{
  id: number
  name: string
  isActive: boolean
  departmentId: number
}

export interface Farmacia{
  id: number
  name: string
  adress: string
  isActive: boolean
  cityId: number
  city: string
  ip: string
  device: string
}

export interface Cadena {
  id: number
  name: string
  isActive: boolean,
  pharmacy?: Farmacia[]
}

/* modulo inventario */
export interface Categoria{
  id?: number
  name: string
  isActive: boolean
  ip: string
  device: string
}

export interface Producto{
  id: number
  name: string
  barcode: string
  description: string
  presentation: string
  quantity: number
  typeSell: string
  cost: number
  idCategory: number
  nameCategory: string
  isActive:boolean
  file: any
}

export interface FilesToProduct{
  productId?: number
  name: string
  fileBase64: string
  typeFile: string
}

export interface Rule{
  id: number
  daysAround: number
  periodicity: number
  quantityBuy: number
  quantityGive: number
  maxChangeYear: number
  productId: number
  productName: string
  barcode: string
  isActive: boolean
}

/* Modulo de medicos */
export interface Especialidad{
  id?: number
  name: string
  isActive: boolean
  ip: string
  device: string
}

export interface Medico{
  id: number
  name: string
  register: string
  isActive: boolean
  specialtyId: number
  patologyName: string
}

/* Modulo de ventas */
export interface Venta{
  id: number
  idCityPharmacy: number
  idPharmacy: number
  cityPharmacy: string
  namePharmacy: string
  userId: string
  noPurchase: string
  reviewed: boolean
  dateShiped: string
}

export interface ProductOnVenta{
  productName: string
  productId: number
  quantityShiped: number
  dateShiped: string
}


export interface Patology {
  id?: string,
  name: string,
  isActive: boolean,
}
