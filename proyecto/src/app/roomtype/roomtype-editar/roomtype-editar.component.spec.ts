import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomtypeEditarComponent } from './roomtype-editar.component';

describe('RoomtypeEditarComponent', () => {
  let component: RoomtypeEditarComponent;
  let fixture: ComponentFixture<RoomtypeEditarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoomtypeEditarComponent]
    });
    fixture = TestBed.createComponent(RoomtypeEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
