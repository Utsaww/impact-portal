import { Component, OnInit, ElementRef, Pipe, Injectable, ViewEncapsulation } from '@angular/core';

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

declare var $: any;

@Pipe({
  name: 'million'
})

@Component({
  selector: 'app-rejectedarticles',
  templateUrl: './rejectedarticles.component.html',
  styleUrls: ['./rejectedarticles.component.css']
})
export class rejectedarticlesComponent implements OnInit {
  loading = false;

  public clientlist = [];
  public info = [];
  public selectedmail = [];
  public selectType = [
    {'value':'ALL', 'label': 'Select'},
    {'value':'print', 'label': 'Print'}, 
    {'value':'web', 'label': 'Web'}
];

  public totalcount = 0;
  public printcount = 0;
  public webcount = 0;
  public tvcount = 0;
  enableforprint = false;
  enableforweb = false;
  enableforbr = false;
  public selectedclient;
  public selectedType;
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


  constructor(public article: ArticleService, http: HttpClient, elementRef: ElementRef, public _client: ClientService, private spinnerService: Ng4LoadingSpinnerService, private helper: HelperService, excelService: ExcelService, private filterPipe: FilterPipe) {
  }

  ngOnInit() {

    $("#reset").hide();
    var self = this;
    $(".bs-tooltip-right .arrow").css("display", "none");
    $(".tooltip-inner").css("display", "none");
    $('[data-toggle="tooltip"]').tooltip();
    // $(document).ready(function(){
    $("#dateclick").click(function () {
      // $('#rangeCal').toggle();
      if ($("#rangeCal").css("display") == "none") {
        $('#rangeCal').css("display", "");
      }
      else {
        $('#rangeCal').css("display", "none");
      }
    })
    updateConfig();
    function updateConfig() {
      var today = new Date();
      var options: { dateLimit: String } = {
        dateLimit: ""
        //,minDate: moment().subtract(365, 'days') , maxDate: moment() 
      };
      $('#config-demo').daterangepicker({
        // maxDate: today
      }, function (start, end, label) {

        var startDateRange = end.format('YYYY-MM-DD');
        var endDateRange = start.format('YYYY-MM-DD');
        self.articlepara.todate = endDateRange;
        self.articlepara.fromdate = startDateRange;
        self.spinnerService.show();

        self.isActiveToday = false;
        self.isActive7Days = false;
        self.isActiveYesterday = false;
        self.isActivedaterange = true;
        self.fromdate =  startDateRange;
        self.todate = endDateRange;
        self.getrejectedArticles();
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
    this.selectedType = "ALL";
    //console.log(localStorage.getItem('storageselectedclient'));
    this.spinnerService.show();

  }

  getrejectedArticles() {
    //alert("here");
    //$('#rangeCal').hide();
    //this.spinnerService.hide();
    this.spinnerService.show();
    this.article.getrejectedArticles(this.articlepara)
      .subscribe(
        res => {
          // console.log(res.docs);
          this.info = res.docs;
          this.spinnerService.hide();
          //console.log(res);
        },
        err => {
          console.log(err);
        }
      )

    this.spinnerService.hide();
    // this.selectedclient = this.articlepara.clientid;

  }
  getArticlebyDaterange(para) {
    if (para == "daterange") {
      this.isActiveToday = false;
      this.isActive7Days = false;
      this.isActiveYesterday = false;
      this.isActivedaterange = true;
    }
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
          this.getrejectedArticles();
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
  
  openMenu($event){
    // alert("here");
    if($("#opencloseMenu").hasClass("exp")){
      $("#opencloseMenu").removeClass("exp");
    }
    else{
      $("#opencloseMenu").addClass("exp");
      }
  }
  //=======================change selectd client form dropdownlist=============================//
  changeclient(value) {
    localStorage.setItem('storageselectedclient', value);
    this.spinnerService.show();
    // this.spinnerService.hide();
    this.getrejectedArticles();
  } 
  selType(value) {
    this.spinnerService.show();
    this.articlepara = { clientid: localStorage.getItem('storageselectedclient'), page: 1, type: value, keytype: '', sortdate: 'asc', sortpub: '', sortnews: '', fromdate: this.fromdate, todate: this.todate, publicationFilter: '', sortprominence: '' }
    this.getrejectedArticles();
  }
  advanceSearchModal() {
    localStorage.setItem('advanceSearchStorage', 'Yes');
    //window.location.replace('/home');
  }

}
