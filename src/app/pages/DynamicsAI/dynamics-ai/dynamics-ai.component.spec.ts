import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicsAiComponent } from './dynamics-ai.component';

describe('DynamicsAiComponent', () => {
  let component: DynamicsAiComponent;
  let fixture: ComponentFixture<DynamicsAiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicsAiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicsAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
