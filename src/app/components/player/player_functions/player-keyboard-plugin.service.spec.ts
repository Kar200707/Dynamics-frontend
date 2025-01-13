import { TestBed } from '@angular/core/testing';

import { PlayerKeyboardPluginService } from './player-keyboard-plugin.service';

describe('PlayerKeyboardPluginService', () => {
  let service: PlayerKeyboardPluginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerKeyboardPluginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
