import { TestBed } from '@angular/core/testing';

import { AudioCacheService } from './audio-cache.service';

describe('AudioCacheService', () => {
  let service: AudioCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
