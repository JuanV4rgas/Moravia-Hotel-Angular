import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomEditarComponent } from './room-editar.component';

describe('RoomEditarComponent', () => {
  let component: RoomEditarComponent;
  let fixture: ComponentFixture<RoomEditarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoomEditarComponent]
    });
    fixture = TestBed.createComponent(RoomEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
