export interface User {
  email: string
  password: string
  name: string
  lastName: string
  role: string
  token: string
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
  status: boolean
  createBy?: string
  creationDate?: string
  updateBy?: string
  updateDate?: string
}

export interface Departamento{
  id: 0
  name: string
  countryId: 0
  countryCode: string
  countryName: string
  status: boolean
  createBy?: string
  creationDate?: string
  updateBy?: string
  updateDate?: string
}

export interface Ciudad{
  id: number
  name: string
  state: boolean
  departymentId: number
  departmentName: string
  countryId: number
  countryName: string
  createBy?: string
  creationDate?: string
  updateBy?: string
  updateDate?: string
}

export interface Farmacia{
  id: number
  name: string
  adress: string
  isDeleted: boolean
  cityId: number
  city: string
  createBy?: string
  creationDate?: string
  updateBy?: string
  updateDate?: string
}

/* modulo inventario */
export interface Categoria{
  id?: number
  name: string
  isDeleted: boolean
  createBy?: string
  creationDate?: string
  updateBy?: string
  updateDate?: string
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
  state:boolean
  createBy?: string
  creationDate?: string
  updateBy?: string
  updateDate?: string
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
  state: boolean
  createBy?: string
  creationDate?: string
  updateBy?: string
  updateDate?: string
}

/* Modulo de medicos */
export interface Especialidad{
  id?: number
  name: string
  isDeleted: boolean
  createBy?: string
  creationDate?: string
  updateBy?: string
  updateDate?: string
}

export interface Medico{
  id: number
  name: string
  register: string
  isDeleted: boolean
  patologyId: number
  patologyName: string
  createBy?: string
  creationDate?: string
  updateBy?: string
  updateDate?: string
}

/* Modulo de ventas */
export interface Venta{
  id: number
  idCityPharmacy: number
  idPharmacy: number
  cityPharmacy: string
  namePharmacy: string
  buyer: string
  noPurchase: string
  reviewed: boolean
  dateShiped: string
  createBy?: string
  creationDate?: string
  updateBy?: string
  updateDate?: string
}

export interface ProductOnVenta{
  productName: string
  productId: number
  quantityShiped: number
  dateShiped: string
  createBy?: string
  creationDate?: string
  updateBy?: string
  updateDate?: string
}
