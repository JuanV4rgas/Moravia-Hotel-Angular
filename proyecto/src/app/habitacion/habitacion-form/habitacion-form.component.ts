import { Component, EventEmitter, Output } from '@angular/core';
import { Habitacion } from '../habitacion';

@Component({
  selector: 'app-habitacion-form',
  templateUrl: './habitacion-form.component.html',
  styleUrls: ['./habitacion-form.component.css']
})
export class HabitacionFormComponent {

    //Evento
    @Output()
    addHabitacionEvent = new EventEmitter<Habitacion>();
  
    sendHabitacion!: Habitacion
  
    //Modelo
    formHabitacion: Habitacion = {
      id: '',
      name: '',
      description: '',
      price: 0,
      capacity: '',
      numberOfBeds: 0,
      image: '',
      type: ''
    }
  
  
    addHabitacionForm(){
      console.log(this.formHabitacion);
      this.sendHabitacion = Object.assign({}, this.formHabitacion);
      this.addHabitacionEvent.emit(this.sendHabitacion);
  
    }
  
    addHabitacion(form: any){
      console.log(this.formHabitacion);
      this.sendHabitacion = Object.assign({}, this.formHabitacion);
      this.addHabitacionEvent.emit(this.sendHabitacion);
    }
  
}
