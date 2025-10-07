import { Component, OnInit } from '@angular/core';
import { RoomTypeService } from 'src/app/services/roomtype.service';
import { RoomType } from '../../model/roomtype';

@Component({
  selector: 'app-roomtype-table',
  templateUrl: './roomtype-table.component.html',
  styleUrls: ['./roomtype-table.component.css']
})
export class RoomTypeTableComponent implements OnInit {
  roomtypes: RoomType[] = [];

  constructor(private roomTypeService: RoomTypeService) {}

  ngOnInit(): void {
    this.roomTypeService.getRoomTypes().subscribe({
      next: (data) => (this.roomtypes = data),
      error: (err) => console.error('Error al cargar roomtypes', err),
    });
  }

  eliminarRoomType(id: string): void {
    this.roomTypeService.deleteRoomType(id).subscribe({
      next: () => (this.roomtypes = this.roomtypes.filter((h) => h.id !== id)),
      error: (err) => console.error('Error al eliminar roomtype', err),
    });
  }
}