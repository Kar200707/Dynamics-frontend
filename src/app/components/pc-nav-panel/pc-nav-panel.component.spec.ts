import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcNavPanelComponent } from './pc-nav-panel.component';

describe('PcNavPanelComponent', () => {
  let component: PcNavPanelComponent;
  let fixture: ComponentFixture<PcNavPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PcNavPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PcNavPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
