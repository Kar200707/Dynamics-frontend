import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackFavoritesComponent } from './track-favorites.component';

describe('TrackFavoritesComponent', () => {
  let component: TrackFavoritesComponent;
  let fixture: ComponentFixture<TrackFavoritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackFavoritesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackFavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
