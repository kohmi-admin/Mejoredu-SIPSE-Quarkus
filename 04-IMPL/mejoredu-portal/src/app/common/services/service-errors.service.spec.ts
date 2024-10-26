import { TestBed } from '@angular/core/testing';

import { ServiceErrorsService } from './service-errors.service';

describe('ServiceErrorsService', () => {
  let service: ServiceErrorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceErrorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
