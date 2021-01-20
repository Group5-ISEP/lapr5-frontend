import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeMapInfoComponent } from './node-map-info.component';

describe('NodeMapInfoComponent', () => {
  let component: NodeMapInfoComponent;
  let fixture: ComponentFixture<NodeMapInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeMapInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeMapInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
