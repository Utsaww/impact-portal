import { ExcelService } from "./../sharedServices";
import { AppSetting } from "./../appsetting";
import { HelperService } from "./../helperservice";
import { ClientService } from "./../clientservice";
import { HttpClient } from "@angular/common/http";
import { ArticleService } from "./../articleservice";
import { Component, OnInit, ElementRef } from "@angular/core";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { Md5 } from "md5-typescript";
import { formatDate } from "@angular/common";
import * as FileSaver from "file-saver";
import { Router } from "@angular/router";
import { timeout } from "q";
import { startsWithPipe } from "../customstart.pipes";
import { NgDatepickerModule } from "ng2-datepicker";
import { NgSelectModule, NgOption } from "@ng-select/ng-select";
import { FilterPipe } from "ngx-filter-pipe";
import { Title } from "@angular/platform-browser";

declare var $: any;
@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.css"]
})
export class MainComponent implements OnInit {
  public qualifiedarticleid = "";
  loading = false;
  public info = [];
  public clientlist = [];
  public selectedmail = [];

  searchText;
  substractNmin; //substract n min from now
  public totalcount = 0;
  public printcount = 0;
  public webcount = 0;
  public twittercount = 0;
  public tvcount = 0;
  p: number = 1;
  elementRef: ElementRef;
  public selectedclient;
  public enableForWeb = true;
  isActiveAll = true;
  isActiveCompany = false;
  isActiveCompetition = false;
  IsActiveIndustry = false;
  activeTypeall = true;
  activeTypeprint = false;
  activeTypeweb = false;
  activeTypetv = false;
  activeTypeTwitter = false;
  editionDisableValue = false;
  languageDisableValue = false;

  checkedArticle: Array<any> = [];
  cpqualifyArticle: Array<any> = [];
  SelRejectedArticles: Array<any> = [];
  displymailarticles: Array<any> = [];

  public isArticle = false;
  private dossierUrl = "";
  isActiveToday = false;
  isActiveYesterday = false;
  isActive7Days = false;
  isActivedaterange = false;
  date = new Date();
  // fromdate = formatDate(this.date, "yyy-MM-dd", 'en', '');
  // todate = formatDate(this.date, "yyy-MM-dd", 'en', '');
  fromdate = "";
  todate = "";
  articlecount = 0;
  pagecount = "";
  limitarticles = 0;
  resultpage = 1;
  articleidsfulltext = [];
  resultArticle = "";
  selectedarticles = 0;
  excelurl = "";
  enableforprint = false;
  enableforweb = false;
  enableForTwitter = false;
  enableforbr = false;
  enablefordash = false;

  sortdateicon = true;
  sortpubicon = true;
  sortnewsicon = true;
  sortprominenceicon = true;

  display = "none";
  copyq = false;
  selectq = false;
  copyselected = [];

  isqualify = false;

  qid = false;

  resarray = [];

  public email;
  public comment;

  public showcasearticle = [];

  vdourl = "";

  brshow = true;
  query: string = "";

  selectedAll: any;

  selected = false;
  dropdownList = [];
  allPublicationList = [];
  dropdownListEdition = [];
  dropdownListLanguage = [];
  dropdownListKeyword = [];
  selectedItems = [];
  selectedItemsEdition = [];
  dropdownSettings = {};
  dropdownSettingsEdition = {};
  publicationFilter = "";
  company_keyword = "";
  editionFilter = "";
  languageFilter = "";
  keywordFilter = "";
  selectedCityIds: "";
  selectedPubIds: "";
  selectedLanguafeIds: "";
  public selectedKeywords = [];

  public dashdisabledClass = "";

  calenderdateFrom: Date;
  calenderdateTwo: Date;
  options: NgDatepickerModule = {
    minYear: 2017,
    maxYear: 2030,
    displayFormat: "YYYY-MM-DD"
  };

  public clientid = "";
  selRejectReason = "";
  userEmail = "";
  public articlepara = {
    clientid: this.clientid,
    page: 1,
    type: "All",
    keytype: "",
    sortdate: "current",
    sortpub: "",
    sortedi: "",
    sortnews: "",
    sortprominence: "",
    fromdate: localStorage.getItem("fromdate"),
    todate: localStorage.getItem("todate"),
    publicationFilter: "",
    editionFilter: "",
    languageFilter: "",
    keywordFilter: this.selectedKeywords,
    showcasefilter: "",
    qualificatinFilter: "",
    newscategoryFilter: "",
    selRejectReason: "",
    userEmail: "",
    company_keyword: "",
    fullTextKeyword: "",
    within_check: ""
  };
  user = {
    email: localStorage.getItem("email")
  };
  constructor(
    private article: ArticleService,
    private http: HttpClient,
    elementRef: ElementRef,
    private _client: ClientService,
    private spinnerService: Ng4LoadingSpinnerService,
    private helper: HelperService,
    private excelService: ExcelService,
    private router: Router,
    private filterPipe: FilterPipe,
    private title: Title
  ) {
    this.elementRef = elementRef;
    this.calenderdateFrom = new Date();
    this.calenderdateTwo = new Date();
  }
  ngOnInit() {
    //set Page Title
    this.title.setTitle("Smart Manage");

    //check if user is login.
    if (this.user.email == null) {
      localStorage.clear();
      window.location.replace(location.origin);
    }

    if (localStorage.getItem("advanceSearchStorage") === "Yes") {
      //$("#searchmodal").modal("show");
      this.advanceSearchModal();
      localStorage.setItem("advanceSearchStorage", "");
    }

    var self = this;
    $(".bs-tooltip-right .arrow").css("display", "none");
    $(".tooltip-inner").css("display", "none");
    $('[data-toggle="tooltip"]').tooltip();

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
        $(".dvresponsivedaterange").css("display", "none");
        $("#selectedTypedaterange").html("Today");
      } else if (fromdate == todate && todate == yesterday) {
        this.isActiveToday = false;
        this.isActiveYesterday = true;
        this.isActivedaterange = false;
        this.isActive7Days = false;
        $("#rangeCal").css("display", "none");
        $(".dvresponsivedaterange").css("display", "none");
        $("#selectedTypedaterange").html("Yesterday");
      } else if (todate == last7days && fromdate == currentdate) {
        this.isActive7Days = true;
        this.isActiveToday = false;
        this.isActiveYesterday = false;
        this.isActivedaterange = false;
        $("#rangeCal").css("display", "none");
        $(".dvresponsivedaterange").css("display", "none");
        $("#selectedTypedaterange").html("Last 7 Days");
      } else {
        this.isActiveToday = false;
        this.isActiveYesterday = false;
        this.isActivedaterange = true;
        this.isActive7Days = false;
        $("#rangeCal").css("display", "");
        $(".dvresponsivedaterange").css("display", "none");
        $("#selectedTypedaterange").html("Custom");
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
    // localStorage.setItem('storageselectedclient', localStorage.getItem('storageselectedclient'));
    if (localStorage.length == 0) {
      window.location.replace(location.origin);
    }

    //check all section start
    $("#checkAll").change(function() {
      var status = $(this).is(":checked") ? true : false;
      $(".checkedarticlesList").prop("checked", status);
      var i = 0;
      $("input:checkbox.checkedarticlesList").each(function() {
        var sThisVal = this.checked ? $(this).val() : "";
        //alert(sThisVal);
        var alreadycheckedid = self.checkedArticle.indexOf(sThisVal);
        if (alreadycheckedid == -1) {
          self.onChangecheckbox(sThisVal, "", "", 0, this.checked); // store in array
        }
      });
    });

    $(".selectperiod a").click(function() {
      // var selectedval = $(this).html();
      var selectedval = $(this)
        .find("span")
        .html();
      $("#selectedType").html(selectedval);
    });

    $(".selectnewsrange a").click(function() {
      // var selectedval = $(this).html();
      var selectedval = $(this).html();
      $("#selectedTypedaterange").html(selectedval);
      if (selectedval == "Custom") {
        $(".dvresponsivedaterange").css("display", "none");
      } else {
        $(".dvresponsivedaterange").css("display", "none");
      }
    });

    $(".summary").off("click");
    $(".summary").click(function() {
      //alert("hi");
      console.log("hello");
    });
    $("#dateclick").click(function() {
      $("#rangeCal").toggle();
    });
    updateConfig();
    function updateConfig() {
      var today = new Date();
      var options: { dateLimit: String } = { dateLimit: "" };

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

      $(".config-demo").daterangepicker(
        {
          // "maxDate": today,
          startDate: todate,
          endDate: fromdate,
          dateLimit: { days: 95 }
        },
        function(start, end, label) {
          var startDateRange = start.format("YYYY-MM-DD");
          var endDateRange = end.format("YYYY-MM-DD");

          self.articlepara.fromdate = endDateRange;
          self.articlepara.todate = startDateRange;

          localStorage.setItem("fromdate", endDateRange);
          localStorage.setItem("todate", startDateRange);

          self.getallarticles();
        }
      );
    }

    //});  //commented by shk for data not loading on calender event end

    this.Clients();
    //this.getallarticles();

    //console.log("here"+self._client.getPrintStatus(self.clientlist,self.articlepara.clientid));

    /************LOAD JAVASCRIPT***********/
  }
  selectAll() {
    this.selectedKeywords = this.dropdownListKeyword.map(x => x.name);
  }

  onInput(event: any) {
    const newValue = event.target.value.replace(/[^0-9]/g, "");
    event.target.value = newValue;
  }
  unselectAll() {
    this.selectedKeywords = [];
  }
  groupByFn = item => item.KeyType + " (" + item.ktype + ")";
  groupValueFn = (_: string, children: any[]) => ({
    name: children[0].KeyType + " (" + children[0].ktype + ")",
    total: children.length
  });
  onActivate(event) {
    $("#news-table-body").animate(
      {
        scrollTop: 0
      },
      "slow"
    );
  }
  getallarticles() {
    var date = new Date();
    //subtract 10 minutes from the current time.
    var minute = date.setMinutes(date.getMinutes() - 20);
    this.substractNmin = formatDate(
      new Date(minute),
      "yyyy-MM-dd HH:mm:ss",
      "en",
      ""
    );

    this.spinnerService.show();

    $("#news-table-body").animate(
      {
        scrollTop: 0
      },
      "slow"
    );
    this.article.getarticles(this.articlepara).subscribe(
      res => {
        // console.log(res.docs);
        this.info = res.docs;
        this.totalcount = res.total;
        this.printcount = res.total;
        this.webcount = res.total;
        this.twittercount = res.total;
        this.tvcount = res.total;
        this.pagecount = res.pages;
        this.limitarticles = res.limit;
        this.resultpage = res.page;
        this.articleidsfulltext = res.docs.map(doc => doc.articleid);
        const articleIdsString = this.articleidsfulltext.join(",");
        const countf = articleIdsString.split(",");
        const count = countf.length;
        // console.log(count);
        // console.log(typeof articleIdsString);
        // console.log(this.articleidsfulltext);

        if (
          this.totalcount >
          (this.resultpage - 1) * this.limitarticles + this.limitarticles
        ) {
          this.resultArticle =
            (this.resultpage - 1) * this.limitarticles +
            1 +
            " - " +
            ((this.resultpage - 1) * this.limitarticles + this.limitarticles);
        } else {
          this.resultArticle =
            (this.resultpage - 1) * this.limitarticles +
            1 +
            " - " +
            this.totalcount;
        }

        this.spinnerService.hide();

        if (this.articlepara.publicationFilter == undefined) {
          this.articlepara.publicationFilter = "";
        }
        if (this.articlepara.editionFilter == undefined) {
          this.articlepara.editionFilter = "";
        }
        if (this.articlepara.languageFilter == undefined) {
          this.articlepara.languageFilter = "";
        }
        if (this.articlepara.keywordFilter == undefined) {
          this.articlepara.keywordFilter = [];
        }

        if (this.articlepara.type == "print,web,tv,twitter") {
          this.articlepara.type = "All";
        }
        if (
          this.articlepara.keytype ==
          "My Company Keyword,My Competitor Keyword,My Industry Keyword"
        ) {
          this.articlepara.keytype = "";
        }
        var keywordAsString = JSON.parse(
          JSON.stringify(this.articlepara.keywordFilter)
        );
        var encodeKeyword = encodeURIComponent(keywordAsString);
        var emailstr = this.user.email;
        var emailarray = emailstr.split("@");
        var emaildomain = emailarray[1];

        // console.log(this.articlepara.fullTextKeyword);
        if (
          this.articlepara.fullTextKeyword !== "" &&
          typeof this.articlepara.fullTextKeyword !== "undefined"
        ) {
          this.excelurl =
            AppSetting.EXCELSERVER +
            "excelfulltext.php?xlu=" +
            Md5.init(emaildomain) +
            "&fd=" +
            this.articlepara.todate +
            "&td=" +
            this.articlepara.fromdate +
            "&client=" +
            this.articlepara.clientid +
            "&keytype=" +
            this.articlepara.keytype +
            "&type=" +
            this.articlepara.type +
            "&publication=" +
            this.articlepara.publicationFilter +
            "&edition=" +
            this.articlepara.editionFilter +
            "&language=" +
            this.articlepara.languageFilter +
            "&keyword=" +
            encodeKeyword +
            "&newscategory=" +
            this.articlepara.newscategoryFilter +
            "&comorkey=" +
            this.articlepara.company_keyword +
            "&q=" +
            this.articlepara.qualificatinFilter +
            "&fulltextQuery=" +
            this.articlepara.fullTextKeyword +
            "&articleids=" +
            articleIdsString;
        } else {
          this.excelurl =
            AppSetting.EXCELSERVER +
            "smart-excel.php?xlu=" +
            Md5.init(emaildomain) +
            "&fd=" +
            this.articlepara.todate +
            "&td=" +
            this.articlepara.fromdate +
            "&client=" +
            this.articlepara.clientid +
            "&keytype=" +
            this.articlepara.keytype +
            "&type=" +
            this.articlepara.type +
            "&publication=" +
            this.articlepara.publicationFilter +
            "&edition=" +
            this.articlepara.editionFilter +
            "&language=" +
            this.articlepara.languageFilter +
            "&keyword=" +
            encodeKeyword +
            "&newscategory=" +
            this.articlepara.newscategoryFilter +
            "&comorkey=" +
            this.articlepara.company_keyword +
            "&q=" +
            this.articlepara.qualificatinFilter;
        }
        //console.log(res);

        $(".bs-tooltip-right .arrow").css("display", "none");
        $(".tooltip-inner").css("display", "none");
        $('[data-toggle="tooltip"]').tooltip();

        this.spinnerService.hide();
      },
      err => {
        console.log(err);
        this.spinnerService.hide();
      }
    );
    this.selectedclient = this.articlepara.clientid;
  }

  onChange(valuechanged) {
    console.log(valuechanged);
  }
  Clients() {
    // console.log(this.user);
    this.spinnerService.show();
    this._client.getClients(this.user).subscribe(
      res => {
        // console.log(res);
        this.clientlist = res;
        if (!localStorage.hasOwnProperty("storageselectedclient")) {
          this.clientid = this.clientlist[0].clientid;
          localStorage.setItem("storageselectedclient", this.clientid);
          this.getclientarticles(this.clientid);
        } else {
          this.clientid = localStorage.getItem("storageselectedclient");
          this.getclientarticles(this.clientid);
        }
      },
      err => {
        console.log(err);
      },
      () => {
        this.getallarticles();
        // console.log(this.clientlist);
        this.enableforprint = this._client.getPrintStatus(
          this.clientlist,
          this.articlepara.clientid
        );
        // console.log(this.enableforprint);
        this.enableforweb = this._client.getWebStatus(
          this.clientlist,
          this.articlepara.clientid
        );
        this.enableForTwitter = this._client.getTwitterStatus(
          this.clientlist,
          this.articlepara.clientid
        );
        // console.log(this.enableforweb);
        this.enableforbr = this._client.getBrStatus(
          this.clientlist,
          this.articlepara.clientid
        );

        this.enablefordash = this._client.getDashStatus(
          this.clientlist,
          this.articlepara.clientid
        );

        if (this.enablefordash == true) {
          localStorage.setItem("storageEnableForDash", "Yes");
        } else {
          localStorage.setItem("storageEnableForDash", "No");
        }

        if (this.enablefordash) {
          this.dashdisabledClass = "";
        } else {
          this.dashdisabledClass = "menudisabled";
        }
      }
    );
  }
  pageChanged(page) {
    $("#checkAll").prop("checked", false); // uncheck to next page
    this.articlepara.page = page;
    this.p = page;
    this.getallarticles();
  }
  getclientarticles(value) {
    this.enablefordash = this._client.getDashStatus(this.clientlist, value);

    if (this.enablefordash) {
      this.dashdisabledClass = "";
    } else {
      this.dashdisabledClass = "menudisabled";
    }

    if (this.enablefordash == true) {
      localStorage.setItem("storageEnableForDash", "Yes");
    } else {
      localStorage.setItem("storageEnableForDash", "No");
    }

    localStorage.setItem("storageselectedclient", value);
    $("#rangeCal").hide();
    this.isActiveToday = true;
    this.isActiveYesterday = false;
    this.isActivedaterange = false;
    this.isActive7Days = false;
    this.isActiveCompetition = false;
    this.IsActiveIndustry = false;
    this.isActiveCompany = false;
    this.activeTypeall = true;
    this.activeTypeprint = false;
    this.activeTypeweb = false;
    this.activeTypeTwitter = false;
    this.activeTypetv = false;
    this.articlepara.keytype = "";
    this.articlepara.showcasefilter = "";
    this.articlepara.fullTextKeyword = "";
    this.articlepara.within_check = "";
    this.articlepara.newscategoryFilter = "";
    this.articlepara.type = "All";
    this.p = 1;
    this.articlepara.page = 1;
    this.articlepara.clientid = value;
    this.articlepara.sortdate = "current";
    this.articlepara.sortpub = "desc";
    this.articlepara.sortedi = "";
    this.articlepara.sortnews = "desc";
    // this.isActiveToday = true;
    this.selectedarticles = 0;
    this.checkedArticle = [];
    this.cpqualifyArticle = [];
    this.qid = false;
    this.articlepara.publicationFilter = "";
    this.articlepara.editionFilter = "";
    this.articlepara.languageFilter = "";
    this.articlepara.keywordFilter = [];
    this.isActiveAll = true;
    this.isArticle = false;

    this.calenderdateFrom = new Date();
    this.calenderdateTwo = new Date();

    //Re-Set All advance search parameter.
    $("#print_media_type").prop("checked", false);
    $("#web_media_type").prop("checked", false);
    $("#twitter_media_type").prop("checked", false);
    $("#tv_media_type").prop("checked", false);

    $("#company_filter").prop("checked", false);
    $("#competitor_filter").prop("checked", false);
    $("#industry_filter").prop("checked", false);

    $("#client_company").prop("checked", false);
    $("#showcase_check").prop("checked", false);
    $("#qualified_check").prop("checked", false);

    $("#news_categort_newspaper").prop("checked", false);
    $("#news_categort_magazine").prop("checked", false);

    this.selectedPubIds = "";
    this.selectedCityIds = "";
    this.selectedLanguafeIds = "";
    this.selectedKeywords = [];
    //Re-Set All advance search parameter end .

    $("#duration_aria").show();
    $("#Search_reset").hide();

    this.getArticlebyDate("today");

    //this.getallarticles();
    // console.log(this.clientlist);
    this.enableforprint = this._client.getPrintStatus(
      this.clientlist,
      this.articlepara.clientid
    );
    // console.log(this.enableforprint);
    this.enableforweb = this._client.getWebStatus(
      this.clientlist,
      this.articlepara.clientid
    );
    this.enableForTwitter = this._client.getTwitterStatus(
      this.clientlist,
      this.articlepara.clientid
    );
    // console.log(this.enableforweb);
    this.enableforbr = this._client.getBrStatus(
      this.clientlist,
      this.articlepara.clientid
    );
    // console.log(this.enableforbr);
    this.enablefordash = this._client.getDashStatus(
      this.clientlist,
      this.articlepara.clientid
    );
  }
  getarticlesbykeytype(keytype) {
    if (keytype === "company") {
      this.isActiveCompetition = false;
      this.IsActiveIndustry = false;
      this.isActiveCompany = true;
      this.isActiveAll = false;
      this.articlepara.keytype = "1";
    }
    if (keytype === "competition") {
      this.isActiveCompetition = true;
      this.IsActiveIndustry = false;
      this.isActiveCompany = false;
      this.articlepara.keytype = "2";
      this.isActiveAll = false;
    }
    if (keytype === "industry") {
      this.isActiveCompetition = false;
      this.IsActiveIndustry = true;
      this.isActiveCompany = false;
      this.isActiveAll = false;
      this.articlepara.keytype = "3";
    }
    if (keytype === "all") {
      this.isActiveCompetition = false;
      this.IsActiveIndustry = false;
      this.isActiveCompany = false;
      this.isActiveAll = true;
      this.articlepara.keytype = "";
    }
    this.p = 1;
    this.articlepara.page = 1;
    this.getallarticles();
  }

  sort(para) {
    if (para === "date") {
      this.articlepara.sortnews = "";
      this.articlepara.sortpub = "";
      this.articlepara.sortedi = "";
      this.articlepara.sortprominence = "";
      if (this.articlepara.sortdate == "desc") {
        this.articlepara.sortdate = "asc";
        this.sortdateicon = true;
      } else {
        this.articlepara.sortdate = "desc";
        this.sortdateicon = false;
      }
      console.log(this.sortdateicon);
    }
    if (para === "pub") {
      this.articlepara.sortdate = "";
      this.articlepara.sortnews = "";
      this.articlepara.sortprominence = "";
      this.articlepara.sortedi = "";
      if (this.articlepara.sortpub == "desc") {
        this.articlepara.sortpub = "asc";
        this.sortpubicon = true;
      } else {
        this.articlepara.sortpub = "desc";
        this.sortpubicon = false;
      }
    }

    if (para === "edi") {
      this.articlepara.sortdate = "";
      this.articlepara.sortnews = "";
      this.articlepara.sortprominence = "";
      this.articlepara.sortpub = "";
      if (this.articlepara.sortedi == "desc") {
        this.articlepara.sortedi = "asc";
        this.sortpubicon = true;
      } else {
        this.articlepara.sortedi = "desc";
        this.sortpubicon = false;
      }
    }

    if (para === "news") {
      this.articlepara.sortdate = "";
      this.articlepara.sortpub = "";
      this.articlepara.sortprominence = "";
      if (this.articlepara.sortnews == "desc") {
        this.articlepara.sortnews = "asc";
        this.sortnewsicon = true;
      } else {
        this.articlepara.sortnews = "desc";
        this.sortnewsicon = false;
      }
    }
    if (para === "prominence") {
      this.articlepara.sortdate = "";
      this.articlepara.sortpub = "";
      this.articlepara.sortedi = "";
      this.articlepara.sortnews = "";
      if (this.articlepara.sortprominence == "asc") {
        this.articlepara.sortprominence = "desc";
        this.sortprominenceicon = false;
      } else {
        this.articlepara.sortprominence = "asc";
        this.sortprominenceicon = true;
      }
    }

    this.getallarticles();
  }

  getFullTextArticle() {
    this.articlepara.fullTextKeyword = $("#fullTextHomePage").val();
    // this.articlepara.within_check = $("#fullTextHomePage").val();
    this.getallarticles();
  }

  getArticlebyType(para) {
    $("#checkAll").prop("checked", false); // uncheck select all
    if (para == "all") {
      this.articlepara.type = "All";
      this.activeTypeall = true;
      this.activeTypeprint = false;
      this.activeTypeweb = false;
      this.activeTypeTwitter = false;
      this.activeTypetv = false;
    }
    if (para == "web") {
      this.articlepara.type = "web";
      this.activeTypeall = false;
      this.activeTypeprint = false;
      this.activeTypeweb = true;
      this.activeTypeTwitter = false;
      this.activeTypetv = false;
    }

    if (para == "TWITTER") {
      this.articlepara.type = "TWITTER";
      this.activeTypeall = false;
      this.activeTypeprint = false;
      this.activeTypeweb = false;
      this.activeTypeTwitter = true;
      this.activeTypetv = false;
    }
    if (para == "print") {
      this.articlepara.type = "print";
      this.activeTypeall = false;
      this.activeTypeprint = true;
      this.activeTypeweb = false;
      this.activeTypeTwitter = false;
      this.activeTypetv = false;
    }
    if (para == "tv") {
      this.articlepara.type = "tv";
      this.activeTypeall = false;
      this.activeTypeprint = false;
      this.activeTypeweb = false;
      this.activeTypeTwitter = false;
      this.activeTypetv = true;
    }
    if (this.isActiveCompany) {
      this.isActiveCompetition = false;
      this.IsActiveIndustry = false;
      this.isActiveAll = false;
    } else if (this.IsActiveIndustry) {
      this.isActiveCompetition = false;
      this.isActiveCompany = false;
      this.isActiveAll = false;
    } else if (this.isActiveCompetition) {
      this.IsActiveIndustry = false;
      this.isActiveCompany = false;
      this.isActiveAll = false;
    } else {
      this.isActiveCompetition = false;
      this.IsActiveIndustry = false;
      this.isActiveCompany = false;
      this.isActiveAll = true;
    }

    // this.isActiveCompany = false;
    // this.isActiveCompetition = false;
    // this.IsActiveIndustry = false;
    // this.isActiveAll = false;

    //this.articlepara.keytype = "";
    this.printcount = 0;
    this.webcount = 0;
    this.twittercount = 0;
    this.tvcount = 0;
    this.totalcount = 0;
    // this.isActiveAll = true;

    this.getallarticles();
  }

  onChangecheckbox(
    articleid: string,
    headline: string,
    publication: string,
    qlength: Number,
    isChecked: boolean
  ) {
    this.cpqualifyArticle = [];
    //let valuetoadd = {};
    //valuetoadd['articleid'] = articleid;
    //valuetoadd['headline'] = headline;
    // valuetoadd['publication'] = publication;
    // console.log(articleid);
    //  console.log(headline);

    //alert(qlength); //shkhan for copy qualification
    //qlength == 1 shkhan, for hide copy
    if (qlength == 100 && this.qualifiedarticleid == "") {
      this.qualifiedarticleid = articleid;
      this.isqualify = true;
      if (isChecked) {
        this.checkedArticle.push(articleid);
        this.cpqualifyArticle.push(articleid);
        this.selectq = true;

        //old
        /*
        this.article.getQualifyArticle(articleid, this.articlepara)
          .subscribe(
            res => {
              console.log(res);
              this.copyselected = res;

            },
            err => {
              console.log(err);
            },
            () => {
              console.log("response");
            }
          )*/
      } else {
        let index = this.checkedArticle.indexOf(articleid);
        this.checkedArticle.splice(index, 1);
        let index2 = this.cpqualifyArticle.indexOf(articleid);
        this.cpqualifyArticle.splice(index2, 1);
        this.selectq = false;
      }
      if (this.checkedArticle.length > 0) {
        this.isArticle = true;
      } else if (this.checkedArticle.length > 25) {
        this.isArticle = true;
      } else if (this.checkedArticle.length == 0) {
        this.checkedArticle = [];
        this.cpqualifyArticle = [];
        this.selectedarticles = 0;
        this.isArticle = false;
        this.copyq = false;
        this.selectq = false;
        // alert("here");
        this.isArticle = false;
        this.copyq = false;
      } else {
        //  alert("here");
        this.isArticle = false;
        this.copyq = false;
      }
      this.selectedarticles = this.checkedArticle.length;
    } else {
      if (isChecked) {
        this.checkedArticle.push(articleid);
      } else {
        let index = this.checkedArticle.indexOf(articleid);
        this.checkedArticle.splice(index, 1);
        let index2 = this.cpqualifyArticle.indexOf(articleid);
        this.cpqualifyArticle.splice(index2, 1);
      }
      if (this.checkedArticle.length > 0) {
        this.isArticle = true;
      } else if (this.checkedArticle.length > 25) {
        this.isArticle = true;
      } else if (this.checkedArticle.length == 0) {
        this.checkedArticle = [];
        this.cpqualifyArticle = [];
        this.selectedarticles = 0;
        this.selectq = false;
        this.isArticle = false;
        this.copyq = false;
        this.selectq = false;
        // alert("there");
        this.isArticle = false;
        this.copyq = false;
      } else {
        //alert("here");
        this.isArticle = false;
        this.copyq = false;
      }
      this.selectedarticles = this.checkedArticle.length;
    }

    console.log(this.checkedArticle);
  }
  SendMail() {
    var selectedArt = this.checkedArticle;
    if (this.checkedArticle.length == 0) {
      return false;
    }
    var selectedJSON = {};
    for (var i = 0; i < selectedArt.length; i++) {
      selectedJSON[i] = selectedArt[i];
    }
    var selectedArticles = selectedJSON;
    var EmailId = $("#txtEmail").val();
    var CommentSend = $("#txtComment").val();
    var Subject = $("#txtSubject").val();

    if (EmailId == "") {
      $("#txtEmail").addClass("alert alert-danger");
      return false;
    }

    if (Subject == "") {
      $("#txtSubject").addClass("alert alert-danger");
      return false;
    }

    this.spinnerService.show();
    var postData_Add = {
      articlepara: this.articlepara,
      selectedArt: selectedArt,
      ToEmailId: EmailId,
      CommentSend: CommentSend,
      FromMail: this.user.email,
      Subject: Subject
    };
    // var postData_Add = {
    //   a:"text"
    // };
    var postData_Add_Send = $(this).serialize() + "&" + $.param(postData_Add);
    this.article
      .sendMail(postData_Add)
      // this.article.sendMail("Ruchi")
      .subscribe(
        res => {
          console.log(res);
          // this.selectedmail = res;
          this.spinnerService.hide();
          $("#txtEmail").val("");
          $("#txtComment").val("");
          $("#txtSubject").val("");
          $("#mailmodal").modal("hide");
        },
        err => {
          console.log(err);
          this.spinnerService.hide();
        }
      );
  }

  searchArticles() {
    this.articlepara.showcasefilter = "";
    this.articlepara.qualificatinFilter = "";
    this.articlepara.fullTextKeyword = "";
    this.articlepara.newscategoryFilter = "";
    this.articlepara.type = "";
    this.articlepara.keytype = "";

    if ($("#print_media_type:checked").val() === "print") {
      this.articlepara.type = "print";
    }

    if ($("#web_media_type:checked").val() === "web") {
      this.articlepara.type = this.articlepara.type + "," + "web";
    }

    if ($("#twitter_media_type:checked").val() === "twitter") {
      this.articlepara.type = this.articlepara.type + "," + "twitter";
    }

    if ($("#tv_media_type:checked").val() === "tv") {
      this.articlepara.type = this.articlepara.type + "," + "tv";
    }

    if ($("#company_filter:checked").val() === "myCom") {
      this.articlepara.keytype = "My Company Keyword";
    }

    if ($("#competitor_filter:checked").val() === "myCottr") {
      this.articlepara.keytype =
        this.articlepara.keytype + "," + "My Competitor Keyword";
    }

    if ($("#industry_filter:checked").val() === "myInd") {
      this.articlepara.keytype =
        this.articlepara.keytype + "," + "My Industry Keyword";
    }

    if ($("#showcase_check:checked").val() === "1") {
      this.articlepara.showcasefilter = "1";
    }

    if ($("#qualified_check:checked").val() === "1") {
      this.articlepara.qualificatinFilter = "1";
    }
    this.articlepara.fullTextKeyword = $("#fullText").val();
    this.articlepara.within_check = $("#withinwords").val();

    if ($("#news_categort_newspaper:checked").val() === "newspaper") {
      this.articlepara.newscategoryFilter = "Newspaper";
    }

    if ($("#news_categort_magazine:checked").val() === "magazine") {
      this.articlepara.newscategoryFilter = "Magazine";
    }
    ///////////////News Category end

    //this.fromdate = formatDate($("#datepicker-1").val(), 'yyy-MM-dd', 'en', '');
    //this.todate = formatDate($("#datepicker-0").val(), 'yyy-MM-dd', 'en', '');

    //this.fromdate = formatDate(this.calenderdateTwo, 'yyy-MM-dd', 'en', '');
    //this.todate = formatDate(this.calenderdateFrom, 'yyy-MM-dd', 'en', '');

    this.fromdate = localStorage.getItem("fromdate");
    this.todate = localStorage.getItem("todate");

    this.articlepara.fromdate = this.fromdate;
    this.articlepara.todate = this.todate;
    this.articlepara.publicationFilter = this.selectedPubIds;
    this.articlepara.editionFilter = this.selectedCityIds;
    this.articlepara.languageFilter = this.selectedLanguafeIds;
    this.articlepara.keywordFilter = this.selectedKeywords;
    // 29 April 2021
    if ($("#client_company:checked").val()) {
      this.articlepara.company_keyword = $("#client_company:checked").val();
    } else {
      this.articlepara.company_keyword = $("#client_keyword:checked").val();
    }
    this.getallarticles();

    var articleType = this.articlepara.type;
    var trimComma = articleType.replace(/^,|,$/g, "");
    if (trimComma == "print") {
      this.articlepara.type = "print";
      this.enableforprint = false;
      this.enableforweb = true;
      this.enableForTwitter = true;
      this.enableforbr = true;

      this.activeTypeall = false;
      this.activeTypeprint = true;
      this.activeTypeweb = false;
      this.activeTypeTwitter = false;
      this.activeTypetv = false;
    } else if (trimComma == "web") {
      this.enableforprint = true;
      this.enableforweb = false;
      this.enableForTwitter = true;
      this.enableforbr = true;

      this.activeTypeall = false;
      this.activeTypeprint = false;
      this.activeTypeweb = true;
      this.activeTypeTwitter = false;
      this.activeTypetv = false;
    } else if (trimComma == "twitter") {
      this.enableforprint = true;
      this.enableforweb = true;
      this.enableForTwitter = false;
      this.enableforbr = true;

      this.activeTypeall = false;
      this.activeTypeprint = false;
      this.activeTypeweb = false;
      this.activeTypeTwitter = true;
      this.activeTypetv = false;
    } else if (trimComma == "tv") {
      this.enableforprint = true;
      this.enableforweb = true;
      this.enableForTwitter = true;
      this.enableforbr = false;

      this.activeTypeall = false;
      this.activeTypeprint = false;
      this.activeTypeweb = false;
      this.activeTypeTwitter = false;
      this.activeTypetv = true;
    } else {
      this.activeTypeall = true;
      this.activeTypeprint = false;
      this.activeTypeweb = false;
      this.activeTypeTwitter = false;
      this.activeTypetv = false;

      this.enableforprint = true;
      this.enableforweb = true;
      this.enableForTwitter = true;
      this.enableforbr = true;
    }

    $("#searchmodal").modal("hide");
    $("#duration_aria").hide();
    $("#Search_reset").show();
  }

  ModalMail() {
    this.spinnerService.show();
    var selectedArt = this.checkedArticle;
    if (this.checkedArticle.length == 0) {
      return false;
    }
    var selectedJSON = {};
    for (var i = 0; i < selectedArt.length; i++) {
      selectedJSON[i] = selectedArt[i];
    }
    var selectedArticles = selectedJSON;
    this.article.getarticlesbyid(this.articlepara, selectedArt).subscribe(
      res => {
        this.selectedmail = res;
        this.spinnerService.hide();
        $("#mailmodal").modal("show");
      },
      err => {
        console.log(err);
        this.spinnerService.hide();
      }
    );
  }
  filterEditionAndLanguage() {
    this.article.getEditionList(this.selectedPubIds).subscribe(
      res => {
        this.dropdownListEdition = res;
      },
      err => {
        console.log(err);
      }
    );

    this.article.getLanguageList(this.selectedPubIds).subscribe(
      res => {
        this.dropdownListLanguage = res;
      },
      err => {
        console.log(err);
      }
    );
  }

  filterPub(searchText) {
    var searchTearms = searchText.term;
    if (searchTearms.length >= 2) {
      this.dropdownList = this.filterPipe.transform(this.allPublicationList, {
        name: searchTearms
      });
    }
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
    //  daterange start here
    var date = new Date();
    var options: { dateLimit: String } = { dateLimit: "" };
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
    $("#advance-search-calender").daterangepicker(
      {
        // maxDate: date,
        minDate: "01/01/2018",
        startDate: todate,
        endDate: fromdate,
        dateLimit: { days: 370 }
      },
      function(start, end, label) {
        var startDateRange = end.format("YYYY-MM-DD");
        var endDateRange = start.format("YYYY-MM-DD");
        localStorage.setItem("fromdate", startDateRange);
        localStorage.setItem("todate", endDateRange);
      }
    );
    //  daterange end here

    var company_keyword = "keyword";
    if ($("#client_keyword:checked").val() === "ckey") {
      company_keyword = "keyword";
    }

    if ($("#client_company:checked").val() === "ccom") {
      company_keyword = "company";
    }

    var k1 = "";
    if ($("#company_filter:checked").val() === "myCom") {
      k1 = "'My Company Keyword',";
    }

    if ($("#competitor_filter:checked").val() === "myCottr") {
      k1 = k1 + "'My Competitor Keyword',";
    }

    if ($("#industry_filter:checked").val() === "myInd") {
      k1 = k1 + "'My Industry Keyword'";
    }

    var filterArtType = "";
    if ($("#print_media_type:checked").val() === "print") {
      filterArtType = "Print";
    }

    if ($("#web_media_type:checked").val() === "web") {
      filterArtType = filterArtType + "Web";
    }

    if (filterArtType == "Web") {
      this.editionDisableValue = true;
      this.languageDisableValue = true;
      $("#news_categort_magazine").attr("disabled", true);
      $("#news_categort_newspaper").attr("disabled", true);
      $("#news_categort_magazine").prop("checked", false);
      $("#news_categort_newspaper").prop("checked", false);
    } else {
      this.editionDisableValue = false;
      this.languageDisableValue = false;
      $("#news_categort_magazine").attr("disabled", false);
      $("#news_categort_newspaper").attr("disabled", false);
    }

    this.article.getPublicationList(filterArtType).subscribe(
      res => {
        this.allPublicationList = res;
      },
      err => {
        console.log(err);
      }
    );

    var selectedPub = "";

    this.article.getEditionList(selectedPub).subscribe(
      res => {
        this.dropdownListEdition = res;
      },
      err => {
        console.log(err);
      }
    );

    this.article.getLanguageList(selectedPub).subscribe(
      res => {
        this.dropdownListLanguage = res;
      },
      err => {
        console.log(err);
      }
    );
    //this.articlepara.clientid

    this.article
      .getClientKeywordList(
        localStorage.getItem("storageselectedclient"),
        k1,
        filterArtType,
        company_keyword
      )
      .subscribe(
        res => {
          // console.log(res);
          this.dropdownListKeyword = res;
        },
        err => {
          console.log(err);
        }
      );

    $("#searchmodal").modal("show");
  }

  clearAlreadySelected() {
    this.selectedPubIds = "";
    this.selectedCityIds = "";
    this.selectedLanguafeIds = "";
  }
  clearSelectedKeywor() {
    this.selectedKeywords = [];
  }
  filterKeyword() {
    var company_keyword = "keyword";
    if ($("#client_keyword:checked").val() === "ckey") {
      company_keyword = "keyword";
    }

    if ($("#client_company:checked").val() === "ccom") {
      company_keyword = "company";
    }
    var k1 = "";
    if ($("#company_filter:checked").val() === "myCom") {
      k1 = "'My Company Keyword',";
    }

    if ($("#competitor_filter:checked").val() === "myCottr") {
      k1 = k1 + "'My Competitor Keyword',";
    }

    if ($("#industry_filter:checked").val() === "myInd") {
      k1 = k1 + "'My Industry Keyword'";
    }

    var filterArtType = "";
    if ($("#print_media_type:checked").val() === "print") {
      filterArtType = "Print";
    }

    if ($("#web_media_type:checked").val() === "web") {
      filterArtType = filterArtType + "Web";
    }

    if (filterArtType == "Web") {
      this.editionDisableValue = true;
      this.languageDisableValue = true;
      $("#news_categort_magazine").attr("disabled", true);
      $("#news_categort_newspaper").attr("disabled", true);
      $("#news_categort_magazine").prop("checked", false);
      $("#news_categort_newspaper").prop("checked", false);
    } else {
      this.editionDisableValue = false;
      this.languageDisableValue = false;
      $("#news_categort_magazine").attr("disabled", false);
      $("#news_categort_newspaper").attr("disabled", false);
    }

    this.article.getPublicationList(filterArtType).subscribe(
      res => {
        this.allPublicationList = res;
      },
      err => {
        console.log(err);
      }
    );

    this.article
      .getClientKeywordList(
        this.articlepara.clientid,
        k1,
        filterArtType,
        company_keyword
      )
      .subscribe(
        res => {
          this.dropdownListKeyword = res;
        },
        err => {
          console.log(err);
        }
      );
  }

  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }

  RejectArticleModal() {
    this.spinnerService.show();
    var selectedArt = this.checkedArticle;
    if (this.checkedArticle.length == 0) {
      return false;
    }
    var selectedJSON = {};
    for (var i = 0; i < selectedArt.length; i++) {
      selectedJSON[i] = selectedArt[i];
    }
    var selectedArticles = selectedJSON;
    this.article.getarticlesbyid(this.articlepara, selectedArt).subscribe(
      res => {
        this.SelRejectedArticles = res;
        this.spinnerService.hide();
        $("#Rejectmodal").modal("show");
      },
      err => {
        console.log(err);
        this.spinnerService.hide();
      }
    );
  }
  onRejectArticles() {
    console.log(this.checkedArticle);

    this.spinnerService.show();
    if (!confirm("Are you sure want to Reject these articles")) {
      this.spinnerService.hide();
      return false;
    }
    this.articlepara.userEmail = this.user.email;
    this.articlepara.selRejectReason = $("#selRejectReason").val();

    this.article
      .rejectArticles(this.articlepara, this.checkedArticle)
      .subscribe(
        res => {
          // this.SelRejectedArticles=res;
          this.spinnerService.hide();
          // console.log(res);
          $("#Rejectmodal").modal("hide");
          $(".checkedarticlesList").each(function() {
            if ($(this).prop("checked")) {
              // console.log("true");
              $(this)
                .closest(".t-body-inner")
                .remove();
            }
          });
          this.totalcount = this.totalcount - this.checkedArticle.length;
          this.checkedArticle = [];
          this.cpqualifyArticle = [];
          this.selectedarticles = 0;
          this.selectq = false;
          this.isArticle = false;
        },
        err => {
          console.log(err);
          this.spinnerService.hide();
        }
      );
  }
  getDossier() {
    this.dossierUrl = "";
    // console.log(Md5.init('test'));
    let i = 1;
    this.checkedArticle.forEach(element => {
      this.dossierUrl += "&" + i + "=" + element;
      i++;
    });
    // console.log(this.dossierUrl);
    if (localStorage.getItem("storageselectedclient") == "N0083") {
      window.location.href =
        AppSetting.DOSSIER_URL_NHAI +
        Md5.init(this.articlepara.clientid) +
        this.dossierUrl;
    } else if (localStorage.getItem("storageselectedclient") == "D0605") {
      window.location.href =
        AppSetting.DOSSIER_URL +
        Md5.init(this.articlepara.clientid) +
        this.dossierUrl;
      // window.location.href = AppSetting.DOSSIER_URL_BARC + Md5.init(this.articlepara.clientid) + this.dossierUrl;
    } else if (localStorage.getItem("storageselectedclient") == "K0069") {
      window.location.href =
        AppSetting.DOSSIER_URL_BARC +
        Md5.init(this.articlepara.clientid) +
        this.dossierUrl;
    } else if (localStorage.getItem("storageselectedclient") == "R0057") {
      window.location.href =
        AppSetting.DOSSIER_URL_BARC +
        Md5.init(this.articlepara.clientid) +
        this.dossierUrl;
    } else if (localStorage.getItem("storageselectedclient") == "D0481") {
      window.location.href =
        AppSetting.DOSSIER_URL_Zee +
        Md5.init(this.articlepara.clientid) +
        this.dossierUrl;
    } else {
      window.location.href =
        AppSetting.DOSSIER_URL +
        Md5.init(this.articlepara.clientid) +
        this.dossierUrl;
    }
  }
  getXML() {
    this.dossierUrl = "";
    console.log(Md5.init("test"));
    let i = 1;
    this.checkedArticle.forEach(element => {
      this.dossierUrl += element + ",";
      i++;
    });
    console.log(this.dossierUrl);
    window.location.href =
      AppSetting.XMLURL +
      this.articlepara.clientid +
      "&articleids=" +
      this.dossierUrl +
      "&fromdate=" +
      this.articlepara.todate +
      "&todate=" +
      this.articlepara.fromdate +
      "&orderby=" +
      this.articlepara.sortdate;
  }
  getArticlebyDate(para) {
    $("#checkAll").prop("checked", false); // uncheck select all
    this.p = 1;
    this.articlepara.page = 1;
    this.date = new Date();
    if (para == "today") {
      $("#rangeCal").hide();
      this.isActiveToday = true;
      this.isActive7Days = false;
      this.isActiveYesterday = false;
      this.isActivedaterange = false;
      this.fromdate = formatDate(this.date, "yyy-MM-dd", "en", "");
      this.todate = formatDate(this.date, "yyy-MM-dd", "en", "");
      localStorage.setItem("fromdate", this.fromdate);
      localStorage.setItem("todate", this.todate);
    }
    if (para == "yesterday") {
      $("#rangeCal").hide();
      this.isActiveToday = false;
      this.isActive7Days = false;
      this.isActiveYesterday = true;
      this.isActivedaterange = false;
      this.fromdate = formatDate(
        this.date.setDate(this.date.getDate() - 1),
        "yyy-MM-dd",
        "en",
        ""
      );
      this.date = new Date();
      this.todate = formatDate(
        this.date.setDate(this.date.getDate() - 1),
        "yyy-MM-dd",
        "en",
        ""
      );
      localStorage.setItem("fromdate", this.fromdate);
      localStorage.setItem("todate", this.todate);
      //console.log(this.todate);
    }
    if (para == "7days") {
      $("#rangeCal").hide();
      this.isActiveToday = false;
      this.isActive7Days = true;
      this.isActiveYesterday = false;
      this.isActivedaterange = false;
      this.date = new Date();
      this.fromdate = formatDate(this.date, "yyy-MM-dd", "en", "");
      this.todate = formatDate(
        this.date.setDate(this.date.getDate() - 6),
        "yyy-MM-dd",
        "en",
        ""
      );
      localStorage.setItem("fromdate", this.fromdate);
      localStorage.setItem("todate", this.todate);
    }
    this.articlepara.fromdate = this.fromdate;
    this.articlepara.todate = this.todate;

    $(".config-demo")
      .data("daterangepicker")
      .setStartDate(
        formatDate(localStorage.getItem("todate"), "dd-MM-yyyy", "en", "")
      );
    $(".config-demo")
      .data("daterangepicker")
      .setEndDate(
        formatDate(localStorage.getItem("fromdate"), "dd-MM-yyyy", "en", "")
      );
    this.getallarticles();
  }
  getArticlebyDaterange(para) {
    if (para == "daterange") {
      this.isActiveToday = false;
      this.isActive7Days = false;
      this.isActiveYesterday = false;
      this.isActivedaterange = true;
    }
  }
  getExcel() {
    this.dossierUrl = "";
    console.log(Md5.init("test"));
    let i = 1;
    this.checkedArticle.forEach(element => {
      this.dossierUrl += "&" + i + "=" + element;
      i++;
    });
    //console.log(this.dossierUrl);
    // $("#articleidsforexcel").val(this.checkedArticle);
    // $("#clientidforexcel").val(this.articlepara.clientid);
    // $("#fromdateforexcel").val(this.articlepara.fromdate);
    // $("#todateforexcel").val(this.articlepara.todate);
    // $("#keytypeforexcel").val(this.articlepara.keytype);
    // $("#typeforexcel").val(this.articlepara.type);
    // var data={
    //   client: this.articlepara.clientid,
    //   fd:
    //   td:
    //   keytype:
    //   type:
    // }
    // $("#formexcel").submit();

    var emailstr = this.user.email;
    var emailarray = emailstr.split("@");
    var emaildomain = emailarray[1];

    window.location.href =
      AppSetting.EXCELSERVER +
      "excel2.php?xlu=" +
      Md5.init(emaildomain) +
      "&id1=" +
      Md5.init(this.articlepara.clientid) +
      this.dossierUrl +
      "&fd=" +
      this.articlepara.todate +
      "&td=" +
      this.articlepara.fromdate +
      "&client=" +
      this.articlepara.clientid +
      "&keytype=" +
      this.articlepara.keytype +
      "&type=" +
      this.articlepara.type +
      "&q=" +
      this.articlepara.qualificatinFilter +
      "&fulltextQuery" +
      this.articlepara.fullTextKeyword;

    //console.log( AppSetting.EXCELSERVER+"excel2.php?id1=" + Md5.init(this.articlepara.clientid) + this.dossierUrl+"&fd=" + this.articlepara.todate + "&td=" + this.articlepara.fromdate + "&client=" + this.articlepara.clientid + "&keytype=" + this.articlepara.keytype + "&type=" + this.articlepara.type);

    //console.log(AppSetting.EXCELSERVER+"excel.php?fd="+this.articlepara.todate+"&td="+this.articlepara.fromdate+"&client="+this.articlepara.clientid+"&keytype="+this.articlepara.keytype+"&type="+this.articlepara.type);
    //window.location.href = AppSetting.EXCELSERVER+"excel.php?fd="+this.articlepara.todate+"&td="+this.articlepara.fromdate+"&client="+this.articlepara.clientid+"&keytype="+this.articlepara.keytype+"&type="+this.articlepara.type;
    /*this.spinnerService.show();
    this.article.getExcel(this.articlepara)
    .subscribe(
      (res : any )=>{
        //this.info = res.docs;
       console.log(res);
        //console.log(res);
      },
      err=>{
        console.log(err);
      }
    )*/
  }
  openDialog() {}
  qualifyArticle() {
    this.router.navigate(["/qualification"]);
  }
  copyqualification() {
    this.checkedArticle = [];
    this.cpqualifyArticle = [];
    this.selectedarticles = 0;
    $("#inner1-" + this.qualifiedarticleid).css({
      "background-color": "#ddeefe"
    });
    $('input[name="' + this.qualifiedarticleid + '"]').attr(
      "disabled",
      "disabled"
    );
    if (this.selectedarticles == 0) {
      this.copyq = true;
    } else {
      this.copyq = true;
    }
  }
  pastequalifications() {
    this.spinnerService.show();
    this.resarray = [];
    //alert(this.qualifiedarticleid);
    confirm("Are you sure to qualify these articles");

    //console.log("selected is "+this.copyselected[0].articleid);
    this.copyq = false;
    this.selectq = false;
    this.article
      .pasteQualification(
        this.qualifiedarticleid,
        this.checkedArticle,
        this.articlepara.clientid
      )
      .subscribe(
        res => {
          var qualifiedArticleIds = this.checkedArticle;

          for (var i = 0; i < qualifiedArticleIds.length; i++) {
            var id = qualifiedArticleIds[i];
            $("#q_" + id).show();
          }

          this.resarray = res;
          $("#inner1-" + this.qualifiedarticleid).css({
            "background-color": ""
          });
          $('input[name="' + this.qualifiedarticleid + '"]').attr(
            "disabled",
            "false"
          );
          this.qualifiedarticleid = "";
          this.checkedArticle = Array();
          this.spinnerService.hide();

          //console.log(this.resarray);
          //this.checkedArticle.forEach(function(element,index,arra){
          //this.qid = element;
          //})

          //this.copyselected = res;
        },
        err => {
          console.log(err);
          this.spinnerService.hide();
        },
        () => {
          console.log("response");
          this.spinnerService.hide();
        }
      );
  }
  clearSlecetion() {
    this.checkedArticle = [];
    this.cpqualifyArticle = [];
    this.selectedarticles = 0;
    this.selectq = false;
    this.isArticle = false;
    this.copyq = false;
    this.selectq = false;
    $("#checkAll").prop("checked", false);
  }

  downloadExcel() {
    console.log("here");
    this.article.getExcel(this.articlepara).subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
    );
  }
  viewBroadcast(param) {
    // this.brshow = true;
    var self = this;

    $("video source").attr("src", param);
    $("video").attr("src", param);

    $("#broadcast").modal("show");
    //this.videoplayer.nativeElement.play();
  }
  brClose() {
    //alert("hello");
    // this.brshow = false;
    $("video source").attr("src", "");
    $("video").attr("src", "");
    $("#broadcast").modal("hide");
  }
  // setShowcase(articleid, event) {
  //   event.currentTarget.style.display = "none";

  //   this.article.showcase(articleid, this.articlepara)
  //     .subscribe(
  //       res => {
  //         //console.log(res);
  //         this.showcasearticle.push(res.articleid);
  //         console.log(this.showcasearticle);

  //       },
  //       err => {
  //         console.log(err);
  //       }
  //     )
  // }

  setShowcase(articleid, $event) {
    // event.currentTarget.style.display = "none";
    this.articlepara.userEmail = this.user.email;
    var event = $event.currentTarget;
    this.article.showcase(articleid, this.articlepara).subscribe(
      res => {
        //console.log(res);
        this.showcasearticle.push(res.articleid);
        if (event.childNodes[0].childNodes[0].classList[0] == "greyshowcase") {
          event.childNodes[0].childNodes[0].classList.value = "blueshowcase";
        } else {
          event.childNodes[0].childNodes[0].classList.value = "greyshowcase";
        }
        // console.log(this.showcasearticle);
      },
      err => {
        console.log(err);
      }
    );
  }
  // getSummary(event, articleid) {
  //   // event.currentTarget.nextElementSibling.nextElementSibling.slideToggle();
  //   //alert($("#summ"+articleid).is(':visible'));
  //   if ($("#summ" + articleid).is(':visible') == false) {
  //     this.article.getsummary(articleid)
  //       .subscribe(
  //         res => {
  //           //console.log(res);
  //           $(".summ").hide();
  //           // console.log($(event.target).closest(".t-body-inner").style.display);
  //           $(event.target).closest(".t-body-inner").find(".summ").css("display", '');
  //           // $("#summ" + articleid).html(res[0]['full_text']);

  //           this.article.getclientkeyword(articleid, localStorage.getItem('storageselectedclient'))
  //             .subscribe(
  //               res_keyword => {

  //                 var com = '';
  //                 var comp = '';
  //                 var ind = '';
  //                 var othr = '';
  //                 var author = '';
  //                 for (var i = 0; i < res_keyword.length; i++) {
  //                   if (res_keyword[i]['keytype'] == 'My Company Keyword') {
  //                     com = '<span class="uitag companytag">' + res_keyword[i]['keyword'] + '</span>';
  //                   } else if (res_keyword[i]['keytype'] == 'My Competitor Keyword') {
  //                     comp = '<span class="uitag comptag">' + res_keyword[i]['keyword'] + '</span>';
  //                   } else if (res_keyword[i]['keytype'] == 'My Industry Keyword') {
  //                     ind = '<span class="uitag industrytag">' + res_keyword[i]['keyword'] + '</span>';
  //                   } else {
  //                     othr = '<span class="uitag othertag">' + res_keyword[i]['keyword'] + '</span>';
  //                   }

  //                 }
  //                 if (res[0]['journalist'] != null && res[0]['journalist'] != '') {
  //                   author = '<i class="icofont-ui-user" style="color: #2262A0; font-size: 14px;"></i> <span>' + res[0]['journalist'] + '</span><br>';
  //                 }
  //                 var com_journalist_html = '<div>' + author + '' + com + '' + comp + '' + ind + '' + othr + '</div>'
  //                 $("#summ" + articleid).html(com_journalist_html + res[0]['full_text']);
  //               },
  //               err => {
  //                 console.log(err);
  //               }
  //             )

  //         },
  //         err => {
  //           console.log(err);
  //         }
  //       )
  //     $(event.target).closest(".t-body-inner").find(".summ").css("display", '');
  //     // console.log(event);

  //   } else {
  //     $(".summ").hide();
  //     //$("#summ"+articleid).is(':visible').hide();
  //   }
  // }

  getSummary(event, articleid) {
    // event.currentTarget.nextElementSibling.nextElementSibling.slideToggle();
    //alert($("#summ"+articleid).is(':visible'));
    if ($("#summ" + articleid).is(":visible") == false) {
      this.article.getsummary(articleid).subscribe(
        res => {
          //console.log(res);
          $(".summ").hide();
          // console.log($(event.target).closest(".t-body-inner").style.display);
          $(event.target)
            .closest(".t-body-inner")
            .find(".summ")
            .css("display", "");
          // $("#summ" + articleid).html(res[0]['full_text']);

          this.article
            .getclientkeyword(
              articleid,
              localStorage.getItem("storageselectedclient")
            )
            .subscribe(
              res_keyword => {
                var com = "";
                var comp = "";
                var ind = "";
                var othr = "";
                var author = "";
                for (var i = 0; i < res_keyword.length; i++) {
                  if (res_keyword[i]["keytype"] == "My Company Keyword") {
                    com +=
                      '<span class="uitag companytag">' +
                      res_keyword[i]["keyword"] +
                      "</span>";
                  } else if (
                    res_keyword[i]["keytype"] == "My Competitor Keyword"
                  ) {
                    comp +=
                      '<span class="uitag comptag">' +
                      res_keyword[i]["keyword"] +
                      "</span>";
                  } else if (
                    res_keyword[i]["keytype"] == "My Industry Keyword"
                  ) {
                    ind +=
                      '<span class="uitag industrytag">' +
                      res_keyword[i]["keyword"] +
                      "</span>";
                  } else {
                    othr +=
                      '<span class="uitag othertag">' +
                      res_keyword[i]["keyword"] +
                      "</span>";
                  }
                }
                if (
                  res[0]["journalist"] != null &&
                  res[0]["journalist"] != ""
                ) {
                  author =
                    '<i class="fas fa-user" style="color: #2262A0; font-size: 14px;"></i> <span>' +
                    res[0]["journalist"] +
                    "</span><br>";
                }
                var com_journalist_html =
                  "<div>" +
                  author +
                  "" +
                  com +
                  "" +
                  comp +
                  "" +
                  ind +
                  "" +
                  othr +
                  "</div>";
                $("#summ" + articleid).html(
                  com_journalist_html + res[0]["full_text"]
                );
              },
              err => {
                console.log(err);
              }
            );
        },
        err => {
          console.log(err);
        }
      );
      $(event.target)
        .closest(".t-body-inner")
        .find(".summ")
        .css("display", "");
      // console.log(event);
    } else {
      $(".summ").hide();
      //$("#summ"+articleid).is(':visible').hide();
    }
  }
  logoutUser() {
    //clear local storage
    localStorage.clear();
    window.location.replace(location.origin);
  }
  displayRSS() {
    var id = localStorage.getItem("storageselectedclient");
    window.open(
      "https://myimpact.in/index.php?page=RSSLinks&id=" + id,
      "rsslink",
      "left=100,top=10,width=700,height=300,resizable=1"
    );
  }
}
