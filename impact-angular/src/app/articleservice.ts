import { HelperService } from "./helperservice";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AppSetting } from "./appsetting";
import { jsonpCallbackContext } from "@angular/common/http/src/module";
import { element } from "@angular/core/src/render3";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ArticleService {
  private SERVERURL = AppSetting.API;
  private AppSettings = AppSetting;
  private EXCELURL = AppSetting.EXCELSERVER;
  private ARTICLEDETAILURL = AppSetting.ARTICLESERVER;

  constructor(private http: HttpClient, private HelperService: HelperService) {}

  private getApiEndpoint(fullText: string): string {
    return fullText ? AppSetting.API2 : AppSetting.API;
  }

  getarticles(articlepara): Observable<any> {
    if (
      articlepara.fullTextKeyword &&
      articlepara.fullTextKeyword.trim().length > 0
    ) {
      this.SERVERURL = AppSetting.API2;
    } else {
      this.SERVERURL = AppSetting.API;
    }
    return this.http.post<any>(
      this.SERVERURL + this.AppSettings.getarticlesData,
      articlepara
    );
  }

  // getarticles(articlepara) {
  //   // console.log(articlepara);
  //   return this.http.post<any>(
  //     this.SERVERURL + this.AppSettings.getarticlesData,
  //     articlepara
  //   );
  // }
  getrejectedArticles(articlepara) {
    // console.log(articlepara);
    return this.http.post<any>(
      this.SERVERURL + this.AppSettings.getrejectedArticles,
      articlepara
    );
  }
  getsmartanalysearticles(articlepara) {
    // console.log(articlepara);
    return this.http.post<any>(
      this.SERVERURL + this.AppSettings.getsmartanalysearticlesData,
      articlepara
    );
  }
  printChartData(articlepara) {
    // console.log(articlepara);
    return this.http.post<any>(
      this.SERVERURL + this.AppSettings.printChartData,
      articlepara
    );
  }
  YearChartData(articlepara) {
    // console.log(articlepara);
    return this.http.post<any>(
      this.SERVERURL + this.AppSettings.YearChartData,
      articlepara
    );
  }
  YearChartDataWEB(articlepara) {
    // console.log(articlepara);
    return this.http.post<any>(this.AppSettings.YearChartDataWEB, articlepara);
  }
  AVEChartData(articlepara) {
    // console.log(articlepara);
    return this.http.post<any>(
      this.SERVERURL + this.AppSettings.AVEChartData,
      articlepara
    );
  }
  TopTenPubChartData(articlepara) {
    // console.log(articlepara);
    return this.http.post<any>(
      this.SERVERURL + this.AppSettings.TopTenPubChartData,
      articlepara
    );
  }
  RegionChartData(articlepara) {
    // console.log(articlepara);
    return this.http.post<any>(
      this.SERVERURL + this.AppSettings.RegionChartData,
      articlepara
    );
  }
  TopTenJournalistChartData(articlepara) {
    // console.log(articlepara);
    return this.http.post<any>(
      this.SERVERURL + this.AppSettings.TopTenJournalistChartData,
      articlepara
    );
  }
  webChartData(articlepara) {
    // console.log(articlepara);
    return this.http.post<any>(this.AppSettings.webChartData, articlepara);
    // return this.http.post<any>(this.SERVERURL +this.AppSettings.webChartData, articlepara);
  }
  sourceChartData(articlepara) {
    // console.log(articlepara);
    return this.http.post<any>(this.AppSettings.sourceChartData, articlepara);
  }
  tvChartData(articlepara) {
    // console.log(articlepara);
    return this.http.post<any>(
      this.SERVERURL + this.AppSettings.tvChartData,
      articlepara
    );
  }
  articlesCount(articlepara) {
    // console.log(articlepara);
    return this.http.post<any>(
      this.SERVERURL + this.AppSettings.articlesCount,
      articlepara
    );
  }
  publicationCount(articlepara) {
    // console.log(articlepara);
    return this.http.post<any>(
      this.SERVERURL + this.AppSettings.publicationCount,
      articlepara
    );
  }
  circulationCount(articlepara) {
    // console.log(articlepara);
    return this.http.post<any>(
      this.SERVERURL + this.AppSettings.circulationCount,
      articlepara
    );
  }
  circulationDistinctCount(articlepara) {
    // console.log(articlepara);
    return this.http.post<any>(
      this.SERVERURL + this.AppSettings.circulationDistinctCount,
      articlepara
    );
  }
  circulationDistinctChart(articlepara) {
    // console.log(articlepara);
    return this.http.post<any>(
      this.SERVERURL + this.AppSettings.circulationDistinctChart,
      articlepara
    );
  }
  circulationAllChart(articlepara) {
    // console.log(articlepara);
    return this.http.post<any>(
      this.SERVERURL + this.AppSettings.circulationAllChart,
      articlepara
    );
  }
  getUserDetails(articlepara) {
    // console.log(articlepara);
    return this.http.post<any>(this.AppSettings.getUserDetails, articlepara, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      }
    });
  }
  getcompanys(articlepara) {
    return this.http.post<any>(this.AppSettings.getcompanys, articlepara);
  }
  getcompanysAll(clientid) {
    return this.http.post<any>(this.AppSettings.getcompanysAll, clientid);
  }
  insertdata(data) {
    return this.http.post<any>(this.AppSettings.insertdata, data);
  }
  resetdata(data) {
    return this.http.post<any>(this.AppSettings.resetdata, data);
  }
  getUserClientDetails(articlepara) {
    // console.log(articlepara);
    return this.http.post<any>(
      this.AppSettings.getUserClientDetails,
      articlepara,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }
    );
  }
  getMyCompanyKeywords(articlepara) {
    // console.log(articlepara);
    return this.http.post<any>(
      this.AppSettings.getMyCompanyKeywords,
      articlepara,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }
    );
  }
  getMyCompetitorKeywords(articlepara) {
    // console.log(articlepara);
    return this.http.post<any>(
      this.AppSettings.getMyCompetitorKeywords,
      articlepara,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }
    );
  }
  getIndustryKeywords(articlepara) {
    // console.log(articlepara);
    return this.http.post<any>(
      this.AppSettings.getIndustryKeywords,
      articlepara,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }
    );
  }
  getOthersKeywords(articlepara) {
    // console.log(articlepara);
    return this.http.post<any>(
      this.AppSettings.getOthersKeywords,
      articlepara,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }
    );
  }
  /* getExcel(articlepara){
     return this.http.post<any>(this.SERVERURL+"excels",articlepara);
   }
   */
  getExcel(articlepara) {
    return this.http.post<any>(
      this.EXCELURL + "excel.php",
      { articleid: JSON.stringify(articlepara) },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      }
    );
  }

  getArticleDetails(articleids: Array<any>, articlepara) {
    //console.log(articleids);
    return this.http.post<any>(this.SERVERURL + "articledetails", {
      articleids: JSON.stringify(articleids),
      articlepara
    });
  }
  getarticlesdash(articlepara) {
    // console.log(articlepara);
    return this.http.post<any>(
      this.SERVERURL + this.AppSettings.getarticlesDataDash,
      articlepara
    );
  }

  getdashjournalist(articlepara) {
    return this.http.post<any>(
      this.SERVERURL + this.AppSettings.getDashJournalist,
      articlepara
    );
  }

  getdashpublication(articlepara) {
    return this.http.post<any>(
      this.SERVERURL + this.AppSettings.getDashPublication,
      articlepara
    );
  }

  getdashcompany(articlepara) {
    return this.http.post<any>(
      this.SERVERURL + this.AppSettings.getDashCompany,
      articlepara
    );
  }

  getdashheadline(articlepara) {
    return this.http.post<any>(
      this.SERVERURL + this.AppSettings.getDashTagCloud,
      articlepara
    );
  }

  getdashallarticles(articlepara) {
    return this.http.post<any>(
      this.SERVERURL + this.AppSettings.getAllArticles,
      articlepara
    );
  }

  getdashchartsdata(articlepara) {
    return this.http.post<any>(
      this.SERVERURL + this.AppSettings.getChartsdata,
      articlepara
    );
  }

  getdashchartspassingdata(articlepara) {
    return this.http.post<any>(
      this.SERVERURL + this.AppSettings.getChartsPassingdata,
      articlepara
    );
  }

  getclientcity(articlepara) {
    return this.http.post<any>(
      this.SERVERURL + this.AppSettings.getarticlesDataDashCity,
      articlepara
    ); //shk
  }

  sendmailarticles(articleids: Array<any>, articlepara) {
    return this.http.post<any>(this.SERVERURL + "mailarticle", {
      articleids: JSON.stringify(articleids),
      articlepara
    });
  }

  getQualifyArticle(articleids, articlepara) {
    //console.log(articleids);
    return this.http.post<any>(this.SERVERURL + "articledetails", {
      articleids: articleids,
      articlepara
    });
  }

  pasteQualification(articleid, checkedarticles: Array<any>, clientid) {
    // let index = data.indexOf('false');
    //data.splice(index, 1);
    return this.http.post<any>(this.SERVERURL + "articleupdates", {
      articleid: articleid,
      checkedarticles: checkedarticles,
      clientid: clientid
    });
  }

  showcase(articleid, articlepara) {
    return this.http.post<any>(this.SERVERURL + this.AppSettings.showcase, {
      articleid: articleid,
      articlepara: articlepara
    });
  }
  getsummary(articleid) {
    return this.http.post<any>(this.SERVERURL + this.AppSettings.getsummary, {
      articleid: articleid
    });
  }
  getclientkeyword(articleid, clientid) {
    return this.http.post<any>(
      this.SERVERURL + this.AppSettings.getclientkeyword,
      { articleid: articleid, clientid: clientid }
    );
  }

  getPublicationList(filterArtType) {
    return this.http.post<any>(
      this.SERVERURL + this.AppSettings.getPublicationList,
      { filterArtType: filterArtType }
    );
  }

  getEditionList(pubname) {
    return this.http.post<any>(
      this.SERVERURL + this.AppSettings.getEditionList,
      { pubname: pubname }
    );
  }
  getLanguageList(pubname) {
    return this.http.post<any>(
      this.SERVERURL + this.AppSettings.getLanguageList,
      { pubname: pubname }
    );
  }
  getClientKeywordList(clientid, companytype, filterArtType, company_keyword) {
    return this.http.post<any>(
      this.SERVERURL + this.AppSettings.getClientKeywordList,
      {
        clientid: clientid,
        companttype: companytype,
        filterArtType: filterArtType,
        company_keyword: company_keyword
      }
    );
  }
  rejectArticles(articlepara, checkedarticles: Array<any>) {
    //console.log("Articles Rejected");
    return this.http.post<any>(
      this.SERVERURL + this.AppSettings.RejectArticles,
      { articleids: checkedarticles, articlepara: articlepara }
    );
  }
  getarticlesbyid(articlepara, checkedarticles: Array<any>) {
    console.log("rejectArtcile");
    return this.http.post<any>(
      this.SERVERURL + this.AppSettings.getarticlesDataById,
      { articleids: checkedarticles, articlepara: articlepara }
    );
  }
  sendMail(Data) {
    return this.http.post<any>(this.AppSettings.sendMail, { Data: Data });
  }
  getCompanyProminent(article) {
    let check = "not";

    let arr = [];

    // if(articleid=='48af8151-4074-11e9-9332-'){
    //console.log("here");

    for (let x in article) {
      arr.push(article[x]);
    }

    const filterdata = Array.from(arr).filter(function(value) {
      return value.keytpe === "My Company Keyword";
    });

    Object.values(filterdata).map(function(value) {
      // console.log(value1['keytpe']);
      //console.log(value['keytpe']);

      if (value["keytpe"].trim() == "My Company Keyword") {
        check = "passing";

        if (value["Prominence"] == "" || value["Prominence"] == null) {
          check = "not";
        } else if (
          value["Prominence"].replace(/^\s+|\s+$/g, "") == "passing" ||
          value["Prominence"] == "null"
        ) {
          check = "passing";
        } else {
          check = "Prominent";
          return check;
        }
      } else {
        check = "not";
      }
    });

    return check;
  }
  getCompetitionProminent(article, articleid) {
    // console.log(article);

    let arr = [];

    // if(articleid=='48af8151-4074-11e9-9332-'){
    //console.log("here");

    for (let x in article) {
      arr.push(article[x]);
    }

    //console.log(arr);
    // }

    let check = "not";

    let refineddata = [];

    const filterdata = Array.from(arr).filter(function(value) {
      return value.keytpe === "My Competitor Keyword";
    });

    // console.log(filterdata);

    Object.values(filterdata).map(function(value) {
      // console.log(value1['keytpe']);
      //console.log(value['keytpe']);

      if (value["keytpe"].trim() == "My Competitor Keyword") {
        check = "passing";

        if (value["Prominence"] == "" || value["Prominence"] === null) {
          check = "not";
        } else if (
          value["Prominence"].replace(/^\s+|\s+$/g, "") == "passing" ||
          value["Prominence"] == "null"
        ) {
          check = "passing";
        } else {
          check = "Prominent";
          return check;
        }
      } else {
        check = "not";
      }
    });

    return check;

    /*const companyprominence = arr.filter(s=>s.keytpe == "My Competitor Keyword");
    if(companyprominence.length>0){
      if(companyprominence['Prominence'] == "prominent" &&  companyprominence['Prominence']!=""){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }*/
  }
  getIndustryProminent(article) {
    let check = "not";

    let arr = [];

    // if(articleid=='48af8151-4074-11e9-9332-'){
    //console.log("here");

    for (let x in article) {
      arr.push(article[x]);
    }

    const filterdata = Array.from(arr).filter(function(value) {
      return value.keytpe === "My Industry Keyword";
    });

    Object.values(filterdata).map(function(value) {
      // console.log(value1['keytpe']);
      //console.log(value['keytpe']);

      if (value["keytpe"].trim() == "My Industry Keyword") {
        check = "passing";
        if (value["Prominence"] == "" || value["Prominence"] === null) {
          check = "not";
          return check;
        } else if (
          value["Prominence"].replace(/^\s+|\s+$/g, "") == "passing" ||
          value["Prominence"] == "null"
        ) {
          check = "passing";
          return check;
        } else {
          check = "Prominent";
          return check;
        }
      } else {
        check = "not";
      }
    });

    return check;
  }
  getSentiment(article: Array<String>) {
    //console.log(article);
    const arr = Array.from(article);

    let check = "negative";

    arr.forEach((value, index) => {
      //  if(value['keytpe'].trim()=='My Company Keyword'){
      if (value["negativescore"] == "0") {
        check = "negative";
      } else {
        check = "positive";
        return check;
      }

      //}
    });

    return check;

    /*const negscore = arr.filter(s => s['negativescore'] == "0" );



    if(negscore.length>0){
      return false;
    }else{
      return true;
    }*/
  }
}
