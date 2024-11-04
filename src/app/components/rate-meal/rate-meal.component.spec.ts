import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateMealComponent } from './rate-meal.component';

describe('RateMealComponent', () => {
  let component: RateMealComponent;
  let fixture: ComponentFixture<RateMealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RateMealComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RateMealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
