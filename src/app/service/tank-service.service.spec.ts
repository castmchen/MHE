import { TestBed, inject } from '@angular/core/testing';

import { TankService } from './tank-service.service';

describe('TankServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TankService]
    });
  });

  it('should be created', inject([TankService], (service: TankService) => {
    expect(service).toBeTruthy();
  }));
});
