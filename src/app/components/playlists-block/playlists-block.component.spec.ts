import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistsBlockComponent } from './playlists-block.component';

describe('PlaylistsBlockComponent', () => {
  let component: PlaylistsBlockComponent;
  let fixture: ComponentFixture<PlaylistsBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistsBlockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaylistsBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
