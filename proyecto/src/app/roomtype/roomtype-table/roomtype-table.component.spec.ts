import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoomTypeTableComponent } from './roomtype-table.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RoomTypeTableComponent', () => {
  let component: RoomTypeTableComponent;
  let fixture: ComponentFixture<RoomTypeTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoomTypeTableComponent],
      imports: [HttpClientTestingModule]
    });
    fixture = TestBed.createComponent(RoomTypeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
