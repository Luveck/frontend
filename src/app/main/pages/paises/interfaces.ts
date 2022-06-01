export interface Pais{
  "id": number,
  "iso"?: string,
  "name": string,
  "iso3": string,
  "phoneCode": string,
  "currency": string,
  "currencyName": string,
  "currencySymbol": string,
  "status": boolean,
  "createBy": string,
  "creationDate": string,
  "updateBy": string,
  "updateDate": string
}

export interface Departamento extends Pais{
  "id": number,
  "name": string,
  "statusCode": string,
  "countryId": number,
  "country": Pais
}

export interface Ciudad extends Departamento{
  "id": number,
  "name": string,
  "stateCode": string,
  "createBy": string,
  "creationDate": string,
  "updateBy": string,
  "updateDate": string,
  "departmentId": number,
  "department": Departamento
}
