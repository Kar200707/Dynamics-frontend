import { TestBed } from '@angular/core/testing';

import { ChatsCacheService } from './chats-cache.service';

describe('ChatsCacheService', () => {
  let service: ChatsCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatsCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
