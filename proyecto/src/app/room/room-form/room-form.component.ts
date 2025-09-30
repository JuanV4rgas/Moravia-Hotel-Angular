import { Component, EventEmitter, Output } from '@angular/core';
import { Room } from '../room';

@Component({
  selector: 'app-room-form',
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.css']
})
export class RoomFormComponent {

    //Evento
    @Output()
    addRoomEvent = new EventEmitter<Room>();
  
    sendRoom!: Room
  
    //Modelo
    formRoom: Room = {
      id: '',
      habitacionNumber: '',
      type: '',
      available: true
    }

     addRoomForm(){
    console.log(this.formRoom);
    this.sendRoom = Object.assign({}, this.formRoom);
    this.addRoomEvent.emit(this.sendRoom);

  }

  addRoom(form: any){
    console.log(this.formRoom);
    this.sendRoom = Object.assign({}, this.formRoom);
    this.addRoomEvent.emit(this.sendRoom);
  }
}
