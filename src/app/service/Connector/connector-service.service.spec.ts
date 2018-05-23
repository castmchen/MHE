import { TestBed, inject } from '@angular/core/testing';

import { ConnectorServiceService } from './connector-service.service';

describe('ConnectorServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConnectorServiceService]
    });
  });

  it('should be created', inject([ConnectorServiceService], (service: ConnectorServiceService) => {
    expect(service).toBeTruthy();
  }));
});
