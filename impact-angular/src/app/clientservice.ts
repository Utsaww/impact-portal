import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { AppSetting } from './appsetting'

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private SERVERURL = AppSetting.API;
  constructor(private http : HttpClient) { }
  
 public getClients(user){
    return this.http.post<any>(this.SERVERURL+"clients",user);
  }
  public getPrintStatus(clientarray,client){
    // console.log("selected client is "+ client);
    
    if(clientarray.filter(x => x.clientid == client)[0]['enabledforprint']==1){
      return false;
    }else{
      return true;
    }

  }
  public getWebStatus(clientarray,client){
    // console.log("selected client is "+ client);
    
    if(clientarray.filter(x => x.clientid == client)[0]['enabledforweb']==1){
      return false;
    }else{
      return true;
    }

  }
  public getBrStatus(clientarray,client){
    // console.log("selected client is "+ client);
    //console.log(clientarray.filter(x => x.clientid == client)[0]);
    if(clientarray.filter(x => x.clientid == client)[0]['enableforbr']==1){
      return false;
    }else{
      return true;
    }

  }
  public getDashStatus(clientarray,client){
    // console.log("selected client is "+ client);
    //console.log(clientarray.filter(x => x.clientid == client)[0]);
    if(clientarray.filter(x => x.clientid == client)[0]['enablefordash']==1){
      return true;
    }else{
      return false;
    }

  }
 public getTwitterStatus(clientarray,client){
    if(clientarray.filter(x => x.clientid == client)[0]['enablefortwitter']==1){
      return false;
    }else{
      return true;
    }

  }

}
 