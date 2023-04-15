import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartanalyseComponent } from './smartanalyse.component';

describe('SmartanalyseComponent', () => {
  let component: SmartanalyseComponent;
  let fixture: ComponentFixture<SmartanalyseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartanalyseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartanalyseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
