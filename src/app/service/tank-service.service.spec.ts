import { TestBed, inject } from '@angular/core/testing';

import { TankServiceService } from './tank-service.service';

describe('TankServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TankServiceService]
    });
  });

  it('should be created', inject([TankServiceService], (service: TankServiceService) => {
    expect(service).toBeTruthy();
  }));
});
