import { TestBed } from '@angular/core/testing';

import { PopulateService } from './populate.service';

describe('PopulateService', () => {
  let service: PopulateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopulateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
