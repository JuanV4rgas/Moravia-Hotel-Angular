import { Component, OnInit } from '@angular/core';
import { RoomType } from '../../model/roomtype';
import { RoomTypeService } from '../../services/roomtype.service';

@Component({
  selector: 'app-roomtype-table',
  templateUrl: './roomtype-table.component.html',
  styleUrls: ['./roomtype-table.component.css']
})
export class RoomTypeTableComponent implements OnInit {

  roomtypes: RoomType[] = [];

  constructor(private roomTypeService: RoomTypeService) {}

  ngOnInit(): void {
    this.loadRoomTypes();
  }

  loadRoomTypes(): void {
    this.roomTypeService.getRoomTypes().subscribe({
      next: (data) => this.roomtypes = data,
      error: (err) => console.error('Error al cargar tipos de habitación:', err)
    });
  }

  eliminarRoomType(id: string): void {
    this.roomTypeService.deleteRoomType(id).subscribe({
      next: () => this.roomtypes = this.roomtypes.filter(rt => rt.id !== id),
      error: (err) => console.error('Error al eliminar tipo de habitación:', err)
    });
  }
}
