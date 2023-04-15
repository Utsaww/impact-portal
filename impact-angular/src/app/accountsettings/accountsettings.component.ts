import { Component, OnInit, ElementRef, Pipe, Injectable, ViewEncapsulation, EventEmitter, ViewChild } from '@angular/core';

import { ExcelService } from '../sharedServices';
import { AppSetting } from '../appsetting';
import { HelperService } from '../helperservice';
import { ClientService } from '../clientservice';
import { HttpClient } from '@angular/common/http';
import { Md5 } from "md5-typescript";
import { formatDate, DecimalPipe } from '@angular/common';
import { ArticleService } from '../articleservice';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FilterPipe } from 'ngx-filter-pipe';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
//import { ChartsModule } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { contactdetailsComponent } from '../contactdetails/contactdetails.component';

declare var $: any;

@Pipe({
  name: 'million'
})

@Component({
  selector: 'app-accountsettings',
  templateUrl: './accountsettings.component.html',
  styleUrls: ['./accountsettings.component.css']
})
@Injectable({
  providedIn: 'root'
})
// export class EventEmitterService {    

//   invokeFirstComponentFunction = new EventEmitter();    
//   subsVar: Subscription;    

//   constructor() { }    

//   onFirstComponentButtonClick() {    
//     this.invokeFirstComponentFunction.emit();    
//   }    
// } 


export class accountsettingsComponent implements OnInit {
  loading = false;

  public clientlist = [];
  public userdetails = [];
  public userClientdetails = [];

  enableforprint = false;
  enableforweb = false;
  enableforbr = false;
  public selectedclient;
  isActiveToday = true;
  isActiveYesterday = false;
  isActive7Days = false;
  isActivedaterange = false;
  date = new Date();
  fromdate = formatDate(this.date, "yyy-MM-dd", 'en', '');
  todate = formatDate(this.date, "yyy-MM-dd", 'en', '');

  public enablefordash = false;
  public dashdisabledClass = '';
  public articlepara = { clientid: localStorage.getItem('storageselectedclient'), page: 1, type: 'All', keytype: '', sortdate: 'asc', sortpub: '', sortnews: '', fromdate: this.fromdate, todate: this.todate, publicationFilter: '', sortprominence: '' }
  user = {
    email: localStorage.getItem('email')
  }


  constructor(public article: ArticleService, http: HttpClient, elementRef: ElementRef, public _client: ClientService, private spinnerService: Ng4LoadingSpinnerService, private helper: HelperService, excelService: ExcelService, private filterPipe: FilterPipe, private router: Router) {
  }

  // public contactdetailsObject = new contactdetailsComponent(ArticleService, HttpClient, ElementRef, ClientService, Ng4LoadingSpinnerService, HelperService, ExcelService, FilterPipe);
  ngOnInit() {

    $("#reset").hide();
    var self = this;
    // $(document).ready(function(){
    $("#dateclick").click(function () {
      $('#rangeCal').toggle();
    });
    if (localStorage.length == 0) {
      window.location.replace(location.origin);
    }

    updateConfig();
    function updateConfig() {
      var options: { dateLimit: String } = {
        dateLimit: ""
        //,minDate: moment().subtract(365, 'days') , maxDate: moment() 
      };
      $('#config-demo').daterangepicker(options, function (start, end, label) {

        var startDateRange = end.format('YYYY-MM-DD');
        var endDateRange = start.format('YYYY-MM-DD');
        self.articlepara.todate = endDateRange;
        self.articlepara.fromdate = startDateRange;
        self.spinnerService.show();

        self.isActiveToday = false;
        self.isActive7Days = false;
        self.isActiveYesterday = false;
        self.isActivedaterange = true;
      });
    }
    //  });

    this.articlepara.type = 'ALL';
    this.articlepara.keytype = '';
    // this.articlepara.prominance = '';
    // this.articlepara.company = '';
    // this.articlepara.author = '';
    this.articlepara.publicationFilter = '';

    this.Clients();  //uncomment for client list
    this.selectedclient = localStorage.getItem('storageselectedclient');
    //console.log(localStorage.getItem('storageselectedclient'));
    this.spinnerService.show();

  }

  getUserDetails() {
    var postData = {
      clientid: localStorage.getItem('storageselectedclient'),
      email: localStorage.getItem('email')
    }

    this.article.getUserDetails(postData)
      .subscribe(
        res => {
          // console.log(res);
          this.userdetails = res[0];
        },
        err => {
          console.log(err);
        }
      )
    this.getUserClientDetails();
  }
  getUserClientDetails() {
    var postData = {
      clientid: localStorage.getItem('storageselectedclient')
    }

    this.article.getUserClientDetails(postData)
      .subscribe(
        res => {
          // console.log(res);
          this.userClientdetails = res[0];
          this.spinnerService.hide();
        },
        err => {
          console.log(err);
        }
      )
  }
  Clients() {
    //console.log(this.user);
    // this.spinnerService.show();
    this._client.getClients(this.user)
      .subscribe(
        res => {
          // console.log(res);
          this.clientlist = res;
          this.enablefordash = this._client.getDashStatus(this.clientlist, this.articlepara.clientid);
          // console.log(this.enableforbr);
          if (this.enablefordash) {
            this.dashdisabledClass = '';
          }
          else {
            this.dashdisabledClass = 'menudisabled';
          }
        },
        err => {
          console.log(err);
        },
        () => {
          // this.getallarticles();
          this.enablefordash = this._client.getDashStatus(this.clientlist, this.articlepara.clientid);
          // console.log(this.enableforbr);
          if (this.enablefordash) {
            this.dashdisabledClass = '';
          }
          else {
            this.dashdisabledClass = 'menudisabled';
          }
          this.spinnerService.show();
        }
      )
  }
  //=======================change selectd client form dropdownlist=============================//
  changeclient(value) {
    localStorage.setItem('storageselectedclient', value);
    let currentUrl = this.router.url;
    this.spinnerService.show();
    this.spinnerService.hide();
    if (currentUrl.indexOf("contactdetails") > -1) {
      this.getUserDetails();
    }
  }

}
