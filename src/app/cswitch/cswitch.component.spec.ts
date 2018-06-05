import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CswitchComponent } from './cswitch.component';

describe('CswitchComponent', () => {
  let component: CswitchComponent;
  let fixture: ComponentFixture<CswitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CswitchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CswitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
