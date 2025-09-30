import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuitesComponent } from './suites.component';

describe('SuitesComponent', () => {
  let component: SuitesComponent;
  let fixture: ComponentFixture<SuitesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuitesComponent]
    });
    fixture = TestBed.createComponent(SuitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
