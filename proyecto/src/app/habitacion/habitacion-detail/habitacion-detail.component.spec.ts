import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitacionDetailComponent } from './habitacion-detail.component';

describe('HabitacionDetailComponent', () => {
  let component: HabitacionDetailComponent;
  let fixture: ComponentFixture<HabitacionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HabitacionDetailComponent]
    });
    fixture = TestBed.createComponent(HabitacionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
