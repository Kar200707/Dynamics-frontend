import { TestBed } from '@angular/core/testing';

import { ImageColorService } from './image-color.service';

describe('ImageColorService', () => {
  let service: ImageColorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageColorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
