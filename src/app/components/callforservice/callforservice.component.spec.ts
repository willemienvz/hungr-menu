import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallforserviceComponent } from './callforservice.component';

describe('CallforserviceComponent', () => {
  let component: CallforserviceComponent;
  let fixture: ComponentFixture<CallforserviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CallforserviceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallforserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
