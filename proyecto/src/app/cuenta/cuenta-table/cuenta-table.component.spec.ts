import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaTableComponent } from './cuenta-table.component';

describe('CuentaTableComponent', () => {
  let component: CuentaTableComponent;
  let fixture: ComponentFixture<CuentaTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CuentaTableComponent]
    });
    fixture = TestBed.createComponent(CuentaTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
