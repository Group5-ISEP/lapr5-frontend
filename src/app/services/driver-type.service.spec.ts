import { TestBed } from '@angular/core/testing';

import { DriverTypeService } from './driver-type.service';

describe('DriverTypeService', () => {
  let service: DriverTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DriverTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
