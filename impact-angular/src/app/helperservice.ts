import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { AppSetting } from './appsetting'
import {Md5} from "md5-typescript";

@Injectable({
  providedIn: 'root'
})
export class HelperService {

    monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
            ];
  public date1;          
  private SERVERURL = AppSetting.API;
  constructor(private http : HttpClient) { }
  
  getdate(date){
    this.date1 = new Date(date);
    return this.date1.getDate()+" "+this.monthNames[this.date1.getMonth()]+" "+this.date1.getFullYear();
  }

  getPrintUrl(articleid,clientid=false,email){
    return AppSetting.HOST+"index.php?page=Nclipj&id="+Md5.init(articleid)+"&id2="+Md5.init(clientid)+"&id3="+Md5.init(email);
  }

  getWebUrl(articleid,clientid,email){
    return "https://web.myimpact.in/index.php?page=QualifyFrameWeb&id="+articleid+"&id2="+Md5.init(clientid)+"&id3="+Md5.init(email);
  }
  convertString(articleid){

    return articleid.toString();
  }
  trim(str : String){
    return str.trim;
  }
  checkArticleArray(articleArray : Array<any>,article){
    if(articleArray.length>0){
        //console.log(articleArray);
        if(articleArray.indexOf(article)> -1){
          
        return true;
        }
        return false;
        }
        return false;
    }
    
    

  

}
