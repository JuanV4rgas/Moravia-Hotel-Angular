import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaRowComponent } from './media-row.component';

describe('MediaRowComponent', () => {
  let component: MediaRowComponent;
  let fixture: ComponentFixture<MediaRowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MediaRowComponent]
    });
    fixture = TestBed.createComponent(MediaRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
