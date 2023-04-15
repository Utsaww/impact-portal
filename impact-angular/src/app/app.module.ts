import { AuthService } from './auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MainComponent } from './main/main.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { QualificationComponent } from './qualification/qualification.component';
import { NewsdashComponent } from './newsdash/newsdash.component';
import { TagCloudModule } from 'angular-tag-cloud-module';
import { startsWithPipe } from './customstart.pipes';
import { ChartModule } from 'angular-highcharts';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { NgDatepickerModule } from 'ng2-datepicker';
import { SmartanalyseComponent } from './smartanalyse/smartanalyse.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { MDBBootstrapModule } from "angular-bootstrap-md";
import {accountsettingsComponent } from './accountsettings/accountsettings.component';
import {rejectedarticlesComponent } from './rejectedarticles/rejectedarticles.component';
import {keywordlistComponent } from './keywordlist/keywordlist.component';
import {changepasswordComponent } from './changepassword/changepassword.component';
import {contactdetailsComponent } from './contactdetails/contactdetails.component';
// import {colorcodesComponent } from './colorcodes/colorcodes.component';
import { SmartstatsComponent } from './smartstats/smartstats.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
// import { ColorSketchModule } from 'ngx-color/sketch';
// import { ColorPickerModule } from '@syncfusion/ej2-angular-inputs';

// import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";
// import { MomentModule } from "ngx-moment";
// import { MDBBootstrapModule } from 'angular-bootstrap-md';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    QualificationComponent,
    NewsdashComponent,
    startsWithPipe,
    SmartanalyseComponent,
    accountsettingsComponent,
    rejectedarticlesComponent,
    keywordlistComponent,
    changepasswordComponent,
    contactdetailsComponent,
    // colorcodesComponent,
    SmartstatsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgSelectModule,
    HttpClientModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    Ng4LoadingSpinnerModule.forRoot(),
    TagCloudModule,
    ChartModule,
    FilterPipeModule,
    AngularMultiSelectModule,
    NgDatepickerModule,
    MDBBootstrapModule.forRoot(),
    InfiniteScrollModule,
    // ColorSketchModule,
    // ColorPickerModule
    // NgxDaterangepickerMd.forRoot(),
    // MDBBootstrapModule.forRoot()
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
