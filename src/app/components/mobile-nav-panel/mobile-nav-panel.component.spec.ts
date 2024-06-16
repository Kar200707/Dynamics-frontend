import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileNavPanelComponent } from './mobile-nav-panel.component';

describe('MobileNavPanelComponent', () => {
  let component: MobileNavPanelComponent;
  let fixture: ComponentFixture<MobileNavPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileNavPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileNavPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
