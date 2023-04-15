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
// import { ColorEvent } from 'ngx-color';

import { PaletteTileEventArgs, ColorPickerEventArgs } from '@syncfusion/ej2-inputs';
// import { addClass } from '@syncfusion/ej2-base';


declare var $: any;

@Pipe({
  name: 'million'
})

@Component({
  selector: 'app-colorcodes',
  templateUrl: './colorcodes.component.html',
  styleUrls: ['./colorcodes.component.css']
})

export class colorcodesComponent implements OnInit {
  loading = false;

  public clientlist = [];
  
  public userdetails= { contactname: '', email: '' };
  public companystrings: any= [];
  public companystringsdata: any= '';
  // public userdetails:Array<any>=[];
  public userClientdetails= { clientid: '', clientname: '', sector: '', enddate: '' };
  // public userClientdetails:Array<any>=[];
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


  constructor(public article: ArticleService, http: HttpClient, elementRef: ElementRef, public _client: ClientService, private spinnerService: Ng4LoadingSpinnerService, private helper: HelperService, excelService: ExcelService, private filterPipe: FilterPipe) {
  }
  public customColors: { [key: string]: string[] } = {
    'custom1': ["#F7464A",
    "#46BFBD",
    "#FDB45C",
    "#949FB1",
    "#4D5360",
    "#ffc107",
    "#8bc34a",
    "#cddc39",
    "#4caf50",
    "#f9a825",
    "#2e7d32",
    "#9e9d24",
    "#2c7978",
    "#a9681b",
    "#4b72b1",
    "#ae42be",
    "#5c2365",
    "#a27b04",
    "#d3294d",
    "#23c8dc",
    "#3d4fbf",
    "#911627",
    "#04a38b",
    "#ff7531",
    "#c2a11b"]
};
public tileRender(args: PaletteTileEventArgs): void {
  // addClass([args.element], ['e-icons', 'e-custom-tile']);
}
  ngOnInit() {
    if (localStorage.length == 0) {
      window.location.replace(location.origin);
    }

    $("#reset").hide();
    var self = this;
    $(".bs-tooltip-right .arrow").css("display", "none");
    $(".tooltip-inner").css("display", "none");
    $('[data-toggle="tooltip"]').tooltip();
    // $(document).ready(function(){
    $("#dateclick").click(function () {
      $('#rangeCal').toggle();
    })
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
    // this.spinnerService.show();
    this.spinnerService.hide();

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
          // this.spinnerService.hide();
        },
        err => {
          console.log(err);
          // this.spinnerService.hide();
        },
        () => {
          // this.getallarticles();
          this.spinnerService.show();
          this.enablefordash = this._client.getDashStatus(this.clientlist, this.articlepara.clientid);
          // console.log(this.enableforbr);
          if (this.enablefordash) {
            this.dashdisabledClass = '';
          }
          else {
            this.dashdisabledClass = 'menudisabled';
          }
          this.getcompanys();
        }
      )
  }
  getcompanys() {
    var postData = {
      clientid: localStorage.getItem('storageselectedclient')
    }

    this.article.getcompanys(postData)
      .subscribe(
        res => {
          // console.log(res);
          if(res.length > 0){
            this.companystrings = res[0];
            var companysdata = this.companystrings;
            this.companystringsdata = companysdata.companysdata;
          }
          else{
            this.companystringsdata = [];
            this.getcompanysAll();
          }
          this.spinnerService.hide();
        },
        err => {
          console.log(err);
        }
      )
  }
  getcompanysAll() {
    var postData = {
      clientid: localStorage.getItem('storageselectedclient')
    }

    this.article.getcompanysAll(postData)
      .subscribe(
        res => {
          // console.log(res);
          if(res.length > 0){
            this.companystringsdata = res;
          }
          else{
            this.companystringsdata = [];
          }
          this.spinnerService.hide();
        },
        err => {
          console.log(err);
        }
      )
  }

  savedata(){
    for(var i=0; i<this.companystringsdata.length; i++){
      this.companystringsdata[i].colorcode = $("#"+this.companystringsdata[i].companyid).val();
    }
    var currentdate = new Date(); 
    var datetime = currentdate.getDate() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
    var data = {
      "clientid": localStorage.getItem("storageselectedclient"),
      "companysdata": this.companystringsdata,
      "createdon": datetime,
      "userid": localStorage.getItem("email")
    }
    var postData = {
      clientid: localStorage.getItem("storageselectedclient"),
      data: data
    }

    this.article.insertdata(postData)
      .subscribe(
        res => {
          // console.log(res);
          alert("saved successfully");
        },
        err => {
          console.log(err);
        }
      )
    // console.log(data);
  }
  resetdata(){
    var postData = {
      clientid: localStorage.getItem("storageselectedclient")
    }

    this.article.resetdata(postData)
      .subscribe(
        res => {
          // console.log(res);
          alert("saved successfully");
        },
        err => {
          console.log(err);
        }
      )
    // console.log(data);
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
  getUserClientDetails() {
    var postData = {
      clientid: localStorage.getItem('storageselectedclient')
    }

    this.article.getUserClientDetails(postData)
      .subscribe(
        res => {
          // console.log(res);
          this.userClientdetails = res[0];
          // this.spinnerService.hide();
        },
        err => {
          console.log(err);
          // this.spinnerService.hide();
        }
      )
  }
  //=======================change selectd client form dropdownlist=============================//
  changeclient(value) {
    localStorage.setItem('storageselectedclient', value);
    this.getcompanys();
    this.spinnerService.show();
    // this.getUserDetails();
  }


  logoutUser() {

    //clear local storage
    localStorage.clear();
    window.location.replace(location.origin);
  }

  advanceSearchModal() {
    localStorage.setItem('advanceSearchStorage', 'Yes');
    //window.location.replace('/home');
  }

}
