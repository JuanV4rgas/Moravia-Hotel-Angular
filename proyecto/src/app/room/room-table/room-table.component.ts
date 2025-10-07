import { Component, OnInit } from '@angular/core';
import { Room } from '../../model/room';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-room-table',
  templateUrl: './room-table.component.html',
  styleUrls: ['./room-table.component.css']
})
export class RoomTableComponent implements OnInit {

  RoomsList: Room[] = [];
  selectedRoom: Room | null = null;  // 👈 corregido

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.roomService.getRooms().subscribe({
      next: (data) => this.RoomsList = data,
      error: (err) => console.error('Error al cargar habitaciones:', err)
    });
  }

  mostrarRoom(room: Room): void {
    this.selectedRoom = room;
  }

  agregarRoom(room: Room): void {
    this.roomService.createRoom(room).subscribe({
      next: (newRoom) => this.RoomsList.push(newRoom),
      error: (err) => console.error('Error al agregar habitación:', err)
    });
  }

  eliminarRoom(room: Room): void {
    this.roomService.deleteRoom(room.id).subscribe({
      next: () => {
        this.RoomsList = this.RoomsList.filter(r => r.id !== room.id);
      },
      error: (err) => console.error('Error al eliminar habitación:', err)
    });
  }
}
