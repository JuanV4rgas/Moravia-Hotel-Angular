import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoomTypeFormComponent } from './roomtype-form.component';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('RoomTypeFormComponent', () => {
  let component: RoomTypeFormComponent;
  let fixture: ComponentFixture<RoomTypeFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoomTypeFormComponent],
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule]
    });
    fixture = TestBed.createComponent(RoomTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
