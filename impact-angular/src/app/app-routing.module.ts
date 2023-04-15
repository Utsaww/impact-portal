import { MainComponent } from './main/main.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { QualificationComponent } from './qualification/qualification.component';
import { TagCloudModule } from 'angular-tag-cloud-module';
import {NewsdashComponent } from './newsdash/newsdash.component'
import {SmartanalyseComponent } from './smartanalyse/smartanalyse.component'
import {SmartstatsComponent } from './smartstats/smartstats.component'
import {accountsettingsComponent } from './accountsettings/accountsettings.component'
import {rejectedarticlesComponent } from './rejectedarticles/rejectedarticles.component'
import {keywordlistComponent } from './keywordlist/keywordlist.component'
import {changepasswordComponent } from './changepassword/changepassword.component'
import {contactdetailsComponent } from './contactdetails/contactdetails.component'
// import {colorcodesComponent } from './colorcodes/colorcodes.component'

const routes: Routes = [
  {
    path : '',
    component : LoginComponent
  },
  {
    path : 'home',
    component : MainComponent
  },
  {
    path : 'qualification',
    component : QualificationComponent
  },
  {
    path : 'dashboard',
    component : NewsdashComponent
  },
  {
    path : 'smartanalyse',
    component : SmartanalyseComponent
  },
  {
    path : 'smartstats',
    component : SmartstatsComponent
  },
  {
    path : 'accountsettings',
    component : accountsettingsComponent,
    children: [
      {
        path:  'keywordlist',
        component:  keywordlistComponent,
      },
      {
        path:  'changepassword',
        component:  changepasswordComponent
      },{
        path:  'contactdetails',
        component:  contactdetailsComponent
      },{
        path:  'rejectedarticles',
        component:  rejectedarticlesComponent
      },
      // {
      //   path:  'colorcodes',
      //   component:  colorcodesComponent
      // },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
 