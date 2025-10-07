import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoomTypeDetailComponent } from './roomtype-detail.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('RoomTypeDetailComponent', () => {
  let component: RoomTypeDetailComponent;
  let fixture: ComponentFixture<RoomTypeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoomTypeDetailComponent],
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } }
        }
      ]
    });
    fixture = TestBed.createComponent(RoomTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
