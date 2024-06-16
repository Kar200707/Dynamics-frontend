import { TestBed } from '@angular/core/testing';

import { PlayerControllerService } from './player-controller.service';

describe('PlayerControllerService', () => {
  let service: PlayerControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
