import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeelementComponent } from './nodeelement.component';

describe('NodeelementComponent', () => {
  let component: NodeelementComponent;
  let fixture: ComponentFixture<NodeelementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeelementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeelementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
