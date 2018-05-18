import { TestBed, inject } from '@angular/core/testing';

import { UserStateServiceService } from './user-state-service.service';

describe('UserStateServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserStateServiceService]
    });
  });

  it('should be created', inject([UserStateServiceService], (service: UserStateServiceService) => {
    expect(service).toBeTruthy();
  }));
});
