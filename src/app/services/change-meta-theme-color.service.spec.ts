import { TestBed } from '@angular/core/testing';

import { ChangeMetaThemeColorService } from './change-meta-theme-color.service';

describe('ChangeMetaThemeColorService', () => {
  let service: ChangeMetaThemeColorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangeMetaThemeColorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
