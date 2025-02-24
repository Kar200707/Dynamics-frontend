import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcAiChatComponent } from './pc-ai-chat.component';

describe('PcAiChatComponent', () => {
  let component: PcAiChatComponent;
  let fixture: ComponentFixture<PcAiChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PcAiChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PcAiChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
