import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverTypeComponent } from './driver-type.component';

describe('DriverTypeComponent', () => {
  let component: DriverTypeComponent;
  let fixture: ComponentFixture<DriverTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
