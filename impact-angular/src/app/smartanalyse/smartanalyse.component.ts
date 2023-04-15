import {
  Component,
  OnInit,
  ElementRef,
  Pipe,
  Injectable,
  ViewEncapsulation,
} from "@angular/core";

import { ExcelService } from "../sharedServices";
import { AppSetting } from "../appsetting";
import { HelperService } from "../helperservice";
import { ClientService } from "../clientservice";
import { HttpClient } from "@angular/common/http";
import { Md5 } from "md5-typescript";
import { formatDate, DecimalPipe } from "@angular/common";
import { ArticleService } from "../articleservice";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { FilterPipe } from "ngx-filter-pipe";
import { ChartOptions, ChartType, ChartDataSets } from "chart.js";
//import { ChartsModule } from 'ng2-charts';
import * as pluginDataLabels from "chartjs-plugin-datalabels";

declare var $: any;

@Pipe({
  name: "million",
})
@Component({
  selector: "app-smartanalyse",
  templateUrl: "./smartanalyse.component.html",
  styleUrls: ["./smartanalyse.component.css"],
})
export class SmartanalyseComponent implements OnInit {
  loading = false;
  values = "";
  public clientlist = [];
  result = [];
  totalcount = "0";
  enableforprint = false;
  enableforweb = false;
  enableforbr = false;
  enablefortwitter = false;
  public selectedclient;
  isActiveToday = true;
  isActiveYesterday = false;
  isActive7Days = false;
  isActivedaterange = false;
  date = new Date();
  fromdate = "";
  todate = "";
  excelurl = "";
  public selectedKeywords = [];

  public excelData = '';

  public selectedmonthAVE: number = new Date().getMonth() - 1;
  public articlepara = {
    clientid: localStorage.getItem("storageselectedclient"),
    page: 1,
    type: "All",
    keytype: "",
    sortdate: "asc",
    sortpub: "",
    sortnews: "",
    fromdate: localStorage.getItem("fromdate"),
    todate: localStorage.getItem("todate"),
    publicationFilter: "",
    sortprominence: "",
    keywordFilter: this.selectedKeywords
  };
  user = {
    email: localStorage.getItem("email"),
  };
  public allLabels = [];
  public allColors = [];
  public displayColor = [];
  public chartTypedefine: string = "bar";
  public chartType: string = "bar";

  public firstclickchart = "";

  public arraymonth: Array<any> = [
    "Select Month",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  public yeardataLabel: Array<any> = [];
  public yearname: Array<any> = [];
  public yeardata: Array<any> = [];
  public chartDatadefine: Array<any> = [];
  public chartDatasets: Array<any> = [
    {
      data: this.yeardata,
      label: "Monthly Trend",
    },
  ];
  public chartLabels: Array<any> = [];
  public AVEChartData: Array<any> = [];
  public colors: Array<any> = [];
  public colorsMonthlyTrend: Array<any> = [];
  public chartColors: Array<any> = this.colors;
  public type: string = "PRINT";
  public chartname: string = "Top Ten Print Publications";
  public chartOptions: any = {
    responsive: true,
    title: {
      display: true,
      text: "PRINT",
      fontSize: 14,
      fontColor: "#000",
    },
    legend: {
      position: "bottom",
    },
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [
        {
          ticks: {
            // suggestedMax: 60
          },
        },
      ],
      yAxes: [{}],
    },
    plugins: {
      datalabels: {
        anchor: "end",
        align: "end",
        font: {
          size: 12,
        },
      },
    },
  };
  /***********************WEB************************************/
  public yeardataLabelWeb: Array<any> = [];
  public yearnameWeb: Array<any> = [];
  public yeardataWeb: Array<any> = [];
  public chartDatasetsWeb: Array<any> = [{ data: this.yeardata, label: "" }];
  public chartLabelsWeb: Array<any> = [];
  public AVEChartDataWeb: Array<any> = [];
  public colorsWeb: Array<any> = [];
  public chartColorsWeb: Array<any> = this.colorsWeb;
  public chartOptionsWeb: any = {
    responsive: true,
    title: {
      display: true,
      text: "WEB",
      fontSize: 14,
      fontColor: "#000",
    },
    legend: {
      display: false,
      position: "bottom",
    },
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [
        {
          ticks: {
            // suggestedMax: 60
          },
        },
      ],
      yAxes: [
        {
          display: false,
        },
      ],
    },
    plugins: {
      datalabels: {
        anchor: "end",
        align: "end",
        font: {
          size: 12,
        },
      },
    },
  };
  /*************************TWITTER********************************/
  public yeardataLabelTwitter: Array<any> = [];
  public yearnameTwitter: Array<any> = [];
  public yeardataTwitter: Array<any> = [];
  public chartDatasetsTwitter: Array<any> = [
    { data: this.yeardata, label: "" },
  ];
  public chartLabelsTwitter: Array<any> = [];
  public AVEChartDataTwitter: Array<any> = [];
  public colorsTwitter: Array<any> = [];
  public chartColorsTwitter: Array<any> = this.colorsTwitter;
  public chartOptionsTwitter: any = {
    responsive: true,
    title: {
      display: true,
      text: "TWITTER",
      fontSize: 14,
      fontColor: "#000",
    },
    legend: {
      display: false,
      position: "bottom",
    },
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [
        {
          ticks: {
            // suggestedMax: 60
          },
        },
      ],
      yAxes: [
        {
          display: false,
        },
      ],
    },
    plugins: {
      datalabels: {
        anchor: "end",
        align: "end",
        font: {
          size: 12,
        },
      },
    },
  };
  /***********************Other charts*****************************/

  public chartTypeAll: string = "horizontalBar";
  public chartDataSetDefineAll: Array<any> = [];
  // public chartDatasetsAll: Array<any> = this.chartDataSetDefineAll;
  // public chartLabelsAll: Array<any> = [];
  public AVEChartDataAll: Array<any> = [];
  public colorsAll: Array<any> = [];
  // public chartColorsAll: Array<any> = this.colorsAll;
  public chartDatasetsAll: Array<any> = this.AVEChartDataAll;
  public chartLabelsAll: Array<any> = [
    "Red",
    "Blue",
    "Yellow",
    "Green",
    "Purple",
    "Orange",
  ];
  public chartColorsAll: Array<any> = this.colorsAll;
  public chartOptionsAll: any = {
    responsive: true,
    legend: {
      position: "bottom",
      labels: {
        // fontColor: '#fff'
      },
    },
    scales: {
      xAxes: [
        {
          stacked: true,
        },
      ],
      yAxes: [
        {
          stacked: true,
        },
      ],
    },
  };

  /***********************Other charts*****************************/

  public chartTypeAVE: string = "horizontalBar";
  public chartDataSetDefineAVE: Array<any> = [];
  // public chartDatasetsAll: Array<any> = this.chartDataSetDefineAll;
  // public chartLabelsAll: Array<any> = [];
  public AVEChartDataAVE: Array<any> = [];
  public colorsAVE: Array<any> = [];
  // public chartColorsAll: Array<any> = this.colorsAll;

  public chartDatasetsAVE: Array<any> = this.AVEChartDataAVE;
  public ExportchartDatasetsAVE: Array<any> = [];
  public chartLabelsAVE: Array<any> = [];
  public ExportchartLabelsAVE: Array<any> = [];
  public chartColorsAVE: Array<any> = this.colorsAVE;
  public chartOptionsAVE: any = {
    responsive: true,
    legend: {
      position: "bottom",
      labels: {
        // fontColor: '#fff'
      },
    },
    scales: {
      xAxes: [
        {
          stacked: true,
        },
      ],
      yAxes: [
        {
          stacked: true,
        },
      ],
    },
  };
  public datavaluesToExport = [];
  /************************Modal Charts*********************************/

  public modalchartType = "";
  public modalchartDatasets: Array<any> = [];
  public modalchartLabels: Array<any> = [];
  public modalchartColors: Array<any> = [];
  public modalchartOptions = {};
  public modallegend = "false";
  public modaltrue = "true";
  public modalfalse = "false";
  public exportExceldata = [];
  public Modalchartname = "";
  public text: string = "charts";
  public ExportprintData = [];

  public chartClicked(e: any): void {}
  public chartHovered(e: any): void {}

  public chartReady: boolean = false;
  public chartReadyWeb: boolean = false;
  public chartReadyTwitter: boolean = false;
  public chartReadyAll: boolean = false;
  public chartReadyAVE: boolean = false;
  public chartReadyModal: boolean = false;

  public enablefordash = false;
  public dashdisabledClass = "";
  public colorscount =0;

  constructor(
    public article: ArticleService,
    public excelService: ExcelService,
    http: HttpClient,
    elementRef: ElementRef,
    public _client: ClientService,
    private spinnerService: Ng4LoadingSpinnerService,
    private helper: HelperService,
    private filterPipe: FilterPipe
  ) {}
  ngOnInit() {
    $("#reset").hide();

    var self = this;
    $(".bs-tooltip-right .arrow").css("display", "none");
    $(".tooltip-inner").css("display", "none");
    $('[data-toggle="tooltip"]').tooltip();

    if (localStorage.length == 0) {
      window.location.replace(location.origin);
    }
    // $(document).ready(function(){
    $("#dateclick").off("click");
    $("#dateclick").click(function () {
      $("#rangeCal").toggle();
    });
    $(".selFilterType a").click(function () {
      var selectedval = $(this).html();
      $("#dropdownMenuLinkType").html(selectedval);
    });
    updateConfig();
    function updateConfig() {
      var today = new Date();
      var options: { dateLimit: String } = {
        dateLimit: "",
        //,minDate: moment().subtract(365, 'days') , maxDate: moment()
      };

      var fromdate = formatDate(
        new Date(localStorage.getItem("fromdate")),
        "dd-MM-yyyy",
        "en",
        ""
      );
      var todate = formatDate(
        new Date(localStorage.getItem("todate")),
        "dd-MM-yyyy",
        "en",
        ""
      );

      $("#config-demo").daterangepicker(
        {
          // maxDate: today,
          startDate: todate,
          endDate: fromdate,
          dateLimit: { days: 95 },
        },
        function (start, end, label) {
          var startDateRange = end.format("YYYY-MM-DD");
          var endDateRange = start.format("YYYY-MM-DD");
          self.articlepara.todate = endDateRange;
          self.articlepara.fromdate = startDateRange;

          localStorage.setItem("fromdate", startDateRange);
          localStorage.setItem("todate", endDateRange);

          self.spinnerService.show();

          self.isActiveToday = false;
          self.isActive7Days = false;
          self.isActiveYesterday = false;
          self.isActivedaterange = true;
          self.printChart();
          self.getcompanysAll();
          // self.getArticlebyDate('custom');
        }
      );
    }
    //  });
    $(".selectperiod a").click(function () {
      var selectedval = $(this).html();
      $("#selectedType").html(selectedval);
    });

    $(".charttype").click(function () {
      self.spinnerService.show();
      self.type = $(this).html();
      self.printChart();
    });

    $(".ChartCategory").click(function () {
      self.spinnerService.show();
      self.chartname = $(this).html();
      self.printChart();
    });
    this.articlepara.type = "ALL";
    this.articlepara.keytype = "";
    // this.articlepara.prominance = '';
    // this.articlepara.company = '';
    // this.articlepara.author = '';
    this.articlepara.publicationFilter = "";

    this.Clients(); //uncomment for client list
    this.selectedclient = localStorage.getItem("storageselectedclient");
    
    ////console.log(localStorage.getItem('storageselectedclient'));
    this.spinnerService.show();
  }
  
  getcompanysAll() {
    var postData = {
      clientid: localStorage.getItem('storageselectedclient')
    }
    this.article.getcompanys(postData)
    .subscribe(
      res => {
        // console.log(res);
        if(res.length > 0){
          var colors=[];
          var resdata = res[0].companysdata;
          for(var i=0;i<resdata.length;i++){
            var companystring = resdata[i].companystring;
            var colorcode = resdata[i].colorcode;
            if(!colors.hasOwnProperty(companystring)){
              colors[companystring] = colorcode;
            }
          }
          // this.displayColor = colors;
          this.allColors=[];
          this.allColors = colors;
          this.colorscount = 1;
          this.printChart();
          // console.log(colors);
        }
        else{
          this.colorscount = 0;
          this.printChart();
          // console.log(res);
        }
        this.spinnerService.hide();
      },
      err => {
        this.colorscount = 0;
        this.printChart();
        // console.log(err);
      }
    )
  }
  ChartCategory(chartname) {
    var self = this;
    self.spinnerService.show();
    self.chartname = chartname;
    self.printChart();
  }
  abbrNum(number, decPlaces) {
    var orig = number;
    var dec = decPlaces;
    // 2 decimal places => 100, 3 => 1000, etc
    decPlaces = Math.pow(10, decPlaces);

    // Enumerate number abbreviations
    var abbrev = ["K", "M", "B", "T"];

    // Go through the array backwards, so we do the largest first
    for (var i = abbrev.length - 1; i >= 0; i--) {
      // Convert array index to "1000", "1000000", etc
      var size = Math.pow(10, (i + 1) * 3);

      // If the number is bigger or equal do the abbreviation
      if (size <= number) {
        // Here, we multiply by decPlaces, round, and then divide by decPlaces.
        // This gives us nice rounding to a particular decimal place.
        number = Math.round((number * decPlaces) / size) / decPlaces;

        // Handle special case where we round up to the next abbreviation
        if (number == 1000 && i < abbrev.length - 1) {
          number = 1;
          i++;
        }

        // //console.log(number);
        // Add the letter for the abbreviation
        number += abbrev[i];

        // We are done... stop
        break;
      }
    }

    // //console.log('abbrNum(' + orig + ', ' + dec + ') = ' + number);
    return number;
  }
  openMenu($event) {
    // alert("here");
    if ($("#opencloseMenu").hasClass("exp")) {
      $("#opencloseMenu").removeClass("exp");
    } else {
      $("#opencloseMenu").addClass("exp");
    }
  }
  advanceSearchModal() {
    localStorage.setItem("advanceSearchStorage", "Yes");
    window.location.replace("/home");
  }
  logoutUser() {
    //clear local storage
    localStorage.clear();
    window.location.replace(location.origin);
  }
  Clients() {
    ////console.log(this.user);
    // this.spinnerService.show();
    this._client.getClients(this.user).subscribe(
      (res) => {
        // //console.log(res);
        this.clientlist = res;
        this.enablefordash = this._client.getDashStatus(
          this.clientlist,
          this.articlepara.clientid
        );
        // console.log(this.enableforbr);
        if (this.enablefordash) {
          this.dashdisabledClass = "";
        } else {
          this.dashdisabledClass = "menudisabled";
        }
      },
      (err) => {
        console.log(err);
      },
      () => {
        // this.getallarticles();
        this.spinnerService.show();
        this.getcompanysAll();
        this.enableforprint = this._client.getPrintStatus(
          this.clientlist,
          this.articlepara.clientid
        );
        this.enableforweb = this._client.getWebStatus(
          this.clientlist,
          this.articlepara.clientid
        );
        this.enableforbr = this._client.getBrStatus(
          this.clientlist,
          this.articlepara.clientid
        );

        this.enablefordash = this._client.getDashStatus(
          this.clientlist,
          this.articlepara.clientid
        );
        this.enablefortwitter = this._client.getDashStatus(
          this.clientlist,
          this.articlepara.clientid
        );
        // console.log(this.enableforbr);
        if (this.enablefordash) {
          this.dashdisabledClass = "";
        } else {
          this.dashdisabledClass = "menudisabled";
        }
      }
    );
  }
  compareValues(key, order = "asc") {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }

      const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
      const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return order === "desc" ? comparison * -1 : comparison;
    };
  }
  printChart() {
    //console.log(this.user);
    this.articlepara.clientid = localStorage.getItem("storageselectedclient");
    if (this.chartname == "Monthly Trend") {
      $(".calendarcontrol").css("display", "none");
      $(".listfilterType").css("display", "none");
      $(".typecategory").css("display", "");
      $(".monthselect").css("display", "none");
      $(".mainchartdiv").removeClass("col-md-9");
      $(".mainchartdiv").addClass("col-md-6");
      $(".otherschartdiv").css("display", "none");
      $(".avechartdiv").css("display", "none");
      $(".mainchartdiv").css("display", "");
      $(".webchartdiv").css("display", "");
      $(".twitterchartdiv").css("display", "");

      $(".filtertype").css("visibility", "hidden");
      $(".ChartCategory").removeClass("active");
      $("#monthlyTrend").addClass("active");

      if ($("#modalChart").length > 0) {
        var canvas = $("#modalChart canvas")[0];
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
      var date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth();
      var firstDay = new Date(y, m, 1);
      var lastDay = new Date(y, m + 1, 0);
      var d = new Date();
      var lastdate = new Date(d.setDate(d.getDate() - 365));
      // var fromdate = currentyear + "-12-31";
      var fromdate = formatDate(lastDay, "yyy-MM-dd", "en", "");
      var todate = formatDate(
        lastdate.getFullYear() + "-" + (lastdate.getMonth() + 2) + "-01",
        "yyy-MM-dd",
        "en",
        ""
      );
      var chartsData = {
        clientid: localStorage.getItem("storageselectedclient"),
        fromdate: fromdate,
        todate: todate,
        type: "PRINT",
      };
      this.chartTypedefine = "bar";
      this.chartType = "bar";

      this.yeardataLabel = [];
      this.yearname = [];
      this.yeardata = [];
      this.chartDatadefine = [];
      this.chartDatasets = [
        {
          data: this.yeardata,
          label: "Monthly Trend",
        },
      ];
      this.chartLabels = [];
      this.AVEChartData = [];
      this.colorsMonthlyTrend = [];
      this.chartColors = this.colorsMonthlyTrend;
      this.chartname = "Monthly Trend";
      this.chartOptions = {
        responsive: true,
        title: {
          display: true,
          text: "PRINT",
          fontSize: 14,
          fontColor: "#000",
        },
        legend: {
          position: "bottom",
        },
        // We use these empty structures as placeholders for dynamic theming.
        scales: {
          xAxes: [
            {
              ticks: {
                // suggestedMax: 60
              },
            },
          ],
          yAxes: [{}],
        },
        plugins: {
          datalabels: {
            anchor: "end",
            align: "end",
            font: {
              size: 12,
            },
          },
        },
      };
      var monthsarray = [
        "",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      // this.spinnerService.show();
      this.article.YearChartData(chartsData).subscribe(
        (res) => {
          this.yeardata = [];
          this.yeardataLabel = [];
          this.yearname = [];
          var PrintData = [];
          for (var i = 0; i < res.length; i++) {
            if (i == res.length - 1) {
              // this.yeardataTwitter.push(res[i].count);
              // this.yeardataLabelTwitter.push(this.arraymonth[res[i]._id.mon]);
              PrintData.push({ month: res[i]._id.mon, count: res[i].count, year: res[i]._id.year });
            } else {
              // this.yeardataTwitter.push(res[i].count);
              // this.yeardataLabelTwitter.push(this.arraymonth[res[i]._id.mon]);
              PrintData.push({ month: res[i]._id.mon, count: res[i].count, year: res[i]._id.year });
            }
          }

          var startmonth = lastdate.getMonth() + 2;
          var monthdata = [];
          var currentdateforChart = new Date();
          var currentyearforChart = currentdateforChart.getFullYear();
          var previousyearforChart = currentyearforChart - 1;
          var year = "";
          for (var i = 0; i < 12; i++) {
            if (startmonth + i > 12) {
              if (PrintData.findIndex((x) => x.month === startmonth + i - 12) != -1) {
                year = PrintData[PrintData.findIndex( (x) => x.month === startmonth + i - 12)].year;
                monthdata.push({
                  month: startmonth + i - 12,
                  count: PrintData[PrintData.findIndex( (x) => x.month === startmonth + i - 12)].count,
                  year: year
                });
              } else {
                monthdata.push({ month: startmonth + i - 12, count: 0, year: currentyearforChart });
              }
            } else {
              if (PrintData.findIndex((x) => x.month === startmonth + i) != -1) {
                monthdata.push({
                  month: startmonth + i,
                  count: PrintData[PrintData.findIndex((x) => x.month === startmonth + i)].count,
                  year: PrintData[PrintData.findIndex( (x) => x.month === startmonth + i)].year
                });
              } else {
                monthdata.push({ month: startmonth + i, count: 0, year: previousyearforChart });
              }
            }
          }

          for (var i = 0; i < monthdata.length; i++) {
            this.yeardata.push(monthdata[i].count);
            var year = "";
            year = monthdata[i].year.toString();
            this.yeardataLabel.push(monthsarray[monthdata[i].month]);
            this.yearname.push(year);
          }

          this.chartLabels = this.yeardataLabel;
          // this.chartDatasets[0].data = this.yeardata;

          this.chartDatasets = [
            { data: this.yeardata, label: "Monthly Trend" },
          ];
          this.colorsMonthlyTrend = [
            {
              backgroundColor: [
                "#ffd862",
                "#ffd862",
                "#ffd862",
                "#ffd862",
                "#ffd862",
                "#ffd862",
                "#ffd862",
                "#ffd862",
                "#ffd862",
                "#ffd862",
                "#ffd862",
                "#ffd862",
                "#ffd862",
                "#ffd862",
                "#ffd862",
                "#ffd862",
                "#ffd862",
                "#ffd862",
                "#ffd862",
                "#F7464A",
                "#ffd862",
                "#ffd862",
                "#ffd862",
                "#ffd862",
                "#ffd862",
              ],
              borderColor: [],
              borderWidth: 0,
            },
          ];
          this.chartColors = this.colorsMonthlyTrend;

          if (res.length == 0) {
            this.chartReady = false;
          } else {
            this.chartReady = true;
          }
          this.chartReadyAll = false;
          this.chartReadyAVE = false;
          this.chartReadyModal = false;
        },
        (err) => {
          console.log(err);
        }
      );

      var chartsData = {
        clientid: localStorage.getItem("storageselectedclient"),
        fromdate: fromdate,
        todate: todate,
        type: "WEB",
      };
      this.chartOptions = {
        responsive: true,
        title: {
          display: true,
          text: "PRINT",
          fontSize: 14,
          fontColor: "#000",
        },
        legend: {
          display: false,
          position: "bottom",
        },
        // We use these empty structures as placeholders for dynamic theming.
        scales: {
          xAxes: [
            {
              ticks: {
                // suggestedMax: 60
              },
            },
          ],
          yAxes: [
            {
              display: false,
            },
          ],
        },
        plugins: {
          datalabels: {
            anchor: "end",
            align: "end",
            font: {
              size: 12,
            },
          },
        },
      };
      // this.spinnerService.show();
      this.article.YearChartDataWEB(chartsData).subscribe(
        (res) => {
          this.yeardataWeb = [];
          this.yeardataLabelWeb = [];
          this.yearnameWeb = [];
          var WebData = [];
          for (var i = 0; i < res.length; i++) {
            if (i == res.length - 1) {
              // this.yeardataTwitter.push(res[i].count);
              // this.yeardataLabelTwitter.push(this.arraymonth[res[i]._id.mon]);
              WebData.push({ month: res[i]._id.mon, count: res[i].count, year: res[i]._id.year});
            } else {
              // this.yeardataTwitter.push(res[i].count);
              // this.yeardataLabelTwitter.push(this.arraymonth[res[i]._id.mon]);
              WebData.push({ month: res[i]._id.mon, count: res[i].count, year: res[i]._id.year });
            }
          }

          var startmonth = lastdate.getMonth() + 2;
          var monthdata = [];
          var currentdateforChart = new Date();
          var currentyearforChart = currentdateforChart.getFullYear();
          var previousyearforChart = currentyearforChart - 1;
          for (var i = 0; i < 12; i++) {
            if (startmonth + i > 12) {
              if (WebData.findIndex((x) => x.month === startmonth + i - 12) != -1) {
                monthdata.push({
                  month: startmonth + i - 12,
                  count: WebData[WebData.findIndex( (x) => x.month === startmonth + i - 12)].count,
                  year: WebData[WebData.findIndex( (x) => x.month === startmonth + i - 12)].year
                });
              } else {
                monthdata.push({ month: startmonth + i - 12, count: 0, year: currentyearforChart });
              }
            } else {
              if (WebData.findIndex((x) => x.month === startmonth + i) != -1) {
                monthdata.push({
                  month: startmonth + i,
                  count: WebData[WebData.findIndex((x) => x.month === startmonth + i)].count,
                  year: WebData[WebData.findIndex((x) => x.month === startmonth + i)].year
                });
              } else {
                monthdata.push({ month: startmonth + i, count: 0, year: previousyearforChart });
              }
            }
          }

          for (var i = 0; i < monthdata.length; i++) {
            this.yeardataWeb.push(monthdata[i].count);
            var year = "";
            year = monthdata[i].year.toString();
            this.yeardataLabelWeb.push(monthsarray[monthdata[i].month]);
            this.yearnameWeb.push(year);
          }

          this.chartLabelsWeb = this.yeardataLabelWeb;
          // this.chartDatasets[0].data = this.yeardata;

          this.chartDatasetsWeb = [
            { data: this.yeardataWeb, label: "Monthly Trend" },
          ];
          this.colorsWeb = [
            {
              backgroundColor: [
                "#b265be",
                "#b265be",
                "#b265be",
                "#b265be",
                "#b265be",
                "#b265be",
                "#b265be",
                "#b265be",
                "#b265be",
                "#b265be",
                "#b265be",
                "#b265be",
                "#b265be",
                "#b265be",
                "#b265be",
                "#b265be",
                "#b265be",
                "#b265be",
                "#b265be",
                "#b265be",
                "#b265be",
                "#b265be",
                "#b265be",
                "#b265be",
                "#b265be",
              ],
              borderColor: [],
              borderWidth: 0,
            },
          ];
          this.chartColorsWeb = this.colorsWeb;
          //console.log(this.yeardata);
          //console.log(this.yeardataLabel);

          if (res.length == 0) {
            this.chartReadyWeb = false;
          } else {
            this.chartReadyWeb = true;
          }
          this.chartReadyAll = false;
          this.chartReadyAVE = false;
          this.chartReadyModal = false;
          this.spinnerService.hide();
        },
        (err) => {
          console.log(err);
        }
      );
      var chartsData = {
        clientid: localStorage.getItem("storageselectedclient"),
        fromdate: fromdate,
        todate: todate,
        type: "TWITTER",
      };
      // this.spinnerService.show();
      this.article.YearChartData(chartsData).subscribe(
        (res) => {
          this.yeardataTwitter = [];
          this.yeardataLabelTwitter = [];
          this.yearnameTwitter=[];
          var TwitterData = [];
          for (var i = 0; i < res.length; i++) {
            if (i == res.length - 1) {
              // this.yeardataTwitter.push(res[i].count);
              // this.yeardataLabelTwitter.push(this.arraymonth[res[i]._id.mon]);
              TwitterData.push({ month: res[i]._id.mon, count: res[i].count, year: res[i]._id.year });
            } else {
              // this.yeardataTwitter.push(res[i].count);
              // this.yeardataLabelTwitter.push(this.arraymonth[res[i]._id.mon]);
              TwitterData.push({ month: res[i]._id.mon, count: res[i].count, year: res[i]._id.year });
            }
          }

          var startmonth = lastdate.getMonth() + 2;
          var monthdata = [];
          var currentdateforChart = new Date();
          var currentyearforChart = currentdateforChart.getFullYear();
          var previousyearforChart = currentyearforChart - 1;
          for (var i = 0; i < 12; i++) {
            if (startmonth + i > 12) {
              if (TwitterData.findIndex((x) => x.month === startmonth + i - 12) != -1) {
                monthdata.push({
                  month: startmonth + i - 12,
                  count: TwitterData[TwitterData.findIndex( (x) => x.month === startmonth + i - 12)].count,
                  year: TwitterData[TwitterData.findIndex( (x) => x.month === startmonth + i - 12)].year,
                });
              } else {
                monthdata.push({ month: startmonth + i - 12, count: 0, year: currentyearforChart });
              }
            } else {
              if (TwitterData.findIndex((x) => x.month === startmonth + i) != -1) {
                monthdata.push({
                  month: startmonth + i,
                  count: TwitterData[TwitterData.findIndex((x) => x.month === startmonth + i)].count,
                  year: TwitterData[TwitterData.findIndex((x) => x.month === startmonth + i)].year,
                });
              } else {
                monthdata.push({ month: startmonth + i, count: 0, year: previousyearforChart });
              }
            }
          }

          for (var i = 0; i < monthdata.length; i++) {
            this.yeardataTwitter.push(monthdata[i].count);
            this.yeardataLabelTwitter.push(monthsarray[monthdata[i].month]);
            var year = "";
            year = monthdata[i].year.toString();
            this.yearnameTwitter.push(year);
          }

          this.chartLabelsTwitter = this.yeardataLabelTwitter;
          // this.chartDatasets[0].data = this.yeardata;

          this.chartDatasetsTwitter = [
            { data: this.yeardataTwitter, label: "Monthly Trend" },
          ];
          // this.colorsTwitter = [
          //   {
          //     backgroundColor: ["#F7464A", "#F7464A", "#F7464A", "#F7464A", "#F7464A", "#F7464A", "#F7464A", "#F7464A", "#F7464A", "#F7464A", "#F7464A", "#F7464A", "#F7464A", "#F7464A", "#F7464A", "#F7464A", "#F7464A", "#F7464A", "#F7464A", "#F7464A", "#F7464A", "#F7464A", "#F7464A", "#F7464A", "#F7464A"],
          //     borderColor: [],
          //     borderWidth: 0,
          //   }
          // ];
          this.colorsTwitter = [
            {
              backgroundColor: [
                "#1da1f2",
                "#1da1f2",
                "#1da1f2",
                "#1da1f2",
                "#1da1f2",
                "#1da1f2",
                "#1da1f2",
                "#1da1f2",
                "#1da1f2",
                "#1da1f2",
                "#1da1f2",
                "#1da1f2",
                "#1da1f2",
                "#1da1f2",
                "#1da1f2",
                "#1da1f2",
                "#1da1f2",
                "#1da1f2",
                "#1da1f2",
                "#1da1f2",
                "#1da1f2",
                "#1da1f2",
                "#1da1f2",
                "#1da1f2",
                "#1da1f2",
              ],
              borderColor: [],
              borderWidth: 0,
            },
          ];
          this.chartColorsTwitter = this.colorsTwitter;
          if (res.length == 0) {
            this.chartReadyTwitter = false;
          } else {
            this.chartReadyTwitter = true;
          }
          this.chartReadyAll = false;
          this.chartReadyAVE = false;
          this.chartReadyModal = false;
          // //console.log(this.yeardata);
          // //console.log(this.yeardataLabel);
          // //this.spinnerService.hide();
        },
        (err) => {
          console.log(err);
        }
      );
    } else if (this.chartname == "By Region - PRINT") {
      $(".calendarcontrol").css("display", "");
      $(".typecategory").css("display", "");
      $(".monthselect").css("display", "none");

      $(".otherschartdiv").css("display", "");
      $(".avechartdiv").css("display", "none");
      $(".mainchartdiv").css("display", "none");
      $(".webchartdiv").css("display", "none");
      $(".twitterchartdiv").css("display", "none");
      $(".listfilterType").css("display", "none");

      $(".filtertype").css("visibility", "visible");
      $(".mainchartdiv").removeClass("col-md-6");
      $(".mainchartdiv").addClass("col-md-9");

      $(".ChartCategory").removeClass("active");
      $("#byRegionPrint").addClass("active");
      var currentdate = new Date();
      var currentyear = currentdate.getFullYear();
      var fromdate = formatDate(
        this.articlepara.fromdate,
        "yyy-MM-dd",
        "en",
        ""
      );
      var todate = formatDate(this.articlepara.todate, "yyy-MM-dd", "en", "");
      var chartsData = {
        clientid: localStorage.getItem("storageselectedclient"),
        fromdate: fromdate,
        todate: todate,
        type: "PRINT",
      };
      this.chartLabelsAll = [];
      this.colorsAll = [];
      //this.spinnerService.hide();
      this.spinnerService.show();
      this.article.RegionChartData(chartsData).subscribe(
        (res) => {
          // //console.log(res);
          if (res.length == 0) {
            this.chartReady = false;
            this.chartReadyWeb = false;
            this.chartReadyTwitter = false;
            this.chartReadyAll = false;
            this.chartReadyAVE = false;
            this.chartReadyModal = false;
            this.spinnerService.hide();
            return false;
          }
          this.AVEChartDataAll = [];
          this.chartLabelsAll = [];
          this.colorsAll = [];
          this.chartTypeAll = "horizontalBar";
          this.chartDataSetDefineAll = [];
          this.colorsAll = [];
          this.chartDatasetsAll = this.AVEChartDataAll;

          this.chartLabelsAll = [];

          this.chartColorsAll = this.colorsAll;

          this.chartOptionsAll = {
            responsive: true,
            legend: {
              position: "bottom",
              labels: {
                // fontColor: '#fff'
              },
            },
            scales: {
              xAxes: [
                {
                  stacked: true,
                },
              ],
              yAxes: [
                {
                  stacked: true,
                },
              ],
            },
            tooltips: {
              // Disable the on-canvas tooltip
              enabled: true,
            },
          };
          this.datavaluesToExport = res;
          var colors: Array<any> = [
            "#ffa1b5",
            "#86c7f3",
            "#ffe29a",
            "#f1f2f4",
            "#93d9d9",
            "#c1d6e1",
            "#eaeaea",
            "#fa9092",
            "#90d9d7",
            "#fed29d",
            "#bfc5d0",
            "#9498a0",
            "#fe76be",
            "#72d595",
            "#99ca72",
            "#7cfff4",
            "#98bf76",
            "#a3f5af",
            "#e89fe6",
            "#dc7196",
            "#e1adca",
            "#8ea17d",
            "#b9fd6e",
            "#dcc4a3",
            "#e871e4",
            "#c5ae89",
          ];

          var chartLabelsAll = [];
          var Labelschart = [];
          var allregiondata = [];
          for (var i = 0; i < res.length; i++) {
            for (var j = 0; j < res[i].values.length; j++) {
              if (chartLabelsAll.indexOf(res[i].values[j].companys) == -1) {
                chartLabelsAll.push(res[i].values[j].companys);
                if(this.allLabels.indexOf(res[i].values[j].companys)==-1){
                  this.allLabels.push(res[i].values[j].companys);
                }
              }
              if (
                res[i]._id.region == undefined ||
                res[i]._id.region == "undefined"
              ) {
              } else {
                if (Labelschart.indexOf(res[i]._id.region) == -1) {
                  Labelschart.push(res[i]._id.region);
                }
              }
              allregiondata.push({
                region: res[i]._id.region,
                companys: res[i].values[j].companys,
                count: res[i].values[j].count,
              });
            }
          }
          for (var i = 0; i < res.length; i++) {
            var dataarr = [];
            for (var j = 0; j < res[i].values.length; j++) {
              if (chartLabelsAll.indexOf(res[i].values[j].companys) > -1) {
                //if(companys == res[i].values[j].companys){
                dataarr.push({
                  region: res[i]._id.region,
                  companys: res[i].values[j].companys,
                  count: res[i].values[j].count,
                });
                // dataarray.push(res[i].values[j].count);
                //}
              }
            }
          }
          // for (var i = 0; i < chartLabelsAll.length; i++) {
          //   // if(this.allLabels.indexOf(res[i]._id)==-1){
          //   this.allLabels.push(chartLabelsAll[i]);
          //   // }
          // }
          if (this.firstclickchart == "") {
            var color1 = "#F7464A";
            var color2 = "#ffa1b5";
            var color3 = "#86c7f3";
            var color4 = "#ffe29a";
            var color5 = "#f1f2f4";
            var color6 = "#93d9d9";
            var color7 = "#c1d6e1";
            var color8 = "#eaeaea";
            var color9 = "#fa9092";
            var color10 = "#90d9d7";
            var color11 = "#fed29d";
            var color12 = "#bfc5d0";
            var color13 = "#9498a0";
            var color14 = "#fe76be";
            var color15 = "#72d595";
            var color16 = "#99ca72";
            var color17 = "#7cfff4";
            var color18 = "#98bf76";
            var color19 = "#a3f5af";
            var color20 = "#e89fe6";
            var color21 = "#dc7196";
            var color22 = "#e1adca";
            var color23 = "#8ea17d";
            var color24 = "#b9fd6e";
            var color25 = "#dcc4a3";
            var color26 = "#e871e4";
            var color27 = "#c5ae89";

            this.colors = [
              color1,
              color2,
              color3,
              color4,
              color5,
              color6,
              color7,
              color8,
              color9,
              color10,
              color11,
              color12,
              color13,
              color14,
              color15,
              color16,
              color17,
              color18,
              color19,
              color20,
              color21,
              color22,
              color23,
              color24,
              color25,
              color26,
              color27,
            ];

            this.allLabels = [];
            //this.allColors = [];
            this.displayColor = [];
            for (var i = 0; i < chartLabelsAll.length; i++) {
              if (this.allLabels.indexOf(chartLabelsAll[i]) == -1) {
                this.allLabels.push(chartLabelsAll[i]);
              }
            }
            if(this.colorscount  == 0){
              for (var i = 0; i < this.allLabels.length; i++) {
                this.allColors[this.allLabels[i]] = this.colors[i];
              }
            }
            for (var j = 0; j < chartLabelsAll.length; j++) {
              this.displayColor[j] = this.allColors[chartLabelsAll[j]];
            }
          }
          else{
            
            for (var i = 0; i < chartLabelsAll.length; i++) {
              if (this.allLabels.indexOf(chartLabelsAll[i]) == -1) {
                this.allLabels.push(chartLabelsAll[i]);
              }
            }
            //this.chartLabels2 = this.printLabel;
            if(this.colorscount  == 0){
              for (var i = 0; i < this.allLabels.length; i++) {
                this.allColors[this.allLabels[i]] = this.colors[i];
              }
            }

            for (var j = 0; j < chartLabelsAll.length; j++) {
              this.displayColor[j] = this.allColors[chartLabelsAll[j]];
            }

            var chartcolors = [];
            for (var i = 0; i < chartLabelsAll.length; i++) {
              chartcolors.push(this.allColors[chartLabelsAll[i]]);
            }
          }


          var dataOfChart = [];
          for (var i = 0; i < chartLabelsAll.length; i++) {
            //chartLabelsAll[i]
            //     var found = allpubdata.find(element => element.companys === chartLabelsAll[i]);
            var obj = $.grep(allregiondata, function (obj) {
              return obj.companys === chartLabelsAll[i];
            });

            var companys = chartLabelsAll[i];
            var datavals = [];
            for (var j = 0; j < obj.length; j++) {
              datavals.push({ region: obj[j].region, count: obj[j].count });
            }
            dataOfChart.push({ companys: companys, values: datavals });
          }
          // console.log(dataOfChart);
          var chartLabelsAll = [];
          for (var k = 0; k < dataOfChart.length; k++) {
            // console.log("company string: "+res[i]._id.companys);
            var datavalues: Array<any> = [];
            if (dataOfChart[k].companys == null) {
            } else if (dataOfChart[k].companys == "null") {
            } else if (dataOfChart[k].companys == "") {
            } else {
              for (var l = 0; l < dataOfChart[k].values.length; l++) {
                if (dataOfChart[0].values.length >= 10) {
                  if (k == 0) {
                    if (l < 10) {
                      chartLabelsAll.push(dataOfChart[k].values[l].region);
                      datavalues.push({
                        region: dataOfChart[k].values[l].region,
                        count: dataOfChart[k].values[l].count,
                      });
                    }
                  } else {
                    if (
                      chartLabelsAll.indexOf(dataOfChart[k].values[l].region) !=
                      -1
                    ) {
                      datavalues.push({
                        region: dataOfChart[k].values[l].region,
                        count: dataOfChart[k].values[l].count,
                      });
                    }
                  }
                } else {
                  // if (l < 10) {
                  //   chartLabelsAll.push(dataOfChart[k].values[l].pub);
                  //   datavalues.push({ 'pub': dataOfChart[k].values[l].pub, 'count': dataOfChart[k].values[l].count });
                  // }

                  if (k == 0) {
                    if (l < 10) {
                      chartLabelsAll.push(dataOfChart[k].values[l].region);
                      datavalues.push({
                        region: dataOfChart[k].values[l].region,
                        count: dataOfChart[k].values[l].count,
                      });
                    }
                  } else {
                    if (
                      chartLabelsAll.indexOf(dataOfChart[k].values[l].region) !=
                      -1
                    ) {
                      if (l < 10) {
                        datavalues.push({
                          region: dataOfChart[k].values[l].region,
                          count: dataOfChart[k].values[l].count,
                        });
                      }
                    }
                  }
                }
              }
            }
            var dataarray = [];
            for (var labels = 0; labels < chartLabelsAll.length; labels++) {
              var index = datavalues.findIndex(
                (x) => x.region === chartLabelsAll[labels]
              );
              if (
                datavalues[index] == undefined ||
                datavalues[index] == "undefined"
              ) {
                // dataarray.push({'pub': chartLabelsAll[labels], 'count': 0});
                dataarray.push("");
              } else {
                dataarray.push(datavalues[index].count);
              }
            }
            this.colorsAll.push({
              backgroundColor: [
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
              ],
              borderColor: [
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
              ],
              borderWidth: 0,
            });
            this.AVEChartDataAll.push({
              label: dataOfChart[k].companys,
              data: dataarray,
            });
          }
          this.chartLabelsAll = chartLabelsAll;
          // this.chartDataSetDefineAll = this.AVEChartDataAll;
          if (this.AVEChartDataAll.length == 0) {
            this.chartReady = false;
            this.chartReadyWeb = false;
            this.chartReadyTwitter = false;
            this.chartReadyAll = false;
            this.chartReadyAVE = false;
            this.chartReadyModal = false;
            $(".chart-dropdown").css("display", "none");
            this.spinnerService.hide();
            return false;
          }
          this.chartDatasetsAll = this.AVEChartDataAll;
          this.chartColorsAll = this.colorsAll;
          this.chartReady = false;
          this.chartReadyWeb = false;
          this.chartReadyTwitter = false;
          this.chartReadyAll = true;
          this.chartReadyAVE = false;
          this.chartReadyModal = false;
          $(".chart-dropdown").css("display", "");
          this.firstclickchart = "ByRegion";
          // //console.log(this.chartLabelsAll);
          // //console.log(this.AVEChartDataAll);
          this.spinnerService.hide();
        },
        (err) => {
          console.log(err);
        }
      );
    } else if (this.chartname == "By AVE - PRINT") {
      $(".calendarcontrol").css("display", "none");
      $(".typecategory").css("display", "none");
      $(".monthselect").css("display", "");

      $(".otherschartdiv").css("display", "none");
      $(".avechartdiv").css("display", "");
      $(".mainchartdiv").css("display", "none");
      $(".webchartdiv").css("display", "none");
      $(".twitterchartdiv").css("display", "none");

      $(".filtertype").css("visibility", "hidden");
      $(".listfilterType").css("display", "none");

      $(".mainchartdiv").removeClass("col-md-6");
      $(".mainchartdiv").addClass("col-md-9");

      $(".ChartCategory").removeClass("active");
      $("#byAVEPrint").addClass("active");
      this.selectedmonthAVE = 8;
      var date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth();
      var firstDay = new Date(y, m, 1);
      var lastDay = new Date(y, m + 1, 0);
      var d = new Date();
      var lastdate = new Date(d.setDate(d.getDate() - 365));
      // var fromdate = currentyear + "-12-31";
      var fromdate = formatDate(lastDay, "yyy-MM-dd", "en", "");
      var todate = formatDate(
        lastdate.getFullYear() + "-" + (lastdate.getMonth() + 2) + "-01",
        "yyy-MM-dd",
        "en",
        ""
      );
      // fromdate = "2020-01-31";
      // todate = "2019-02-01";
      var chartsData = {
        clientid: localStorage.getItem("storageselectedclient"),
        fromdate: fromdate,
        todate: todate,
        type: "PRINT",
      };
      //this.spinnerService.hide();
      this.spinnerService.show();
      this.article.AVEChartData(chartsData).subscribe(
        (res) => {
          //console.log(res);
          if (res.length == 0) {
            this.chartReady = false;
            this.chartReadyWeb = false;
            this.chartReadyTwitter = false;
            this.chartReadyAll = false;
            this.chartReadyAVE = false;
            this.chartReadyModal = false;
            $(".chart-dropdown").css("display", "none");
            this.spinnerService.hide();
            return false;
          }
          this.AVEChartDataAVE = [];
          this.chartDatasetsAVE = [];
          this.colorsAVE = [];
          this.chartDataSetDefineAVE = [];
          this.AVEChartDataAVE = [];
          this.colorsAVE = [];
          var OthersAVEData=[];
          var ExportToExcelChartDataAVE=[];

          this.chartDatasetsAVE = this.AVEChartDataAVE;

          this.chartLabelsAVE = [];
          this.ExportchartLabelsAVE = [];

          this.chartColorsAVE = this.colorsAVE;
          for (var i = 0; i < 12; i++) {
            if (lastdate.getMonth() + 1 + i >= 12) {
              this.chartLabelsAVE.push(
                this.arraymonth[lastdate.getMonth() + 1 + i - 11]
              );
              this.ExportchartLabelsAVE.push(
                this.arraymonth[lastdate.getMonth() + 1 + i - 11]
              );
            } else {
              this.chartLabelsAVE.push(
                this.arraymonth[lastdate.getMonth() + 2 + i]
              );
              this.ExportchartLabelsAVE.push(
                this.arraymonth[lastdate.getMonth() + 2 + i]
              );
            }
          }
          // this.chartLabelsAVE = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];

          this.chartOptionsAVE = {
            responsive: true,
            title: {
              display: true,
              text: "AVE (Rs. in Millions)",
              fontSize: 14,
              fontColor: "#000",
            },
            legend: {
              position: "bottom",
              labels: {
                // fontColor: '#fff'
              },
            },
            scales: {
              xAxes: [
                {
                  stacked: true,
                },
              ],
              yAxes: [
                {
                  stacked: true,
                },
              ],
            },
          };
          var colors: Array<any> = [
            "#ffa1b5",
            "#86c7f3",
            "#ffe29a",
            "#f1f2f4",
            "#93d9d9",
            "#c1d6e1",
            "#eaeaea",
            "#fa9092",
            "#90d9d7",
            "#fed29d",
            "#bfc5d0",
            "#9498a0",
            "#fe76be",
            "#72d595",
            "#99ca72",
            "#7cfff4",
            "#98bf76",
            "#a3f5af",
            "#e89fe6",
            "#dc7196",
            "#e1adca",
            "#8ea17d",
            "#b9fd6e",
            "#dcc4a3",
            "#e871e4",
            "#c5ae89",
          ];
          var chartLabelsAll = [];
          for (var i: number = 0; i < res.length; i++) {
            if (res[i]._id.companys == "") {
            } else if (res[i]._id.companys == "null") {
            } else if (res[i]._id.companys == null) {
            } else {
              if(chartLabelsAll.length < 10){
                if (chartLabelsAll.indexOf(res[i]._id.companys) == -1) {
                  chartLabelsAll.push(res[i]._id.companys)
                  if(this.allLabels.indexOf(res[i]._id.companys)==-1){
                    this.allLabels.push(res[i]._id.companys);
                  }
                }
              }
              else{
                if (chartLabelsAll.indexOf("others") == -1) {
                  chartLabelsAll.push("others");
                  if(this.allLabels.indexOf("others")==-1){
                    this.allLabels.push("others");
                  }
                }
              }
            }
          }
          
              
          // for(var l=0; l< chartLabelsAll.length; l++){
          for(var l=0; l< res.length; l++){
            // console.log(chartLabelsAll[l]);
            var datavalue = [];
            var exportdatavalue = [];
            var datavalueothers = [];
            var datavalueothersprevious = [];

            var startmonth = lastdate.getMonth() + 2;
            var monthdata = [];
            var PrintData = res[l].values;
            for (var i = 0; i < 12; i++) {
              if (startmonth + i > 12) {
                if (PrintData.findIndex((x) => x.month === startmonth + i - 12) != -1) {
                  monthdata.push({
                    month: startmonth + i - 12,
                    count: PrintData[PrintData.findIndex( (x) => x.month === startmonth + i - 12)].value,
                  });
                } else {
                  // monthdata.push({ month: startmonth + i - 12, count: 0 });
                  monthdata.push({ month: startmonth + i - 12, count: "" });
                }
              } else {
                if (PrintData.findIndex((x) => x.month === startmonth + i) != -1) {
                  monthdata.push({
                    month: startmonth + i,
                    count: PrintData[PrintData.findIndex((x) => x.month === startmonth + i)].value,
                  });
                } else {
                  // monthdata.push({ month: startmonth + i, count: 0 });
                  monthdata.push({ month: startmonth + i, count: "" });
                }
              }
            }
            // console.log(monthdata);
            if(l < 10){
              for (var i = 0; i < monthdata.length; i++) {
                if(monthdata[i].count == ""){
                  datavalue.push(monthdata[i].count);
                  exportdatavalue.push(monthdata[i].count);
                }
                else{
                  // datavalue.push(monthdata[i].count.toFixed(2));
                  datavalue.push(Math.round(monthdata[i].count));
                  exportdatavalue.push(monthdata[i].count.toFixed(2));
                }
              }
            }
            else{

              for (var i = 0; i < monthdata.length; i++) {
                if(monthdata[i].count == ""){
                  datavalue.push(monthdata[i].count);
                  datavalueothers.push(monthdata[i].count);
                  exportdatavalue.push(monthdata[i].count);
                }
                else{
                  // datavalue.push(monthdata[i].count.toFixed(2));
                  // datavalueothers.push(monthdata[i].count.toFixed(2));
                  datavalue.push(Math.round(monthdata[i].count));
                  datavalueothers.push(Math.round(monthdata[i].count));
                  exportdatavalue.push(monthdata[i].count.toFixed(2));
                }
              }
            }
            //   for(var k=0; k < res[l].values.length; k++){
            //     console.log(res[l].values[k].month);
            //     console.log(this.arraymonth);
            //     // if(this.arraymonth.indexOf(this.arraymonth[res[i].values[k].month]) != -1) {
            //     //   datavalue.push(res[i].values[k].value);
            //     // }
            //     // else{
            //     //   datavalue.push(0);
            //     // }

            // }

            // this.AVEChartDataAVE.push({
            //   label: res[l]._id.companys,
            //   data: datavalue,
            // });
            if(res.length > 10){
              if(l<10){
                this.AVEChartDataAVE.push({
                  label: chartLabelsAll[l],
                  data: datavalue,
                });
              }
              else{
                OthersAVEData.push({
                  label: "others",
                  data: datavalueothers,
                });
              }
            }
            else{
              this.AVEChartDataAVE.push({
                label: chartLabelsAll[l],
                data: datavalue,
              });
            }
            
            ExportToExcelChartDataAVE.push({
              label: res[l]._id.companys,
              data: exportdatavalue,
            });
          }
          var allvalues = OthersAVEData;
          var othercount0:any = 0;
          var othercount1:any = 0;
          var othercount2:any = 0;
          var othercount3:any = 0;
          var othercount4:any = 0;
          var othercount5:any = 0;
          var othercount6:any = 0;
          var othercount7:any = 0;
          var othercount8:any = 0;
          var othercount9:any = 0;
          var othercount10:any = 0;
          var othercount11:any = 0;
          var datavalueothersAVE=[];
          if(allvalues.length > 0){
            for(var i=0;i<allvalues.length;i++){
                if(allvalues[i].label == "others"){
                    for(var j=0;j<12;j++){
                      if(j==0){
                        if(allvalues[i].data[j] != ""){
                            othercount0 += parseFloat(allvalues[i].data[j]);
                        }
                      }
                      if(j==1){
                        if(allvalues[i].data[j] != ""){
                            othercount1 += parseFloat(allvalues[i].data[j]);
                        }
                      }
                      if(j==2){
                        if(allvalues[i].data[j] != ""){
                            othercount2 += parseFloat(allvalues[i].data[j]);
                        }
                      }
                      if(j==3){
                        if(allvalues[i].data[j] != ""){
                            othercount3 += parseFloat(allvalues[i].data[j]);
                        }
                      }
                      if(j==4){
                        if(allvalues[i].data[j] != ""){
                            othercount4 += parseFloat(allvalues[i].data[j]);
                        }
                      }
                      if(j==5){
                        if(allvalues[i].data[j] != ""){
                            othercount5 += parseFloat(allvalues[i].data[j]);
                        }
                      }
                      if(j==6){
                        if(allvalues[i].data[j] != ""){
                            othercount6 += parseFloat(allvalues[i].data[j]);
                        }
                      }
                      if(j==7){
                        if(allvalues[i].data[j] != ""){
                            othercount7 += parseFloat(allvalues[i].data[j]);
                        }
                      }
                      if(j==8){
                        if(allvalues[i].data[j] != ""){
                            othercount8 += parseFloat(allvalues[i].data[j]);
                        }
                      }
                      if(j==9){
                        if(allvalues[i].data[j] != ""){
                            othercount9 += parseFloat(allvalues[i].data[j]);
                        }
                      }
                      if(j==10){
                        if(allvalues[i].data[j] != ""){
                            othercount10 += parseFloat(allvalues[i].data[j]);
                        }
                      }
                      if(j==11){
                        if(allvalues[i].data[j] != ""){
                            othercount11 += parseFloat(allvalues[i].data[j]);
                        }
                      }
                    }
                }
            }
            if(othercount0 == 0){
              othercount0 = "";
            }
            else{
              // othercount0 = othercount0.toFixed(2);
              othercount0 = Math.round(othercount0);
            }
            if(othercount1 == 0){
              othercount1 = "";
            }
            else{
              // othercount1 = othercount1.toFixed(2);
              othercount1 = Math.round(othercount1);
            }
            if(othercount2 == 0){
              othercount2 = "";
            }
            else{
              // othercount2 = othercount2.toFixed(2);
              othercount2 = Math.round(othercount2);
            }
            if(othercount3 == 0){
              othercount3 = "";
            }
            else{
              // othercount3 = othercount3.toFixed(2);
              othercount3 = Math.round(othercount3);
            }
            if(othercount4 == 0){
              othercount4 = "";
            }
            else{
              // othercount4 = othercount4.toFixed(2);
              othercount4 = Math.round(othercount4);
            }
            if(othercount5 == 0){
              othercount5 = "";
            }
            else{
              // othercount5 = othercount5.toFixed(2);
              othercount5 = Math.round(othercount5);
            }
            if(othercount6 == 0){
              othercount6 = "";
            }
            else{
              // othercount6 = othercount6.toFixed(2);
              othercount6 = Math.round(othercount6);
            }
            if(othercount7 == 0){
              othercount7 = "";
            }
            else{
              // othercount7 = othercount7.toFixed(2);
              othercount7 = Math.round(othercount7);
            }
            if(othercount8 == 0){
              othercount8 = "";
            }
            else{
              // othercount8 = othercount8.toFixed(2);
              othercount8 = Math.round(othercount8);
            }
            if(othercount9 == 0){
              othercount9 = "";
            }
            else{
              // othercount9 = othercount9.toFixed(2);
              othercount9 = Math.round(othercount9);
            }
            if(othercount10 == 0){
              othercount10 = "";
            }
            else{
              // othercount10 = othercount10.toFixed(2);
              othercount10 = Math.round(othercount10);
            }
            if(othercount11 == 0){
              othercount11 = "";
            }
            else{
              // othercount11 = othercount11.toFixed(2);
              othercount11 = Math.round(othercount11);
            }
            datavalueothersAVE = [othercount0, othercount1, othercount2, othercount3, othercount4, othercount5, othercount6, othercount7, othercount8, othercount9, othercount10, othercount11];
            this.AVEChartDataAVE.push({
              label: "others",
              data: datavalueothersAVE,
            });
          }
          if (this.firstclickchart == "") {
            var color1 = "#F7464A";
            var color2 = "#ffa1b5";
            var color3 = "#86c7f3";
            var color4 = "#ffe29a";
            var color5 = "#f1f2f4";
            var color6 = "#93d9d9";
            var color7 = "#c1d6e1";
            var color8 = "#eaeaea";
            var color9 = "#fa9092";
            var color10 = "#90d9d7";
            var color11 = "#fed29d";
            var color12 = "#bfc5d0";
            var color13 = "#9498a0";
            var color14 = "#fe76be";
            var color15 = "#72d595";
            var color16 = "#99ca72";
            var color17 = "#7cfff4";
            var color18 = "#98bf76";
            var color19 = "#a3f5af";
            var color20 = "#e89fe6";
            var color21 = "#dc7196";
            var color22 = "#e1adca";
            var color23 = "#8ea17d";
            var color24 = "#b9fd6e";
            var color25 = "#dcc4a3";
            var color26 = "#e871e4";
            var color27 = "#c5ae89";

            this.colors = [
              color1,
              color2,
              color3,
              color4,
              color5,
              color6,
              color7,
              color8,
              color9,
              color10,
              color11,
              color12,
              color13,
              color14,
              color15,
              color16,
              color17,
              color18,
              color19,
              color20,
              color21,
              color22,
              color23,
              color24,
              color25,
              color26,
              color27,
            ];

            this.allLabels = [];
            //this.allColors = [];
            this.displayColor = [];
            for (var i = 0; i < chartLabelsAll.length; i++) {
              if (this.allLabels.indexOf(chartLabelsAll[i]) == -1) {
                this.allLabels.push(chartLabelsAll[i]);
              }
            }
            if(this.colorscount  == 0){
              for (var i = 0; i < this.allLabels.length; i++) {
                this.allColors[this.allLabels[i]] = this.colors[i];
              }
            }
            for (var j = 0; j < chartLabelsAll.length; j++) {
              this.displayColor[j] = this.allColors[chartLabelsAll[j]];
            }
            this.firstclickchart = "ByAVE";
          }
          else{
            
            for (var i = 0; i < chartLabelsAll.length; i++) {
              if (this.allLabels.indexOf(chartLabelsAll[i]) == -1) {
                this.allLabels.push(chartLabelsAll[i]);
              }
            }
            //this.chartLabels2 = this.printLabel;
            if(this.colorscount  == 0){
              for (var i = 0; i < this.allLabels.length; i++) {
                this.allColors[this.allLabels[i]] = this.colors[i];
              }
            }

            for (var j = 0; j < chartLabelsAll.length; j++) {
              this.displayColor[j] = this.allColors[chartLabelsAll[j]];
            }

            var chartcolors = [];
            for (var i = 0; i < chartLabelsAll.length; i++) {
              chartcolors.push(this.allColors[chartLabelsAll[i]]);
            }
          }
          for(var i=0;i<chartLabelsAll.length;i++){
            this.colorsAVE.push({
              backgroundColor: [
                this.displayColor[i],
                this.displayColor[i],
                this.displayColor[i],
                this.displayColor[i],
                this.displayColor[i],
                this.displayColor[i],
                this.displayColor[i],
                this.displayColor[i],
                this.displayColor[i],
                this.displayColor[i],
                this.displayColor[i],
                this.displayColor[i],
                this.displayColor[i],
              ],
              borderColor: [
                this.displayColor[i],
                this.displayColor[i],
                this.displayColor[i],
                this.displayColor[i],
                this.displayColor[i],
                this.displayColor[i],
                this.displayColor[i],
                this.displayColor[i],
                this.displayColor[i],
                this.displayColor[i],
                this.displayColor[i],
                this.displayColor[i],
                this.displayColor[i],
              ],
              borderWidth: 0,
            });
          }
          if (this.AVEChartDataAVE.length == 0) {
            this.chartReady = false;
            this.chartReadyWeb = false;
            this.chartReadyTwitter = false;
            this.chartReadyAll = false;
            this.chartReadyAVE = false;
            this.chartReadyModal = false;
            $(".chart-dropdown").css("display", "none");
            this.spinnerService.hide();
            return false;
          }
          this.chartDatasetsAVE = this.AVEChartDataAVE;
          this.ExportchartDatasetsAVE = ExportToExcelChartDataAVE;
          this.chartColorsAVE = this.colorsAVE;
          // console.log(this.chartDatasetsAll);
          // console.log(this.chartColorsAll);
          this.chartReady = false;
          this.chartReadyWeb = false;
          this.chartReadyTwitter = false;
          this.chartReadyAll = false;
          this.chartReadyAVE = true;
          this.chartReadyModal = false;
          $(".chart-dropdown").css("display", "");
          this.spinnerService.hide();
        },
        (err) => {
          console.log(err);
        }
      );

    } else if (this.chartname == "Top Ten Print Publications") {
      $(".calendarcontrol").css("display", "");
      $(".typecategory").css("display", "");
      $(".monthselect").css("display", "none");

      $(".otherschartdiv").css("display", "");
      $(".avechartdiv").css("display", "none");
      $(".mainchartdiv").css("display", "none");
      $(".webchartdiv").css("display", "none");
      $(".twitterchartdiv").css("display", "none");
      $(".listfilterType").css("display", "none");

      $(".filtertype").css("visibility", "visible");

      $(".mainchartdiv").removeClass("col-md-9");
      $(".mainchartdiv").addClass("col-md-6");

      $(".ChartCategory").removeClass("active");
      $("#toptenpub").addClass("active");
      var currentdate = new Date();
      var currentyear = currentdate.getFullYear();
      var fromdate = formatDate(
        this.articlepara.fromdate,
        "yyy-MM-dd",
        "en",
        ""
      );
      var todate = formatDate(this.articlepara.todate, "yyy-MM-dd", "en", "");

      this.spinnerService.show();
      var chartsData = {
        clientid: localStorage.getItem("storageselectedclient"),
        fromdate: fromdate,
        todate: todate,
        type: "PRINT",
      };
      // this.firstclickchart = "ToptenPublication";
      this.article.TopTenPubChartData(chartsData).subscribe(
        (res) => {
          if (res.length == 0) {
            this.chartReady = false;
            this.chartReadyWeb = false;
            this.chartReadyTwitter = false;
            this.chartReadyAll = false;
            this.chartReadyAVE = false;
            this.chartReadyModal = false;
            $(".chart-dropdown").css("display", "none");
            this.spinnerService.hide();
            return false;
          }
          this.AVEChartDataAll = [];
          this.chartDatasetsAll = [];

          this.chartLabelsAll = [];
          this.colorsAll = [];
          this.chartTypeAll = "horizontalBar";
          this.chartDataSetDefineAll = [];
          this.AVEChartDataAll = [];
          this.colorsAll = [];
          this.chartDatasetsAll = this.AVEChartDataAll;

          this.chartLabelsAll = [];

          this.chartColorsAll = this.colorsAll;

          this.chartOptionsAll = {
            responsive: true,
            legend: {
              position: "bottom",
              labels: {
                // fontColor: '#fff'
              },
            },
            scales: {
              xAxes: [
                {
                  stacked: true,
                },
              ],
              yAxes: [
                {
                  stacked: true,
                },
              ],
            },
          };
          var colors: Array<any> = [
            "#ffa1b5",
            "#86c7f3",
            "#ffe29a",
            "#f1f2f4",
            "#93d9d9",
            "#c1d6e1",
            "#eaeaea",
            "#fa9092",
            "#90d9d7",
            "#fed29d",
            "#bfc5d0",
            "#9498a0",
            "#fe76be",
            "#72d595",
            "#99ca72",
            "#7cfff4",
            "#98bf76",
            "#a3f5af",
            "#e89fe6",
            "#dc7196",
            "#e1adca",
            "#8ea17d",
            "#b9fd6e",
            "#dcc4a3",
            "#e871e4",
            "#c5ae89",
          ];

          var chartLabelsAll = [];
          var Labelschart = [];
          var Labelschart = [];
          var allpubdata = [];
          for (var i = 0; i < res.length; i++) {
            for (var j = 0; j < res[i].values.length; j++) {
              if (chartLabelsAll.indexOf(res[i].values[j].companys) == -1) {
                chartLabelsAll.push(res[i].values[j].companys);
              }
              if (res[i]._id.pub == undefined || res[i]._id.pub == "undefined") {
              } else {
                if (Labelschart.indexOf(res[i]._id.pub) == -1) {
                  Labelschart.push(res[i]._id.pub);
                }
              }
              allpubdata.push({
                pub: res[i]._id.pub,
                companys: res[i].values[j].companys,
                count: res[i].values[j].count,
              });
            }
          }
          // var allpubdata = [];
          // for(var i=0;i<res.length;i++){
          //   // allpubdata.push(res[i]._id.pub);
            
          //   allpubdata.push({
          //     pub: res[i]._id.pub,
          //     companys: res[i].values[j].companys,
          //     count: res[i].values[j].count,
          //   });
          // }
          for (var i = 0; i < res.length; i++) {
            var dataarr = [];
            for (var j = 0; j < res[i].values.length; j++) {
              if (chartLabelsAll.indexOf(res[i].values[j].companys) > -1) {
                //             if(companys == res[i].values[j].companys){
                dataarr.push({
                  pub: res[i]._id.pub,
                  companys: res[i].values[j].companys,
                  count: res[i].values[j].count,
                });
                // dataarray.push(res[i].values[j].count);
                //             }
              }
              else{
                dataarr.push({
                  pub: res[i]._id.pub,
                  companys: res[i].values[j].companys,
                  count: "",
                });
              }
            }

            // var dataOfChart = [];
            // for (var i = 0; i < chartLabelsAll.length; i++) {
            //   //chartLabelsAll[i]
            //   //     var found = allpubdata.find(element => element.companys === chartLabelsAll[i]);
            //   var obj = $.grep(allpubdata, function (obj) {
            //     return obj.companys === chartLabelsAll[i];
            //   });

            //   var companys = chartLabelsAll[i];
            //   var datavals = [];
            //   for (var j = 0; j < obj.length; j++) {
            //     datavals.push({ 'pub': obj[j].pub, 'count': obj[j].count });
            //   }
            //   dataOfChart.push({ 'companys': companys, 'values': datavals });
            // }
            // console.log(dataOfChart);
          }

          for (var i = 0; i < chartLabelsAll.length; i++) {
            if (this.allLabels.indexOf(chartLabelsAll[i]) == -1) {
              this.allLabels.push(chartLabelsAll[i]);
            }
          }
          if(this.colorscount  == 0){
            for (var i = 0; i < this.allLabels.length; i++) {
              this.allColors[this.allLabels[i]] = this.colors[i];
            }
          }
          for (var j = 0; j < chartLabelsAll.length; j++) {
            this.displayColor[j] = this.allColors[chartLabelsAll[j]];
          }

          var dataOfChart = [];
          for (var i = 0; i < chartLabelsAll.length; i++) {
            //chartLabelsAll[i]
            //     var found = allpubdata.find(element => element.companys === chartLabelsAll[i]);
            var obj = $.grep(allpubdata, function (obj) {
              return obj.companys === chartLabelsAll[i];
            });

            var companys = chartLabelsAll[i];
            var datavals = [];
            for (var j = 0; j < obj.length; j++) {
              datavals.push({ pub: obj[j].pub, count: obj[j].count });
            }
            dataOfChart.push({ companys: companys, values: datavals });
          }
          // console.log(dataOfChart);
          var chartLabelsAll = [];
          for(var i=0;i<res.length;i++){
            chartLabelsAll.push(res[i]._id.pub);
          }
          for (var k = 0; k < dataOfChart.length; k++) {
            // console.log("company string: "+res[i]._id.companys);
            var datavalues: Array<any> = [];
            if (dataOfChart[k].companys == null) {
            } else if (dataOfChart[k].companys == "null") {
            } else if (dataOfChart[k].companys == "") {
            } else {
              for (var l = 0; l < dataOfChart[k].values.length; l++) {
                // if (dataOfChart[0].values.length >= 10) {
                //   if (k == 0) {
                //     if (l < 10) {
                //       chartLabelsAll.push(dataOfChart[k].values[l].pub);
                //       datavalues.push({
                //         pub: dataOfChart[k].values[l].pub,
                //         count: dataOfChart[k].values[l].count,
                //       });
                //     }
                //   } else {
                //     if (
                //       chartLabelsAll.indexOf(dataOfChart[k].values[l].pub) != -1
                //     ) {
                //       datavalues.push({
                //         pub: dataOfChart[k].values[l].pub,
                //         count: dataOfChart[k].values[l].count,
                //       });
                //     }
                //     else{
                //       chartLabelsAll.push(dataOfChart[k].values[l].pub);
                //       datavalues.push({
                //         pub: dataOfChart[k].values[l].pub,
                //         count: dataOfChart[k].values[l].count,
                //       });
                //     }
                //   }
                // } else {
                  // if (l < 10) {
                  //   chartLabelsAll.push(dataOfChart[k].values[l].pub);
                  //   datavalues.push({ 'pub': dataOfChart[k].values[l].pub, 'count': dataOfChart[k].values[l].count });
                  // }

                  // if (k == 0) {
                  //   if (l < 10) {
                  //     chartLabelsAll.push(dataOfChart[k].values[l].pub);
                  //     datavalues.push({
                  //       pub: dataOfChart[k].values[l].pub,
                  //       count: dataOfChart[k].values[l].count,
                  //     });
                  //   }
                  // } else {
                    if (chartLabelsAll.indexOf(dataOfChart[k].values[l].pub) != -1) {
                      if (l < 10) {
                        datavalues.push({
                          pub: dataOfChart[k].values[l].pub,
                          count: dataOfChart[k].values[l].count,
                        });
                      }
                    }
                    else{
                      chartLabelsAll.push(dataOfChart[k].values[l].pub);
                      datavalues.push({
                        pub: dataOfChart[k].values[l].pub,
                        count: dataOfChart[k].values[l].count,
                      });
                    }
                  // }
                // }
              }
            }
            var dataarray = [];
            for (var labels = 0; labels < chartLabelsAll.length; labels++) {
              var index = datavalues.findIndex((x) => x.pub === chartLabelsAll[labels]);
              if (datavalues[index] == undefined || datavalues[index] == "undefined") {
                // dataarray.push({'pub': chartLabelsAll[labels], 'count': 0});
                dataarray.push("");
              } else {
                dataarray.push(datavalues[index].count);
              }
            }
            var allLabelsForChart = [];
            for(var n=0; n<dataOfChart.length; n++){
              allLabelsForChart.push(dataOfChart[n].companys);
            }
            if (this.firstclickchart == "") {
              var color1 = "#F7464A";
              var color2 = "#ffa1b5";
              var color3 = "#86c7f3";
              var color4 = "#ffe29a";
              var color5 = "#f1f2f4";
              var color6 = "#93d9d9";
              var color7 = "#c1d6e1";
              var color8 = "#eaeaea";
              var color9 = "#fa9092";
              var color10 = "#90d9d7";
              var color11 = "#fed29d";
              var color12 = "#bfc5d0";
              var color13 = "#9498a0";
              var color14 = "#fe76be";
              var color15 = "#72d595";
              var color16 = "#99ca72";
              var color17 = "#7cfff4";
              var color18 = "#98bf76";
              var color19 = "#a3f5af";
              var color20 = "#e89fe6";
              var color21 = "#dc7196";
              var color22 = "#e1adca";
              var color23 = "#8ea17d";
              var color24 = "#b9fd6e";
              var color25 = "#dcc4a3";
              var color26 = "#e871e4";
              var color27 = "#c5ae89";
  
              this.colors = [
                color1,
                color2,
                color3,
                color4,
                color5,
                color6,
                color7,
                color8,
                color9,
                color10,
                color11,
                color12,
                color13,
                color14,
                color15,
                color16,
                color17,
                color18,
                color19,
                color20,
                color21,
                color22,
                color23,
                color24,
                color25,
                color26,
                color27,
              ];
  
              this.allLabels = [];
              //this.allColors = [];
              this.displayColor = [];
              for (var i = 0; i < allLabelsForChart.length; i++) {
                if (this.allLabels.indexOf(allLabelsForChart[i]) == -1) {
                  this.allLabels.push(allLabelsForChart[i]);
                }
              }
              if(this.colorscount  == 0){
                for (var i = 0; i < this.allLabels.length; i++) {
                  this.allColors[this.allLabels[i]] = this.colors[i];
                }
              }
              for (var j = 0; j < allLabelsForChart.length; j++) {
                this.displayColor[j] = this.allColors[allLabelsForChart[j]];
              }
              this.firstclickchart = "ToptenPublication";
            }
            else{
              for (var i = 0; i < allLabelsForChart.length; i++) {
                if (this.allLabels.indexOf(allLabelsForChart[i]) == -1) {
                  this.allLabels.push(allLabelsForChart[i]);
                }
              }

              if(this.colorscount  == 0){
                for (var i = 0; i < this.allLabels.length; i++) {
                  this.allColors[this.allLabels[i]] = this.colors[i];
                }
              }
              
              for (var j = 0; j < allLabelsForChart.length; j++) {
                this.displayColor[j] = this.allColors[allLabelsForChart[j]];
              }
              
              var chartcolors = [];
              for (var i = 0; i < allLabelsForChart.length; i++) {
                chartcolors.push(this.allColors[allLabelsForChart[i]]);
              }
            }
            this.colorsAll.push({
              backgroundColor: [
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
              ],
              borderColor: [
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
              ],
              borderWidth: 0,
            });
            this.AVEChartDataAll.push({
              label: dataOfChart[k].companys,
              data: dataarray,
            });
          }
          this.chartLabelsAll = chartLabelsAll;

          this.chartDatasetsAll = this.AVEChartDataAll;
          if (this.AVEChartDataAll.length == 0) {
            this.chartReady = false;
            this.chartReadyWeb = false;
            this.chartReadyTwitter = false;
            this.chartReadyAll = false;
            this.chartReadyAVE = false;
            this.chartReadyModal = false;
            $(".chart-dropdown").css("display", "none");
            this.spinnerService.hide();
            return false;
          }
          this.chartColorsAll = this.colorsAll;
          this.chartReady = false;
          this.chartReadyWeb = false;
          this.chartReadyTwitter = false;
          this.chartReadyAll = true;
          this.chartReadyAVE = false;
          this.chartReadyModal = false;
          $(".chart-dropdown").css("display", "");
          //console.log(this.chartLabels);
          //console.log(this.AVEChartData);
          this.spinnerService.hide();
        },
        (err) => {
          console.log(err);
        }
      );
    } else if (this.chartname == "Top Ten Print Journalists") {
      $(".calendarcontrol").css("display", "");
      $(".typecategory").css("display", "");
      $(".monthselect").css("display", "none");

      $(".otherschartdiv").css("display", "");
      $(".avechartdiv").css("display", "none");
      $(".mainchartdiv").css("display", "none");
      $(".webchartdiv").css("display", "none");
      $(".twitterchartdiv").css("display", "none");
      $(".listfilterType").css("display", "none");

      $(".filtertype").css("visibility", "visible");

      $(".mainchartdiv").removeClass("col-md-9");
      $(".mainchartdiv").addClass("col-md-6");

      $(".ChartCategory").removeClass("active");
      $("#toptenjour").addClass("active");
      var currentdate = new Date();
      var currentyear = currentdate.getFullYear();
      var fromdate = formatDate(
        this.articlepara.fromdate,
        "yyy-MM-dd",
        "en",
        ""
      );
      var todate = formatDate(this.articlepara.todate, "yyy-MM-dd", "en", "");
      var chartsData = {
        clientid: localStorage.getItem("storageselectedclient"),
        fromdate: fromdate,
        todate: todate,
        type: "PRINT",
      };
      this.chartLabelsAll = [];
      this.chartColorsAll = [];

      //this.spinnerService.hide();
      this.spinnerService.show();
      this.article.TopTenJournalistChartData(chartsData).subscribe(
        (res) => {
          if (res.length == 0) {
            this.chartReady = false;
            this.chartReadyWeb = false;
            this.chartReadyTwitter = false;
            this.chartReadyAll = false;
            this.chartReadyAVE = false;
            this.chartReadyModal = false;
            $(".chart-dropdown").css("display", "none");
            this.spinnerService.hide();
            return false;
          }
          this.AVEChartDataAll = [];
          this.chartDatasetsAll = [];

          this.chartLabelsAll = [];
          this.colorsAll = [];
          this.chartTypeAll = "horizontalBar";
          this.chartDataSetDefineAll = [];
          this.AVEChartDataAll = [];
          this.colorsAll = [];
          this.chartDatasetsAll = this.AVEChartDataAll;

          this.chartLabelsAll = [];

          this.chartColorsAll = this.colorsAll;

          this.chartOptionsAll = {
            responsive: true,
            legend: {
              position: "bottom",
              labels: {
                // fontColor: '#fff'
              },
            },
            scales: {
              xAxes: [
                {
                  stacked: true,
                },
              ],
              yAxes: [
                {
                  stacked: true,
                },
              ],
            },
          };
          var colors: Array<any> = [
            "#ffa1b5",
            "#86c7f3",
            "#ffe29a",
            "#f1f2f4",
            "#93d9d9",
            "#c1d6e1",
            "#eaeaea",
            "#fa9092",
            "#90d9d7",
            "#fed29d",
            "#bfc5d0",
            "#9498a0",
            "#fe76be",
            "#72d595",
            "#99ca72",
            "#7cfff4",
            "#98bf76",
            "#a3f5af",
            "#e89fe6",
            "#dc7196",
            "#e1adca",
            "#8ea17d",
            "#b9fd6e",
            "#dcc4a3",
            "#e871e4",
            "#c5ae89",
          ];

          var chartLabelsAll = [];
          var Labelschart = [];
          var allpubdata = [];
          // for(var i=0;i<res.length;i++){
          //   if (res[i]._id.jour == undefined || res[i]._id.jour == "undefined" || res[i]._id.jour == null || res[i]._id.jour == "null") {
          //   }
          //   else{
          //     Labelschart.push(res[i]._id.jour);
          //   }
          // }
          for (var i = 0; i < res.length; i++) {
            for (var j = 0; j < res[i].values.length; j++) {
              if (chartLabelsAll.indexOf(res[i].values[j].companys) == -1) {
                if(res[i].values[j].companys == "null") {

                }
                else{
                  chartLabelsAll.push(res[i].values[j].companys);
                }
              }
              if (res[i]._id.jour == undefined || res[i]._id.jour == "undefined") {
              } else {
                if (Labelschart.indexOf(res[i]._id.jour) == -1) {
                  Labelschart.push(res[i]._id.jour);
                }
              }
              allpubdata.push({
                jour: res[i]._id.jour,
                companys: res[i].values[j].companys,
                count: res[i].values[j].count,
              });
            }
          }
          for (var i = 0; i < res.length; i++) {
            var dataarr = [];
            for (var j = 0; j < res[i].values.length; j++) {
              if (chartLabelsAll.indexOf(res[i].values[j].companys) > -1) {
                //             if(companys == res[i].values[j].companys){
                dataarr.push({
                  jour: res[i]._id.jour,
                  companys: res[i].values[j].companys,
                  count: res[i].values[j].count,
                });
                // dataarray.push(res[i].values[j].count);
                //             }
              }
            }
          }
          var dataOfChart = [];
          for (var i = 0; i < chartLabelsAll.length; i++) {
            //chartLabelsAll[i]
            //     var found = allpubdata.find(element => element.companys === chartLabelsAll[i]);
            var obj = $.grep(allpubdata, function (obj) {
              return obj.companys === chartLabelsAll[i];
            });

            var companys = chartLabelsAll[i];
            var datavals = [];
            for (var j = 0; j < obj.length; j++) {
              datavals.push({ jour: obj[j].jour, count: obj[j].count });
            }
            dataOfChart.push({ companys: companys, values: datavals });
          }
          // console.log(dataOfChart);
          var chartLabelsAll = [];
          for(var i=0;i<res.length;i++){
            chartLabelsAll.push(res[i]._id.jour);
          }
          for (var k = 0; k < dataOfChart.length; k++) {
            // console.log("company string: "+res[i]._id.companys);
            var datavalues: Array<any> = [];
            if (dataOfChart[k].companys == null) {
            } else if (dataOfChart[k].companys == "null") {
            } else if (dataOfChart[k].companys == "") {
            } else {
              for (var l = 0; l < dataOfChart[k].values.length; l++) {
                // if (dataOfChart[0].values.length >= 10) {
                //   if (k == 0) {
                //     if (l < 10) {
                //       chartLabelsAll.push(dataOfChart[k].values[l].jour);
                //       datavalues.push({
                //         jour: dataOfChart[k].values[l].jour,
                //         count: dataOfChart[k].values[l].count,
                //       });
                //     }
                //   } else {
                //     if (
                //       chartLabelsAll.indexOf(dataOfChart[k].values[l].jour) !=
                //       -1
                //     ) {
                //       datavalues.push({
                //         jour: dataOfChart[k].values[l].jour,
                //         count: dataOfChart[k].values[l].count,
                //       });
                //     }
                //   }
                // } else {
                  // if (k == 0) {
                  //   if (l < 10) {
                  //     chartLabelsAll.push(dataOfChart[k].values[l].jour);
                  //     datavalues.push({
                  //       jour: dataOfChart[k].values[l].jour,
                  //       count: dataOfChart[k].values[l].count,
                  //     });
                  //   }
                  // } else {
                    if (chartLabelsAll.indexOf(dataOfChart[k].values[l].jour) != -1) {
                      datavalues.push({
                        jour: dataOfChart[k].values[l].jour,
                        count: dataOfChart[k].values[l].count,
                      });
                    } else {
                      chartLabelsAll.push(dataOfChart[k].values[l].jour);
                      datavalues.push({
                        jour: dataOfChart[k].values[l].jour,
                        count: dataOfChart[k].values[l].count,
                      });
                    }
                  // }
                // }
              }
            }
            // console.log(dataOfChart[k].companys);
            // console.log(datavalues);
            var dataarray = [];
            for (var labels = 0; labels < chartLabelsAll.length; labels++) {
              var index = datavalues.findIndex(
                (x) => x.jour === chartLabelsAll[labels]
              );
              if (
                datavalues[index] == undefined ||
                datavalues[index] == "undefined"
              ) {
                // dataarray.push({'pub': chartLabelsAll[labels], 'count': 0});
                dataarray.push("");
              } else {
                dataarray.push(datavalues[index].count);
              }
            }
           
            var allLabelsForChart = [];
            for(var n=0; n<dataOfChart.length; n++){
                // console.log(dataOfChart[n].companys);
                allLabelsForChart.push(dataOfChart[n].companys);
            }
            if (this.firstclickchart == "") {
              var color1 = "#F7464A";
              var color2 = "#ffa1b5";
              var color3 = "#86c7f3";
              var color4 = "#ffe29a";
              var color5 = "#f1f2f4";
              var color6 = "#93d9d9";
              var color7 = "#c1d6e1";
              var color8 = "#eaeaea";
              var color9 = "#fa9092";
              var color10 = "#90d9d7";
              var color11 = "#fed29d";
              var color12 = "#bfc5d0";
              var color13 = "#9498a0";
              var color14 = "#fe76be";
              var color15 = "#72d595";
              var color16 = "#99ca72";
              var color17 = "#7cfff4";
              var color18 = "#98bf76";
              var color19 = "#a3f5af";
              var color20 = "#e89fe6";
              var color21 = "#dc7196";
              var color22 = "#e1adca";
              var color23 = "#8ea17d";
              var color24 = "#b9fd6e";
              var color25 = "#dcc4a3";
              var color26 = "#e871e4";
              var color27 = "#c5ae89";
  
              this.colors = [
                color1,
                color2,
                color3,
                color4,
                color5,
                color6,
                color7,
                color8,
                color9,
                color10,
                color11,
                color12,
                color13,
                color14,
                color15,
                color16,
                color17,
                color18,
                color19,
                color20,
                color21,
                color22,
                color23,
                color24,
                color25,
                color26,
                color27,
              ];
  
              this.allLabels = [];
              //this.allColors = [];
              this.displayColor = [];
              for (var i = 0; i < allLabelsForChart.length; i++) {
                if (this.allLabels.indexOf(allLabelsForChart[i]) == -1) {
                  this.allLabels.push(allLabelsForChart[i]);
                }
              }
              if(this.colorscount  == 0){
                  for (var i = 0; i < this.allLabels.length; i++) {
                    this.allColors[this.allLabels[i]] = this.colors[i];
                }
              }
              for (var j = 0; j < allLabelsForChart.length; j++) {
                this.displayColor[j] = this.allColors[allLabelsForChart[j]];
              }
              this.firstclickchart = "ToptenJournalist";
            }
            else{
              
              for (var i = 0; i < allLabelsForChart.length; i++) {
                if (this.allLabels.indexOf(allLabelsForChart[i]) == -1) {
                  this.allLabels.push(allLabelsForChart[i]);
                }
              }
              //this.chartLabels2 = this.printLabel;
              if(this.colorscount  == 0){
                for (var i = 0; i < this.allLabels.length; i++) {
                  this.allColors[this.allLabels[i]] = this.colors[i];
                }
              }
  
              for (var j = 0; j < allLabelsForChart.length; j++) {
                this.displayColor[j] = this.allColors[allLabelsForChart[j]];
              }
  
              var chartcolors = [];
              for (var i = 0; i < allLabelsForChart.length; i++) {
                chartcolors.push(this.allColors[allLabelsForChart[i]]);
              }
            } 
            this.colorsAll.push({
              backgroundColor: [
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
              ],
              borderColor: [
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
              ],
              borderWidth: 0,
            });
            this.AVEChartDataAll.push({
              label: dataOfChart[k].companys,
              data: dataarray,
            });
          }
          this.chartLabelsAll = chartLabelsAll;

          this.chartDatasetsAll = this.AVEChartDataAll;

          this.chartColorsAll = this.colorsAll;
          this.chartReady = false;
          this.chartReadyWeb = false;
          this.chartReadyTwitter = false;
          this.chartReadyAll = true;
          this.chartReadyAVE = false;
          this.chartReadyModal = false;
          $(".chart-dropdown").css("display", "");
          //console.log(this.chartLabels);
          //console.log(this.AVEChartData);
          this.spinnerService.hide();
        },
        (err) => {
          console.log(err);
        }
      );
    } else if (this.chartname == "Top Ten Online Sources") {
      $(".calendarcontrol").css("display", "");
      $(".typecategory").css("display", "");
      $(".monthselect").css("display", "none");

      $(".otherschartdiv").css("display", "");
      $(".avechartdiv").css("display", "none");
      $(".mainchartdiv").css("display", "none");
      $(".webchartdiv").css("display", "none");
      $(".twitterchartdiv").css("display", "none");
      $(".listfilterType").css("display", "none");

      $(".filtertype").css("visibility", "visible");

      $(".mainchartdiv").removeClass("col-md-9");
      $(".mainchartdiv").addClass("col-md-6");

      $(".ChartCategory").removeClass("active");
      $("#toptenonlinepub").addClass("active");
      var currentdate = new Date();
      var currentyear = currentdate.getFullYear();
      var fromdate = formatDate(
        this.articlepara.fromdate,
        "yyy-MM-dd",
        "en",
        ""
      );
      var todate = formatDate(this.articlepara.todate, "yyy-MM-dd", "en", "");
      this.chartLabelsAll = [];
      this.colorsAll = [];
      //this.spinnerService.hide();
      this.spinnerService.show();
      var chartsData = {
        clientid: localStorage.getItem("storageselectedclient"),
        fromdate: fromdate,
        todate: todate,
        type: "WEB",
      };
      
      this.article.TopTenPubChartData(chartsData).subscribe(
        (res) => {
          if (res.length == 0) {
            this.chartReady = false;
            this.chartReadyWeb = false;
            this.chartReadyTwitter = false;
            this.chartReadyAll = false;
            this.chartReadyAVE = false;
            this.chartReadyModal = false;
            $(".chart-dropdown").css("display", "none");
            this.spinnerService.hide();
            return false;
          }
          this.AVEChartDataAll = [];
          this.chartDatasetsAll = [];

          this.chartLabelsAll = [];
          this.colorsAll = [];
          this.chartTypeAll = "horizontalBar";
          this.chartDataSetDefineAll = [];
          this.AVEChartDataAll = [];
          this.colorsAll = [];
          this.chartDatasetsAll = this.AVEChartDataAll;

          this.chartLabelsAll = [];

          this.chartColorsAll = this.colorsAll;

          this.chartOptionsAll = {
            responsive: true,
            legend: {
              position: "bottom",
              labels: {
                // fontColor: '#fff'
              },
            },
            scales: {
              xAxes: [
                {
                  stacked: true,
                },
              ],
              yAxes: [
                {
                  stacked: true,
                },
              ],
            },
          };
          var colors: Array<any> = [
            "#ffa1b5",
            "#86c7f3",
            "#ffe29a",
            "#f1f2f4",
            "#93d9d9",
            "#c1d6e1",
            "#eaeaea",
            "#fa9092",
            "#90d9d7",
            "#fed29d",
            "#bfc5d0",
            "#9498a0",
            "#fe76be",
            "#72d595",
            "#99ca72",
            "#7cfff4",
            "#98bf76",
            "#a3f5af",
            "#e89fe6",
            "#dc7196",
            "#e1adca",
            "#8ea17d",
            "#b9fd6e",
            "#dcc4a3",
            "#e871e4",
            "#c5ae89",
          ];

          var chartLabelsAll = [];
          var Labelschart = [];
          var Labelschart = [];
          var allpubdata = [];
          for (var i = 0; i < res.length; i++) {
            for (var j = 0; j < res[i].values.length; j++) {
              if (chartLabelsAll.indexOf(res[i].values[j].companys) == -1) {
                chartLabelsAll.push(res[i].values[j].companys);
              }
              if (
                res[i]._id.pub == undefined ||
                res[i]._id.pub == "undefined"
              ) {
              } else {
                if (Labelschart.indexOf(res[i]._id.pub) == -1) {
                  Labelschart.push(res[i]._id.pub);
                }
              }
              allpubdata.push({
                pub: res[i]._id.pub,
                companys: res[i].values[j].companys,
                count: res[i].values[j].count,
              });
            }
          }
          for (var i = 0; i < res.length; i++) {
            var dataarr = [];
            for (var j = 0; j < res[i].values.length; j++) {
              if (chartLabelsAll.indexOf(res[i].values[j].companys) > -1) {
                //             if(companys == res[i].values[j].companys){
                dataarr.push({
                  pub: res[i]._id.pub,
                  companys: res[i].values[j].companys,
                  count: res[i].values[j].count,
                });
                // dataarray.push(res[i].values[j].count);
                //             }
              }
            }

            // var dataOfChart = [];
            // for (var i = 0; i < chartLabelsAll.length; i++) {
            //   //chartLabelsAll[i]
            //   //     var found = allpubdata.find(element => element.companys === chartLabelsAll[i]);
            //   var obj = $.grep(allpubdata, function (obj) {
            //     return obj.companys === chartLabelsAll[i];
            //   });

            //   var companys = chartLabelsAll[i];
            //   var datavals = [];
            //   for (var j = 0; j < obj.length; j++) {
            //     datavals.push({ 'pub': obj[j].pub, 'count': obj[j].count });
            //   }
            //   dataOfChart.push({ 'companys': companys, 'values': datavals });
            // }
            // console.log(dataOfChart);
          }
          var dataOfChart = [];
          for (var i = 0; i < chartLabelsAll.length; i++) {
            //chartLabelsAll[i]
            //     var found = allpubdata.find(element => element.companys === chartLabelsAll[i]);
            var obj = $.grep(allpubdata, function (obj) {
              return obj.companys === chartLabelsAll[i];
            });

            var companys = chartLabelsAll[i];
            var datavals = [];
            for (var j = 0; j < obj.length; j++) {
              datavals.push({ pub: obj[j].pub, count: obj[j].count });
            }
            dataOfChart.push({ companys: companys, values: datavals });
          }
          // console.log(dataOfChart);
          var chartLabelsAll = [];
          for(var i=0;i<res.length;i++){
            chartLabelsAll.push(res[i]._id.pub);
          }
          for (var k = 0; k < dataOfChart.length; k++) {
            // console.log("company string: "+res[i]._id.companys);
            var datavalues: Array<any> = [];
            if (dataOfChart[k].companys == null) {
            } else if (dataOfChart[k].companys == "null") {
            } else if (dataOfChart[k].companys == "") {
            } else {
              for (var l = 0; l < dataOfChart[k].values.length; l++) {
                // if (dataOfChart[0].values.length >= 10) {
                //   if (k == 0) {
                //     if (l < 10) {
                //       chartLabelsAll.push(dataOfChart[k].values[l].pub);
                //       datavalues.push({
                //         pub: dataOfChart[k].values[l].pub,
                //         count: dataOfChart[k].values[l].count,
                //       });
                //     }
                //   } else {
                //     if (
                //       chartLabelsAll.indexOf(dataOfChart[k].values[l].pub) != -1
                //     ) {
                //       datavalues.push({
                //         pub: dataOfChart[k].values[l].pub,
                //         count: dataOfChart[k].values[l].count,
                //       });
                //     }
                //   }
                // } else {
                  // if (l < 10) {
                  //   chartLabelsAll.push(dataOfChart[k].values[l].pub);
                  //   datavalues.push({ 'pub': dataOfChart[k].values[l].pub, 'count': dataOfChart[k].values[l].count });
                  // }

                  // if (k == 0) {
                  //   if (l < 10) {
                  //     chartLabelsAll.push(dataOfChart[k].values[l].pub);
                  //     datavalues.push({
                  //       pub: dataOfChart[k].values[l].pub,
                  //       count: dataOfChart[k].values[l].count,
                  //     });
                  //   }
                  // } else {
                    if (chartLabelsAll.indexOf(dataOfChart[k].values[l].pub) != -1) {
                      if (l < 10) {
                        datavalues.push({
                          pub: dataOfChart[k].values[l].pub,
                          count: dataOfChart[k].values[l].count,
                        });
                      }
                    }
                  // }
                // }
              }
            }
            var dataarray = [];
            for (var labels = 0; labels < chartLabelsAll.length; labels++) {
              var index = datavalues.findIndex(
                (x) => x.pub === chartLabelsAll[labels]
              );
              if (
                datavalues[index] == undefined ||
                datavalues[index] == "undefined"
              ) {
                // dataarray.push({'pub': chartLabelsAll[labels], 'count': 0});
                dataarray.push("");
              } else {
                dataarray.push(datavalues[index].count);
              }
            }
            var allLabelsForChart = [];
            for(var n=0; n<dataOfChart.length; n++){
                // console.log(dataOfChart[n].companys);
                allLabelsForChart.push(dataOfChart[n].companys);
            }
            if (this.firstclickchart == "") {
              var color1 = "#F7464A";
              var color2 = "#ffa1b5";
              var color3 = "#86c7f3";
              var color4 = "#ffe29a";
              var color5 = "#f1f2f4";
              var color6 = "#93d9d9";
              var color7 = "#c1d6e1";
              var color8 = "#eaeaea";
              var color9 = "#fa9092";
              var color10 = "#90d9d7";
              var color11 = "#fed29d";
              var color12 = "#bfc5d0";
              var color13 = "#9498a0";
              var color14 = "#fe76be";
              var color15 = "#72d595";
              var color16 = "#99ca72";
              var color17 = "#7cfff4";
              var color18 = "#98bf76";
              var color19 = "#a3f5af";
              var color20 = "#e89fe6";
              var color21 = "#dc7196";
              var color22 = "#e1adca";
              var color23 = "#8ea17d";
              var color24 = "#b9fd6e";
              var color25 = "#dcc4a3";
              var color26 = "#e871e4";
              var color27 = "#c5ae89";
  
              this.colors = [
                color1,
                color2,
                color3,
                color4,
                color5,
                color6,
                color7,
                color8,
                color9,
                color10,
                color11,
                color12,
                color13,
                color14,
                color15,
                color16,
                color17,
                color18,
                color19,
                color20,
                color21,
                color22,
                color23,
                color24,
                color25,
                color26,
                color27,
              ];
  
              this.allLabels = [];
              //this.allColors = [];
              this.displayColor = [];
              for (var i = 0; i < allLabelsForChart.length; i++) {
                if (this.allLabels.indexOf(allLabelsForChart[i]) == -1) {
                  this.allLabels.push(allLabelsForChart[i]);
                }
              }
              if(this.colorscount  == 0){
                for (var i = 0; i < this.allLabels.length; i++) {
                  this.allColors[this.allLabels[i]] = this.colors[i];
                }
              }
              for (var j = 0; j < allLabelsForChart.length; j++) {
                this.displayColor[j] = this.allColors[allLabelsForChart[j]];
              }
              this.firstclickchart = "Toptenonlinesources";
            }
            else{
              
              for (var i = 0; i < allLabelsForChart.length; i++) {
                if (this.allLabels.indexOf(allLabelsForChart[i]) == -1) {
                  this.allLabels.push(allLabelsForChart[i]);
                }
              }
              //this.chartLabels2 = this.printLabel;
              if(this.colorscount  == 0){
                for (var i = 0; i < this.allLabels.length; i++) {
                  this.allColors[this.allLabels[i]] = this.colors[i];
                }
              }
  
              for (var j = 0; j < allLabelsForChart.length; j++) {
                this.displayColor[j] = this.allColors[allLabelsForChart[j]];
              }
  
              var chartcolors = [];
              for (var i = 0; i < allLabelsForChart.length; i++) {
                chartcolors.push(this.allColors[allLabelsForChart[i]]);
              }
            }
            this.colorsAll.push({
              backgroundColor: [
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
              ],
              borderColor: [
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
                this.displayColor[k],
              ],
              borderWidth: 0,
            });
            this.AVEChartDataAll.push({
              label: dataOfChart[k].companys,
              data: dataarray,
            });
          }

          this.chartLabelsAll = chartLabelsAll;

          this.chartDatasetsAll = this.AVEChartDataAll;

          if (this.AVEChartDataAll.length == 0) {
            this.chartReady = false;
            this.chartReadyWeb = false;
            this.chartReadyTwitter = false;
            this.chartReadyAll = false;
            this.chartReadyAVE = false;
            this.chartReadyModal = false;
            $(".chart-dropdown").css("display", "none");
            this.spinnerService.hide();
            return false;
          }
          this.chartColorsAll = this.colorsAll;
          this.chartReady = false;
          this.chartReadyWeb = false;
          this.chartReadyTwitter = false;
          this.chartReadyAll = true;
          this.chartReadyAVE = false;
          this.chartReadyModal = false;
          $(".chart-dropdown").css("display", "");
          //console.log(this.chartLabels);
          //console.log(this.AVEChartData);
          this.spinnerService.hide();
        },
        (err) => {
          console.log(err);
        }
      );
    } else if (this.chartname == "Top Ten Twitter") {
      $(".calendarcontrol").css("display", "");
      $(".typecategory").css("display", "");
      $(".monthselect").css("display", "none");

      $(".otherschartdiv").css("display", "");
      $(".avechartdiv").css("display", "none");
      $(".mainchartdiv").css("display", "none");
      $(".webchartdiv").css("display", "none");
      $(".twitterchartdiv").css("display", "none");
      $(".listfilterType").css("display", "none");

      $(".filtertype").css("visibility", "visible");

      $(".mainchartdiv").removeClass("col-md-9");
      $(".mainchartdiv").addClass("col-md-6");

      $(".ChartCategory").removeClass("active");
      $("#toptentwitterpub").addClass("active");
      var currentdate = new Date();
      var currentyear = currentdate.getFullYear();
      var fromdate = formatDate(
        this.articlepara.fromdate,
        "yyy-MM-dd",
        "en",
        ""
      );
      var todate = formatDate(this.articlepara.todate, "yyy-MM-dd", "en", "");
      this.chartLabelsAll = [];
      this.colorsAll = [];
      //this.spinnerService.hide();
      this.spinnerService.show();
      var chartsData = {
        clientid: localStorage.getItem("storageselectedclient"),
        fromdate: fromdate,
        todate: todate,
        type: "TWITTER",
      };
      
      this.article.TopTenPubChartData(chartsData).subscribe((res) => {
        if (res.length == 0) {
          this.chartReady = false;
          this.chartReadyWeb = false;
          this.chartReadyTwitter = false;
          this.chartReadyAll = false;
          this.chartReadyAVE = false;
          this.chartReadyModal = false;
          $(".chart-dropdown").css("display", "none");
          this.spinnerService.hide();
          return false;
        }
        // //console.log(res);
        this.chartDatasetsAll = [];

        this.AVEChartDataAll = [];
        this.chartLabelsAll = [];
        this.colorsAll = [];
        this.chartTypeAll = "horizontalBar";
        this.chartDataSetDefineAll = [];
        this.colorsAll = [];
        this.chartDatasetsAll = this.AVEChartDataAll;

        this.chartLabelsAll = [];

        this.chartColorsAll = this.colorsAll;

        this.chartOptionsAll = {
          responsive: true,
          legend: {
            position: "bottom",
            labels: {
              // fontColor: '#fff'
            },
          },
          scales: {
            xAxes: [
              {
                stacked: true,
              },
            ],
            yAxes: [
              {
                stacked: true,
              },
            ],
          },
        };
        var colors: Array<any> = [
          "#ffa1b5",
          "#86c7f3",
          "#ffe29a",
          "#f1f2f4",
          "#93d9d9",
          "#c1d6e1",
          "#eaeaea",
          "#fa9092",
          "#90d9d7",
          "#fed29d",
          "#bfc5d0",
          "#9498a0",
          "#fe76be",
          "#72d595",
          "#99ca72",
          "#7cfff4",
          "#98bf76",
          "#a3f5af",
          "#e89fe6",
          "#dc7196",
          "#e1adca",
          "#8ea17d",
          "#b9fd6e",
          "#dcc4a3",
          "#e871e4",
          "#c5ae89",
        ];

        var chartLabelsAll = [];
        var Labelschart = [];
        var Labelschart = [];
        var allpubdata = [];
        for (var i = 0; i < res.length; i++) {
          for (var j = 0; j < res[i].values.length; j++) {
            if (chartLabelsAll.indexOf(res[i].values[j].companys) == -1) {
              chartLabelsAll.push(res[i].values[j].companys);
            }
            if (res[i]._id.pub == undefined || res[i]._id.pub == "undefined") {
            } else {
              if (Labelschart.indexOf(res[i]._id.pub) == -1) {
                Labelschart.push(res[i]._id.pub);
              }
            }
            allpubdata.push({
              pub: res[i]._id.pub,
              companys: res[i].values[j].companys,
              count: res[i].values[j].count,
            });
          }
        }
        for (var i = 0; i < res.length; i++) {
          var dataarr = [];
          for (var j = 0; j < res[i].values.length; j++) {
            if (chartLabelsAll.indexOf(res[i].values[j].companys) > -1) {
              //             if(companys == res[i].values[j].companys){
              dataarr.push({
                pub: res[i]._id.pub,
                companys: res[i].values[j].companys,
                count: res[i].values[j].count,
              });
              // dataarray.push(res[i].values[j].count);
              //             }
            }
          }

          // var dataOfChart = [];
          // for (var i = 0; i < chartLabelsAll.length; i++) {
          //   //chartLabelsAll[i]
          //   //     var found = allpubdata.find(element => element.companys === chartLabelsAll[i]);
          //   var obj = $.grep(allpubdata, function (obj) {
          //     return obj.companys === chartLabelsAll[i];
          //   });

          //   var companys = chartLabelsAll[i];
          //   var datavals = [];
          //   for (var j = 0; j < obj.length; j++) {
          //     datavals.push({ 'pub': obj[j].pub, 'count': obj[j].count });
          //   }
          //   dataOfChart.push({ 'companys': companys, 'values': datavals });
          // }
          // console.log(dataOfChart);
        }
        var dataOfChart = [];
        for (var i = 0; i < chartLabelsAll.length; i++) {
          //chartLabelsAll[i]
          //     var found = allpubdata.find(element => element.companys === chartLabelsAll[i]);
          var obj = $.grep(allpubdata, function (obj) {
            return obj.companys === chartLabelsAll[i];
          });

          var companys = chartLabelsAll[i];
          var datavals = [];
          for (var j = 0; j < obj.length; j++) {
            datavals.push({ pub: obj[j].pub, count: obj[j].count });
          }
          dataOfChart.push({ companys: companys, values: datavals });
        }
        // console.log(dataOfChart);
        var chartLabelsAll = [];
        for(var i=0;i<res.length;i++){
          chartLabelsAll.push(res[i]._id.pub);
        }
        for (var k = 0; k < dataOfChart.length; k++) {
          // console.log("company string: "+res[i]._id.companys);
          var datavalues: Array<any> = [];
          if (dataOfChart[k].companys == null) {
          } else if (dataOfChart[k].companys == "null") {
          } else if (dataOfChart[k].companys == "") {
          } else {
            for (var l = 0; l < dataOfChart[k].values.length; l++) {
              // if (dataOfChart[0].values.length >= 10) {
              //   if (k == 0) {
              //     if (l < 10) {
              //       chartLabelsAll.push(dataOfChart[k].values[l].pub);
              //       datavalues.push({
              //         pub: dataOfChart[k].values[l].pub,
              //         count: dataOfChart[k].values[l].count,
              //       });
              //     }
              //   } else {
              //     if (
              //       chartLabelsAll.indexOf(dataOfChart[k].values[l].pub) != -1
              //     ) {
              //       if (l < 10) {
              //         datavalues.push({
              //           pub: dataOfChart[k].values[l].pub,
              //           count: dataOfChart[k].values[l].count,
              //         });
              //       }
              //     }
              //   }
              // } else {
                // if (k == 0) {
                //   if (l < 10) {
                //     chartLabelsAll.push(dataOfChart[k].values[l].pub);
                //     datavalues.push({ 'pub': dataOfChart[k].values[l].pub, 'count': dataOfChart[k].values[l].count });
                //   }
                // }
                // else {
                //   if (chartLabelsAll.indexOf(dataOfChart[k].values[l].pub) != -1) {
                //     if (l < 10) {
                //       datavalues.push({ 'pub': dataOfChart[k].values[l].pub, 'count': dataOfChart[k].values[l].count });
                //     }
                //   }
                // }
                if (
                  chartLabelsAll.indexOf(dataOfChart[k].values[l].pub) != -1
                ) {
                  if (l < 10) {
                    // chartLabelsAll.push(dataOfChart[k].values[l].pub);
                    datavalues.push({
                      pub: dataOfChart[k].values[l].pub,
                      count: dataOfChart[k].values[l].count,
                    });
                  }
                } else {
                  // if (l < 10) {
                  chartLabelsAll.push(dataOfChart[k].values[l].pub);
                  datavalues.push({
                    pub: dataOfChart[k].values[l].pub,
                    count: dataOfChart[k].values[l].count,
                  });
                  // }
                }
              // }
            }
          }
          var dataarray = [];
          for (var labels = 0; labels < chartLabelsAll.length; labels++) {
            var index = datavalues.findIndex(
              (x) => x.pub === chartLabelsAll[labels]
            );
            if (
              datavalues[index] == undefined ||
              datavalues[index] == "undefined"
            ) {
              // dataarray.push({'pub': chartLabelsAll[labels], 'count': 0});
              dataarray.push("");
            } else {
              dataarray.push(datavalues[index].count);
            }
          }
          var allLabelsForChart = [];
          for(var n=0; n<dataOfChart.length; n++){
              // console.log(dataOfChart[n].companys);
              allLabelsForChart.push(dataOfChart[n].companys);
          }
          if (this.firstclickchart == "") {
            var color1 = "#F7464A";
            var color2 = "#ffa1b5";
            var color3 = "#86c7f3";
            var color4 = "#ffe29a";
            var color5 = "#f1f2f4";
            var color6 = "#93d9d9";
            var color7 = "#c1d6e1";
            var color8 = "#eaeaea";
            var color9 = "#fa9092";
            var color10 = "#90d9d7";
            var color11 = "#fed29d";
            var color12 = "#bfc5d0";
            var color13 = "#9498a0";
            var color14 = "#fe76be";
            var color15 = "#72d595";
            var color16 = "#99ca72";
            var color17 = "#7cfff4";
            var color18 = "#98bf76";
            var color19 = "#a3f5af";
            var color20 = "#e89fe6";
            var color21 = "#dc7196";
            var color22 = "#e1adca";
            var color23 = "#8ea17d";
            var color24 = "#b9fd6e";
            var color25 = "#dcc4a3";
            var color26 = "#e871e4";
            var color27 = "#c5ae89";

            this.colors = [
              color1,
              color2,
              color3,
              color4,
              color5,
              color6,
              color7,
              color8,
              color9,
              color10,
              color11,
              color12,
              color13,
              color14,
              color15,
              color16,
              color17,
              color18,
              color19,
              color20,
              color21,
              color22,
              color23,
              color24,
              color25,
              color26,
              color27,
            ];

            this.allLabels = [];
            //this.allColors = [];
            this.displayColor = [];
            for (var i = 0; i < allLabelsForChart.length; i++) {
              if (this.allLabels.indexOf(allLabelsForChart[i]) == -1) {
                this.allLabels.push(allLabelsForChart[i]);
              }
            }
            if(this.colorscount  == 0){
              for (var i = 0; i < this.allLabels.length; i++) {
                this.allColors[this.allLabels[i]] = this.colors[i];
              }
            }
            for (var j = 0; j < allLabelsForChart.length; j++) {
              this.displayColor[j] = this.allColors[allLabelsForChart[j]];
            }
            this.firstclickchart = "ToptenTwitter";
          }
          else{
            
            for (var i = 0; i < allLabelsForChart.length; i++) {
              if (this.allLabels.indexOf(allLabelsForChart[i]) == -1) {
                this.allLabels.push(allLabelsForChart[i]);
              }
            }
            //this.chartLabels2 = this.printLabel;
              if(this.colorscount  == 0){
                for (var i = 0; i < this.allLabels.length; i++) {
                  this.allColors[this.allLabels[i]] = this.colors[i];
                }
              }

            for (var j = 0; j < allLabelsForChart.length; j++) {
              this.displayColor[j] = this.allColors[allLabelsForChart[j]];
            }

            var chartcolors = [];
            for (var i = 0; i < allLabelsForChart.length; i++) {
              chartcolors.push(this.allColors[allLabelsForChart[i]]);
            }
          }
          this.colorsAll.push({
            backgroundColor: [
              this.displayColor[k],
              this.displayColor[k],
              this.displayColor[k],
              this.displayColor[k],
              this.displayColor[k],
              this.displayColor[k],
              this.displayColor[k],
              this.displayColor[k],
              this.displayColor[k],
              this.displayColor[k],
            ],
            borderColor: [
              this.displayColor[k],
              this.displayColor[k],
              this.displayColor[k],
              this.displayColor[k],
              this.displayColor[k],
              this.displayColor[k],
              this.displayColor[k],
              this.displayColor[k],
              this.displayColor[k],
              this.displayColor[k],
            ],
            borderWidth: 0,
          });
          this.AVEChartDataAll.push({
            label: dataOfChart[k].companys,
            data: dataarray,
          });
        }
        this.chartLabelsAll = chartLabelsAll;

        this.chartDatasetsAll = this.AVEChartDataAll;

        if (this.AVEChartDataAll.length == 0) {
          this.chartReady = false;
          this.chartReadyWeb = false;
          this.chartReadyTwitter = false;
          this.chartReadyAll = false;
          this.chartReadyAVE = false;
          this.chartReadyModal = false;
          $(".chart-dropdown").css("display", "none");
          this.spinnerService.hide();
          return false;
        }
        this.chartColorsAll = this.colorsAll;
        this.chartReady = false;
        this.chartReadyWeb = false;
        this.chartReadyTwitter = false;
        this.chartReadyAll = true;
        this.chartReadyAVE = false;
        this.chartReadyModal = false;
        $(".chart-dropdown").css("display", "");
        //console.log(this.chartLabels);
        //console.log(this.AVEChartData);
        this.spinnerService.hide();
      });
    }
  }
  printAllChart(chartname) {
    this.Modalchartname = chartname;
    this.chartReadyModal = true;
    if (chartname == "Monthly Trend Print") {
      this.modalchartType = this.chartType;
      this.modalchartDatasets = this.chartDatasets;
      this.modalchartLabels = this.chartLabels;
      this.modalchartColors = this.chartColors;
      this.modalchartOptions = this.chartOptions;
      this.modallegend = this.modaltrue;

      this.ExportprintData = [];
      // this.ExportprintData.push({
      //   Month: "Month",
      //   Year: "Year",
      //   count: "Value",
      // });
      for (var i = 0; i < this.yeardata.length; i++) {
        this.ExportprintData.push({
          Month: this.yeardataLabel[i],
          Year: this.yearname[i],
          count: this.yeardata[i],
        });
      }
      this.exportExceldata = this.ExportprintData; 
      this.text = "Monthly Trend Print";
      $("#centralModalLg").modal("show");
    } else if (chartname == "Monthly Trend Web") {
      this.modalchartType = this.chartType;
      this.modalchartDatasets = this.chartDatasetsWeb;
      this.modalchartLabels = this.chartLabelsWeb;
      this.modalchartColors = this.chartColorsWeb;
      this.modalchartOptions = this.chartOptionsWeb;
      this.modallegend = this.modaltrue;
      this.ExportprintData = [];
      // this.ExportprintData.push({
      //   Month: "Month",
      //   Year: "Year",
      //   count: "Value",
      // });
      for (var i = 0; i < this.yeardataWeb.length; i++) {
        this.ExportprintData.push({
          Month: this.yeardataLabelWeb[i],
          Year: this.yearnameWeb[i],
          count: this.yeardataWeb[i],
        });
      }
      this.exportExceldata = this.ExportprintData;
      this.text = "Monthly Trend Web";
      $("#centralModalLg").modal("show");
    } else if (chartname == "Monthly Trend Twitter") {
      this.modalchartType = this.chartType;
      this.modalchartDatasets = this.chartDatasetsTwitter;
      this.modalchartLabels = this.chartLabelsTwitter;
      this.modalchartColors = this.chartColorsTwitter;
      this.modalchartOptions = this.chartOptionsTwitter;
      this.modallegend = this.modaltrue;

      this.ExportprintData = [];
      // this.ExportprintData.push({
      //   Month: "Month",
      //   Year: "Year",
      //   count: "Value",
      // });
      for (var i = 0; i < this.yeardataTwitter.length; i++) {
        this.ExportprintData.push({
          Month: this.yeardataLabelTwitter[i],
          Year: this.yearnameTwitter[i],
          count: this.yeardataTwitter[i],
        });
      }
      this.exportExceldata = this.ExportprintData;
      this.text = "Monthly Trend Twitter";
      $("#centralModalLg").modal("show");
    } else if (chartname == "AllCharts") {
      if (this.chartname == "By Region - PRINT") {
        this.modalchartType = this.chartTypeAll;
        this.modalchartDatasets = this.chartDatasetsAll;
        this.modalchartLabels = this.chartLabelsAll;
        this.modalchartColors = this.chartColorsAll;
        this.modalchartOptions = this.chartOptionsAll;
        // this.modallegend = this.modalfalse;
        this.modallegend = "false";
        this.exportExceldata = [];

        // console.log(this.datavaluesToExport);
        // for (var i = 0; i < this.ExportprintsourceData.length; i++) {
        //   this.exportExceldata.push({ '_id': this.ExportprintsourceData[i]._id.companys, 'count': this.ExportprintsourceData[i].count });
        // }
        this.text = "By Region - PRINT";
      } else if (this.chartname == "Top Ten Publications") {
        this.modalchartType = this.chartTypeAll;
        this.modalchartDatasets = this.chartDatasetsAll;
        this.modalchartLabels = this.chartLabelsAll;
        this.modalchartColors = this.chartColorsAll;
        this.modalchartOptions = this.chartOptionsAll;
        this.modallegend = this.modalfalse;
        this.exportExceldata = [];
        // for (var i = 0; i < this.ExportchartCirculationData.length; i++) {
        //   this.exportExceldata.push({ '_id': this.ExportchartCirculationData[i]._id.companys, 'count': this.ExportchartCirculationData[i].count });
        // }
        this.text = "Top Ten Publications";
      } else if (this.chartname == "Top Ten Journalists") {
        this.modalchartType = this.chartTypeAll;
        this.modalchartDatasets = this.chartDatasetsAll;
        this.modalchartLabels = this.chartLabelsAll;
        this.modalchartColors = this.chartColorsAll;
        this.modalchartOptions = this.chartOptionsAll;
        this.modallegend = this.modaltrue;
        // this.exportExceldata = this.ExportwebData;
        this.text = "Top Ten Journalists";
      }
    } else if (chartname == "By AVE - PRINT") {
      this.modalchartType = this.chartTypeAVE;
      this.modalchartDatasets = this.chartDatasetsAVE;
      this.modalchartLabels = this.chartLabelsAVE;
      this.modalchartColors = this.chartColorsAVE;
      this.modalchartOptions = this.chartOptionsAVE;
      this.exportExceldata = [];
      this.modallegend = "false";
      // for (var i = 0; i < this.ExportchartCirculationAllData.length; i++) {
      //   this.exportExceldata.push({ '_id': this.ExportchartCirculationAllData[i]._id.companys, 'count': this.ExportchartCirculationAllData[i].count });
      // }
 
 
      this.text = "By AVE - PRINT";
    }
  }
  download_img = function (el) {
    // var canvas = $("#centralModalLg canvas")[0];
    var canvas = $(".dvChartDiv canvas")[0];
    var ctx1 = canvas.getContext("2d");
    ctx1.mozImageSmoothingEnabled = false;
    ctx1.webkitImageSmoothingEnabled = false;
    ctx1.msImageSmoothingEnabled = false;
    ctx1.imageSmoothingEnabled = false;
    var w = canvas.width;
    var h = canvas.height;
    //get the current ImageData for the canvas.
    var data;
    data = ctx1.getImageData(0, 0, w, h);

    //store the current globalCompositeOperation
    var compositeOperation = ctx1.globalCompositeOperation;
    //set to draw behind current content
    ctx1.globalCompositeOperation = "destination-over";

    //set background color
    ctx1.fillStyle = "white";

    //draw background / rect on entire canvas
    ctx1.fillRect(0, 0, w, h);

    var image = canvas.toDataURL("image/jpeg", 1.0);
    //clear the canvas
    ctx1.clearRect(0, 0, w, h);

    //restore it with original / cached ImageData
    ctx1.putImageData(data, 0, 0);

    //reset the globalCompositeOperation to what it was
    ctx1.globalCompositeOperation = compositeOperation;
    var el = $(".chart-dropdown .dropdown-item")[1];
    var link = el;
    link.download = this.chartname + ".jpeg";
    link.href = image;
  };
  download_imngMonthlyTrend = function (el) {
    // var canvas = $("#centralModalLg canvas")[0];
    var canvas = $("#modalChart canvas")[0];
    var ctx1 = canvas.getContext("2d");
    ctx1.mozImageSmoothingEnabled = false;
    ctx1.webkitImageSmoothingEnabled = false;
    ctx1.msImageSmoothingEnabled = false;
    ctx1.imageSmoothingEnabled = false;
    var w = canvas.width;
    var h = canvas.height;
    //get the current ImageData for the canvas.
    var data;
    data = ctx1.getImageData(0, 0, w, h);

    //store the current globalCompositeOperation
    var compositeOperation = ctx1.globalCompositeOperation;
    //set to draw behind current content
    ctx1.globalCompositeOperation = "destination-over";

    //set background color
    ctx1.fillStyle = "white";

    //draw background / rect on entire canvas
    ctx1.fillRect(0, 0, w, h);

    var image = canvas.toDataURL("image/jpeg", 1.0);
    //clear the canvas
    ctx1.clearRect(0, 0, w, h);

    //restore it with original / cached ImageData
    ctx1.putImageData(data, 0, 0);

    //reset the globalCompositeOperation to what it was
    ctx1.globalCompositeOperation = compositeOperation;
    var el = $(".chartdownloadoptionsMonthlyTrend .dropdown-item")[1];
    var link = el;
    link.download = this.text + ".jpeg";
    link.href = image;
  };
  download_imgAVE = function (el) {
    // var canvas = $("#centralModalLg canvas")[0];
    var canvas = $("#dvAVEChart canvas")[0];
    var ctx1 = canvas.getContext("2d");
    ctx1.mozImageSmoothingEnabled = false;
    ctx1.webkitImageSmoothingEnabled = false;
    ctx1.msImageSmoothingEnabled = false;
    ctx1.imageSmoothingEnabled = false;
    var w = canvas.width;
    var h = canvas.height;
    //get the current ImageData for the canvas.
    var data;
    data = ctx1.getImageData(0, 0, w, h);

    //store the current globalCompositeOperation
    var compositeOperation = ctx1.globalCompositeOperation;
    //set to draw behind current content
    ctx1.globalCompositeOperation = "destination-over";

    //set background color
    ctx1.fillStyle = "white";

    //draw background / rect on entire canvas
    ctx1.fillRect(0, 0, w, h);

    var image = canvas.toDataURL("image/jpeg", 1.0);
    //clear the canvas
    ctx1.clearRect(0, 0, w, h);

    //restore it with original / cached ImageData
    ctx1.putImageData(data, 0, 0);

    //reset the globalCompositeOperation to what it was
    ctx1.globalCompositeOperation = compositeOperation;
    var el = $(".chartdownloadoptionsAVE .dropdown-item")[1];
    var link = el;
    link.download = this.text + ".jpeg";
    link.href = image;
  };
  download_data = function () {
    // //console.log(this.exportExceldata);
    var excelService: ExcelService;
    this.ExportprintData = [];
    var chartLabelsAVE = this.ExportchartLabelsAVE;
    // this.ExportprintData.push(" ");
    var chartLabels=[];
    for (var i = 0; i < chartLabelsAVE.length; i++) {
      chartLabels.push(this.chartLabelsAVE[i] );
    }
    this.ExportprintData[0] = chartLabels;
    if (this.ExportchartLabelsAVE[0] != "") {
      this.ExportprintData[0].unshift("");
      this.ExportchartLabelsAVE.splice(0, 1);
    }
    for (var i = 0; i < this.ExportchartDatasetsAVE.length; i++) {
      var chartdatavalues0 = "";
      var chartdatavalues1 = "";
      var chartdatavalues2 = "";
      var chartdatavalues3 = "";
      var chartdatavalues4 = "";
      var chartdatavalues5 = "";
      var chartdatavalues6 = "";
      var chartdatavalues7 = "";
      var chartdatavalues8 = "";
      var chartdatavalues9 = "";
      var chartdatavalues10 = "";
      var chartdatavalues11 = "";
      for (var j = 0; j < this.ExportchartDatasetsAVE[i].data.length; j++) {
        var AVEdata = this.ExportchartDatasetsAVE[i].data[j];
        // if (isNaN(AVEdata)) {
        if (AVEdata == "") {
          AVEdata = 0;
        }
        // }
        if (j == 0) {
          chartdatavalues0 = AVEdata;
        }
        if (j == 1) {
          chartdatavalues1 = AVEdata;
        }
        if (j == 2) {
          chartdatavalues2 = AVEdata;
        }
        if (j == 3) {
          chartdatavalues3 = AVEdata;
        }
        if (j == 4) {
          chartdatavalues4 = AVEdata;
        }
        if (j == 5) {
          chartdatavalues5 = AVEdata;
        }
        if (j == 6) {
          chartdatavalues6 = AVEdata;
        }
        if (j == 7) {
          chartdatavalues7 = AVEdata;
        }
        if (j == 8) {
          chartdatavalues8 = AVEdata;
        }
        if (j == 9) {
          chartdatavalues9 = AVEdata;
        }
        if (j == 10) {
          chartdatavalues10 = AVEdata;
        }
        if (j == 11) {
          chartdatavalues11 = AVEdata;
        }
      }
      var Data = [
        this.ExportchartDatasetsAVE[i].label,
        chartdatavalues0,
        chartdatavalues1,
        chartdatavalues2,
        chartdatavalues3,
        chartdatavalues4,
        chartdatavalues5,
        chartdatavalues6,
        chartdatavalues7,
        chartdatavalues8,
        chartdatavalues9,
        chartdatavalues10,
        chartdatavalues11,
      ];
      this.ExportprintData.push(Data);
      // this.ExportprintData.push({ 'company': this.AVEChartDataAll[i].label, chartdatavalues0, chartdatavalues1, chartdatavalues2, chartdatavalues3, chartdatavalues4, chartdatavalues5, chartdatavalues6, chartdatavalues7, chartdatavalues8, chartdatavalues9 });
      // this.ExportprintData.push({ 'company': this.AVEChartDataAll[i].label, 'count': chartdatavalues });
    }
    this.exportExceldata = this.ExportprintData;
    // this.exportExceldata = this.AVEChartDataAll;
    this.excelService.exportAsExcelFile(this.exportExceldata, "Data");
  };
  download_dataMonthlyTrend = function () {
    // //console.log(this.exportExceldata);
    var excelService: ExcelService;
    this.exportExceldata = this.ExportprintData;
    // this.exportExceldata = this.AVEChartDataAll;
    // this.excelService.exportAsExcelFile(this.exportExceldata, "Data");

    //gtype, title1, counts, month, year
    //new_baronly

    // window.location.href = "myimpact.in/GetData_newportal.php?gtype=new_baronly&title1=Monthly Trend&data="+this.ExportprintData;
    window.open("https://myimpact.in/GetData_newportal.php?gtype=new_baronly&title1=Monthly Trend&data=" + JSON.stringify(this.ExportprintData), "_blank");
  };
  getArticles = function () {
    if (this.chartname == 'Top Ten Print Publications') {
      var publication = '';
      // console.log("hre thr");
      this.articlepara.type = 'PRINT'
      this.ExportprintData = [];
      var chartLabels = this.chartLabelsAll;
      // this.ExportprintData.push(" ");
      for (var i = 0; i < this.chartLabelsAll; i++) {
        chartLabels.push({ 'Labels': this.chartLabelsAll[i] });
      }
      this.ExportprintData[0] = chartLabels;
      if (this.chartLabelsAll[0] != "") {
        this.ExportprintData[0].unshift("");
        this.chartLabelsAll.splice(0, 1);
      }

      //console.log(this.AVEChartDataAll);

      for (var i = 0; i < this.AVEChartDataAll.length; i++) {
        var chartdatavalues0 = "";
        var chartdatavalues1 = "";
        var chartdatavalues2 = "";
        var chartdatavalues3 = "";
        var chartdatavalues4 = "";
        var chartdatavalues5 = "";
        var chartdatavalues6 = "";
        var chartdatavalues7 = "";
        var chartdatavalues8 = "";
        var chartdatavalues9 = "";
        for (var j = 0; j < this.AVEChartDataAll[i].data.length; j++) {
          var AVEdata = this.AVEChartDataAll[i].data[j];
          // if (isNaN(AVEdata)) {
          if (AVEdata == "") {
            AVEdata = 0;
          }
          // }
          if (j == 0) {
            chartdatavalues0 = AVEdata;
          }
          if (j == 1) {
            chartdatavalues1 = AVEdata;
          }
          if (j == 2) {
            chartdatavalues2 = AVEdata;
          }
          if (j == 3) {
            chartdatavalues3 = AVEdata;
          }
          if (j == 4) {
            chartdatavalues4 = AVEdata;
          }
          if (j == 5) {
            chartdatavalues5 = AVEdata;
          }
          if (j == 6) {
            chartdatavalues6 = AVEdata;
          }
          if (j == 7) {
            chartdatavalues7 = AVEdata;
          }
          if (j == 8) {
            chartdatavalues8 = AVEdata;
          }
          if (j == 9) {
            chartdatavalues9 = AVEdata;
          }
        }
        var Data = [this.AVEChartDataAll[i].label, chartdatavalues0, chartdatavalues1, chartdatavalues2, chartdatavalues3, chartdatavalues4, chartdatavalues5, chartdatavalues6, chartdatavalues7, chartdatavalues8, chartdatavalues9];
        this.ExportprintData.push(Data);
      }
      this.exportExceldata = this.ExportprintData;
      //console.log(this.exportExceldata);

      publication = this.exportExceldata[0].join();

      console.log(this.exportExceldata[0].join());

      //return;
      var keywordAsString = JSON.parse(JSON.stringify(this.articlepara.keywordFilter));
      var encodeKeyword = encodeURIComponent(keywordAsString);



      var emailstr = this.user.email;
      var emailarray = emailstr.split("@");
      var emaildomain = emailarray[1];
      //window.location.href    
      var url = AppSetting.EXCELSERVER1 + "DataChart.php?xlu=" + Md5.init(emaildomain) + "&id1=" + Md5.init(this.articlepara.clientid) + "&fd=" + this.articlepara.todate + "&td=" + this.articlepara.fromdate + "&client=" + this.articlepara.clientid + "&keytype=" + this.articlepara.keytype + "&type=" + this.articlepara.type + "&publication=" + this.exportExceldata[0].join();

      console.log(url);
      window.location.href = url;
    }

    else if (this.chartname == 'Top Ten Print Journalists') {

      var journalist = '';
      // console.log("hre thr");
      this.ExportprintData = [];
      var chartLabels = this.chartLabelsAll;
      // this.ExportprintData.push(" ");
      for (var i = 0; i < this.chartLabelsAll; i++) {
        chartLabels.push({ 'Labels': this.chartLabelsAll[i] });
      }
      this.ExportprintData[0] = chartLabels;
      if (this.chartLabelsAll[0] != "") {
        this.ExportprintData[0].unshift("");
        this.chartLabelsAll.splice(0, 1);
      }

      //console.log(this.AVEChartDataAll);

      for (var i = 0; i < this.AVEChartDataAll.length; i++) {
        var chartdatavalues0 = "";
        var chartdatavalues1 = "";
        var chartdatavalues2 = "";
        var chartdatavalues3 = "";
        var chartdatavalues4 = "";
        var chartdatavalues5 = "";
        var chartdatavalues6 = "";
        var chartdatavalues7 = "";
        var chartdatavalues8 = "";
        var chartdatavalues9 = "";
        for (var j = 0; j < this.AVEChartDataAll[i].data.length; j++) {
          var AVEdata = this.AVEChartDataAll[i].data[j];
          // if (isNaN(AVEdata)) {
          if (AVEdata == "") {
            AVEdata = 0;
          }
          // }
          if (j == 0) {
            chartdatavalues0 = AVEdata;
          }
          if (j == 1) {
            chartdatavalues1 = AVEdata;
          }
          if (j == 2) {
            chartdatavalues2 = AVEdata;
          }
          if (j == 3) {
            chartdatavalues3 = AVEdata;
          }
          if (j == 4) {
            chartdatavalues4 = AVEdata;
          }
          if (j == 5) {
            chartdatavalues5 = AVEdata;
          }
          if (j == 6) {
            chartdatavalues6 = AVEdata;
          }
          if (j == 7) {
            chartdatavalues7 = AVEdata;
          }
          if (j == 8) {
            chartdatavalues8 = AVEdata;
          }
          if (j == 9) {
            chartdatavalues9 = AVEdata;
          }
        }
        var Data = [this.AVEChartDataAll[i].label, chartdatavalues0, chartdatavalues1, chartdatavalues2, chartdatavalues3, chartdatavalues4, chartdatavalues5, chartdatavalues6, chartdatavalues7, chartdatavalues8, chartdatavalues9];
        this.ExportprintData.push(Data);
      }
      this.exportExceldata = this.ExportprintData;
      // console.log("HEY");
      // console.log(this.exportExceldata);

      journalist = this.exportExceldata[0].join();

      console.log(this.exportExceldata[0].join());

      //return;
      var keywordAsString = JSON.parse(JSON.stringify(this.articlepara.keywordFilter));
      var encodeKeyword = encodeURIComponent(keywordAsString);


      var keywordAsString = JSON.parse(JSON.stringify(this.articlepara.keywordFilter));
      var encodeKeyword = encodeURIComponent(keywordAsString);

      console.log("url");

      var emailstr = this.user.email;
      var emailarray = emailstr.split("@");
      var emaildomain = emailarray[1];
      // alert("jour");

      var url = AppSetting.EXCELSERVER1 + "DataChart.php?xlu=" + Md5.init(emaildomain) + "&id1=" + Md5.init(this.articlepara.clientid) + "&fd=" + this.articlepara.todate + "&td=" + this.articlepara.fromdate + "&client=" + this.articlepara.clientid + "&keytype=" + this.articlepara.keytype + "&type=" + this.articlepara.type + "&journalist=" + this.exportExceldata[0].join();
      console.log(url);
      window.location.href = url;
    }

    else if (this.chartname == 'Top Ten Online Sources') {

      var publication = '';
      // console.log("hre thr");
      this.ExportprintData = [];
      var chartLabels = this.chartLabelsAll;
      this.articlepara.type = 'WEB'
      // this.ExportprintData.push(" ");
      for (var i = 0; i < this.chartLabelsAll; i++) {
        chartLabels.push({ 'Labels': this.chartLabelsAll[i] });
      }
      this.ExportprintData[0] = chartLabels;
      if (this.chartLabelsAll[0] != "") {
        this.ExportprintData[0].unshift("");
        this.chartLabelsAll.splice(0, 1);
      }

      //console.log(this.AVEChartDataAll);

      for (var i = 0; i < this.AVEChartDataAll.length; i++) {
        var chartdatavalues0 = "";
        var chartdatavalues1 = "";
        var chartdatavalues2 = "";
        var chartdatavalues3 = "";
        var chartdatavalues4 = "";
        var chartdatavalues5 = "";
        var chartdatavalues6 = "";
        var chartdatavalues7 = "";
        var chartdatavalues8 = "";
        var chartdatavalues9 = "";
        for (var j = 0; j < this.AVEChartDataAll[i].data.length; j++) {
          var AVEdata = this.AVEChartDataAll[i].data[j];
          // if (isNaN(AVEdata)) {
          if (AVEdata == "") {
            AVEdata = 0;
          }
          // }
          if (j == 0) {
            chartdatavalues0 = AVEdata;
          }
          if (j == 1) {
            chartdatavalues1 = AVEdata;
          }
          if (j == 2) {
            chartdatavalues2 = AVEdata;
          }
          if (j == 3) {
            chartdatavalues3 = AVEdata;
          }
          if (j == 4) {
            chartdatavalues4 = AVEdata;
          }
          if (j == 5) {
            chartdatavalues5 = AVEdata;
          }
          if (j == 6) {
            chartdatavalues6 = AVEdata;
          }
          if (j == 7) {
            chartdatavalues7 = AVEdata;
          }
          if (j == 8) {
            chartdatavalues8 = AVEdata;
          }
          if (j == 9) {
            chartdatavalues9 = AVEdata;
          }
        }
        var Data = [this.AVEChartDataAll[i].label, chartdatavalues0, chartdatavalues1, chartdatavalues2, chartdatavalues3, chartdatavalues4, chartdatavalues5, chartdatavalues6, chartdatavalues7, chartdatavalues8, chartdatavalues9];
        this.ExportprintData.push(Data);
      }
      this.exportExceldata = this.ExportprintData;
      // console.log("HEY");
      // console.log(this.exportExceldata);

      publication = this.exportExceldata[0].join();

      console.log(this.exportExceldata[0].join());

      //return;
      var keywordAsString = JSON.parse(JSON.stringify(this.articlepara.keywordFilter));
      var encodeKeyword = encodeURIComponent(keywordAsString);


      var keywordAsString = JSON.parse(JSON.stringify(this.articlepara.keywordFilter));
      var encodeKeyword = encodeURIComponent(keywordAsString);

      console.log("url");

      var emailstr = this.user.email;
      var emailarray = emailstr.split("@");
      var emaildomain = emailarray[1];
      // alert("jour");

      var url = AppSetting.EXCELSERVER1 + "DataChart.php?xlu=" + Md5.init(emaildomain) + "&id1=" + Md5.init(this.articlepara.clientid) + "&fd=" + this.articlepara.todate + "&td=" + this.articlepara.fromdate + "&client=" + this.articlepara.clientid + "&keytype=" + this.articlepara.keytype + "&type=" + this.articlepara.type + "&publication=" + this.exportExceldata[0].join();
      console.log(url);
      window.location.href = url;

    }


    else if (this.chartname == "By Region - PRINT") {
      var region = '';
      this.articlepara.type = 'PRINT'
      // console.log("hre thr");
      this.ExportprintData = [];
      var chartLabels = this.chartLabelsAll;
      // this.ExportprintData.push(" ");
      for (var i = 0; i < this.chartLabelsAll; i++) {
        chartLabels.push({ 'Labels': this.chartLabelsAll[i] });
      }
      this.ExportprintData[0] = chartLabels;
      if (this.chartLabelsAll[0] != "") {
        this.ExportprintData[0].unshift("");
        this.chartLabelsAll.splice(0, 1);
      }

      //console.log(this.AVEChartDataAll);

      for (var i = 0; i < this.AVEChartDataAll.length; i++) {
        var chartdatavalues0 = "";
        var chartdatavalues1 = "";
        var chartdatavalues2 = "";
        var chartdatavalues3 = "";
        var chartdatavalues4 = "";
        var chartdatavalues5 = "";
        var chartdatavalues6 = "";
        var chartdatavalues7 = "";
        var chartdatavalues8 = "";
        var chartdatavalues9 = "";
        for (var j = 0; j < this.AVEChartDataAll[i].data.length; j++) {
          var AVEdata = this.AVEChartDataAll[i].data[j];
          // if (isNaN(AVEdata)) {
          if (AVEdata == "") {
            AVEdata = 0;
          }
          // }
          if (j == 0) {
            chartdatavalues0 = AVEdata;
          }
          if (j == 1) {
            chartdatavalues1 = AVEdata;
          }
          if (j == 2) {
            chartdatavalues2 = AVEdata;
          }
          if (j == 3) {
            chartdatavalues3 = AVEdata;
          }
          if (j == 4) {
            chartdatavalues4 = AVEdata;
          }
          if (j == 5) {
            chartdatavalues5 = AVEdata;
          }
          if (j == 6) {
            chartdatavalues6 = AVEdata;
          }
          if (j == 7) {
            chartdatavalues7 = AVEdata;
          }
          if (j == 8) {
            chartdatavalues8 = AVEdata;
          }
          if (j == 9) {
            chartdatavalues9 = AVEdata;
          }
        }
        var Data = [this.AVEChartDataAll[i].label, chartdatavalues0, chartdatavalues1, chartdatavalues2, chartdatavalues3, chartdatavalues4, chartdatavalues5, chartdatavalues6, chartdatavalues7, chartdatavalues8, chartdatavalues9];
        this.ExportprintData.push(Data);
      }
      this.exportExceldata = this.ExportprintData;
      console.log("HEY");
      console.log(this.exportExceldata);

      region = this.exportExceldata[0].join();

      console.log(this.exportExceldata[0].join());

      //return;
      var keywordAsString = JSON.parse(JSON.stringify(this.articlepara.keywordFilter));
      var encodeKeyword = encodeURIComponent(keywordAsString);


      var keywordAsString = JSON.parse(JSON.stringify(this.articlepara.keywordFilter));
      var encodeKeyword = encodeURIComponent(keywordAsString);

      console.log("url");

      var emailstr = this.user.email;
      var emailarray = emailstr.split("@");
      var emaildomain = emailarray[1];
      // alert("jour");

      var url = AppSetting.EXCELSERVER1 + "DataChart.php?xlu=" + Md5.init(emaildomain) + "&id1=" + Md5.init(this.articlepara.clientid) + "&fd=" + this.articlepara.todate + "&td=" + this.articlepara.fromdate + "&client=" + this.articlepara.clientid + "&keytype=" + this.articlepara.keytype + "&type=" + this.articlepara.type + "&region=" + this.exportExceldata[0].join();
      console.log(url);
      window.location.href = url;




    }

    else if (this.chartname == 'Top Ten Twitter') {

      var publication = '';
      // console.log("hre thr");
      this.ExportprintData = [];
      var chartLabels = this.chartLabelsAll;
      this.articlepara.type = 'Twitter'
      // this.ExportprintData.push(" ");
      for (var i = 0; i < this.chartLabelsAll; i++) {
        chartLabels.push({ 'Labels': this.chartLabelsAll[i] });
      }
      this.ExportprintData[0] = chartLabels;
      if (this.chartLabelsAll[0] != "") {
        this.ExportprintData[0].unshift("");
        this.chartLabelsAll.splice(0, 1);
      }

      //console.log(this.AVEChartDataAll);

      for (var i = 0; i < this.AVEChartDataAll.length; i++) {
        var chartdatavalues0 = "";
        var chartdatavalues1 = "";
        var chartdatavalues2 = "";
        var chartdatavalues3 = "";
        var chartdatavalues4 = "";
        var chartdatavalues5 = "";
        var chartdatavalues6 = "";
        var chartdatavalues7 = "";
        var chartdatavalues8 = "";
        var chartdatavalues9 = "";
        for (var j = 0; j < this.AVEChartDataAll[i].data.length; j++) {
          var AVEdata = this.AVEChartDataAll[i].data[j];
          // if (isNaN(AVEdata)) {
          if (AVEdata == "") {
            AVEdata = 0;
          }
          // }
          if (j == 0) {
            chartdatavalues0 = AVEdata;
          }
          if (j == 1) {
            chartdatavalues1 = AVEdata;
          }
          if (j == 2) {
            chartdatavalues2 = AVEdata;
          }
          if (j == 3) {
            chartdatavalues3 = AVEdata;
          }
          if (j == 4) {
            chartdatavalues4 = AVEdata;
          }
          if (j == 5) {
            chartdatavalues5 = AVEdata;
          }
          if (j == 6) {
            chartdatavalues6 = AVEdata;
          }
          if (j == 7) {
            chartdatavalues7 = AVEdata;
          }
          if (j == 8) {
            chartdatavalues8 = AVEdata;
          }
          if (j == 9) {
            chartdatavalues9 = AVEdata;
          }
        }
        var Data = [this.AVEChartDataAll[i].label, chartdatavalues0, chartdatavalues1, chartdatavalues2, chartdatavalues3, chartdatavalues4, chartdatavalues5, chartdatavalues6, chartdatavalues7, chartdatavalues8, chartdatavalues9];
        this.ExportprintData.push(Data);
      }
      this.exportExceldata = this.ExportprintData;
      // console.log("HEY");
      // console.log(this.exportExceldata);

      publication = this.exportExceldata[0].join();

      console.log(this.exportExceldata[0].join());

      //return;
      var keywordAsString = JSON.parse(JSON.stringify(this.articlepara.keywordFilter));
      var encodeKeyword = encodeURIComponent(keywordAsString);


      var keywordAsString = JSON.parse(JSON.stringify(this.articlepara.keywordFilter));
      var encodeKeyword = encodeURIComponent(keywordAsString);

      console.log("url");

      var emailstr = this.user.email;
      var emailarray = emailstr.split("@");
      var emaildomain = emailarray[1];
      // alert("jour");

      var url = AppSetting.EXCELSERVER1 + "DataChart.php?xlu=" + Md5.init(emaildomain) + "&id1=" + Md5.init(this.articlepara.clientid) + "&fd=" + this.articlepara.todate + "&td=" + this.articlepara.fromdate + "&client=" + this.articlepara.clientid + "&keytype=" + this.articlepara.keytype + "&type=" + this.articlepara.type + "&publication=" + this.exportExceldata[0].join();
      console.log(url);
      window.location.href = url;

    }






    else if (this.chartname == 'By AVE - PRINT') {

      var ave = '';
      // this.articlepara.type = 'PRINT'
      // console.log("hre thr");
      this.ExportprintData = [];
      var chartLabels = this.chartLabelsAll;
      // this.ExportprintData.push(" ");
      for (var i = 0; i < this.chartLabelsAll; i++) {
        chartLabels.push({ 'Labels': this.chartLabelsAll[i] });
      }
      this.ExportprintData[0] = chartLabels;
      if (this.chartLabelsAll[0] != "") {
        this.ExportprintData[0].unshift("");
        this.chartLabelsAll.splice(0, 1);
      }

      //console.log(this.AVEChartDataAll);

      for (var i = 0; i < this.AVEChartDataAll.length; i++) {
        var chartdatavalues0 = "";
        var chartdatavalues1 = "";
        var chartdatavalues2 = "";
        var chartdatavalues3 = "";
        var chartdatavalues4 = "";
        var chartdatavalues5 = "";
        var chartdatavalues6 = "";
        var chartdatavalues7 = "";
        var chartdatavalues8 = "";
        var chartdatavalues9 = "";
        for (var j = 0; j < this.AVEChartDataAll[i].data.length; j++) {
          var AVEdata = this.AVEChartDataAll[i].data[j];
          // if (isNaN(AVEdata)) {
          if (AVEdata == "") {
            AVEdata = 0;
          }
          // }
          if (j == 0) {
            chartdatavalues0 = AVEdata;
          }
          if (j == 1) {
            chartdatavalues1 = AVEdata;
          }
          if (j == 2) {
            chartdatavalues2 = AVEdata;
          }
          if (j == 3) {
            chartdatavalues3 = AVEdata;
          }
          if (j == 4) {
            chartdatavalues4 = AVEdata;
          }
          if (j == 5) {
            chartdatavalues5 = AVEdata;
          }
          if (j == 6) {
            chartdatavalues6 = AVEdata;
          }
          if (j == 7) {
            chartdatavalues7 = AVEdata;
          }
          if (j == 8) {
            chartdatavalues8 = AVEdata;
          }
          if (j == 9) {
            chartdatavalues9 = AVEdata;
          }
        }
        var Data = [this.AVEChartDataAll[i].label, chartdatavalues0, chartdatavalues1, chartdatavalues2, chartdatavalues3, chartdatavalues4, chartdatavalues5, chartdatavalues6, chartdatavalues7, chartdatavalues8, chartdatavalues9];
        this.ExportprintData.push(Data);
      }
      this.exportExceldata = this.AVEChartDataAVE;
       

      //ave = this.exportExceldata[0].join();
var jsonArray =  this.AVEChartDataAVE;
      var tempArray = jsonArray.map((item) => item.label);
      //console.log("Hre");
      //console.log(tempArray);

// ave = this.tempArray;
  
var arr = tempArray;
arr = arr.toString();
//console.log(arr);

  //    console.log("Hre");
      
    //  console.log(this.exportExceldata[0].join());

      //return;
      var keywordAsString = JSON.parse(JSON.stringify(this.articlepara.keywordFilter));
      var encodeKeyword = encodeURIComponent(keywordAsString);


      var keywordAsString = JSON.parse(JSON.stringify(this.articlepara.keywordFilter));
      var encodeKeyword = encodeURIComponent(keywordAsString);

       
   


      var emailstr = this.user.email;
      var emailarray = emailstr.split("@");
      var emaildomain = emailarray[1];


      var url = AppSetting.EXCELSERVER1 + "DataChart.php?xlu=" + Md5.init(emaildomain) + "&id1=" + Md5.init(this.articlepara.clientid) + "&fd=" + this.articlepara.todate + "&td=" + this.articlepara.fromdate + "&client=" + this.articlepara.clientid + "&keytype=" + this.articlepara.keytype + "&type=" + this.articlepara.type + "&ave=" +arr ;
      console.log(url);
      window.location.href = url;

    }



  }
  download_dataAll = function () {
    // //console.log(this.exportExceldata);
    var excelService: ExcelService;
    this.ExportprintData = [];
    var chartLabelsAll = this.chartLabelsAll;
    // this.ExportprintData.push(" ");
    var chartLabels=[];
    for (var i = 0; i < chartLabelsAll.length; i++) {
      chartLabels.push(this.chartLabelsAll[i] );
    }
    this.ExportprintData[0] = chartLabels;
    if (this.chartLabelsAll[0] != "") {
      this.ExportprintData[0].unshift("");
      this.chartLabelsAll.splice(0, 1);
    }
    for (var i = 0; i < this.AVEChartDataAll.length; i++) {
      var chartdatavalues0 = "";
      var chartdatavalues1 = "";
      var chartdatavalues2 = "";
      var chartdatavalues3 = "";
      var chartdatavalues4 = "";
      var chartdatavalues5 = "";
      var chartdatavalues6 = "";
      var chartdatavalues7 = "";
      var chartdatavalues8 = "";
      var chartdatavalues9 = "";
      for (var j = 0; j < this.AVEChartDataAll[i].data.length; j++) {
        var AVEdata = this.AVEChartDataAll[i].data[j];
        // if (isNaN(AVEdata)) {
        if (AVEdata == "") {
          AVEdata = 0;
        }
        // }
        if (j == 0) {
          chartdatavalues0 = AVEdata;
        }
        if (j == 1) {
          chartdatavalues1 = AVEdata;
        }
        if (j == 2) {
          chartdatavalues2 = AVEdata;
        }
        if (j == 3) {
          chartdatavalues3 = AVEdata;
        }
        if (j == 4) {
          chartdatavalues4 = AVEdata;
        }
        if (j == 5) {
          chartdatavalues5 = AVEdata;
        }
        if (j == 6) {
          chartdatavalues6 = AVEdata;
        }
        if (j == 7) {
          chartdatavalues7 = AVEdata;
        }
        if (j == 8) {
          chartdatavalues8 = AVEdata;
        }
        if (j == 9) {
          chartdatavalues9 = AVEdata;
        }
      }
      var Data = [
        this.AVEChartDataAll[i].label,
        chartdatavalues0,
        chartdatavalues1,
        chartdatavalues2,
        chartdatavalues3,
        chartdatavalues4,
        chartdatavalues5,
        chartdatavalues6,
        chartdatavalues7,
        chartdatavalues8,
        chartdatavalues9,
      ];
      this.ExportprintData.push(Data);
      // this.ExportprintData.push({ 'company': this.AVEChartDataAll[i].label, chartdatavalues0, chartdatavalues1, chartdatavalues2, chartdatavalues3, chartdatavalues4, chartdatavalues5, chartdatavalues6, chartdatavalues7, chartdatavalues8, chartdatavalues9 });
      // this.ExportprintData.push({ 'company': this.AVEChartDataAll[i].label, 'count': chartdatavalues });
    }
    this.exportExceldata = this.ExportprintData;
    // this.exportExceldata = this.AVEChartDataAll;

    // this.excelService.exportAsExcelFile(this.exportExceldata, "Data");
    var fromdate = formatDate(
      this.articlepara.fromdate,
      "yyy-MM-dd",
      "en",
      ""
    );
    var todate = formatDate(this.articlepara.todate, "yyy-MM-dd", "en", "");
    window.open("https://myimpact.in/GetData_newportal.php?gtype=stgbarmonth&fromdate="+todate+"&todate="+fromdate+"&title1="+this.chartname+"&data=" + JSON.stringify(this.ExportprintData), "_blank");
  };
  changeclient(value) {
    localStorage.setItem("storageselectedclient", value);
    //window.location.reload();
    // this.getArticlebyDate('today');
    this.spinnerService.show();
    this.firstclickchart = "";
    this.Clients();
    this.getcompanysAll();
  }


}
