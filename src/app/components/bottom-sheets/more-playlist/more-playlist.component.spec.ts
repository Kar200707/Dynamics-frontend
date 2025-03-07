import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MorePlaylistComponent } from './more-playlist.component';

describe('MorePlaylistComponent', () => {
  let component: MorePlaylistComponent;
  let fixture: ComponentFixture<MorePlaylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MorePlaylistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MorePlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
