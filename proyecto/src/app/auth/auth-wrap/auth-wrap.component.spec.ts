import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthWrapComponent } from './auth-wrap.component';

describe('AuthWrapComponent', () => {
  let component: AuthWrapComponent;
  let fixture: ComponentFixture<AuthWrapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthWrapComponent]
    });
    fixture = TestBed.createComponent(AuthWrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
