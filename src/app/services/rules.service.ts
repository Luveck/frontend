import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rule } from '../interfaces/models';
import { AuthService } from './auth.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class RulesService {
  reglas!: Rule[]
  headers:any

  constructor(
    private _http:HttpClient,
    private _dataServ:DataService,
    private _authServ:AuthService
  ) {
    this.headers = {'Authorization':`Bearer ${this._authServ.userToken}`}
  }

  notify(msg:string, icon:any){
    this._dataServ.fir(msg, icon)
  }

  getRules(){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    return this._http.get<any>(`${this._dataServ.baseURL}/RuleChange/GetRules`,
      {headers: this.headers}
    )
  }

  getRuleById(id:string){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    return this._http.get<any>(`${this._dataServ.baseURL}/RuleChange/GetRuleById?Id=${id}`,
      {headers: this.headers}
    )
  }

  addRule(formData:any){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    let dataRule:Rule = {
      ...formData
    }
    console.log(dataRule)
    return this._http.post(`${this._dataServ.baseURL}/RuleChange/CreateRule`, dataRule, {
      headers: this.headers
    })
  }

  updateRule(formData:any, ruleId:number|undefined, state:boolean){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    let dataRule:Rule = {
      "id": ruleId,
      ...formData,
      "state": state
    }
    console.log(dataRule)
    return this._http.post(`${this._dataServ.baseURL}/RuleChange/UpdateRule`, dataRule, {
      headers: this.headers
    })
  }

  getProdConRules(){
    return this._http.get<any>(`${this._dataServ.baseURL}/RuleChange/GetProductsLanding`,
      {headers: this.headers}
    )
  }
}
