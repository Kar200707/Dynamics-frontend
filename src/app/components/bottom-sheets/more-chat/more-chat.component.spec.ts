import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreChatComponent } from './more-chat.component';

describe('MoreChatComponent', () => {
  let component: MoreChatComponent;
  let fixture: ComponentFixture<MoreChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoreChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoreChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
