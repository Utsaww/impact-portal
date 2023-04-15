import { Component, OnInit, ElementRef, Injectable, ViewEncapsulation } from '@angular/core';

import { ExcelService } from '../sharedServices';
import { AppSetting } from '../appsetting';
import { HelperService } from '../helperservice';
import { ClientService } from '../clientservice';
import { HttpClient } from '@angular/common/http';
import { ArticleService } from '../articleservice';
import { Md5 } from "md5-typescript";
import { formatDate } from '@angular/common';
import * as FileSaver from 'file-saver';
import { CloudData, CloudOptions } from 'angular-tag-cloud-module';
import { Chart } from 'angular-highcharts';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FilterPipe } from 'ngx-filter-pipe';
import { Title } from '@angular/platform-browser';

declare var $: any;

@Component({
  selector: 'app-newsdash',
  templateUrl: './newsdash.component.html',
  //template: '<div><angular-tag-cloud [data]="data" [width]="options.width" [height]="options.height" [overflow]="options.overflow"> </angular-tag-cloud></div>',
  styleUrls: ['./newsdash.component.css'],
  //encapsulation: ViewEncapsulation.Emulated 
})
export class NewsdashComponent implements OnInit {
  public chart;
  public p;
  public passinggroupdata;
  public headlineggroupdata;
  public prominentggroupdata;
  public clientedition = [];
  date = new Date();
  // fromdate = formatDate(this.date,"yyy-MM-dd", 'en', '');
  // todate  = formatDate(this.date,"yyy-MM-dd", 'en', '');

  fromdate = "";
  todate = "";
  //fromdate = formatDate(this.date,"2019-01-07", 'en', '');
  //todate  = formatDate(this.date,"2019-01-01", 'en', '');
  //public fromdate;
  //public todate;
  result = [];
  totalcount = 0;
  publicationarray = [];
  headlinearray = [];
  jourdataarray = [];
  companydataarray = [];
  public clientlist = [];
  enableforprint = false;
  enableforweb = false;
  enableforbr = false;
  public selectedclient;
  isActiveToday = true;
  isActive7Days = false;
  isActivedaterange = false;
  notEmptyPost = true;
  notscrolly = true;




  public articlepara = { clientid: localStorage.getItem('storageselectedclient'), page: 1, type: 'All', keytype: '', sortdate: 'asc', sortpub: '', sortnews: '', fromdate: localStorage.getItem('fromdate'), todate: localStorage.getItem('todate'), prominance: '', company: '', author: '',word:'',pubsort:'',articlelimit: 100,articleskip: 0 }
  user = {
    email: localStorage.getItem('email')
  }

  constructor(public article: ArticleService, http: HttpClient, elementRef: ElementRef, public _client: ClientService, private spinnerService: Ng4LoadingSpinnerService, private helper: HelperService, excelService: ExcelService, private filterPipe: FilterPipe,private title: Title) {
  }

  ngOnInit() {
     //set page title
     this.title.setTitle('Smart Dashboard');

    //check if user is login.
    if(this.user.email==null){
      localStorage.clear();
      window.location.replace(location.origin);
    }

    //check if enable for dash
    if(localStorage.getItem("storageEnableForDash")=="No"){
      alert("You are not subscribed to the SmartDash service. For subscription, please contact Impact Helpdesk at helpdesk@impactmeasurement.co.in");
      window.location.replace(location.origin+"/home");
      return false;
    }

    $("#reset").hide();

    var self = this;

    $(".bs-tooltip-right .arrow").css("display", "none");
    $(".tooltip-inner").css("display", "none");
    $('[data-toggle="tooltip"]').tooltip();

    if ((localStorage.hasOwnProperty("fromdate")) || (localStorage.hasOwnProperty("todate"))) {
      var fromdate = localStorage.getItem("fromdate");
      var todate = localStorage.getItem("todate");
      var currentdate = formatDate(this.date, "yyyy-MM-dd", 'en', '');
      var yesterday = formatDate(this.date.setDate(this.date.getDate() - 1), "yyyy-MM-dd", 'en', '');
      var last7days = formatDate(this.date.setDate(this.date.getDate() - 6), "yyyy-MM-dd", 'en', '');
      if ((fromdate == todate) && (todate == currentdate)) {
        this.isActiveToday = true;
        this.isActivedaterange = false;
        this.isActive7Days = false;
        $("#rangeCal").css("display", "none");
        $(".dvresponsivedaterange").css("display", "none");
        $("#selectedType").html("Today");
      }
      else if ((fromdate == todate) && (todate == yesterday)) {
        this.isActiveToday = false;
        this.isActivedaterange = true;
        this.isActive7Days = false;
        $("#rangeCal").css("display", "");
        $(".dvresponsivedaterange").css("display", "none");
        $("#selectedType").html("Yesterday");
      }
      else if ((todate == last7days) && (fromdate == currentdate)) {
        this.isActive7Days = true;
        this.isActiveToday = false;
        this.isActivedaterange = false;
        $("#rangeCal").css("display", "none");
        $(".dvresponsivedaterange").css("display", "none");
        $("#selectedType").html("Last 7 Days");
      }
      else {
        this.isActiveToday = false;
        this.isActivedaterange = true;
        this.isActive7Days = false;
        $("#rangeCal").css("display", "");
        $(".dvresponsivedaterange").css("display", "");
        $("#selectedType").html("Custom");
      }
      // this.getArticlebyDate
      // self.getallarticles();
    }
    else {
      this.articlepara.fromdate = formatDate(this.date, "yyyy-MM-dd", 'en', '');
      this.articlepara.todate = formatDate(this.date, "yyyy-MM-dd", 'en', '');
      localStorage.setItem("fromdate", formatDate(this.date, "yyyy-MM-dd", 'en', ''));
      localStorage.setItem("todate", formatDate(this.date, "yyyy-MM-dd", 'en', ''));
      this.isActiveToday = true;
      this.isActivedaterange = false;
      this.isActive7Days = false;
    }
    // $(document).ready(function(){

    $(".selectperiod a").click(function(){
      var selectedval = $(this).html();
      $("#selectedType").html(selectedval);
      if (selectedval == "Custom") {
        $(".dvresponsivedaterange").css("display", "");
      }
      else {
        $(".dvresponsivedaterange").css("display", "none");
      }
    });
    $("#dateclick").click(function () {
      $('#rangeCal').toggle();
    })
    updateConfig();
    function updateConfig() {
      var date = new Date();
      var options: { dateLimit: String } = { dateLimit: "" };
      // var fromdate = formatDate(self.date, "dd-MM-yyyy", 'en', '');
      // var todate = formatDate(self.date, "dd-MM-yyyy", 'en', '');
      // if (self.isActivedaterange) {
      //   fromdate = formatDate(new Date(localStorage.getItem("fromdate")), "dd-MM-yyyy", 'en', '');
      //   todate = formatDate(new Date(localStorage.getItem("todate")), "dd-MM-yyyy", 'en', '');
      // }
      
      var fromdate = formatDate(new Date(localStorage.getItem("fromdate")), "dd-MM-yyyy", 'en', '');
      var todate = formatDate(new Date(localStorage.getItem("todate")), "dd-MM-yyyy", 'en', '');
      
      $('.config-demo').daterangepicker({
        // maxDate: date,
        startDate: todate,
        endDate: fromdate,
        "dateLimit": { days: 95 }
      }, function (start, end, label) {
        var startDateRange = end.format('YYYY-MM-DD');
        var endDateRange = start.format('YYYY-MM-DD');
        self.articlepara.todate = endDateRange;
        self.articlepara.fromdate = startDateRange;
        localStorage.setItem("fromdate", startDateRange);
        localStorage.setItem("todate", endDateRange);
        self.getArticlebyDate('custom');
      });
    }
    //  });

    this.articlepara.type = '';
    this.articlepara.keytype = '';
    this.articlepara.prominance = '';
    this.articlepara.company = '';
    this.articlepara.author = '';
    this.articlepara.word = '';
    this.articlepara.pubsort = '';

    this.Clients();  //uncomment for client list
    this.selectedclient = localStorage.getItem('storageselectedclient');
    //console.log(localStorage.getItem('storageselectedclient'));
    



    this.getAllInfo();

    this.article.getclientcity(this.articlepara)
      .subscribe(
        res => {
          this.clientedition = res;
        },
        err => {
          console.log(err);
        }
      )


  }

  getAllInfo(){
   
    this.getJounalistCloud();

    this.getPublicationCloud();

    this.getCompanyCloud();

    this.getHeadlineCloud();

    this.getArticles();

    this.getPassingData();

    this.getCharts();
    
  }



  getPassingData() {
    this.article.getdashchartspassingdata(this.articlepara)
    .subscribe(
      res => {
        var compassing = 0;
        var competitorpassing = 0;
        var industrypassing = 0;
    
        var i;
        for (i = 0; i < res.length; i++) {
         
            if ((res[i].keytpe === 'My Company Keyword') && (res[i].Prominence === 'passing' || res[i].Prominence === 'null')) {
              compassing = compassing + res[i].totalcount;
            } else if ((res[i].keytpe === 'My Competitor Keyword') && (res[i].Prominence === 'passing' || res[i].Prominence === 'null')) {
              competitorpassing = competitorpassing + res[i].totalcount;
            } else if ((res[i].keytpe === 'My Industry Keyword') && (res[i].Prominence === 'passing' || res[i].Prominence === 'null')) {
              industrypassing = industrypassing + res[i].totalcount;
            }
        }
        this.passinggroupdata = compassing + ',' + competitorpassing + ',' + industrypassing;
      },
      err => {
        console.log(err);
      }
    )
  }


  getCharts(){
    this.spinnerService.show();
    setTimeout(()=>{
    this.article.getdashchartsdata(this.articlepara)
      .subscribe(
        res => {
          //this.passinggroupdata = this.passingdata(res);
          this.headlineggroupdata = this.headlinedata(res);
          this.prominentggroupdata = this.prominentdata(res);
          this.barchart();
          this.spinnerService.hide();
        },
        err => {
          console.log(err);
        }
      )},3000)
  }

  getHeadlineCloud(){
    //this.spinnerService.show();
  this.article.getdashheadline(this.articlepara)
  .subscribe(
    res => {
      this.headlinearray = res;
      //this.spinnerService.hide();
    },
    err => {
      console.log(err);
    }
  )
}

getCompanyCloud(){
  this.article.getdashcompany(this.articlepara)
  .subscribe(
    res => {
      this.companydataarray = res;
    },
    err => {
      console.log(err);
    }
  )
}

getPublicationCloud(){
  this.article.getdashpublication(this.articlepara)
  .subscribe(
    res => {
      var sum=0;
      for(let a of res){
          sum=sum+a.totalcount;
      }
      this.totalcount = sum;
      this.publicationarray = res;
    },
    err => {
      console.log(err);
    }
  )
}

getJounalistCloud(){
  this.article.getdashjournalist(this.articlepara)
  .subscribe(
    res => {
      this.jourdataarray = res;
    },
    err => {
      console.log(err);
    }
  )
}

getArticles(){
  this.article.getdashallarticles(this.articlepara)
  .subscribe(
    res => {
      //alert(res.length);
      this.result = res
      
      this.articlepara.articleskip = res.length;
    },
    err => {
      console.log(err);
    }
  )
}
onScrollDown(){
    if (this.notscrolly && this.notEmptyPost) {
    this.getArticlesNext();
    this.notscrolly = false;
    }
  }

getArticlesNext(){
    
  this.article.getdashallarticles(this.articlepara)
    .subscribe(
      res => {

        if (res.length === 0 ) {
          this.notEmptyPost =  false;
        }

        this.articlepara.articleskip = this.articlepara.articleskip + res.length;
        this.result = this.result.concat(res);
        this.notscrolly = true;
      },
      err => {
        console.log(err);
      }
    )
}



 passingdata(articlekeyword) {
    var compassing = 0;
    var competitorpassing = 0;
    var industrypassing = 0;

    var i;
    for (i = 0; i < articlekeyword.length; i++) {
        if ((articlekeyword[i].keytpe === 'My Company Keyword') && (articlekeyword[i].Prominence === 'passing' || articlekeyword[i].Prominence === 'null')) {
          compassing = compassing + articlekeyword[i].totalcount;
        } else if ((articlekeyword[i].keytpe === 'My Competitor Keyword') && (articlekeyword[i].Prominence === 'passing' || articlekeyword[i].Prominence === 'null')) {
          competitorpassing = competitorpassing + articlekeyword[i].totalcount;
        } else if ((articlekeyword[i].keytpe === 'My Industry Keyword') && (articlekeyword[i].Prominence === 'passing' || articlekeyword[i].Prominence === 'null')) {
          industrypassing = industrypassing + articlekeyword[i].totalcount;
        }

      

    }
    return compassing + ',' + competitorpassing + ',' + industrypassing;
  }


  //Prominent data for chart
  prominentdata(articlekeyword) {

    var comprominent = 0;
    var competitorprominent = 0;
    var industryprominent = 0;
    var i;
    for (i = 0; i < articlekeyword.length; i++) {
        if ((articlekeyword[i].keytpe == 'My Company Keyword') && (articlekeyword[i].Prominence == 'prominent')) {
          comprominent = articlekeyword[i].totalcount;;
        } else if ((articlekeyword[i].keytpe == 'My Competitor Keyword') && (articlekeyword[i].Prominence == 'prominent')) {
          competitorprominent = articlekeyword[i].totalcount;;
        } else if ((articlekeyword[i].keytpe == 'My Industry Keyword') && (articlekeyword[i].Prominence == 'prominent')) {
          industryprominent = articlekeyword[i].totalcount;;
        }
    }
    return comprominent + ',' + competitorprominent + ',' + industryprominent;
  }


  openMenu($event) {
    // alert("here");
    if ($("#opencloseMenu").hasClass("exp")) {
      $("#opencloseMenu").removeClass("exp");
    }
    else {
      $("#opencloseMenu").addClass("exp");
    }
  }
  //Headline data for chart

  headlinedata(articlekeyword) {
    var comheadline = 0;
    var competitorheadline = 0;
    var industryheadline = 0;

    var i;
    for (i = 0; i < articlekeyword.length; i++) {
        if ((articlekeyword[i].keytpe == 'My Company Keyword') && (articlekeyword[i].Prominence == 'headline mention')) {
          comheadline = articlekeyword[i].totalcount;
        } else if ((articlekeyword[i].keytpe == 'My Competitor Keyword') && (articlekeyword[i].Prominence == 'headline mention')) {
          competitorheadline = articlekeyword[i].totalcount;
        } else if ((articlekeyword[i].keytpe == 'My Industry Keyword') && (articlekeyword[i].Prominence == 'headline mention')) {
          industryheadline = articlekeyword[i].totalcount;
        }


    }
    return comheadline + ',' + competitorheadline + ',' + industryheadline;
  }







  journalistcloud(jourarray) {
    var arr = [];
    var jourarr = [];

    jourarray.forEach(element => {
      var alljour = element.journalist;
      alljour.forEach(element => {
        arr.push(element.journalist);
      });
    });
    jourarr = this.arrayCountValues(arr);
    return jourarr;
    //console.log(jourarr);

  }

  headlinecloud(articleheadlinearray) {
    //let list: string[] = [];
    var string1 = '';
    var str = '';

    articleheadlinearray.forEach(element => {
      //list.push(element.headline);
      str = element.headline;
      string1 += str.replace(/[^a-zA-Z ]/g, "") + ' '

    });
    var strArr = string1.split(' ');
    var headlinearray = this.arrayCountValues(strArr);
    console.log(headlinearray);
    return headlinearray;
  }

  publicationcloud(dataarray) {
    var arr = [];
    var publicationarray = [];

    dataarray.forEach(element => {
      arr.push(element.publication);
    });
    //publicationarray.sort();
    publicationarray = this.arrayCountValues(arr);
    //publicationarray.sort();
    //console.log(publicationarray);
    return publicationarray;

  }
  // Sort the word cloud, this function is used with keyvalue in html file
  mySortingFunction = (a, b) => {
    return a.value > b.value ? -1 : 1;
  }

  arrayCountValues(arr) {


    var a = [], b = [], prev;

    arr.sort();
    for (var i = 0; i < arr.length; i++) {
      if (this.isInArray(arr[i]) == false) {
        if (isNaN(arr[i]) == true) {
          if (arr[i] !== prev) {
            a.push(arr[i]);
            b.push(1);
          } else {
            b[b.length - 1]++;
          }

          prev = arr[i];
        }
      }
    }

    //return [a, b];

    var r = [];

    for (i = 0; i < a.length; i++) {
      r[a[i]] = b[i];
    }
    return r;
  }

  isInArray(value) {
    var stopwords = ["A", "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "by", "yours", "yourself", "yourselves", ":", ",", "!", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "Q", "A", "Rs", "RS", "rs", "The", "will", "shall", "may"];

    return stopwords.indexOf(value) > -1;

  }
  barchart() {
    //console.log(passinggroupdata);
    //bar charts section
    this.chart = new Chart({
      // colors: ['#f8e367','#e18197','#93ccce'],
      chart: {
        //height: 200,
        //  width: 360,
        type: 'bar',
        plotBorderWidth: 1,
        margin: [30, 30, 60, 75]
      },
      title: {
        text: ''
      },
     credits: {
        enabled: false
    },
      xAxis: {
        categories: ['Company', 'Competitor', 'Industry']
      },
      yAxis: {
        min: 0,
        title: {
          text: ''
        }
      },
      legend: {
        reversed: true
      },
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          }
        }]
      },
      plotOptions: {
        series: {
          stacking: 'pointer',
          point: {
            events: {
              click: function (e) {
                const p = e.point
                this.getChartsData(p.category, p.series.name);
                //alert(p.category);
                //alert(p.series.name);
              }.bind(this)
            }
          }
        }
      },
      series: [{
        name: 'Headline',
        color: '#e18197',
        data: JSON.parse("[" + this.headlineggroupdata + "]")
      }, {
        name: 'Prominent',
        color: '#f8e367',
        data: JSON.parse("[" + this.prominentggroupdata + "]")
      }, {
        name: 'Passing',
        color: '#93ccce',
        data: JSON.parse("[" + this.passinggroupdata + "]")
      }]
    });



    //bar charts end

  }


  //company cloud section
  companycloud(articlekeyword) {

    var keywordarray = [];
    var companykeyword = [];
    var companydataarray = [];

    var i;
    for (i = 0; i < articlekeyword.length; i++) {
      keywordarray = articlekeyword[i].keyword;
      var j;
      for (j = 0; j < keywordarray.length; j++) {

        if (articlekeyword[i].type === 'WEB') {
          if (keywordarray[j].companyissue != 'null' && keywordarray[j].companyissue != null && keywordarray[j].companyissue != '') {
            companykeyword.push(keywordarray[j].companyissue + '_' + keywordarray[j].keytpe);
          }
        } else {
          if (keywordarray[j].companys != 'null' && keywordarray[j].companys != null && keywordarray[j].companys != '') {
            companykeyword.push(keywordarray[j].companys + '_' + keywordarray[j].keytpe);
          }
        }

      }

    }
    companydataarray = this.arrayCountValues(companykeyword);
    return companydataarray;
  }
  //company cloud section end

  Clients() {
    //console.log(this.user);
    this.spinnerService.show();
    this._client.getClients(this.user)
      .subscribe(
        res => {
          // console.log(res);
          this.clientlist = res;
        },
        err => {
          console.log(err);
        },
        () => {
          // this.getallarticles();

          this.enableforprint = this._client.getPrintStatus(this.clientlist, this.articlepara.clientid);
          this.enableforweb = this._client.getWebStatus(this.clientlist, this.articlepara.clientid);
          this.enableforbr = this._client.getBrStatus(this.clientlist, this.articlepara.clientid);
        }
      )
  }
  //=======================change selectd client form dropdownlist=============================//
  changeclient(value) {
    if(this._client.getDashStatus(this.clientlist, value)==false){
         alert("You are not subscribed to the SmartDash service. For subscription, please contact Impact Helpdesk at helpdesk@impactmeasurement.co.in");
         localStorage.setItem('storageselectedclient', value);
         this.getArticlebyDate('today');
         window.location.replace(location.origin+"/home");
         return false;
    }else{
    localStorage.setItem('storageselectedclient', value);
    //window.location.reload();
    this.getArticlebyDate('today');
  }
  }

  getArticlebyDate(para) {
    this.articlepara.articleskip=0;
    $("#reset").hide();
    this.date = new Date();
    if (para == "7days") {
      $('#rangeCal').hide();
      this.fromdate = formatDate(this.date, 'yyy-MM-dd', 'en', '');
      this.todate = formatDate(this.date.setDate(this.date.getDate() - 6), 'yyy-MM-dd', 'en', '');
      this.isActiveToday = false;
      this.isActive7Days = true;
      this.isActivedaterange = false;
      localStorage.setItem("fromdate", this.fromdate);
      localStorage.setItem("todate", this.todate);
    } else if (para == "custom") {
      //$('#rangeCal').hide();
      this.fromdate = this.articlepara.fromdate;
      this.todate = this.articlepara.todate;
      localStorage.setItem("fromdate", this.fromdate);
      localStorage.setItem("todate", this.todate);
      //this.todate 
      this.isActiveToday = false;
      this.isActive7Days = false;
      this.isActivedaterange = true;
    } else {
      $('#rangeCal').hide();
      this.fromdate = formatDate(this.date, 'yyy-MM-dd', 'en', '');
      this.todate = formatDate(this.date, 'yyy-MM-dd', 'en', '');
      localStorage.setItem("fromdate", this.fromdate);
      localStorage.setItem("todate", this.todate);
      this.isActiveToday = true;
      this.isActive7Days = false;
      this.isActivedaterange = false;

    }
    //this.articlepara.type = '';
    this.articlepara.keytype = '';
    this.articlepara.prominance = '';
    this.articlepara.company = '';
    this.articlepara.author = '';
    this.articlepara.word = '';
    this.articlepara.pubsort = '';
    this.articlepara.fromdate = this.fromdate;
    this.articlepara.todate = this.todate;
    this.articlepara.clientid = localStorage.getItem('storageselectedclient');

    this.getAllInfo();




  }
  getArticlebyDaterange(para) {
    if (para == "daterange") {
      this.isActiveToday = false;
      this.isActive7Days = false;
      this.isActivedaterange = true;
    }
  }


  getArticleByWord(word) {
    this.articlepara.articleskip = 0;
    //this.articlepara.type = '';
    this.articlepara.keytype = '';
    this.articlepara.prominance = '';
    this.articlepara.company = '';
    this.articlepara.author = '';
    this.articlepara.word = word;
    this.articlepara.pubsort = '';
    this.spinnerService.show();
    $("#searchkey").html(word);
    this.getAllInfo();
    $("#reset").show();
  }


  getArticleByPublication(pub) {
    this.articlepara.articleskip = 0;
    //this.articlepara.type = '';
    this.articlepara.keytype = '';
    this.articlepara.prominance = '';
    this.articlepara.company = '';
    this.articlepara.author = '';
    this.articlepara.word = '';
    this.articlepara.pubsort = pub;
    $("#searchkey").html(pub);
    this.getAllInfo();
    $("#reset").show();
  }


  getArticleByCompany(companykeyword) {
    this.articlepara.articleskip = 0
   // this.articlepara.type = '';
    this.articlepara.keytype = '';
    this.articlepara.prominance = '';
    this.articlepara.company = companykeyword;
    this.articlepara.author = '';
    this.articlepara.word = '';
    this.articlepara.pubsort = '';
    $("#searchkey").html(companykeyword);
    this.getAllInfo();
    $("#reset").show();
  }


  getArticleByAuthor(authorname) {
    this.articlepara.articleskip = 0;
    //this.articlepara.type = '';
    this.articlepara.keytype = '';
    this.articlepara.prominance = '';
    this.articlepara.company = '';
    this.articlepara.author = authorname;
    this.articlepara.word = '';
    this.articlepara.pubsort = '';
    this.spinnerService.show();
    $("#searchkey").html(authorname);
    this.getAllInfo();
    $("#reset").show();
  }


  getChartsData(Catname, Prominance) {
    this.articlepara.articleskip = 0;
    if (Catname == 'Company') {
      var com = 'My Company Keyword';
    } else if (Catname == 'Competitor') {
      var com = 'My Competitor Keyword';
    } else {
      var com = 'My Industry Keyword';
    }


    if (Prominance == 'Prominent') {
      var pro = 'prominent';
    } else if (Prominance == 'Passing') {
      var pro = 'passing';
    } else {
      var pro = 'headline mention';
    }


    //this.articlepara.type = '';
    this.articlepara.keytype = com;
    this.articlepara.prominance = pro;
    this.articlepara.company = '';
    this.articlepara.author = '';
    this.articlepara.word = '';
    this.articlepara.pubsort = '';
    $("#searchkey").html(com+', '+pro);
    this.getAllInfo();
    $("#reset").show();
  }

  getArticlebyType(articletype) {

    this.articlepara.articleskip = 0;
    if (articletype != '') {
      this.articlepara.type = articletype;
     $("#dropdownNewsItem").html(articletype);
    } else {
      this.articlepara.type = '';
      $("#dropdownNewsItem").html('All News');
    }
    this.articlepara.keytype = '';
    this.articlepara.prominance = '';
    this.articlepara.company = '';
    this.articlepara.author = '';
    this.articlepara.word = '';
    this.articlepara.pubsort = '';
    
    this.getAllInfo();
   // $("#reset").show();
  }


  reloadContent() {
    $("#searchkey").html();
    this.articlepara.articleskip = 0;
   // this.articlepara.type = '';
    this.articlepara.keytype = '';
    this.articlepara.prominance = '';
    this.articlepara.company = '';
    this.articlepara.author = '';
    this.articlepara.word = '';
    this.articlepara.pubsort = '';
    this.getAllInfo();
    $("#reset").hide();
  }

  advanceSearchModal() {
    localStorage.setItem('advanceSearchStorage', 'Yes');
    window.location.replace('/home');
  }

  matchString(string) { 
    var result = string.match(/news|stories|stake|Family|Loan|salary|Market|Share|Industry|Product|Disease|Generic/gi); 
    if(result){
      return true;
    }
    return false; 
}

}

