import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitacionTableComponent } from './habitacion-table.component';

describe('HabitacionTableComponent', () => {
  let component: HabitacionTableComponent;
  let fixture: ComponentFixture<HabitacionTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HabitacionTableComponent]
    });
    fixture = TestBed.createComponent(HabitacionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
