import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTrackInPlaylistsComponent } from './add-track-in-playlists.component';

describe('AddTrackInPlaylistsComponent', () => {
  let component: AddTrackInPlaylistsComponent;
  let fixture: ComponentFixture<AddTrackInPlaylistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTrackInPlaylistsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTrackInPlaylistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
