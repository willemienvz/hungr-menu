import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoMenuComponent } from './no-menu.component';

describe('NoMenuComponent', () => {
  let component: NoMenuComponent;
  let fixture: ComponentFixture<NoMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
