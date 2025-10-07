import { Component, EventEmitter, Output } from '@angular/core';
import { Service } from '../service';

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.css']
})
export class ServiceFormComponent {

  //Evento
  @Output()
  addServiceEvent = new EventEmitter<Service>();

  sendService!: Service

  //Modelo
  formService: Service = {
    id: 0,
    name: '',
    price: 0,
    description: '',
    image: ''
  }


  addServiceForm(){
    console.log(this.formService);
    this.sendService = Object.assign({}, this.formService);
    this.addServiceEvent.emit(this.sendService);

  }

  addService(form: any){
    console.log(this.formService);
    this.sendService = Object.assign({}, this.formService);
    this.addServiceEvent.emit(this.sendService);
  }

}
