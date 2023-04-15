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
  selector: "app-smartstats",
  templateUrl: "./smartstats.component.html",
  styleUrls: ["./smartstats.component.scss"],
})
export class SmartstatsComponent implements OnInit {
  loading = false;

  public clientlist = [];
  result = [];
  totalcount = "0";
  enableforprint = false;
  enableforweb = false;
  enableforbr = false;
  public selectedclient;
  isActiveToday = true;
  isActiveYesterday = false;
  isActive7Days = false;
  isActivedaterange = false;
  date = new Date();
  // fromdate = formatDate(this.date, "yyy-MM-dd", 'en', '');
  // todate = formatDate(this.date, "yyy-MM-dd", 'en', '');
  fromdate = "";
  todate = "";

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
  };
  user = {
    email: localStorage.getItem("email"),
  };
  public dimensionval = "allarticles";
  public chartsData = {
    clientid: localStorage.getItem("storageselectedclient"),
    fromdate: this.fromdate,
    todate: this.todate,
    dimension: this.dimensionval,
  };
  public articleCountData = {
    clientid: localStorage.getItem("storageselectedclient"),
    fromdate: this.fromdate,
    todate: this.todate,
    type: "PRINT",
    dimension: this.dimensionval,
    counttype: "mycomp",
  };
  public sourceCount = "";
  public sourceCountprevious = "";
  public printarticlecount = "";
  public webarticlecount = "";
  public tvarticlecount = "";
  public printarticlecountall = "0";
  public webarticlecountall = "0";
  public tvarticlecountall = "0";
  public lastprintarticlecount = "";
  public lastwebarticlecount = "";
  public lasttvarticlecount = "";
  public websourceCount = "";
  public websourceCountprevious = "";
  public twittersourceCount = "";
  public twittersourceCountprevious = "";
  public allcirculationCount = "";
  public allcirculationCountDisplay = "";
  public allcirculationCountPrevious = "";
  public allcirculationDistinctCount = "";
  public allcirculationDistinctCountDisplay = "";
  public allcirculationDistinctCountPrevious = "";
  public allcirculationWebCount = "";
  public allcirculationWebCountDisplay = "";
  public allcirculationWebCountPrevious = "";
  public allcirculationDistinctWebCount = "";
  public allcirculationDistinctWebCountDisplay = "";
  public allcirculationDistinctWebCountPrevious = "";
  public lastprintarticlecountcolor = "pos";
  public lastwebarticlecountcolor = "pos";
  public lasttvarticlecountcolor = "pos";
  public allcirculationCountPreviouscolor = "pos";
  public allcirculationDistinctCountPreviouscolor = "pos";
  public allcirculationWebCountPreviouscolor = "pos";
  public allcirculationDistinctWebCountPreviouscolor = "pos";
  public websourceCountpreviouscolor = "pos";
  public twittersourceCountpreviouscolor = "pos";
  public printsourceCountpreviouscolor = "pos";
  public printData = [];
  public printLabel = [];
  public webData = [];
  public webLabel = [];
  public tvData = [];
  public tvLabel = [];
  public colors = [];
  public labels = [];
  public colorwithLabel = [];
  public printsourceData = [];
  public printsourceLabel = [];
  public websourceData = [];
  public websourceLabel = [];
  public twittersourceData = [];
  public twittersourceLabel = [];
  public chartCirculationData = [];
  public chartCirculationLabel = [];
  public chartCirculationAllData = [];
  public chartCirculationAllLabel = [];
  public chartCirculationWebData = [];
  public chartCirculationWebLabel = [];
  public chartCirculationWebAllData = [];
  public chartCirculationWebAllLabel = [];

  public ExportprintData = [];
  public ExportwebData = [];
  public ExporttvData = [];
  public ExportprintsourceData = [];
  public ExportwebsourceData = [];
  public ExporttwittersourceData = [];
  public ExportchartCirculationData = [];
  public ExportchartCirculationAllData = [];
  public ExportchartCirculationWebData = [];
  public ExportchartCirculationWebAllData = [];

  public allLabels = [];
  public allColors = [];
  public displayColor = [];
  public modaltrue = "true";
  public modalfalse = "false";
  public exportExceldata = [];
  public Modalchartname = "";
  public text: string = "charts";
  public enablefordash = false;
  public dashdisabledClass = "";
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
  public chartType: string = "horizontalBar";

  public chartDatasets: Array<any> = [
    {
      data: [],
      label: "My First dataset",
    },
  ];
  public barChartPlugins = [pluginDataLabels];
  public chartLabels: Array<any> = [
    "Red",
    "Blue",
    "Yellow",
    "Green",
    "Purple",
    "Orange",
  ];

  public chartColors: Array<any> = [
    {
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255,99,132,1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 0,
    },
  ];

  public chartOptions: any = {
    responsive: true,
    legend: {
      // display: false,
      position: "bottom",
      onClick: (e) => e.stopPropagation(),
    },
  };
  public chartClicked(e: any): void {}
  public chartHovered(e: any): void {}

  public chartType2: string = "pie";

  public chartDatasets2: Array<any> = [
    // { data: [300, 50, 100, 40, 120], label: ['My First dataset'] }
    { data: this.printData, label: ["My News - Monthly Trend"] },
  ];

  // public chartLabels2: Array<any> = ['Red', 'Green', 'Yellow', 'Grey', 'Dark Grey'];

  public chartLabels2: Array<any> = [];

  // public chartColors2: Array<any> = [
  //   {
  //     backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360', '#ffc107', '#8bc34a', '#cddc39', '#4caf50', '#f9a825', '#2e7d32', '#9e9d24'],
  //     hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870', '#A8B3C5', '#616774', '#ffc107', '#8bc34a', '#cddc39', '#4caf50', '#f9a825', '#2e7d32', '#9e9d24'],
  //     borderWidth: 2,
  //   }
  // ];

  // public chartColorsWeb: Array<any> = [
  //   {
  //     backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360', '#ffc107', '#8bc34a', '#cddc39', '#4caf50', '#f9a825', '#2e7d32', '#9e9d24'],
  //     hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870', '#A8B3C5', '#616774', '#ffc107', '#8bc34a', '#cddc39', '#4caf50', '#f9a825', '#2e7d32', '#9e9d24'],
  //     borderWidth: 2,
  //   }
  // ];

  public chartColors2: Array<any> = [
    {
      backgroundColor: this.displayColor,
      hoverBackgroundColor: this.displayColor,
      borderWidth: 2,
    },
  ];

  public chartColorsWeb: Array<any> = [
    {
      backgroundColor: this.displayColor,
      hoverBackgroundColor: this.displayColor,
      borderWidth: 2,
    },
  ];

  public chartColorstv: Array<any> = [
    {
      backgroundColor: this.displayColor,
      hoverBackgroundColor: this.displayColor,
      borderWidth: 2,
    },
  ];

  public chartOptions2: any = {
    responsive: true,
    legend: {
      // display: false,
      position: "bottom",
      onClick: (e) => e.stopPropagation(),
    },
    plugins: {
      datalabels: {
        align: function (context) {
          var index = context.dataIndex;
          var value = context.dataset.data[index];
          //var invert = Math.abs(value) <= 1;
          return value > 0 ? "end" : "start";
        },
        formatter: (value, ctx) => {
          let sum = 0;
          let dataArr = ctx.chart.data.datasets[0].data;
          dataArr.map((data) => {
            sum += data;
          });
          let percentage = Math.round((value * 100) / sum) + "%";
          return percentage;
        },
        display: true,
        color: "#ffffff",
        // formatter: function (value) {
        //   return this.formatValue(value);
        // }.bind(this)
      },
    },
  };
  public chartTypeBar: string = "horizontalBar";

  // public chartDatasetsBar: Array<any> = [
  //   { data: [65, 59, 80, 81, 56, 55, 40], label: 'My First dataset' }
  // ];
  public chartPrintDatasetsBar: ChartDataSets[] = [
    { data: this.printsourceData, label: "My First dataset" },
  ];
  public chartPrintLabelsBar: Array<any> = this.printsourceLabel;

  public chartCirculationDistinctDatasetsBar: ChartDataSets[] = [
    { data: this.chartCirculationData, label: "My First dataset" },
  ];
  public chartCirculationDistinctWebDatasetsBar: ChartDataSets[] = [
    { data: this.chartCirculationWebData, label: "My First dataset" },
  ];
  public chartCirculationDistinctLabelsBar: Array<any> = this
    .chartCirculationLabel;

  public chartCirculationAllDatasetsBar: ChartDataSets[] = [
    { data: this.chartCirculationAllData, label: "My First dataset" },
  ];
  public chartCirculationAllLabelsBar: Array<any> = this
    .chartCirculationAllLabel;

  public chartCirculationWebDistinctDatasetsBar: ChartDataSets[] = [
    { data: this.chartCirculationWebData, label: "My First dataset" },
  ];
  public chartCirculationWebDistinctLabelsBar: Array<any> = this
    .chartCirculationWebLabel;

  public chartCirculationWebAllDatasetsBar: ChartDataSets[] = [
    { data: this.chartCirculationWebAllData, label: "My First dataset" },
  ];
  public chartCirculationWebAllLabelsBar: Array<any> = this
    .chartCirculationWebAllLabel;

  public chartWebDatasetsBar: ChartDataSets[] = [
    { data: this.websourceData, label: "My First dataset" },
  ];
  public charttwitterDatasetsBar: ChartDataSets[] = [
    { data: this.twittersourceData, label: "My First dataset" },
  ];
  public chartWebLabelsBar: Array<any> = this.websourceLabel;
  public charttwitterLabelsBar: Array<any> = this.twittersourceLabel;
  public chartColorsBar: Array<any> = [];
  public chartColorsBarReach: Array<any> = [];
  public chartColorsBarWebReach: Array<any> = [];
  public chartColorsBarImpression: Array<any> = [];
  public chartColorsBarWebImpression: Array<any> = [];
  public chartColorsBarsourcesPrint: Array<any> = [];

  public chartColorsBarsources: Array<any> = [];
  public chartColorsBarsourcesweb: Array<any> = [];
  public chartColorsBarsourcestwitter: Array<any> = [];
  public chartOptionsBar: any = {
    responsive: true,
    color: "#ffffff",
    legend: {
      display: false,
      position: "bottom",
      onClick: (e) => e.stopPropagation(),
    },
    layout: {
      padding: {
        right: 40,
      },
    },
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [
        {
          ticks: {
            suggestedMax: 10,
            beginAtZero: true,
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

        // color: "#ffffff"
      },
    },
  };
  public chartClicked2(e: any): void {}
  public chartHovered2(e: any): void {}

  public chartDatasetsweb: Array<any> = [
    // { data: [300, 50, 100, 40, 120], label: ['My First dataset'] }
    { data: this.webData, label: ["My First dataset"] },
  ];
  public chartLabelsweb: Array<any> = [];

  public chartDatasetstv: Array<any> = [
    // { data: [300, 50, 100, 40, 120], label: ['My First dataset'] }
    { data: this.tvData, label: ["My First dataset"] },
  ];
  public chartLabelstv: Array<any> = [];

  public modalchartType = "";
  public modalchartDatasets: Array<any> = [];
  public modalchartLabels: Array<any> = [];
  public modalchartColors: Array<any> = [];
  public modalchartOptions = {};
  public modallegend = "false";
  public colorscount =0;
  ngOnInit() {
    $("#reset").hide();

    var self = this;
    $(".bs-tooltip-right .arrow").css("display", "none");
    $(".tooltip-inner").css("display", "none");
    $('[data-toggle="tooltip"]').tooltip();

    this.modalchartType = this.chartType2;
    this.modalchartDatasets = this.chartDatasets2;
    this.modalchartLabels = this.chartLabels2;
    this.modalchartColors = this.chartColors2;
    this.modalchartOptions = this.chartOptions2;
    this.modallegend = this.modaltrue;
    if (
      localStorage.hasOwnProperty("fromdate") ||
      localStorage.hasOwnProperty("todate")
    ) {
      var fromdate = localStorage.getItem("fromdate");
      var todate = localStorage.getItem("todate");
      var currentdate = formatDate(this.date, "yyyy-MM-dd", "en", "");
      var yesterday = formatDate(
        this.date.setDate(this.date.getDate() - 1),
        "yyyy-MM-dd",
        "en",
        ""
      );
      var last7days = formatDate(
        this.date.setDate(this.date.getDate() - 6),
        "yyyy-MM-dd",
        "en",
        ""
      );
      if (fromdate == todate && todate == currentdate) {
        this.isActiveToday = true;
        this.isActiveYesterday = false;
        this.isActivedaterange = false;
        this.isActive7Days = false;
        $("#rangeCal").css("display", "none");
      } else if (fromdate == todate && todate == yesterday) {
        this.isActiveToday = false;
        this.isActiveYesterday = true;
        this.isActivedaterange = false;
        this.isActive7Days = false;
        $("#rangeCal").css("display", "none");
      } else if (todate == last7days && fromdate == currentdate) {
        this.isActive7Days = true;
        this.isActiveToday = false;
        this.isActiveYesterday = false;
        this.isActivedaterange = false;
        $("#rangeCal").css("display", "none");
      } else {
        this.isActiveToday = false;
        this.isActiveYesterday = false;
        this.isActivedaterange = true;
        this.isActive7Days = false;
        $("#rangeCal").css("display", "");
      }
      // this.getArticlebyDate
      // self.getallarticles();
    } else {
      this.articlepara.fromdate = formatDate(this.date, "yyyy-MM-dd", "en", "");
      this.articlepara.todate = formatDate(this.date, "yyyy-MM-dd", "en", "");
      localStorage.setItem(
        "fromdate",
        formatDate(this.date, "yyyy-MM-dd", "en", "")
      );
      localStorage.setItem(
        "todate",
        formatDate(this.date, "yyyy-MM-dd", "en", "")
      );
      this.isActiveToday = true;
      this.isActiveYesterday = false;
      this.isActivedaterange = false;
      this.isActive7Days = false;
    }
    if (localStorage.length == 0) {
      window.location.replace(location.origin);
    }
    // $(document).ready(function(){
    $("#dateclick").off("click");
    $("#dateclick").click(function() {
      $("#rangeCal").toggle();
    });
    updateConfig();
    function updateConfig() {
      var today = new Date();
      var options: { dateLimit: String } = {
        dateLimit: "",
        //,minDate: moment().subtract(365, 'days') , maxDate: moment()
      };
      // var fromdate = formatDate(self.date, "dd-MM-yyyy", 'en', '');
      // var todate = formatDate(self.date, "dd-MM-yyyy", 'en', '');
      // if (self.isActivedaterange) {
      //   fromdate = formatDate(new Date(localStorage.getItem("fromdate")), "dd-MM-yyyy", 'en', '');
      //   todate = formatDate(new Date(localStorage.getItem("todate")), "dd-MM-yyyy", 'en', '');
      // }

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
        function(start, end, label) {
          var startDateRange = end.format("YYYY-MM-DD");
          var endDateRange = start.format("YYYY-MM-DD");
          self.articlepara.todate = endDateRange;
          self.articlepara.fromdate = startDateRange;

          localStorage.setItem("fromdate", startDateRange);
          localStorage.setItem("todate", endDateRange);

          self.spinnerService.show();

          self.sourceCountprevious = "";
          self.lastprintarticlecount = "";
          self.lastwebarticlecount = "";
          self.lasttvarticlecount = "";
          self.websourceCountprevious = "";
          self.allcirculationCountPrevious = "";
          self.allcirculationDistinctCountPrevious = "";
          self.allcirculationWebCountPrevious = "";
          self.allcirculationDistinctWebCountPrevious = "";

          self.isActiveToday = false;
          self.isActive7Days = false;
          self.isActiveYesterday = false;
          self.isActivedaterange = true;
          self.getcompanysAll();
          // self.getArticlebyDate('custom');
        }
      );
    }
    //  });
    $(".selectperiod a").click(function() {
      var selectedval = $(this).html();
      $("#selectedType").html(selectedval);
    });
    this.articlepara.type = "ALL";
    this.articlepara.keytype = "";
    // this.articlepara.prominance = '';
    // this.articlepara.company = '';
    // this.articlepara.author = '';
    this.articlepara.publicationFilter = "";

    this.Clients(); //uncomment for client list
    this.selectedclient = localStorage.getItem("storageselectedclient");
    //console.log(localStorage.getItem('storageselectedclient'));
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
          this.allColors=[];
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

        // console.log(number);
        // Add the letter for the abbreviation
        number += abbrev[i];

        // We are done... stop
        break;
      }
    }

    // console.log('abbrNum(' + orig + ', ' + dec + ') = ' + number);
    return number;
  }
  Clients() {
    //console.log(this.user);
    // this.spinnerService.show();
    this._client.getClients(this.user).subscribe(
      (res) => {
        // console.log(res);
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
        // console.log(this.enableforbr);
        if (this.enablefordash) {
          this.dashdisabledClass = "";
        } else {
          this.dashdisabledClass = "menudisabled";
        }
      }
    );
  }
  printChart() {
    //console.log(this.user);

    this.allLabels = [];
    // this.allColors = [];
    this.displayColor = [];
    if (this.isActiveToday) {
      var date = new Date();
      var fromdate = formatDate(
        date.setDate(date.getDate()),
        "yyy-MM-dd",
        "en",
        ""
      );
      var todate = fromdate;
      var para = "today";
      this.fromdate = fromdate;
      this.todate = todate;
      this.articlesCountbyDateType(fromdate, todate, "PRINT");
    } else if (this.isActive7Days) {
      var date = new Date();
      var fromdate = formatDate(
        date.setDate(date.getDate() - 6),
        "yyy-MM-dd",
        "en",
        ""
      );
      var todate = formatDate(
        date.setDate(date.getDate() - 13),
        "yyy-MM-dd",
        "en",
        ""
      );
      var para = "7days";
      this.fromdate = fromdate;
      this.todate = todate;
      this.articlesCountbyDateType(fromdate, todate, "PRINT");
    } else if (this.isActiveYesterday) {
      var date = new Date();
      var fromdate = formatDate(
        date.setDate(date.getDate() - 1),
        "yyy-MM-dd",
        "en",
        ""
      );
      var todate = fromdate;
      var para = "yesterday";
      this.fromdate = fromdate;
      this.todate = todate;
      this.articlesCountbyDateType(fromdate, todate, "PRINT");
    } else {
      var para = "custom";
      // alert("Custom date");
    }
    if (para == "7days") {
      $("#rangeCal").hide();
      var date = new Date();
      this.fromdate = formatDate(date, "yyy-MM-dd", "en", "");
      var todate = formatDate(
        date.setDate(date.getDate() - 6),
        "yyy-MM-dd",
        "en",
        ""
      );
      this.todate = todate;
      this.isActiveToday = false;
      this.isActiveYesterday = false;
      this.isActive7Days = true;
      this.isActivedaterange = false;
    } else if (para == "custom") {
      //$('#rangeCal').hide();
      this.fromdate = this.articlepara.fromdate;
      this.todate = this.articlepara.todate;
      //this.todate
      this.isActiveToday = false;
      this.isActive7Days = false;
      this.isActiveYesterday = false;
      this.isActivedaterange = true;

      this.sourceCountprevious = "";
      this.lastprintarticlecount = "";
      this.lastwebarticlecount = "";
      this.lasttvarticlecount = "";
      this.websourceCountprevious = "";
      this.allcirculationCountPrevious = "";
      this.twittersourceCountprevious = "";
      this.allcirculationDistinctWebCountPrevious = "";
      this.allcirculationDistinctCountPrevious = "";
      this.allcirculationWebCountPrevious = "";
    } else if (para == "yesterday") {
      var date = new Date();
      var fromdate = formatDate(
        date.setDate(date.getDate() - 1),
        "yyy-MM-dd",
        "en",
        ""
      );
      var todate = fromdate;
      // var todate = formatDate(date.setDate(date.getDate() - 1), 'yyy-MM-dd', 'en', '');

      this.fromdate = fromdate;
      this.todate = todate;
      this.isActiveToday = false;
      this.isActive7Days = false;
      this.isActiveYesterday = true;
      this.isActivedaterange = false;
    } else {
      $("#rangeCal").hide();
      this.fromdate = formatDate(this.fromdate, "yyy-MM-dd", "en", "");
      this.todate = formatDate(this.todate, "yyy-MM-dd", "en", "");
      this.isActiveToday = true;
      this.isActive7Days = false;
      this.isActiveYesterday = false;
      this.isActivedaterange = false;
    }
    this.articlepara.type = "";
    this.articlepara.keytype = "";
    // this.articlepara.prominance = '';
    // this.articlepara.company = '';
    // this.articlepara.author = '';
    this.articlepara.publicationFilter = "";
    this.articlepara.fromdate = this.fromdate;
    this.articlepara.todate = this.todate;
    this.articlepara.clientid = localStorage.getItem("storageselectedclient");

    // this.spinnerService.show();
    this.chartsData = {
      clientid: localStorage.getItem("storageselectedclient"),
      fromdate: this.fromdate,
      todate: this.todate,
      dimension: this.dimensionval,
    };

    this.publicationCount(this.fromdate, this.todate);
    this.circulationCount(this.fromdate, this.todate);
    // this.spinnerService.show();
    this.article.printChartData(this.chartsData).subscribe(
      (res) => {
        // console.log(res);
        // this.printData = res;
        this.printLabel = [];
        this.printData = [];
        var countres = res.length;
        this.ExportprintData = res;
        var nullcount = 0;
        if (countres > 6) {
          for (var i = 0; i < 7; i++) {
            if (res[i]._id == null) {
              nullcount += res[i].count;
            } else if (res[i]._id == "null") {
              nullcount += res[i].count;
            } else if (res[i]._id.trim() == "") {
              nullcount += res[i].count;
            } else {
              this.printLabel.push(res[i]._id);
              this.printData.push(res[i].count);
            }
          }
          if (nullcount > 0) {
            this.printLabel.push("N.A.");
            this.printData.push(nullcount);
          }
          var otherscount = 0;
          var flag = false;
          for (var i = 7; i < res.length; i++) {
            otherscount += res[i].count;
            flag = true;
          }
          if (flag) {
            this.printLabel.push("others");
            this.printData.push(otherscount);
          }
        } else {
          for (var i = 0; i < res.length; i++) {
            this.printLabel.push(res[i]._id);
            this.printData.push(res[i].count);
          }
        }

        for (var i = 0; i < this.printLabel.length; i++) {
          // if(this.allLabels.indexOf(res[i]._id)==-1){
          this.allLabels.push(this.printLabel[i]);
          // }
        }
        this.chartDatasets2 = [
          // { data: [300, 50, 100, 40, 120], label: ['My First dataset'] }
          { data: this.printData, label: ["My First dataset"] },
        ];

        var color1 = "#F7464A";
        var color2 = "#46BFBD";
        var color3 = "#FDB45C";
        var color4 = "#949FB1";
        var color5 = "#4D5360";
        var color6 = "#ffc107";
        var color7 = "#8bc34a";
        var color8 = "#cddc39";
        var color9 = "#4caf50";
        var color10 = "#f9a825";
        var color11 = "#2e7d32";
        var color12 = "#9e9d24";
        var color13 = "#2c7978";
        var color14 = "#a9681b";
        var color15 = "#4b72b1";
        var color16 = "#ae42be";
        var color17 = "#5c2365";
        var color18 = "#a27b04";
        var color19 = "#d3294d";
        var color20 = "#23c8dc";
        var color21 = "#3d4fbf";
        var color22 = "#911627";
        var color23 = "#04a38b";
        var color24 = "#ff7531";
        var color25 = "#c2a11b";

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
        ];
        if(this.colorscount  == 0){
          for (var i = 0; i < this.allLabels.length; i++) {
            this.allColors[this.allLabels[i]] = this.colors[i];
          }
        }

        for (var j = 0; j < this.printLabel.length; j++) {
          this.displayColor[j] = this.allColors[this.printLabel[j]];
        }

        this.chartColors2 = [
          {
            backgroundColor: this.displayColor,
            hoverBackgroundColor: this.displayColor,
            borderWidth: 2,
          },
        ];
        this.chartLabels2 = this.printLabel;

        this.webChart();
      },
      (err) => {
        console.log(err);
        this.chartDatasets2 = [];
        this.chartLabels2 = [];
        this.webChart();
      }
    );
  }
  webChart() {
    //console.log(this.user);
    var chartsDataweb = {
      clientid: localStorage.getItem("storageselectedclient"),
      fromdate: this.fromdate,
      todate: this.todate,
      dimension: this.dimensionval,
      type: "WEB",
    };
    // this.spinnerService.show();
    this.article.webChartData(chartsDataweb).subscribe(
      (res) => {
        this.webLabel = [];
        this.webData = [];
        var countres = res.length;
        this.ExportwebData = res;
        var nullcount = 0;
        if (countres > 6) {
          for (var i = 0; i < 7; i++) {
            if (res[i]._id == null) {
              nullcount += res[i].count;
            } else if (res[i]._id == "null") {
              nullcount += res[i].count;
            } else if (res[i]._id.trim() == "") {
              nullcount += res[i].count;
            } else {
              this.webLabel.push(res[i]._id);
              this.webData.push(res[i].count);
            }
          }

          if (nullcount > 0) {
            this.webLabel.push("N.A.");
            this.webData.push(nullcount);
          }
          var otherscount = 0;
          var flag = false;
          for (var i = 7; i < res.length; i++) {
            otherscount += res[i].count;
            flag = true;
          }
          if (flag) {
            this.webLabel.push("others");
            this.webData.push(otherscount);
          }
        } else {
          for (var i = 0; i < res.length; i++) {
            // this.webLabel.push(res[i]._id);
            // this.webData.push(res[i].count);
            if (res[i]._id == null) {
              nullcount += res[i].count;
            } else if (res[i]._id == "null") {
              nullcount += res[i].count;
            } else if (res[i]._id.trim() == "") {
              nullcount += res[i].count;
            } else {
              this.webLabel.push(res[i]._id);
              this.webData.push(res[i].count);
            }
          }
          if (nullcount > 0) {
            this.webLabel.push("N.A.");
            this.webData.push(nullcount);
          }
          var otherscount = 0;
          var flag = false;
          for (var i = 7; i < res.length; i++) {
            otherscount += res[i].count;
            flag = true;
          }
          if (flag) {
            this.webLabel.push("others");
            this.webData.push(otherscount);
          }
        }
        this.chartDatasetsweb = [
          { data: this.webData, label: ["My First dataset"] },
        ];
        for (var i = 0; i < this.webLabel.length; i++) {
          if (this.allLabels.indexOf(this.webLabel[i]) == -1) {
            this.allLabels.push(this.webLabel[i]);
          }
        }
        //this.chartLabels2 = this.printLabel;
        this.chartLabelsweb = this.webLabel;
        if(this.colorscount  == 0){
          for (var i = 0; i < this.allLabels.length; i++) {
            this.allColors[this.allLabels[i]] = this.colors[i];
          }
        }

        for (var j = 0; j < this.webLabel.length; j++) {
          this.displayColor[j] = this.allColors[this.webLabel[j]];
        }

        var chartcolors = [];
        for (var i = 0; i < this.webLabel.length; i++) {
          chartcolors.push(this.allColors[this.webLabel[i]]);
        }

        this.chartColorsWeb = [
          {
            backgroundColor: chartcolors,
            hoverBackgroundColor: chartcolors,
            borderWidth: 2,
          },
        ];

        this.tvChart();
      },
      (err) => {
        console.log(err);
        this.chartDatasetsweb = [];
        this.chartLabelsweb = [];
        this.tvChart();
      }
    );
  }
  tvChart() {
    //console.log(this.user);
    // this.spinnerService.show();
    var chartsDatatwitter = {
      clientid: localStorage.getItem("storageselectedclient"),
      fromdate: this.fromdate,
      todate: this.todate,
      dimension: this.dimensionval,
      type: "TWITTER",
    };
    // this.spinnerService.show();
    this.article.webChartData(chartsDatatwitter).subscribe(
      (res) => {
        this.tvLabel = [];
        this.tvData = [];
        var countres = res.length;
        this.ExporttvData = res;
        var nullcount = 0;
        if (countres > 6) {
          for (var i = 0; i < 7; i++) {
            if (res[i]._id == null) {
              nullcount += res[i].count;
            } else if (res[i]._id == "null") {
              nullcount += res[i].count;
            } else if (res[i]._id.trim() == "") {
              nullcount += res[i].count;
            } else {
              this.tvLabel.push(res[i]._id);
              this.tvData.push(res[i].count);
            }
          }

          if (nullcount > 0) {
            this.tvLabel.push("N.A.");
            this.tvData.push(nullcount);
          }
          var otherscount = 0;
          var flag = false;
          for (var i = 7; i < res.length; i++) {
            otherscount += res[i].count;
            flag = true;
          }
          if (flag) {
            this.tvLabel.push("others");
            this.tvData.push(otherscount);
          }
        } else {
          for (var i = 0; i < res.length; i++) {
            if (res[i]._id == null) {
              nullcount += res[i].count;
            } else if (res[i]._id == "null") {
              nullcount += res[i].count;
            } else if (res[i]._id.trim() == "") {
              nullcount += res[i].count;
            } else {
              this.tvLabel.push(res[i]._id);
              this.tvData.push(res[i].count);
            }
          }
          if (nullcount > 0) {
            this.tvLabel.push("N.A.");
            this.tvData.push(nullcount);
          }
        }
        this.chartDatasetstv = [
          { data: this.tvData, label: ["My First dataset"] },
        ];

        // this.tvLabel = [];
        // this.tvData = [];
        // for (var i = 0; i < res.length; i++) {
        //   var label = $('[name="client"] option:selected').text();
        //   this.tvLabel.push(label);
        //   this.tvData.push(res[i].count);

        // }
        // this.chartDatasetstv = [
        //   { data: this.tvData, label: ['My First dataset'] }
        // ];

        this.chartLabelstv = this.tvLabel;

        for (var i = 0; i < this.tvLabel.length; i++) {
          if (this.allLabels.indexOf(this.tvLabel[i]) == -1) {
            this.allLabels.push(this.tvLabel[i]);
          }
        }
        if(this.colorscount  == 0){
          for (var i = 0; i < this.allLabels.length; i++) {
            this.allColors[this.allLabels[i]] = this.colors[i];
          }
        }

        for (var j = 0; j < this.tvLabel.length; j++) {
          this.displayColor[j] = this.allColors[this.tvLabel[j]];
        }

        var chartcolors = [];
        for (var i = 0; i < this.tvLabel.length; i++) {
          chartcolors.push(this.allColors[this.tvLabel[i]]);
        }

        this.chartColorstv = [
          {
            backgroundColor: chartcolors,
            hoverBackgroundColor: chartcolors,
            borderWidth: 2,
          },
        ];
        this.articlesCount();
        this.printSourceData();
      },
      (err) => {
        console.log(err);
        this.chartDatasetstv = [];
        this.chartLabelstv = [];
        this.articlesCount();
        this.printSourceData();
      }
    );
  }
  articlesCount() {
    //console.log(this.user);
    // this.spinnerService.show();
    this.articleCountData = {
      clientid: localStorage.getItem("storageselectedclient"),
      fromdate: this.fromdate,
      todate: this.todate,
      type: "PRINT",
      dimension: this.dimensionval,
      counttype: "mycomp",
    };
    this.article.articlesCount(this.articleCountData).subscribe(
      (res) => {
        this.printarticlecount = res.length;
        this.webarticlesCount();
        // var date = new Date();
        if (this.isActiveToday) {
          var date = new Date();
          var fromdate = formatDate(
            date.setDate(date.getDate() - 1),
            "yyy-MM-dd",
            "en",
            ""
          );
          var todate = fromdate;

          this.articlesCountbyDateType(fromdate, todate, "PRINT");
        } else if (this.isActive7Days) {
          var date = new Date();
          var fromdate = formatDate(
            date.setDate(date.getDate() - 6),
            "yyy-MM-dd",
            "en",
            ""
          );
          var todate = formatDate(
            date.setDate(date.getDate() - 13),
            "yyy-MM-dd",
            "en",
            ""
          );

          this.articlesCountbyDateType(fromdate, todate, "PRINT");
        } else if (this.isActiveYesterday) {
          var date = new Date();
          var fromdate = formatDate(
            date.setDate(date.getDate() - 2),
            "yyy-MM-dd",
            "en",
            ""
          );
          var todate = fromdate;
          this.articlesCountbyDateType(fromdate, todate, "PRINT");
        } else {
          // alert("Custom date");
        }
      },
      (err) => {
        console.log(err);
        this.webarticlesCount();
      }
    );
  }
  webarticlesCount() {
    //console.log(this.user);
    // this.spinnerService.show();
    this.articleCountData = {
      clientid: localStorage.getItem("storageselectedclient"),
      fromdate: this.fromdate,
      todate: this.todate,
      type: "WEB",
      dimension: this.dimensionval,
      counttype: "mycomp",
    };
    this.article.articlesCount(this.articleCountData).subscribe(
      (res) => {
        this.webarticlecount = res.length;
        this.tvarticlesCount();
        if (this.isActiveToday) {
          var date = new Date();
          var fromdate = formatDate(
            date.setDate(date.getDate() - 1),
            "yyy-MM-dd",
            "en",
            ""
          );
          var todate = fromdate;
          this.articlesCountbyDateType(fromdate, todate, "WEB");
        } else if (this.isActive7Days) {
          var date = new Date();
          var fromdate = formatDate(
            date.setDate(date.getDate() - 6),
            "yyy-MM-dd",
            "en",
            ""
          );
          var todate = formatDate(
            date.setDate(date.getDate() - 13),
            "yyy-MM-dd",
            "en",
            ""
          );
          this.articlesCountbyDateType(fromdate, todate, "WEB");
        } else if (this.isActiveYesterday) {
          var date = new Date();
          var fromdate = formatDate(
            date.setDate(date.getDate() - 2),
            "yyy-MM-dd",
            "en",
            ""
          );
          var todate = fromdate;
          this.articlesCountbyDateType(fromdate, todate, "WEB");
        } else {
          // alert("Custom date");
        }
      },
      (err) => {
        console.log(err);
        this.tvarticlesCount();
      }
    );
  }
  tvarticlesCount() {
    //console.log(this.user);
    // this.spinnerService.show();
    this.articleCountData = {
      clientid: localStorage.getItem("storageselectedclient"),
      fromdate: this.fromdate,
      todate: this.todate,
      type: "TWITTER",
      dimension: this.dimensionval,
      counttype: "mycomp",
    };
    this.article.articlesCount(this.articleCountData).subscribe(
      (res) => {
        this.tvarticlecount = res.length;
        var date = new Date();
        if (this.isActiveToday) {
          var date = new Date();
          var fromdate = formatDate(
            date.setDate(date.getDate() - 1),
            "yyy-MM-dd",
            "en",
            ""
          );
          var todate = fromdate;
          this.articlesCountbyDateType(fromdate, todate, "TWITTER");
        } else if (this.isActive7Days) {
          var date = new Date();
          var fromdate = formatDate(
            date.setDate(date.getDate() - 6),
            "yyy-MM-dd",
            "en",
            ""
          );
          var todate = formatDate(
            date.setDate(date.getDate() - 13),
            "yyy-MM-dd",
            "en",
            ""
          );
          this.articlesCountbyDateType(fromdate, todate, "TWITTER");
        } else if (this.isActiveYesterday) {
          var date = new Date();
          var fromdate = formatDate(
            date.setDate(date.getDate() - 2),
            "yyy-MM-dd",
            "en",
            ""
          );
          var todate = fromdate;
          this.articlesCountbyDateType(fromdate, todate, "TWITTER");
        } else {
          // alert("Custom date");
        }

        this.articlesCountAll();
      },
      (err) => {
        console.log(err);
        this.articlesCountAll();
      }
    );
  }

  articlesCountAll() {
    //console.log(this.user);
    // this.spinnerService.show();
    this.articleCountData = {
      clientid: localStorage.getItem("storageselectedclient"),
      fromdate: this.fromdate,
      todate: this.todate,
      type: "PRINT",
      dimension: this.dimensionval,
      counttype: "all",
    };
    this.article.articlesCount(this.articleCountData).subscribe(
      (res) => {
        this.printarticlecountall = res.length;
        this.webarticlesCountAll();
        // var date = new Date();
      },
      (err) => {
        console.log(err);
        this.webarticlesCountAll();
      }
    );
  }
  webarticlesCountAll() {
    //console.log(this.user);
    // this.spinnerService.show();
    this.articleCountData = {
      clientid: localStorage.getItem("storageselectedclient"),
      fromdate: this.fromdate,
      todate: this.todate,
      type: "WEB",
      dimension: this.dimensionval,
      counttype: "all",
    };
    this.article.articlesCount(this.articleCountData).subscribe(
      (res) => {
        this.webarticlecountall = res.length;
        this.tvarticlesCountAll();
      },
      (err) => {
        this.tvarticlesCountAll();
      }
    );
  }
  tvarticlesCountAll() {
    //console.log(this.user);
    // this.spinnerService.show();
    this.articleCountData = {
      clientid: localStorage.getItem("storageselectedclient"),
      fromdate: this.fromdate,
      todate: this.todate,
      type: "TWITTER",
      dimension: this.dimensionval,
      counttype: "all",
    };
    this.article.articlesCount(this.articleCountData).subscribe(
      (res) => {
        this.tvarticlecountall = res.length;
        // this.spinnerService.hide();
      },
      (err) => {
        // console.log(err);
      }
    );
  }
  articlesCountbyDateType(fromdate, todate, type) {
    //console.log(this.user);
    // this.spinnerService.show();
    this.articleCountData = {
      clientid: localStorage.getItem("storageselectedclient"),
      fromdate: fromdate,
      todate: todate,
      type: type,
      dimension: this.dimensionval,
      counttype: "mycomp",
    };
    this.article.articlesCount(this.articleCountData).subscribe(
      (res) => {
        // this.tvarticlecount = res.length;
        if (type == "PRINT") {
          // this.lastprintarticlecount = res.length;
          var current = this.printarticlecount;
          var previous = res.length;
          var percentage = 0;
          if (current == previous) {
            this.lastprintarticlecount = "0%";
            this.lastprintarticlecountcolor = "neu";
          } else if (current > previous) {
            percentage = (parseInt(previous) / parseInt(current)) * 100;
            percentage = 100 - percentage;
            if (percentage == 0) {
              this.lastprintarticlecount = Math.round(percentage) + "%";
              this.lastprintarticlecountcolor = "neu";
            } else {
              this.lastprintarticlecount = "+" + Math.round(percentage) + "%";
              this.lastprintarticlecountcolor = "pos";
            }
          } else {
            percentage = (parseInt(current) / parseInt(previous)) * 100;
            percentage = 100 - percentage;
            if (percentage == 0) {
              this.lastprintarticlecount = Math.round(percentage) + "%";
              this.lastprintarticlecountcolor = "neu";
            } else {
              this.lastprintarticlecount = "-" + Math.round(percentage) + "%";
              this.lastprintarticlecountcolor = "neg";
            }
          }
        } else if (type == "WEB") {
          // this.lastwebarticlecount = res.length;
          var current = this.webarticlecount;
          var previous = res.length;

          var percentage = 0;
          if (current == previous) {
            this.lastwebarticlecount = "0%";
            this.lastwebarticlecountcolor = "neu";
          } else if (current > previous) {
            percentage = (parseInt(previous) / parseInt(current)) * 100;
            percentage = 100 - percentage;
            if (percentage == 0) {
              this.lastwebarticlecount = Math.round(percentage) + "%";
              this.lastwebarticlecountcolor = "neu";
            } else {
              this.lastwebarticlecount = "+" + Math.round(percentage) + "%";
              this.lastwebarticlecountcolor = "pos";
            }
          } else {
            percentage = (parseInt(current) / parseInt(previous)) * 100;
            percentage = 100 - percentage;
            if (percentage == 0) {
              this.lastwebarticlecount = Math.round(percentage) + "%";
              this.lastwebarticlecountcolor = "neu";
            } else {
              this.lastwebarticlecount = "-" + Math.round(percentage) + "%";
              this.lastwebarticlecountcolor = "neg";
            }
          }
        }
        //TV changed to TWITTER
        else if (type == "TWITTER") {
          var current = this.tvarticlecount;
          var previous = res.length;
          var percentage = 100 - (parseInt(current) / parseInt(previous)) * 100;

          if (current == previous) {
            this.lasttvarticlecount = "0%";
            this.lasttvarticlecountcolor = "neu";
          } else if (current > previous) {
            percentage = (parseInt(previous) / parseInt(current)) * 100;
            percentage = 100 - percentage;
            if (percentage == 0) {
              this.lasttvarticlecount = Math.round(percentage) + "%";
              this.lasttvarticlecountcolor = "neu";
            } else {
              this.lasttvarticlecount = "+" + Math.round(percentage) + "%";
              this.lasttvarticlecountcolor = "pos";
            }
          } else {
            percentage = (parseInt(current) / parseInt(previous)) * 100;
            percentage = 100 - percentage;
            if (percentage == 0) {
              this.lasttvarticlecount = Math.round(percentage) + "%";
              this.lasttvarticlecountcolor = "neu";
            } else {
              this.lasttvarticlecount = "-" + Math.round(percentage) + "%";
              this.lasttvarticlecountcolor = "neg";
            }
          }
          // this.lasttvarticlecount = res.length;
        }
        // return res.length;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  publicationCount(fromdate, todate) {
    //console.log(this.user);
    var chartsData = {
      clientid: localStorage.getItem("storageselectedclient"),
      fromdate: fromdate,
      todate: todate,
      type: "PRINT",
      dimension: this.dimensionval,
    };
    // this.spinnerService.show();
    this.article.publicationCount(chartsData).subscribe(
      (res) => {
        //publication count
        this.sourceCount = res.length;
        if (this.isActiveToday) {
          var date = new Date();
          var fromdate = formatDate(
            date.setDate(date.getDate() - 1),
            "yyy-MM-dd",
            "en",
            ""
          );
          var todate = fromdate;
          this.publicationCountprevious(fromdate, todate);
        } else if (this.isActive7Days) {
          var date = new Date();
          var fromdate = formatDate(
            date.setDate(date.getDate() - 6),
            "yyy-MM-dd",
            "en",
            ""
          );
          var todate = formatDate(
            date.setDate(date.getDate() - 13),
            "yyy-MM-dd",
            "en",
            ""
          );

          this.publicationCountprevious(fromdate, todate);
        } else if (this.isActiveYesterday) {
          var date = new Date();
          var fromdate = formatDate(
            date.setDate(date.getDate() - 2),
            "yyy-MM-dd",
            "en",
            ""
          );

          var todate = fromdate;
          this.publicationCountprevious(fromdate, todate);
        } else {
          // alert("Custom date");
        }
        this.sourceCountWeb();
      },
      (err) => {
        this.sourceCountWeb();
        console.log(err);
      }
    );
  }
  publicationCountprevious(fromdate, todate) {
    //console.log(this.user);
    var chartsData = {
      clientid: localStorage.getItem("storageselectedclient"),
      fromdate: fromdate,
      todate: todate,
      type: "PRINT",
      dimension: this.dimensionval,
    };
    // this.spinnerService.show();
    this.article.publicationCount(chartsData).subscribe(
      (res) => {
        //publication count
        // this.sourceCountprevious = res.length;
        var current = this.sourceCount;
        var previous = res.length;
        var percentage = 0;
        if (current == previous) {
          this.sourceCountprevious = "0%";
          this.printsourceCountpreviouscolor = "neu";
        } else if (current > previous) {
          percentage = (parseInt(previous) / parseInt(current)) * 100;
          percentage = 100 - percentage;
          if (percentage == 0) {
            this.sourceCountprevious = Math.round(percentage) + "%";
            this.printsourceCountpreviouscolor = "neu";
          } else {
            this.sourceCountprevious = "+" + Math.round(percentage) + "%";
            this.printsourceCountpreviouscolor = "pos";
          }
        } else {
          percentage = (parseInt(current) / parseInt(previous)) * 100;
          percentage = 100 - percentage;
          if (percentage == 0) {
            this.sourceCountprevious = Math.round(percentage) + "%";
            this.printsourceCountpreviouscolor = "neu";
          } else {
            this.sourceCountprevious = "-" + Math.round(percentage) + "%";
            this.printsourceCountpreviouscolor = "neg";
          }
        }
        // this.sourceCountWeb()
      },
      (err) => {
        console.log(err);
      }
    );
  }
  sourceCountWeb() {
    //console.log(this.user);
    var chartsData = {
      clientid: localStorage.getItem("storageselectedclient"),
      fromdate: this.fromdate,
      todate: this.todate,
      type: "WEB",
      dimension: this.dimensionval,
    };
    // this.spinnerService.show();
    this.article.publicationCount(chartsData).subscribe(
      (res) => {
        //publication count
        this.websourceCount = res.length;
        if (this.isActiveToday) {
          var date = new Date();
          var fromdate = formatDate(
            date.setDate(date.getDate() - 1),
            "yyy-MM-dd",
            "en",
            ""
          );
          var todate = fromdate;
          this.sourceCountpreviousweb(fromdate, todate);
        } else if (this.isActive7Days) {
          var date = new Date();
          var fromdate = formatDate(
            date.setDate(date.getDate() - 6),
            "yyy-MM-dd",
            "en",
            ""
          );
          var todate = formatDate(
            date.setDate(date.getDate() - 13),
            "yyy-MM-dd",
            "en",
            ""
          );

          this.sourceCountpreviousweb(fromdate, todate);
        } else if (this.isActiveYesterday) {
          var date = new Date();
          var fromdate = formatDate(
            date.setDate(date.getDate() - 2),
            "yyy-MM-dd",
            "en",
            ""
          );
          var todate = fromdate;
          this.sourceCountpreviousweb(fromdate, todate);
        } else {
          // alert("Custom date");
        }
        this.sourceCounttwitter();
      },
      (err) => {
        console.log(err);
        this.sourceCounttwitter();
      }
    );
  }
  sourceCountpreviousweb(fromdate, todate) {
    //console.log(this.user);
    var chartsData = {
      clientid: localStorage.getItem("storageselectedclient"),
      fromdate: fromdate,
      todate: todate,
      type: "WEB",
      dimension: this.dimensionval,
    };
    // this.spinnerService.show();
    this.article.publicationCount(chartsData).subscribe(
      (res) => {
        //publication count
        // this.websourceCountprevious = res.length;
        var current = this.websourceCount;
        var previous = res.length;
        var percentage = 0;
        if (current == previous) {
          this.websourceCountprevious = "0%";
          this.websourceCountpreviouscolor = "neu";
        } else if (current > previous) {
          percentage = (parseInt(previous) / parseInt(current)) * 100;
          percentage = 100 - percentage;
          if (percentage == 0) {
            this.websourceCountprevious = Math.round(percentage) + "%";
            this.websourceCountpreviouscolor = "neu";
          } else {
            this.websourceCountprevious = "+" + Math.round(percentage) + "%";
            this.websourceCountpreviouscolor = "pos";
          }
        } else {
          percentage = (parseInt(current) / parseInt(previous)) * 100;
          percentage = 100 - percentage;
          if (percentage == 0) {
            this.websourceCountprevious = Math.round(percentage) + "%";
            this.websourceCountpreviouscolor = "neu";
          } else {
            this.websourceCountprevious = "-" + Math.round(percentage) + "%";
            this.websourceCountpreviouscolor = "neg";
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  sourceCounttwitter() {
    //console.log(this.user);
    var chartsData = {
      clientid: localStorage.getItem("storageselectedclient"),
      fromdate: this.fromdate,
      todate: this.todate,
      type: "TWITTER",
      dimension: this.dimensionval,
    };
    // this.spinnerService.show();
    this.article.publicationCount(chartsData).subscribe(
      (res) => {
        //publication count
        this.twittersourceCount = res.length;
        if (this.isActiveToday) {
          var date = new Date();
          var fromdate = formatDate(
            date.setDate(date.getDate() - 1),
            "yyy-MM-dd",
            "en",
            ""
          );
          var todate = fromdate;
          this.sourceCountprevioustwitter(fromdate, todate);
        } else if (this.isActive7Days) {
          var date = new Date();
          var fromdate = formatDate(
            date.setDate(date.getDate() - 6),
            "yyy-MM-dd",
            "en",
            ""
          );
          var todate = formatDate(
            date.setDate(date.getDate() - 13),
            "yyy-MM-dd",
            "en",
            ""
          );

          this.sourceCountprevioustwitter(fromdate, todate);
        } else if (this.isActiveYesterday) {
          var date = new Date();
          var fromdate = formatDate(
            date.setDate(date.getDate() - 2),
            "yyy-MM-dd",
            "en",
            ""
          );
          var todate = fromdate;
          this.sourceCountprevioustwitter(fromdate, todate);
        } else {
          // alert("Custom date");
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  sourceCountprevioustwitter(fromdate, todate) {
    //console.log(this.user);
    var chartsData = {
      clientid: localStorage.getItem("storageselectedclient"),
      fromdate: fromdate,
      todate: todate,
      type: "TWITTER",
      dimension: this.dimensionval,
    };
    // this.spinnerService.show();
    this.article.publicationCount(chartsData).subscribe(
      (res) => {
        //publication count
        // this.websourceCountprevious = res.length;
        var current = this.twittersourceCount;
        var previous = res.length;
        var percentage = 0;
        if (current == previous) {
          this.twittersourceCountprevious = "0%";
          this.twittersourceCountpreviouscolor = "neu";
        } else if (current > previous) {
          percentage = (parseInt(previous) / parseInt(current)) * 100;
          percentage = 100 - percentage;
          if (percentage == 0) {
            this.twittersourceCountprevious = Math.round(percentage) + "%";
            this.twittersourceCountpreviouscolor = "neu";
          } else {
            this.twittersourceCountprevious =
              "+" + Math.round(percentage) + "%";
            this.twittersourceCountpreviouscolor = "pos";
          }
        } else {
          percentage = (parseInt(current) / parseInt(previous)) * 100;
          percentage = 100 - percentage;
          if (percentage == 0) {
            this.twittersourceCountprevious = Math.round(percentage) + "%";
            this.twittersourceCountpreviouscolor = "neu";
          } else {
            this.twittersourceCountprevious =
              "-" + Math.round(percentage) + "%";
            this.twittersourceCountpreviouscolor = "neg";
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  circulationCount(fromdate, todate) {
    //console.log(this.user);
    var chartsData = {
      clientid: localStorage.getItem("storageselectedclient"),
      fromdate: fromdate,
      todate: todate,
      type: "PRINT",
      dimension: this.dimensionval,
    };
    // this.spinnerService.show();
    this.article.circulationCount(chartsData).subscribe(
      (res) => {
        //publication count
        if (res.length == 0) {
          this.allcirculationCount = "0";
          this.allcirculationCountDisplay = "0";
          this.circulationCountprevious(fromdate, todate);
          this.circulationDistinctCount(this.fromdate, this.todate);
        } else {
          this.allcirculationCount = res[0].totalcirculation;
          this.allcirculationCountDisplay = this.abbrNum(
            res[0].totalcirculation,
            2
          );
          if (this.isActiveToday) {
            var date = new Date();
            var fromdate = formatDate(
              date.setDate(date.getDate() - 1),
              "yyy-MM-dd",
              "en",
              ""
            );
            var todate = fromdate;
            this.circulationCountprevious(fromdate, todate);
          } else if (this.isActive7Days) {
            var date = new Date();
            var fromdate = formatDate(
              date.setDate(date.getDate() - 6),
              "yyy-MM-dd",
              "en",
              ""
            );
            var todate = formatDate(
              date.setDate(date.getDate() - 13),
              "yyy-MM-dd",
              "en",
              ""
            );

            this.circulationCountprevious(fromdate, todate);
          } else if (this.isActiveYesterday) {
            var date = new Date();
            var fromdate = formatDate(
              date.setDate(date.getDate() - 2),
              "yyy-MM-dd",
              "en",
              ""
            );
            var todate = fromdate;
            this.circulationCountprevious(fromdate, todate);
          } else {
            // alert("Custom date");
          }
          this.circulationDistinctCount(this.fromdate, this.todate);
        }
      },
      (err) => {
        console.log(err);
        this.circulationDistinctCount(this.fromdate, this.todate);
      }
    );
  }
  circulationCountprevious(fromdate, todate) {
    //console.log(this.user);
    var chartsData = {
      clientid: localStorage.getItem("storageselectedclient"),
      fromdate: fromdate,
      todate: todate,
      type: "PRINT",
      dimension: this.dimensionval,
    };
    // this.spinnerService.show();
    this.article.circulationCount(chartsData).subscribe(
      (res) => {
        // this.allcirculationCount = res[0].totalcirculation;
        if (res.length == 0) {
          this.allcirculationCountPrevious = "0%";
          this.allcirculationCountPreviouscolor = "neu";
        } else {
          var current = this.allcirculationCount;
          var previous = res[0].totalcirculation;
          var percentage = 0;
          if (current == previous) {
            this.allcirculationCountPrevious = "0%";
            this.allcirculationCountPreviouscolor = "neu";
          } else if (current > previous) {
            percentage = (parseInt(previous) / parseInt(current)) * 100;
            percentage = 100 - percentage;
            if (percentage == 0) {
              this.allcirculationCountPrevious = Math.round(percentage) + "%";
              this.allcirculationCountPreviouscolor = "neu";
            } else {
              this.allcirculationCountPrevious =
                "+" + Math.round(percentage) + "%";
              this.allcirculationCountPreviouscolor = "pos";
            }
          } else {
            percentage = (parseInt(current) / parseInt(previous)) * 100;
            percentage = 100 - percentage;
            if (percentage == 0) {
              this.allcirculationCountPrevious = Math.round(percentage) + "%";
              this.allcirculationCountPreviouscolor = "neu";
            } else {
              this.allcirculationCountPrevious =
                "-" + Math.round(percentage) + "%";
              this.allcirculationCountPreviouscolor = "neg";
            }
          }
          // this.printSourceData();
        }
      },
      (err) => {
        console.log(err);
        // this.printSourceData();
      }
    );
  }

  circulationCountWeb(fromdate, todate) {
    //console.log(this.user);
    var chartsData = {
      clientid: localStorage.getItem("storageselectedclient"),
      fromdate: fromdate,
      todate: todate,
      type: "WEB",
      dimension: this.dimensionval,
    };
    // this.spinnerService.show();
    this.article.circulationCount(chartsData).subscribe(
      (res) => {
        //publication count
        if (res.length == 0) {
          this.allcirculationWebCount = "0";
          this.allcirculationWebCountDisplay = "0";
        } else {
          this.allcirculationWebCount = res[0].totalcirculation;
          this.allcirculationWebCountDisplay = this.abbrNum(
            res[0].totalcirculation,
            2
          );
        }
        if (this.isActiveToday) {
          var date = new Date();
          var fromdate = formatDate(
            date.setDate(date.getDate() - 1),
            "yyy-MM-dd",
            "en",
            ""
          );
          var todate = fromdate;
          this.circulationWebCountprevious(fromdate, todate);
        } else if (this.isActive7Days) {
          var date = new Date();
          var fromdate = formatDate(
            date.setDate(date.getDate() - 6),
            "yyy-MM-dd",
            "en",
            ""
          );
          var todate = formatDate(
            date.setDate(date.getDate() - 13),
            "yyy-MM-dd",
            "en",
            ""
          );

          this.circulationWebCountprevious(fromdate, todate);
        } else if (this.isActiveYesterday) {
          var date = new Date();
          var fromdate = formatDate(
            date.setDate(date.getDate() - 2),
            "yyy-MM-dd",
            "en",
            ""
          );
          var todate = fromdate;
          this.circulationWebCountprevious(fromdate, todate);
        } else {
          // alert("Custom date");
        }
        this.circulationDistinctWebCount(this.fromdate, this.todate);
      },
      (err) => {
        console.log(err);
        this.circulationDistinctWebCount(this.fromdate, this.todate);
      }
    );
  }
  circulationWebCountprevious(fromdate, todate) {
    //console.log(this.user);
    var chartsData = {
      clientid: localStorage.getItem("storageselectedclient"),
      fromdate: fromdate,
      todate: todate,
      type: "WEB",
      dimension: this.dimensionval,
    };
    // this.spinnerService.show();
    this.article.circulationCount(chartsData).subscribe(
      (res) => {
        // this.allcirculationCount = res[0].totalcirculation;
        if (res.length == 0) {
          this.allcirculationWebCountPrevious = "0%";
          this.allcirculationWebCountPreviouscolor = "neu";
        } else {
          var current = this.allcirculationWebCount;
          var previous = res[0].totalcirculation;
          var percentage = 0;
          if (current == previous) {
            this.allcirculationWebCountPrevious = "0%";
            this.allcirculationWebCountPreviouscolor = "neu";
          } else if (current > previous) {
            percentage = (parseInt(previous) / parseInt(current)) * 100;
            percentage = 100 - percentage;
            if (percentage == 0) {
              this.allcirculationWebCountPrevious =
                Math.round(percentage) + "%";
              this.allcirculationWebCountPreviouscolor = "neu";
            } else {
              this.allcirculationWebCountPrevious =
                "+" + Math.round(percentage) + "%";
              this.allcirculationWebCountPreviouscolor = "pos";
            }
          } else {
            percentage = (parseInt(current) / parseInt(previous)) * 100;
            percentage = 100 - percentage;
            if (percentage == 0) {
              this.allcirculationWebCountPrevious =
                Math.round(percentage) + "%";
              this.allcirculationWebCountPreviouscolor = "neu";
            } else {
              this.allcirculationWebCountPrevious =
                "-" + Math.round(percentage) + "%";
              this.allcirculationWebCountPreviouscolor = "neg";
            }
          }
          // this.printSourceData();
        }
      },
      (err) => {
        console.log(err);
        // this.printSourceData();
      }
    );
  }
  printSourceData() {
    //console.log(this.user);
    var PrintsourcechartsData = {
      clientid: localStorage.getItem("storageselectedclient"),
      fromdate: this.fromdate,
      todate: this.todate,
      type: "PRINT",
      dimension: this.dimensionval,
    };
    // this.spinnerService.show();
    this.article.sourceChartData(PrintsourcechartsData).subscribe(
      (res) => {
        this.printsourceLabel = [];
        this.printsourceData = [];
        var countres = res.length;
        this.ExportprintsourceData = res;
        var nullcount = 0;

        if (countres > 6) {
          for (var i = 0; i < 7; i++) {
            if (res[i]._id.companys == null) {
              nullcount += res[i].count;
            } else if (res[i]._id.companys == "null") {
              nullcount += res[i].count;
            } else if (res[i]._id.companys.trim() == "") {
              nullcount += res[i].count;
            } else {
              this.printsourceLabel.push(res[i]._id.companys);
              this.printsourceData.push(res[i].count);
            }
          }

          if (nullcount > 0) {
            this.printsourceLabel.push("N.A.");
            this.printsourceData.push(nullcount);
          }
          var otherscount = 0;
          var flag = false;
          for (var i = 7; i < res.length; i++) {
            otherscount += res[i].count;
            flag = true;
          }
          if (flag) {
            this.printsourceLabel.push("others");
            this.printsourceData.push(otherscount);
          }
        } else {
          for (var i = 0; i < res.length; i++) {
            this.printsourceLabel.push(res[i]._id.companys);
            this.printsourceData.push(res[i].count);
          }
        }

        this.chartPrintDatasetsBar = [
          { data: this.printsourceData, label: "Sources Touched" },
        ];
        this.chartPrintLabelsBar = this.printsourceLabel;
        for (var i = 0; i < this.printsourceLabel.length; i++) {
          if (this.allLabels.indexOf(this.printsourceLabel[i]) == -1) {
            this.allLabels.push(this.printsourceLabel[i]);
          }
        }
        if(this.colorscount  == 0){
          for (var i = 0; i < this.allLabels.length; i++) {
            this.allColors[this.allLabels[i]] = this.colors[i];
          }
        }

        for (var j = 0; j < this.printsourceLabel.length; j++) {
          this.displayColor[j] = this.allColors[this.printsourceLabel[j]];
        }

        var chartcolors = [];
        for (var i = 0; i < this.printsourceLabel.length; i++) {
          chartcolors.push(this.allColors[this.printsourceLabel[i]]);
        }

        this.chartColorsBarsourcesPrint = [
          {
            backgroundColor: chartcolors,
            hoverBackgroundColor: chartcolors,
            borderWidth: 0,
          },
        ];
        this.webSourceData();
      },
      (err) => {
        console.log(err);
        this.chartPrintDatasetsBar = [];
        this.chartPrintLabelsBar = [];
        this.webSourceData();
      }
    );
  }
  webSourceData() {
    //console.log(this.user);
    var WebsourcechartsData = {
      clientid: localStorage.getItem("storageselectedclient"),
      fromdate: this.fromdate,
      todate: this.todate,
      type: "WEB",
      dimension: this.dimensionval,
    };
    // this.spinnerService.show();
    this.article.sourceChartData(WebsourcechartsData).subscribe(
      (res) => {
        this.websourceLabel = [];
        this.websourceData = [];
        var countres = res.length;
        this.ExportwebsourceData = res;
        var nullcount = 0;

        if (countres > 6) {
          for (var i = 0; i < 7; i++) {
            if (res[i]._id.companys == null) {
              nullcount += res[i].count;
            } else if (res[i]._id.companys == "null") {
              nullcount += res[i].count;
            } else if (res[i]._id.companys.trim() == "") {
              nullcount += res[i].count;
            } else {
              this.websourceLabel.push(res[i]._id.companys);
              this.websourceData.push(res[i].count);
            }
          }

          if (nullcount > 0) {
            this.websourceLabel.push("N.A.");
            this.websourceData.push(nullcount);
          }
          var otherscount = 0;
          var flag = false;
          for (var i = 7; i < res.length; i++) {
            otherscount += res[i].count;
            flag = true;
          }
          if (flag) {
            this.websourceLabel.push("others");
            this.websourceData.push(otherscount);
          }
        } else {
          for (var i = 0; i < res.length; i++) {
            if (res[i]._id.companys == null) {
              nullcount += res[i].count;
            } else if (res[i]._id.companys == "null") {
              nullcount += res[i].count;
            } else if (res[i]._id.companys.trim() == "") {
              nullcount += res[i].count;
            } else {
              this.websourceLabel.push(res[i]._id.companys);
              this.websourceData.push(res[i].count);
            }
            // this.websourceLabel.push(res[i]._id.companys);
            // this.websourceData.push(res[i].count);
          }
          if (nullcount > 0) {
            this.websourceLabel.push("N.A.");
            this.websourceData.push(nullcount);
          }
        }

        this.chartWebDatasetsBar = [
          { data: this.websourceData, label: "Sources Touched" },
        ];
        this.chartWebLabelsBar = this.websourceLabel;
        for (var i = 0; i < this.websourceLabel.length; i++) {
          if (this.allLabels.indexOf(this.websourceLabel[i]) == -1) {
            this.allLabels.push(this.websourceLabel[i]);
          }
        }
        if(this.colorscount  == 0){
          for (var i = 0; i < this.allLabels.length; i++) {
            this.allColors[this.allLabels[i]] = this.colors[i];
          }
        }

        for (var j = 0; j < this.websourceLabel.length; j++) {
          this.displayColor[j] = this.allColors[this.websourceLabel[j]];
        }

        var chartcolors = [];
        for (var i = 0; i < this.websourceLabel.length; i++) {
          chartcolors.push(this.allColors[this.websourceLabel[i]]);
        }

        this.chartColorsBarsourcesweb = [
          {
            backgroundColor: chartcolors,
            hoverBackgroundColor: chartcolors,
            borderWidth: 0,
          },
        ];
        this.twitterSourceData();
      },
      (err) => {
        console.log(err);
        this.chartWebDatasetsBar = [];
        this.chartWebLabelsBar = [];
        this.twitterSourceData();
      }
    );
  }
  twitterSourceData() {
    //console.log(this.user);
    var twittersourcechartsData = {
      clientid: localStorage.getItem("storageselectedclient"),
      fromdate: this.fromdate,
      todate: this.todate,
      type: "TWITTER",
      dimension: this.dimensionval,
    };
    // this.spinnerService.show();
    this.article.sourceChartData(twittersourcechartsData).subscribe(
      (res) => {
        this.twittersourceLabel = [];
        this.twittersourceData = [];
        var countres = res.length;
        this.ExporttwittersourceData = res;
        var nullcount = 0;

        if (countres > 6) {
          for (var i = 0; i < 7; i++) {
            if (res[i]._id.companys == null) {
              nullcount += res[i].count;
            } else if (res[i]._id.companys == "null") {
              nullcount += res[i].count;
            } else if (res[i]._id.companys.trim() == "") {
              nullcount += res[i].count;
            } else {
              this.twittersourceLabel.push(res[i]._id.companys);
              this.twittersourceData.push(res[i].count);
            }
          }

          if (nullcount > 0) {
            this.twittersourceLabel.push("N.A.");
            this.twittersourceData.push(nullcount);
          }
          var otherscount = 0;
          var flag = false;
          for (var i = 7; i < res.length; i++) {
            otherscount += res[i].count;
            flag = true;
          }
          if (flag) {
            this.twittersourceLabel.push("others");
            this.twittersourceData.push(otherscount);
          }
        } else {
          for (var i = 0; i < res.length; i++) {
            if (res[i]._id.companys == null) {
              nullcount += res[i].count;
            } else if (res[i]._id.companys == "null") {
              nullcount += res[i].count;
            } else if (res[i]._id.companys.trim() == "") {
              nullcount += res[i].count;
            } else {
              this.twittersourceLabel.push(res[i]._id.companys);
              this.twittersourceData.push(res[i].count);
            }
          }
          if (nullcount > 0) {
            this.twittersourceLabel.push("N.A.");
            this.twittersourceData.push(nullcount);
          }
        }

        this.charttwitterDatasetsBar = [
          { data: this.twittersourceData, label: "Sources Touched" },
        ];
        this.charttwitterLabelsBar = this.twittersourceLabel;
        for (var i = 0; i < this.twittersourceLabel.length; i++) {
          if (this.allLabels.indexOf(this.twittersourceLabel[i]) == -1) {
            this.allLabels.push(this.twittersourceLabel[i]);
          }
        }
        if(this.colorscount  == 0){
          for (var i = 0; i < this.allLabels.length; i++) {
            this.allColors[this.allLabels[i]] = this.colors[i];
          }
        }

        for (var j = 0; j < this.twittersourceLabel.length; j++) {
          this.displayColor[j] = this.allColors[this.twittersourceLabel[j]];
        }

        var chartcolors = [];
        for (var i = 0; i < this.twittersourceLabel.length; i++) {
          chartcolors.push(this.allColors[this.twittersourceLabel[i]]);
        }

        this.chartColorsBarsourcestwitter = [
          {
            backgroundColor: chartcolors,
            hoverBackgroundColor: chartcolors,
            borderWidth: 0,
          },
        ];
        this.circulationDistinctCount(this.fromdate, this.todate);
        this.circulationCountWeb(this.fromdate, this.todate);
      },
      (err) => {
        console.log(err);
        this.charttwitterDatasetsBar = [];
        this.charttwitterLabelsBar = [];
        this.circulationDistinctCount(this.fromdate, this.todate);
        this.circulationCountWeb(this.fromdate, this.todate);
      }
    );
  }
  circulationDistinctCount(fromdate, todate) {
    //console.log(this.user);
    var chartsData = {
      clientid: localStorage.getItem("storageselectedclient"),
      fromdate: fromdate,
      todate: todate,
      type: "PRINT",
      dimension: this.dimensionval,
    };
    // this.spinnerService.show();
    this.article.circulationDistinctCount(chartsData).subscribe(
      (res) => {
        //publication count
        if (res.length == 0) {
          this.allcirculationDistinctCount = "0";
          this.allcirculationDistinctCountDisplay = "0";
          this.circulationDistinctCountprevious(fromdate, todate);
        } else {
          this.allcirculationDistinctCount = res[0].totalcirculation;
          this.allcirculationDistinctCountDisplay = this.abbrNum(
            res[0].totalcirculation,
            2
          );
          if (this.isActiveToday) {
            var date = new Date();
            var fromdate = formatDate(
              date.setDate(date.getDate() - 1),
              "yyy-MM-dd",
              "en",
              ""
            );
            var todate = fromdate;
            this.circulationDistinctCountprevious(fromdate, todate);
          } else if (this.isActive7Days) {
            var date = new Date();
            var fromdate = formatDate(
              date.setDate(date.getDate() - 6),
              "yyy-MM-dd",
              "en",
              ""
            );
            var todate = formatDate(
              date.setDate(date.getDate() - 13),
              "yyy-MM-dd",
              "en",
              ""
            );

            this.circulationDistinctCountprevious(fromdate, todate);
          } else if (this.isActiveYesterday) {
            var date = new Date();
            var fromdate = formatDate(
              date.setDate(date.getDate() - 2),
              "yyy-MM-dd",
              "en",
              ""
            );
            var todate = fromdate;
            this.circulationDistinctCountprevious(fromdate, todate);
          } else {
            // alert("Custom date");
          }
        }
        this.circulationDistinctChart();
      },
      (err) => {
        this.circulationDistinctChart();
        console.log(err);
      }
    );
  }
  circulationDistinctCountprevious(fromdate, todate) {
    //console.log(this.user);
    var chartsData = {
      clientid: localStorage.getItem("storageselectedclient"),
      fromdate: fromdate,
      todate: todate,
      type: "PRINT",
      dimension: this.dimensionval,
    };
    // this.spinnerService.show();
    this.article.circulationDistinctCount(chartsData).subscribe(
      (res) => {
        if (res.length == 0) {
          this.allcirculationDistinctCountPrevious = "0%";
          this.allcirculationDistinctCountPreviouscolor = "neu";
        } else {
          var current = this.allcirculationDistinctCount;
          var previous = res[0].totalcirculation;
          var percentage = 0;
          if (current == previous) {
            this.allcirculationDistinctCountPrevious = "0%";
            this.allcirculationDistinctCountPreviouscolor = "neu";
          } else if (current > previous) {
            percentage = (parseInt(previous) / parseInt(current)) * 100;
            percentage = 100 - percentage;
            if (percentage == 0) {
              this.allcirculationDistinctCountPrevious =
                Math.round(percentage) + "%";
              this.allcirculationDistinctCountPreviouscolor = "neu";
            } else {
              this.allcirculationDistinctCountPrevious =
                "+" + Math.round(percentage) + "%";
              this.allcirculationDistinctCountPreviouscolor = "pos";
            }
          } else {
            percentage = (parseInt(current) / parseInt(previous)) * 100;
            percentage = 100 - percentage;
            if (percentage == 0) {
              this.allcirculationDistinctCountPrevious =
                Math.round(percentage) + "%";
              this.allcirculationDistinctCountPreviouscolor = "neu";
            } else {
              this.allcirculationDistinctCountPrevious =
                "-" + Math.round(percentage) + "%";
              this.allcirculationDistinctCountPreviouscolor = "neg";
            }
          }
          this.circulationDistinctChart();
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  circulationDistinctChart() {
    //console.log(this.user);
    var sendchartsData = {
      clientid: localStorage.getItem("storageselectedclient"),
      fromdate: this.fromdate,
      todate: this.todate,
      type: "PRINT",
      dimension: this.dimensionval,
    };
    // this.spinnerService.show();
    this.article.circulationDistinctChart(sendchartsData).subscribe(
      (res) => {
        this.chartCirculationData = [];
        this.chartCirculationLabel = [];
        var countres = res.length;
        this.ExportchartCirculationData = res;
        var nullcount = 0;

        if (countres > 6) {
          for (var i = 0; i < 7; i++) {
            if (res[i]._id.companys == null) {
              nullcount += res[i].count;
            } else if (res[i]._id.companys == "null") {
              nullcount += res[i].count;
            } else if (res[i]._id.companys.trim() == "") {
              nullcount += res[i].count;
            } else {
              this.chartCirculationLabel.push(res[i]._id.companys);
              this.chartCirculationData.push(
                (res[i].count / 1000000).toFixed(2)
              );
            }
          }
          if (nullcount > 0) {
            this.chartCirculationLabel.push("N.A.");
            this.chartCirculationData.push((nullcount / 1000000).toFixed(2));
          }
          var otherscount = 0;
          var flag = false;
          for (var i = 7; i < res.length; i++) {
            otherscount += res[i].count;
            flag = true;
          }
          if (flag) {
            this.chartCirculationLabel.push("others");
            this.chartCirculationData.push((otherscount / 1000000).toFixed(2));
          }
        } else {
          for (var i = 0; i < res.length; i++) {
            this.chartCirculationLabel.push(res[i]._id.companys);
            this.chartCirculationData.push((res[i].count / 1000000).toFixed(2));
          }
        }

        this.chartCirculationDistinctDatasetsBar = [
          { data: this.chartCirculationData, label: "Sources Touched" },
        ];
        this.chartCirculationDistinctLabelsBar = this.chartCirculationLabel;

        for (var i = 0; i < this.chartCirculationLabel.length; i++) {
          if (this.allLabels.indexOf(this.chartCirculationLabel[i]) == -1) {
            this.allLabels.push(this.chartCirculationLabel[i]);
          }
        }
        if(this.colorscount  == 0){
          for (var i = 0; i < this.allLabels.length; i++) {
            this.allColors[this.allLabels[i]] = this.colors[i];
          }
        }

        for (var j = 0; j < this.chartCirculationLabel.length; j++) {
          this.displayColor[j] = this.allColors[this.chartCirculationLabel[j]];
        }

        var chartcolors = [];
        for (var i = 0; i < this.chartCirculationLabel.length; i++) {
          chartcolors.push(this.allColors[this.chartCirculationLabel[i]]);
        }

        this.chartColorsBarReach = [
          {
            backgroundColor: chartcolors,
            hoverBackgroundColor: chartcolors,
            borderWidth: 0,
          },
        ];
        this.circulationAllChart();
      },
      (err) => {
        console.log(err);
        this.chartPrintLabelsBar = [];
        this.chartCirculationDistinctLabelsBar = [];
        this.circulationAllChart();
      }
    );
  }
  circulationAllChart() {
    //console.log(this.user);
    var sendchartsData = {
      clientid: localStorage.getItem("storageselectedclient"),
      fromdate: this.fromdate,
      todate: this.todate,
      type: "PRINT",
      dimension: this.dimensionval,
    };
    // this.spinnerService.show();
    this.article.circulationAllChart(sendchartsData).subscribe(
      (res) => {
        this.chartCirculationAllData = [];
        this.chartCirculationAllLabel = [];
        var countres = res.length;
        this.ExportchartCirculationAllData = res;
        var nullcount = 0;

        if (countres > 6) {
          for (var i = 0; i < 7; i++) {
            if (res[i]._id.companys == null) {
              nullcount += res[i].count / 1000000;
            } else if (res[i]._id.companys == "null") {
              nullcount += res[i].count / 1000000;
            } else if (res[i]._id.companys.trim() == "") {
              nullcount += res[i].count / 1000000;
            } else {
              this.chartCirculationAllLabel.push(res[i]._id.companys);
              this.chartCirculationAllData.push(
                (res[i].count / 1000000).toFixed(2)
              );
            }
          }
          if (nullcount > 0) {
            this.chartCirculationAllLabel.push("N.A.");
            this.chartCirculationAllData.push(nullcount.toFixed(2));
          }
          var otherscount = 0;
          var flag = false;
          for (var i = 7; i < res.length; i++) {
            otherscount += res[i].count / 1000000;
            flag = true;
          }
          if (flag) {
            this.chartCirculationAllLabel.push("others");
            this.chartCirculationAllData.push(otherscount.toFixed(2));
          }
        } else {
          for (var i = 0; i < res.length; i++) {
            this.chartCirculationAllLabel.push(res[i]._id.companys);
            this.chartCirculationAllData.push(
              (res[i].count / 1000000).toFixed(2)
            );
          }
        }

        this.chartCirculationAllDatasetsBar = [
          { data: this.chartCirculationAllData, label: "Sources Touched" },
        ];
        this.chartCirculationAllLabelsBar = this.chartCirculationAllLabel;
        for (var i = 0; i < this.chartCirculationAllLabel.length; i++) {
          if (this.allLabels.indexOf(this.chartCirculationAllLabel[i]) == -1) {
            this.allLabels.push(this.chartCirculationAllLabel[i]);
          }
        }
        if(this.colorscount  == 0){
          for (var i = 0; i < this.allLabels.length; i++) {
            this.allColors[this.allLabels[i]] = this.colors[i];
          }
        }

        for (var j = 0; j < this.chartCirculationAllLabel.length; j++) {
          this.displayColor[j] = this.allColors[
            this.chartCirculationAllLabel[j]
          ];
        }

        var chartcolors = [];
        for (var i = 0; i < this.chartCirculationAllLabel.length; i++) {
          chartcolors.push(this.allColors[this.chartCirculationAllLabel[i]]);
        }

        this.chartColorsBarImpression = [
          {
            backgroundColor: chartcolors,
            hoverBackgroundColor: chartcolors,
            borderWidth: 0,
          },
        ];
      },
      (err) => {
        this.chartCirculationDistinctLabelsBar = [];
        this.chartCirculationAllLabelsBar = [];
        console.log(err);
      }
    );
  }
  circulationDistinctWebCount(fromdate, todate) {
    //console.log(this.user);
    var chartsData = {
      clientid: localStorage.getItem("storageselectedclient"),
      fromdate: fromdate,
      todate: todate,
      type: "WEB",
      dimension: this.dimensionval,
    };
    // this.spinnerService.show();
    this.article.circulationDistinctCount(chartsData).subscribe(
      (res) => {
        //publication count
        if (res.length == 0) {
          this.allcirculationDistinctWebCount = "0";
          this.allcirculationDistinctWebCountDisplay = "0";
        } else {
          this.allcirculationDistinctWebCount = res[0].totalcirculation;
          this.allcirculationDistinctWebCountDisplay = this.abbrNum(
            res[0].totalcirculation,
            2
          );
        }
        if (this.isActiveToday) {
          var date = new Date();
          var fromdate = formatDate(
            date.setDate(date.getDate() - 1),
            "yyy-MM-dd",
            "en",
            ""
          );
          var todate = fromdate;
          this.circulationDistinctWebCountprevious(fromdate, todate);
        } else if (this.isActive7Days) {
          var date = new Date();
          var fromdate = formatDate(
            date.setDate(date.getDate() - 6),
            "yyy-MM-dd",
            "en",
            ""
          );
          var todate = formatDate(
            date.setDate(date.getDate() - 13),
            "yyy-MM-dd",
            "en",
            ""
          );

          this.circulationDistinctWebCountprevious(fromdate, todate);
        } else if (this.isActiveYesterday) {
          var date = new Date();
          var fromdate = formatDate(
            date.setDate(date.getDate() - 2),
            "yyy-MM-dd",
            "en",
            ""
          );
          var todate = fromdate;
          this.circulationDistinctWebCountprevious(fromdate, todate);
        } else {
          // alert("Custom date");
        }
        this.circulationDistinctWebChart();
      },
      (err) => {
        console.log(err);
        this.circulationDistinctWebChart();
      }
    );
  }
  circulationDistinctWebCountprevious(fromdate, todate) {
    //console.log(this.user);
    var chartsData = {
      clientid: localStorage.getItem("storageselectedclient"),
      fromdate: fromdate,
      todate: todate,
      type: "WEB",
      dimension: this.dimensionval,
    };
    // this.spinnerService.show();
    this.article.circulationDistinctCount(chartsData).subscribe(
      (res) => {
        if (res.length == 0) {
          this.allcirculationDistinctWebCountPrevious = "0%";
          this.allcirculationDistinctWebCountPreviouscolor = "neu";
        } else {
          var current = this.allcirculationDistinctWebCount;
          var previous = res[0].totalcirculation;
          var percentage = 0;
          if (current == previous) {
            this.allcirculationDistinctWebCountPrevious = "0%";
            this.allcirculationDistinctWebCountPreviouscolor = "neu";
          } else if (current > previous) {
            percentage = (parseInt(previous) / parseInt(current)) * 100;
            percentage = 100 - percentage;
            if (percentage == 0) {
              this.allcirculationDistinctWebCountPrevious =
                Math.round(percentage) + "%";
              this.allcirculationDistinctWebCountPreviouscolor = "neu";
            } else {
              this.allcirculationDistinctWebCountPrevious =
                "+" + Math.round(percentage) + "%";
              this.allcirculationDistinctWebCountPreviouscolor = "pos";
            }
          } else {
            percentage = (parseInt(current) / parseInt(previous)) * 100;
            percentage = 100 - percentage;
            if (percentage == 0) {
              this.allcirculationDistinctWebCountPrevious =
                Math.round(percentage) + "%";
              this.allcirculationDistinctWebCountPreviouscolor = "neu";
            } else {
              this.allcirculationDistinctWebCountPrevious =
                "-" + Math.round(percentage) + "%";
              this.allcirculationDistinctWebCountPreviouscolor = "neg";
            }
          }
        }
      },
      (err) => {
        this.circulationDistinctWebChart();
        console.log(err);
      }
    );
  }
  circulationDistinctWebChart() {
    //console.log(this.user);
    var sendchartsData = {
      clientid: localStorage.getItem("storageselectedclient"),
      fromdate: this.fromdate,
      todate: this.todate,
      type: "WEB",
      dimension: this.dimensionval,
    };
    // this.spinnerService.show();
    this.article.circulationDistinctChart(sendchartsData).subscribe(
      (res) => {
        this.chartCirculationWebData = [];
        this.chartCirculationWebLabel = [];
        var countres = res.length;
        this.ExportchartCirculationWebData = res;
        var nullcount = 0;

        if (countres > 6) {
          for (var i = 0; i < 7; i++) {
            if (res[i]._id.companys == null) {
              nullcount += res[i].count;
            } else if (res[i]._id.companys == "null") {
              nullcount += res[i].count;
            } else if (res[i]._id.companys.trim() == "") {
              nullcount += res[i].count;
            } else {
              this.chartCirculationWebLabel.push(res[i]._id.companys);
              this.chartCirculationWebData.push(
                (res[i].count / 1000000).toFixed(2)
              );
            }
          }
          if (nullcount > 0) {
            this.chartCirculationWebLabel.push("N.A.");
            this.chartCirculationWebData.push((nullcount / 1000000).toFixed(2));
          }
          var otherscount = 0;
          var flag = false;
          for (var i = 7; i < res.length; i++) {
            otherscount += res[i].count;
            flag = true;
          }
          if (flag) {
            this.chartCirculationWebLabel.push("others");
            this.chartCirculationWebData.push(
              (otherscount / 1000000).toFixed(2)
            );
          }
        } else {
          for (var i = 0; i < res.length; i++) {
            if (res[i]._id.companys == null) {
              nullcount += res[i].count;
            } else if (res[i]._id.companys == "null") {
              nullcount += res[i].count;
            } else if (res[i]._id.companys.trim() == "") {
              nullcount += res[i].count;
            } else {
              this.chartCirculationWebLabel.push(res[i]._id.companys);
              this.chartCirculationWebData.push(
                (res[i].count / 1000000).toFixed(2)
              );
            }
          }
          if (nullcount > 0) {
            this.chartCirculationWebLabel.push("N.A.");
            this.chartCirculationWebData.push((nullcount / 1000000).toFixed(2));
          }
        }

        this.chartCirculationWebDistinctDatasetsBar = [
          { data: this.chartCirculationWebData, label: "Sources Touched" },
        ];
        this.chartCirculationWebDistinctLabelsBar = this.chartCirculationWebLabel;

        for (var i = 0; i < this.chartCirculationWebLabel.length; i++) {
          if (this.allLabels.indexOf(this.chartCirculationWebLabel[i]) == -1) {
            this.allLabels.push(this.chartCirculationWebLabel[i]);
          }
        }
        if(this.colorscount  == 0){
          for (var i = 0; i < this.allLabels.length; i++) {
            this.allColors[this.allLabels[i]] = this.colors[i];
          }
        }

        for (var j = 0; j < this.chartCirculationWebLabel.length; j++) {
          this.displayColor[j] = this.allColors[
            this.chartCirculationWebLabel[j]
          ];
        }

        var chartcolors = [];
        for (var i = 0; i < this.chartCirculationWebLabel.length; i++) {
          chartcolors.push(this.allColors[this.chartCirculationWebLabel[i]]);
        }

        this.chartColorsBarWebReach = [
          {
            backgroundColor: chartcolors,
            hoverBackgroundColor: chartcolors,
            borderWidth: 0,
          },
        ];
        this.circulationWebAllChart();
      },
      (err) => {
        console.log(err);
        this.chartCirculationWebDistinctDatasetsBar = [];
        this.chartCirculationWebDistinctLabelsBar = [];
        this.circulationWebAllChart();
      }
    );
  }
  circulationWebAllChart() {
    //console.log(this.user);
    var sendchartsData = {
      clientid: localStorage.getItem("storageselectedclient"),
      fromdate: this.fromdate,
      todate: this.todate,
      type: "WEB",
      dimension: this.dimensionval,
    };
    // this.spinnerService.show();
    this.article.circulationAllChart(sendchartsData).subscribe(
      (res) => {
        this.chartCirculationWebAllData = [];
        this.chartCirculationWebAllLabel = [];
        var countres = res.length;
        this.ExportchartCirculationWebAllData = res;
        var nullcount = 0;

        if (countres > 6) {
          for (var i = 0; i < 7; i++) {
            if (res[i]._id.companys == null) {
              nullcount += res[i].count / 1000000;
            } else if (res[i]._id.companys == "null") {
              nullcount += res[i].count / 1000000;
            } else if (res[i]._id.companys.trim() == "") {
              nullcount += res[i].count / 1000000;
            } else {
              this.chartCirculationWebAllLabel.push(res[i]._id.companys);
              this.chartCirculationWebAllData.push(
                (res[i].count / 1000000).toFixed(2)
              );
            }
          }
          if (nullcount > 0) {
            this.chartCirculationWebAllLabel.push("N.A.");
            this.chartCirculationWebAllData.push(nullcount.toFixed(2));
          }
          var otherscount = 0;
          var flag = false;
          for (var i = 7; i < res.length; i++) {
            otherscount += res[i].count / 1000000;
            flag = true;
          }
          if (flag) {
            this.chartCirculationWebAllLabel.push("others");
            this.chartCirculationWebAllData.push(otherscount.toFixed(2));
          }
        } else {
          for (var i = 0; i < res.length; i++) {
            if (res[i]._id.companys == null) {
              nullcount += res[i].count / 1000000;
            } else if (res[i]._id.companys == "null") {
              nullcount += res[i].count / 1000000;
            } else if (res[i]._id.companys.trim() == "") {
              nullcount += res[i].count / 1000000;
            } else {
              this.chartCirculationWebAllLabel.push(res[i]._id.companys);
              this.chartCirculationWebAllData.push(
                (res[i].count / 1000000).toFixed(2)
              );
            }
          }
          if (nullcount > 0) {
            this.chartCirculationWebAllLabel.push("N.A.");
            this.chartCirculationWebAllData.push(nullcount.toFixed(2));
          }
        }

        this.chartCirculationWebAllDatasetsBar = [
          { data: this.chartCirculationWebAllData, label: "Sources Touched" },
        ];
        this.chartCirculationWebAllLabelsBar = this.chartCirculationWebAllLabel;
        for (var i = 0; i < this.chartCirculationWebAllLabel.length; i++) {
          if (
            this.allLabels.indexOf(this.chartCirculationWebAllLabel[i]) == -1
          ) {
            this.allLabels.push(this.chartCirculationWebAllLabel[i]);
          }
        }
        if(this.colorscount  == 0){
          for (var i = 0; i < this.allLabels.length; i++) {
            this.allColors[this.allLabels[i]] = this.colors[i];
          }
        }

        for (var j = 0; j < this.chartCirculationWebAllLabel.length; j++) {
          this.displayColor[j] = this.allColors[
            this.chartCirculationWebAllLabel[j]
          ];
        }

        var chartcolors = [];
        for (var i = 0; i < this.chartCirculationWebAllLabel.length; i++) {
          chartcolors.push(this.allColors[this.chartCirculationWebAllLabel[i]]);
        }

        this.chartColorsBarWebImpression = [
          {
            backgroundColor: chartcolors,
            hoverBackgroundColor: chartcolors,
            borderWidth: 0,
          },
        ];
        this.spinnerService.hide();
      },
      (err) => {
        this.chartCirculationWebAllDatasetsBar = [];
        this.chartCirculationWebAllLabelsBar = [];
        this.spinnerService.hide();
        console.log(err);
      }
    );
  }
  //=======================change selectd client form dropdownlist=============================//
  changeclient(value) {
    localStorage.setItem("storageselectedclient", value);
    //window.location.reload();
    this.getArticlebyDate("today");
    this.spinnerService.show();
    this.getcompanysAll();
  }
  getArticlebyDate(para) {
    $("#reset").hide();
    this.spinnerService.show();
    this.date = new Date();
    if (para == "7days") {
      $("#rangeCal").hide();
      var date = new Date();
      this.fromdate = formatDate(date, "yyy-MM-dd", "en", "");
      var todate = formatDate(
        date.setDate(date.getDate() - 6),
        "yyy-MM-dd",
        "en",
        ""
      );
      this.todate = todate;
      this.isActiveToday = false;
      this.isActiveYesterday = false;
      this.isActive7Days = true;
      this.isActivedaterange = false;
      localStorage.setItem("fromdate", this.fromdate);
      localStorage.setItem("todate", this.todate);
    } else if (para == "custom") {
      //$('#rangeCal').hide();
      this.fromdate = this.articlepara.fromdate;
      this.todate = this.articlepara.todate;
      //this.todate
      this.isActiveToday = false;
      this.isActive7Days = false;
      this.isActiveYesterday = false;
      this.isActivedaterange = true;
      localStorage.setItem("fromdate", this.fromdate);
      localStorage.setItem("todate", this.todate);
    } else if (para == "yesterday") {
      var date = new Date();
      var fromdate = formatDate(
        date.setDate(date.getDate() - 1),
        "yyy-MM-dd",
        "en",
        ""
      );
      var todate = fromdate;
      // var todate = formatDate(date.setDate(date.getDate() - 1), 'yyy-MM-dd', 'en', '');

      this.fromdate = fromdate;
      this.todate = todate;
      this.isActiveToday = false;
      this.isActive7Days = false;
      this.isActiveYesterday = true;
      this.isActivedaterange = false;
      localStorage.setItem("fromdate", this.fromdate);
      localStorage.setItem("todate", this.todate);
    } else {
      $("#rangeCal").hide();
      this.fromdate = formatDate(this.date, "yyy-MM-dd", "en", "");
      this.todate = formatDate(this.date, "yyy-MM-dd", "en", "");
      this.isActiveToday = true;
      this.isActive7Days = false;
      this.isActiveYesterday = false;
      this.isActivedaterange = false;
      localStorage.setItem("fromdate", this.fromdate);
      localStorage.setItem("todate", this.todate);
    }
    this.articlepara.type = "";
    this.articlepara.keytype = "";
    // this.articlepara.prominance = '';
    // this.articlepara.company = '';
    // this.articlepara.author = '';
    this.articlepara.publicationFilter = "";
    this.articlepara.fromdate = this.fromdate;
    this.articlepara.todate = this.todate;
    this.articlepara.clientid = localStorage.getItem("storageselectedclient");

    this.spinnerService.show();

    $("#config-demo")
      .data("daterangepicker")
      .setStartDate(
        formatDate(localStorage.getItem("todate"), "dd-MM-yyyy", "en", "")
      );
    $("#config-demo")
      .data("daterangepicker")
      .setEndDate(
        formatDate(localStorage.getItem("fromdate"), "dd-MM-yyyy", "en", "")
      );
    this.printChart();
  }
  getArticlebyDaterange(para) {
    if (para == "daterange") {
      this.isActiveToday = false;
      this.isActive7Days = false;
      this.isActiveYesterday = false;
      this.isActivedaterange = true;
    }
  }
  radio_dimesionChange(data) {
    var chartstype = data.target.value;
    this.dimensionval = chartstype;
    this.ngOnInit();
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
  printAllChart(chartname) {
    this.Modalchartname = chartname;
    if (chartname == "share of voice Print") {
      this.modalchartType = this.chartType2;
      this.modalchartDatasets = this.chartDatasets2;
      this.modalchartLabels = this.chartLabels2;
      this.modalchartColors = this.chartColors2;
      this.modalchartOptions = this.chartOptions2;
      this.modallegend = this.modaltrue;
      this.exportExceldata = this.ExportprintData;
      this.text = "Share of Voice";
    } else if (chartname == "share of Sources Touched Print") {
      this.modalchartType = this.chartTypeBar;
      this.modalchartDatasets = this.chartPrintDatasetsBar;
      this.modalchartLabels = this.chartPrintLabelsBar;
      this.modalchartColors = this.chartColorsBarsourcesPrint;
      this.modalchartOptions = this.chartOptionsBar;
      // this.modallegend = this.modalfalse;
      this.modallegend = "false";
      this.exportExceldata = [];
      for (var i = 0; i < this.ExportprintsourceData.length; i++) {
        this.exportExceldata.push({
          Company: this.ExportprintsourceData[i]._id.companys,
          count: this.ExportprintsourceData[i].count,
        });
      }
      this.text = "Rank on Source";
    } else if (chartname == "share of Impressions Touched Print") {
      this.modalchartType = this.chartTypeBar;
      this.modalchartDatasets = this.chartCirculationDistinctDatasetsBar;
      this.modalchartLabels = this.chartCirculationDistinctLabelsBar;
      this.modalchartColors = this.chartColorsBarReach;
      this.modalchartOptions = this.chartOptionsBar;
      this.modallegend = this.modalfalse;
      this.exportExceldata = [];
      for (var i = 0; i < this.ExportchartCirculationData.length; i++) {
        this.exportExceldata.push({
          Company: this.ExportchartCirculationData[i]._id.companys,
          count: this.ExportchartCirculationData[i].count,
        });
      }
      this.text = "Rank on Impressions";
    } else if (chartname == "share of Reach Touched Print") {
      this.modalchartType = this.chartTypeBar;
      this.modalchartDatasets = this.chartCirculationAllDatasetsBar;
      this.modalchartLabels = this.chartCirculationAllLabelsBar;
      this.modalchartColors = this.chartColorsBarImpression;
      this.modalchartOptions = this.chartOptionsBar;
      this.modallegend = this.modalfalse;
      this.exportExceldata = [];
      for (var i = 0; i < this.ExportchartCirculationAllData.length; i++) {
        this.exportExceldata.push({
          Company: this.ExportchartCirculationAllData[i]._id.companys,
          count: this.ExportchartCirculationAllData[i].count,
        });
      }
      this.text = "Rank on Reach";
    } else if (chartname == "share of voice Web") {
      this.modalchartType = this.chartType2;
      this.modalchartDatasets = this.chartDatasetsweb;
      this.modalchartLabels = this.chartLabelsweb;
      this.modalchartColors = this.chartColorsWeb;
      this.modalchartOptions = this.chartOptions2;
      this.modallegend = this.modaltrue;
      this.exportExceldata = this.ExportwebData;
      this.text = "Share of Voice";
    } else if (chartname == "share of Sources Touched Web") {
      this.modalchartType = this.chartTypeBar;
      this.modalchartDatasets = this.chartWebDatasetsBar;
      this.modalchartLabels = this.chartWebLabelsBar;
      this.modalchartColors = this.chartColorsBarsourcesweb;
      this.modalchartOptions = this.chartOptionsBar;
      this.modallegend = this.modalfalse;
      this.exportExceldata = [];
      for (var i = 0; i < this.ExportwebsourceData.length; i++) {
        this.exportExceldata.push({
          Company: this.ExportwebsourceData[i]._id.companys,
          count: this.ExportwebsourceData[i].count,
        });
      }
      this.text = "Rank on Source";
    } else if (chartname == "share of voice Twitter") {
      this.modalchartType = this.chartType2;
      this.modalchartDatasets = this.chartDatasetstv;
      this.modalchartLabels = this.chartLabelstv;
      this.modalchartColors = this.chartColorstv;
      this.modalchartOptions = this.chartOptions2;
      this.modallegend = this.modaltrue;
      this.exportExceldata = this.ExporttvData;
      this.text = "Share of Voice";
    } else if (chartname == "share of Sources Touched Twitter") {
      this.modalchartType = this.chartTypeBar;
      this.modalchartDatasets = this.charttwitterDatasetsBar;
      this.modalchartLabels = this.charttwitterLabelsBar;
      this.modalchartColors = this.chartColorsBarsourcestwitter;
      this.modalchartOptions = this.chartOptionsBar;
      this.modallegend = this.modalfalse;
      this.exportExceldata = [];
      for (var i = 0; i < this.ExporttwittersourceData.length; i++) {
        this.exportExceldata.push({
          Company: this.ExporttwittersourceData[i]._id.companys,
          count: this.ExporttwittersourceData[i].count,
        });
      }
      this.text = "Rank on Sources";
    } else if (chartname == "share of Impressions Touched Web") {
      this.modalchartType = this.chartTypeBar;
      this.modalchartDatasets = this.chartCirculationWebDistinctDatasetsBar;
      this.modalchartLabels = this.chartCirculationWebDistinctLabelsBar;
      this.modalchartColors = this.chartColorsBarWebReach;
      this.modalchartOptions = this.chartOptionsBar;
      this.modallegend = this.modalfalse;
      this.exportExceldata = [];
      for (var i = 0; i < this.ExportchartCirculationWebData.length; i++) {
        this.exportExceldata.push({
          Company: this.ExportchartCirculationWebData[i]._id.companys,
          count: this.ExportchartCirculationWebData[i].count,
        });
      }
      this.text = "Rank on Impressions Web";
    } else if (chartname == "share of Reach Touched Web") {
      this.modalchartType = this.chartTypeBar;
      this.modalchartDatasets = this.chartCirculationWebAllDatasetsBar;
      this.modalchartLabels = this.chartCirculationWebAllLabelsBar;
      this.modalchartColors = this.chartColorsBarWebImpression;
      this.modalchartOptions = this.chartOptionsBar;
      this.modallegend = this.modalfalse;
      this.exportExceldata = [];
      for (var i = 0; i < this.ExportchartCirculationWebAllData.length; i++) {
        this.exportExceldata.push({
          Company: this.ExportchartCirculationWebAllData[i]._id.companys,
          count: this.ExportchartCirculationWebAllData[i].count,
        });
      }
      this.text = "Rank on Reach Web";
    }
    $("#centralModalLg").modal("show");
  }
  download_img = function(el) {
    var canvas = $("#centralModalLg canvas")[0];
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
    var el = $(".chartdownloadoptions .dropdown-item")[1];
    var link = el;
    link.download = this.text + ".jpeg";
    link.href = image;
  };
  download_data = function() {
    // console.log(this.exportExceldata);
    var excelService: ExcelService;
    this.excelService.exportAsExcelFile(this.exportExceldata, "Data");
  };
}
