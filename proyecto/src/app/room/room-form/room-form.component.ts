import { Component, EventEmitter, Output } from '@angular/core';
import { Room } from '../../model/room';

@Component({
  selector: 'app-room-form',
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.css']
})
export class RoomFormComponent {

  @Output()
  addRoomEvent = new EventEmitter<Room>();

  sendRoom!: Room;

  // Modelo inicial corregido
  formRoom: Room = {
    id: '',
    habitacionNumber: '',
    available: true,
    type: {
      id: '',
      name: '',
      description: '',
      price: 0,
      capacity: '',
      numberOfBeds: 0,
      image: ''
    }
  };

  addRoomForm() {
    console.log(this.formRoom);
    this.sendRoom = { ...this.formRoom };
    this.addRoomEvent.emit(this.sendRoom);
  }

  addRoom(form: any) {
    console.log(this.formRoom);
    this.sendRoom = { ...this.formRoom };
    this.addRoomEvent.emit(this.sendRoom);
  }
}
