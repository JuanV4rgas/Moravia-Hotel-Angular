import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceEditarComponent } from './service-editar.component';

describe('ServiceEditarComponent', () => {
  let component: ServiceEditarComponent;
  let fixture: ComponentFixture<ServiceEditarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceEditarComponent]
    });
    fixture = TestBed.createComponent(ServiceEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
