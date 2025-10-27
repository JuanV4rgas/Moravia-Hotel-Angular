import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalLayoutComponent } from './portal-layout.component';

describe('PortalLayoutComponent', () => {
  let component: PortalLayoutComponent;
  let fixture: ComponentFixture<PortalLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortalLayoutComponent]
    });
    fixture = TestBed.createComponent(PortalLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
