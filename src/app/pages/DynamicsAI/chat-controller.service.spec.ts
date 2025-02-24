import { TestBed } from '@angular/core/testing';

import { ChatControllerService } from './chat-controller.service';

describe('ChatControllerService', () => {
  let service: ChatControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
