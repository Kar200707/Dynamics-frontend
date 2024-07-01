import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { mainPageGuard } from './main-page.guard';

describe('mainPageGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => mainPageGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
