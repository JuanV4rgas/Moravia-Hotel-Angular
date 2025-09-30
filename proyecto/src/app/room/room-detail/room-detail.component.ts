import { Component, Input } from '@angular/core';
import { Room } from '../room';

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.css']
})
export class RoomDetailComponent {

  @Input()
  room!:Room;

  //Inyectar dependencias
  constructor(){}

  //funcion que llama el componente
  ngOnInit():void{
    console.log("ngOnInit del detail");
  }

  ngOnChanges():void{
    console.log("ngOnChanges del detail");
  } 
}
