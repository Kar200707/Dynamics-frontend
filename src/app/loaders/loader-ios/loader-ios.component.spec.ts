import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderIosComponent } from './loader-ios.component';

describe('LoaderIosComponent', () => {
  let component: LoaderIosComponent;
  let fixture: ComponentFixture<LoaderIosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaderIosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaderIosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
