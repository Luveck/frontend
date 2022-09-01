export interface User {
  email: string,
  password: string,
  name: string,
  lastName: string,
  role: string,
  token: string,
}

/* modulo zonas */
export interface Pais{
  id: number,
  name: string,
  iso3: string,
  phoneCode: string,
  currency: string,
  currencyName: string,
  currencySymbol: string,
  status: boolean,
  createBy: string,
  creationDate: string,
  updateBy: string,
  updateDate: string
}

export interface Departamento{
  id: number,
  name: string,
  stateCode: string,
  countryId: number,
  countryCode: string,
  countryName: string
}

export interface Ciudad{
  id: number,
  name: string,
  stateId: number,
  stateCode: string,
  stateName: string,
  countryId: number,
  countryName: string,
  createBy: string,
  creationDate: string,
  updateBy: string,
  updateDate: string
}

/* modulo inventario */
export interface Categoria{
  id?: number
  name: string
  state: boolean
  createBy: string
  creationDate: string
  updateBy?: string
  updateDate?: string
}

export interface Producto{
  id: number
  name: string
  description: string
  presentation: string
  quantity: number
  typeSell: string
  cost: number
  createBy: string
  creationDate: string
  updateBy: string
  updateDate: string
  idCategory: number
  nameCategory: string
}
