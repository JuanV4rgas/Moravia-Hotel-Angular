import { Component } from '@angular/core';
import { Room } from '../room';

@Component({
  selector: 'app-room-table',
  templateUrl: './room-table.component.html',
  styleUrls: ['./room-table.component.css']
})
export class RoomTableComponent {

  //Atributos 
  selectedRoom!: Room;

  //Base de datos
    RoomsList: Room[] = [
      {
      id: "ROOM001",
      habitacionNumber: "101",
      type: "Suite",
      available: true
    },
    {
      id: "ROOM002",
      habitacionNumber: "102",
      type: "Doble",
      available: false
    },
    {
      id: "ROOM003",
      habitacionNumber: "103",
      type: "Sencilla",
      available: true
    },
    {
      id: "ROOM004",
      habitacionNumber: "201",
      type: "Doble",
      available: true
    },
    {
      id: "ROOM005",
      habitacionNumber: "202",
      type: "Suite",
      available: false
    }
  ];
  
    mostrarRoom(Room:Room){
      this.selectedRoom= Room;
    }
  
    agregarRoom(Room:Room){
      this.RoomsList.push(Room);
    }
  
    eliminarRoom(Room:Room){
      var index = this.RoomsList.indexOf(Room);
      this.RoomsList.splice(index,1);
    }
  
}

