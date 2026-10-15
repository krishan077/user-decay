import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { monetUserGuard } from './monet-user-guard';

describe('monetUserGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => monetUserGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
