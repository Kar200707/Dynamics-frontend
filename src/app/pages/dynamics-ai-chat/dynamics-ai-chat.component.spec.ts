import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicsAiChatComponent } from './dynamics-ai-chat.component';

describe('DynamicsAiChatComponent', () => {
  let component: DynamicsAiChatComponent;
  let fixture: ComponentFixture<DynamicsAiChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicsAiChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicsAiChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
