import { Component,Input } from '@angular/core';
import { Habitacion } from '../habitacion';

@Component({
  selector: 'app-habitacion-detail',
  templateUrl: './habitacion-detail.component.html',
  styleUrls: ['./habitacion-detail.component.css']
})
export class HabitacionDetailComponent {
  @Input()
  habitacion!:Habitacion;

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