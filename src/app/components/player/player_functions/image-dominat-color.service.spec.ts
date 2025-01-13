import { TestBed } from '@angular/core/testing';

import { ImageDominatColorService } from './image-dominat-color.service';

describe('ImageDominatColorService', () => {
  let service: ImageDominatColorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageDominatColorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
