import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loginRegGuard } from './login-reg.guard';

describe('loginRegGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loginRegGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
