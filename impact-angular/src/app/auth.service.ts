import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { AppSetting } from './appsetting'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private SERVERURL = AppSetting.API;
  constructor(private http : HttpClient) { }
  
  login(user){
    console.log(user);
    return this.http.post<any>(this.SERVERURL+"users",user);
  }

}
 