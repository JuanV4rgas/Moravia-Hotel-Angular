import { Component, OnInit } from '@angular/core';
import { RoomService } from 'src/app/services/room.service';
import { Room } from '../../model/room';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-room-table',
   standalone: true,
  templateUrl: './room-table.component.html',
  imports: [CommonModule, RouterModule],
  styleUrls: ['./room-table.component.css']
})
export class RoomTableComponent {

  //Atributos 
  selectedRoom!: Room;

  //Base de datos
    rooms: Room[] = [];

      constructor(private roomService: RoomService) {}

    ngOnInit(){
  this.roomService.getAllRooms().subscribe({
    next: (data) => (this.rooms = data),
      error: (err) => console.error('Error al cargar roomtypes', err),
  });
}

 eliminarRoom(id: string): void {
    this.roomService.deleteRoom(id).subscribe({
      next: () => (this.rooms = this.rooms.filter((h) => h.id !== id)),
      error: (err) => console.error('Error al eliminar roomtype', err),
    });
  }
  
}

