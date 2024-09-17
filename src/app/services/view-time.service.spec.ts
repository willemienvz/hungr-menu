import { TestBed } from '@angular/core/testing';

import { ViewTimeService } from './view-time.service';

describe('ViewTimeService', () => {
  let service: ViewTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
