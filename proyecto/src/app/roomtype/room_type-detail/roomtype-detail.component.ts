import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoomTypeService } from 'src/app/services/roomtype.service';
import { RoomType } from '../../model/roomtype';

@Component({
  selector: 'app-roomtype-detail',
  templateUrl: './roomtype-detail.component.html',
  styleUrls: ['./roomtype-detail.component.css']
})
export class RoomTypeDetailComponent implements OnInit {
  roomType?: RoomType;

  constructor(
    private route: ActivatedRoute,
    private roomTypeService: RoomTypeService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.roomTypeService.getRoomType(id).subscribe({
      next: (data) => (this.roomType = data),
      error: (err) => console.error('Error al cargar tipo de habitación', err),
    });
  }
}