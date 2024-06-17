import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerBottomSheetComponent } from './timer-bottom-sheet.component';

describe('TimerBottomSheetComponent', () => {
  let component: TimerBottomSheetComponent;
  let fixture: ComponentFixture<TimerBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimerBottomSheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimerBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
