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
  createBy?: string
  creationDate?: string
  updateBy?: string
  updateDate?: string
}

export interface Departamento{
  id: 0,
  name: string,
  countryId: 0,
  countryCode: string,
  countryName: string,
  status: boolean,
  createBy?: string
  creationDate?: string
  updateBy?: string
  updateDate?: string
}

export interface Ciudad{
  id?: number,
  name: string,
  stateId: string,
  stateCode: string,
  stateName: string,
  countryId?: string,
  countryName?: string,
  createBy?: string
  creationDate?: string
  updateBy?: string
  updateDate?: string
}

export interface Farmacia{
  id?: number,
  name: string,
  adress: string,
  isDeleted: boolean,
  cityId: number,
  cityName: string
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
  description: string
  presentation: string
  quantity: number | any
  typeSell: string
  cost: number | any
  idCategory: number
  nameCategory: string
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
