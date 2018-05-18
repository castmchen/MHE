import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFlowComponent } from './app-flow.component';

describe('AppFlowComponent', () => {
  let component: AppFlowComponent;
  let fixture: ComponentFixture<AppFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppFlowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
