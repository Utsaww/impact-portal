import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-qualification',
  templateUrl: './qualification.component.html',
  styleUrls: ['./qualification.component.css']
})
export class QualificationComponent implements OnInit {

  constructor(private _location: Location) { }

  ngOnInit() {
    var self = this;
  }
  goBack(){
    this._location.back();
  }
  getQualifyParams(){
    
  }

}
