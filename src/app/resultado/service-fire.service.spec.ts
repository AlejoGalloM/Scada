import { TestBed } from '@angular/core/testing';

import { ServiceFireService } from './service-fire.service';

describe('ServiceFireService', () => {
  let service: ServiceFireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceFireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
