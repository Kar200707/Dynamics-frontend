import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderMainComponent } from './loader-main.component';

describe('LoaderMainComponent', () => {
  let component: LoaderMainComponent;
  let fixture: ComponentFixture<LoaderMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaderMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaderMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
